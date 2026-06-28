export const CAPACITY = 4

export const COLOR_LABELS = {
  red: 'Red',
  green: 'Green',
  blue: 'Blue',
  yellow: 'Yellow',
  purple: 'Purple',
  cyan: 'Cyan',
  pink: 'Pink',
  orange: 'Orange',
}

export const ALGORITHMS = ['BFS', 'DFS', 'UCS', 'Greedy', 'A*']

export const HEURISTIC_ALGORITHMS = ['Greedy', 'A*']

export const HEURISTICS = [
  'Misplaced color blocks',
  'Incomplete bottles',
  'Color transition count',
]

export function algorithmUsesHeuristic(algorithm) {
  return HEURISTIC_ALGORITHMS.includes(algorithm)
}
