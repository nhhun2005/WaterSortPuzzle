export const CAPACITY = 4

export const BOTTLE_COUNT = 8

export const PUZZLE_COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan']

export const COLOR_LABELS = {
  red: 'Do',
  green: 'Xanh la',
  blue: 'Xanh duong',
  yellow: 'Vang',
  purple: 'Tim',
  cyan: 'Xanh ngoc',
}

export const ALGORITHMS = ['BFS', 'DFS', 'UCS', 'Greedy', 'A*']

export const HEURISTIC_ALGORITHMS = ['Greedy', 'A*']

export const HEURISTICS = [
  'Misplaced color blocks',
  'Incomplete bottles',
  'Color transition count',
]

export const HEURISTIC_OPTIONS = [
  { value: 'Misplaced color blocks', label: 'So khoi mau sai vi tri' },
  { value: 'Incomplete bottles', label: 'So lo chua hoan thanh' },
  { value: 'Color transition count', label: 'So lan chuyen mau' },
]

export function algorithmUsesHeuristic(algorithm) {
  return HEURISTIC_ALGORITHMS.includes(algorithm)
}
