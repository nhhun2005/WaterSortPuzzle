export const CAPACITY = 4

export const BOTTLE_COUNT = 5

export const PUZZLE_COLORS = ['R', 'G', 'B']

export const COLOR_LABELS = {
  R: 'Đỏ',
  G: 'Xanh lá',
  B: 'Xanh dương',
}

export const ALGORITHMS = ['BFS', 'DFS', 'UCS', 'Greedy', 'A*']

export const HEURISTIC_ALGORITHMS = ['Greedy', 'A*']

export const HEURISTICS = [
  'Combined',
  'Incomplete bottles',
  'Color transition count',
]

export const HEURISTIC_OPTIONS = [
  { value: 'Combined', label: 'Kết hợp' },
  { value: 'Incomplete bottles', label: 'Số lọ chưa hoàn thiện' },
  { value: 'Color transition count', label: 'Số lần chuyển màu' },
]

export function algorithmUsesHeuristic(algorithm) {
  return HEURISTIC_ALGORITHMS.includes(algorithm)
}
