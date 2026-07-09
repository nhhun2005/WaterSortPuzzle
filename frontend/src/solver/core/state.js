import { isWinState, pourBetween } from '../../lib/gameLogic'

/**
 * State representation
 * -------------------
 * A state is simply an array of bottles, where each bottle is an array of
 * color strings ordered bottom -> top (the last element is the "top" that
 * gets poured out first). This mirrors the representation used across the
 * gameplay UI so the solver and the game share the exact same pour rules.
 */

/**
 * Serialize a state into a canonical string key used for the visited set.
 *
 * Bottles are sorted before joining so that two states that only differ by
 * the order of their bottles are treated as identical. This symmetry
 * reduction is safe (any goal reachable from one arrangement is reachable
 * from an equivalent one) and dramatically shrinks the search space.
 */
export function serializeState(bottles) {
  return bottles
    .map((bottle) => bottle.join(','))
    .sort()
    .join('|')
}

/** A state is a goal when every bottle is empty or a single completed color. */
export function isEnd(bottles) {
  return isWinState(bottles)
}

/**
 * Generate every legal successor state.
 *
 * We try to pour from bottle i into bottle j for every ordered pair (i, j).
 * `pourBetween` already enforces the rules (matching top color, capacity,
 * pours the whole top run) and returns the resulting bottles plus a
 * human-readable action ({ from, to, color, amount } with 1-based indices).
 * Each move has a uniform cost of 1.
 */
export function generateNextStates(bottles) {
  const nextStates = []

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
