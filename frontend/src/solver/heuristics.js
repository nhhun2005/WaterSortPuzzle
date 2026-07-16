import { CAPACITY } from '../constants/game'

function isComplete(bottle) {
  return (
    bottle.length === CAPACITY && bottle.every((color) => color === bottle[0])
  )
}

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

export function combined(bottles) {

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

export const HEURISTIC_FUNCTIONS = {
  'Combined': combined,
  'Incomplete bottles': incompleteBottles,
  'Color transition count': colorTransitionCount,
}

export const DEFAULT_HEURISTIC = 'Combined'

export function getHeuristic(label) {
  return HEURISTIC_FUNCTIONS[label] ?? HEURISTIC_FUNCTIONS[DEFAULT_HEURISTIC]
}
