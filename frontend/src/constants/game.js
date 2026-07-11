export const CAPACITY = 4

export const BOTTLE_COUNT = 8

export const PUZZLE_COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan']

export const COLOR_LABELS = {
  red: 'Đỏ',
  green: 'Xanh lá',
  blue: 'Xanh dương',
  yellow: 'Vàng',
  purple: 'Tím',
  cyan: 'Xanh ngọc',
}

export const ALGORITHMS = ['BFS', 'DFS', 'UCS', 'Greedy', 'A*']

export const HEURISTIC_ALGORITHMS = ['Greedy', 'A*']

export const HEURISTICS = [
  'Misplaced color blocks',
  'Incomplete bottles',
  'Color transition count',
]

export const HEURISTIC_OPTIONS = [
  { value: 'Misplaced color blocks', label: 'Số khối màu sai vị trí' },
  { value: 'Incomplete bottles', label: 'Số lọ chưa hoàn thành' },
  { value: 'Color transition count', label: 'Số lần chuyển màu' },
]

export function algorithmUsesHeuristic(algorithm) {
  return HEURISTIC_ALGORITHMS.includes(algorithm)
}
