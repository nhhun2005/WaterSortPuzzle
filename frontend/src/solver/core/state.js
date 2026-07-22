import { isWinState, pourBetween } from '../../lib/gameLogic'

export const SOLVER_TIMEOUT_MS = 10000

export function isTimedOut(startTime, limitMs = SOLVER_TIMEOUT_MS) {
  return performance.now() - startTime > limitMs
}


export function serializeState(bottles) {
  return bottles
    .map((bottle) => bottle.join(','))
    .join('|')
}

export function isEnd(bottles) {
  return isWinState(bottles)
}

export function generateNextStates(bottles) {
  const nextStates = []

  // This is the canonical action order shared by every search algorithm:
  // lower source index first, then lower target index. Algorithms may choose
  // different states to expand, but must not reorder the actions of a state.
  for (let source = 0; source < bottles.length; source += 1) {
    for (let target = 0; target < bottles.length; target += 1) {
      if (source === target) {
        continue
      }

      const result = pourBetween(bottles, source, target)
      if (result) {
        nextStates.push({
          bottles: result.bottles,
          move: result.action,
          cost: 1,
        })
      }
    }
  }

  return nextStates
}
