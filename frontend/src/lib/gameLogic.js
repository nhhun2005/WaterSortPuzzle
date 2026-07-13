import { CAPACITY } from '../constants/game'

// Các hàm thao tác trên trạng thái bài toán, dùng chung cho bộ giải và sinh đề.
// Mỗi lọ là một ngăn xếp màu xếp từ đáy (index 0) lên miệng (phần tử cuối).

export function cloneBottles(bottles) {
  return bottles.map((bottle) => [...bottle])
}

export function topColor(bottle) {
  return bottle[bottle.length - 1]
}

// Đếm số vạch màu cùng màu liên tiếp nằm trên đỉnh lọ.
export function countTopRun(bottle) {
  const color = topColor(bottle)
  let count = 0

  for (let index = bottle.length - 1; index >= 0; index -= 1) {
    if (bottle[index] !== color) {
      break
    }
    count += 1
  }

  return count
}

// Đổ chất lỏng từ lọ nguồn sang lọ đích nếu hợp lệ, trả về trạng thái mới và hành động.
export function pourBetween(bottles, sourceIndex, targetIndex) {
  if (sourceIndex === targetIndex) {
    return null
  }

  const source = bottles[sourceIndex]
  const target = bottles[targetIndex]

  if (!source?.length || !target || target.length >= CAPACITY) {
    return null
  }

  if (isCompleteBottle(source)) {
    return null
  }

  const color = topColor(source)
  if (target.length > 0 && topColor(target) !== color) {
    return null
  }

  const amount = Math.min(countTopRun(source), CAPACITY - target.length)
  if (amount <= 0) {
    return null
  }

  const next = cloneBottles(bottles)
  for (let step = 0; step < amount; step += 1) {
    next[targetIndex].push(next[sourceIndex].pop())
  }

  return {
    bottles: next,
    action: {
      from: sourceIndex + 1,
      to: targetIndex + 1,
      color,
      amount,
    },
  }
}

// Trạng thái kết thúc: mỗi lọ hoặc rỗng hoặc chứa đúng 4 vạch cùng màu.
export function isWinState(bottles) {
  return bottles.every((bottle) => bottle.length === 0 || isCompleteBottle(bottle))
}

export function isCompleteBottle(bottle) {
  return (
    bottle.length === CAPACITY && bottle.every((color) => color === bottle[0])
  )
}
