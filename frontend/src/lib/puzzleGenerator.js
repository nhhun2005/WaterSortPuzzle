import { BOTTLE_COUNT, CAPACITY, PUZZLE_COLORS } from '../constants/game'
import { cloneBottles, countTopRun, isWinState, topColor } from './gameLogic'

export function createSolvedPuzzle() {
  const filled = PUZZLE_COLORS.map((color) => Array(CAPACITY).fill(color))
  const emptyCount = BOTTLE_COUNT - filled.length
  return [...filled, ...Array.from({ length: emptyCount }, () => [])]
}

export function generateRandomPuzzle({ minMoves = 40, maxMoves = 80 } = {}) {
  const shuffleMoves = randomInt(minMoves, maxMoves)
  let current = createSolvedPuzzle()

  for (let step = 0; step < shuffleMoves || isWinState(current); step += 1) {
    current = applyReverseShuffleMove(current)
  }

  return cloneBottles(current)
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

        if (canReverseExactly && bottles[target].length + amount <= CAPACITY) {
          moves.push({ source, target, color, amount })
        }
      }
    }
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
