import { CAPACITY } from '../constants/game'

/**
 * Heuristics for the informed searches (Greedy, A*).
 *
 * Every function here is fully computed from the actual bottle contents -
 * there are no magic constants or approximations. Each returns 0 exactly when
 * the state is already solved, so Greedy/A* recognise a finished puzzle.
 * Each function estimates how much work remains from a given state; Greedy
 * and A* use that estimate to decide which node to expand next.
 */


function isComplete(bottle) {
  return (
    bottle.length === CAPACITY && bottle.every((color) => color === bottle[0])
  )
}

/**
 * Color transition count.
 *
 * Counts, across all bottles, every adjacent pair of layers with a different
 * color. A solved bottle is a single uniform block, so it contributes 0, and
 * a more fragmented state scores higher.
 */

export function colorTransitionCount(bottles) {
  let transitions = 0

  for (const bottle of bottles) {
    for (let layer = 1; layer < bottle.length; layer += 1) {
      if (bottle[layer] !== bottle[layer - 1]) {
        transitions += 1
      }
    }
  }

  return transitions
}

/**
 * Misplaced color blocks.
 *
 * The color-block estimate ported from the original Java Heuristic: for each
 * non-empty bottle count the internal color transitions and add one more when
 * the bottle is not yet a completed single color. This rewards states that
 * both reduce fragmentation and finish bottles outright.
 */
export function misplacedColorBlocks(bottles) {
  let score = 0

  for (const bottle of bottles) {
    if (bottle.length === 0) {
      continue
    }

    for (let layer = 1; layer < bottle.length; layer += 1) {
      if (bottle[layer] !== bottle[layer - 1]) {
        score += 1
      }
    }

    if (!isComplete(bottle)) {
      score += 1
    }
  }

  return score
}

/**
 * Incomplete bottles.
 *
 * The simplest of the three: the number of non-empty bottles that are not yet
 * a finished single color. A solved state scores 0.
 */

export function incompleteBottles(bottles) {
  let score = 0

  for (const bottle of bottles) {
    if (bottle.length === 0) {
      continue
    }
    if (!isComplete(bottle)) {
      score += 1
    }
  }

  return score
}

/**
 * Registry keyed by the human-readable labels shown in the UI
 * (see HEURISTICS in constants/game.js).
 */
export const HEURISTIC_FUNCTIONS = {
  'Misplaced color blocks': misplacedColorBlocks,
  'Incomplete bottles': incompleteBottles,
  'Color transition count': colorTransitionCount,
}

/** Default heuristic used when none is explicitly selected. */
export const DEFAULT_HEURISTIC = 'Misplaced color blocks'

/**
 * Resolve a heuristic function from its label, falling back to the default.
 */
export function getHeuristic(label) {
  return HEURISTIC_FUNCTIONS[label] ?? HEURISTIC_FUNCTIONS[DEFAULT_HEURISTIC]
}
