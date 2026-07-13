import { BOTTLE_COUNT, CAPACITY, PUZZLE_COLORS } from '../constants/game'
import { cloneBottles, countTopRun, isWinState, topColor } from './gameLogic'

// Tao trang thai da giai xong: moi mau day mot lo, cac lo con lai de rong.
export function createSolvedPuzzle() {
  const filled = PUZZLE_COLORS.map((color) => Array(CAPACITY).fill(color))
  const emptyCount = BOTTLE_COUNT - filled.length
  return [...filled, ...Array.from({ length: emptyCount }, () => [])]
}

export function generateRandomPuzzle({ minMoves = 40, maxMoves = 80 } = {}) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const shuffleMoves = randomInt(minMoves, maxMoves)
    let current = createSolvedPuzzle()
    let appliedMoves = 0

    for (let step = 0; step < shuffleMoves; step += 1) {
      const next = applyReverseShuffleMove(current)
      if (!next) {
        break
      }

      current = next
      appliedMoves += 1
    }

    if (appliedMoves >= minMoves && !isWinState(current)) {
      return cloneBottles(current)
    }
  }

  return createSolvedPuzzle()
}

function applyReverseShuffleMove(bottles) {
  const moves = []

  for (let source = 0; source < bottles.length; source += 1) {
    const sourceBottle = bottles[source]
    if (sourceBottle.length === 0) {
      continue
    }

    const color = topColor(sourceBottle)
    const maxAmount = countTopRun(sourceBottle)

    for (let target = 0; target < bottles.length; target += 1) {
      if (source === target || bottles[target].length >= CAPACITY) {
        continue
      }
      if (topColor(bottles[target]) === color) {
        continue
      }

      for (let amount = 1; amount <= maxAmount; amount += 1) {
        const sourceWillBeEmpty = sourceBottle.length === amount
        const sourceWillKeepSameTop = amount < maxAmount
        const canReverseExactly = sourceWillBeEmpty || sourceWillKeepSameTop
        const reverseSourceWouldBeComplete =
          bottles[target].length === 0 && amount === CAPACITY

        if (
          canReverseExactly &&
          !reverseSourceWouldBeComplete &&
          bottles[target].length + amount <= CAPACITY
        ) {
          moves.push({ source, target, color, amount })
        }
      }
    }
  }

  if (moves.length === 0) {
    return null
  }

  const move = moves[randomInt(0, moves.length - 1)]
  const next = cloneBottles(bottles)
  for (let step = 0; step < move.amount; step += 1) {
    next[move.target].push(next[move.source].pop())
  }
  return next
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
