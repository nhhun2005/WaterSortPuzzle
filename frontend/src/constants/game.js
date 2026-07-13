export const CAPACITY = 4

export const PUZZLE_COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan']

export const COLOR_LABELS = {
  red: 'Đỏ',
  green: 'Xanh lá',
  blue: 'Xanh dương',
  yellow: 'Vàng',
  purple: 'Tím',
  cyan: 'Xanh ngọc',
}

export const DIFFICULTY_LEVELS = [
  { id: 'easy', label: 'Dễ (3 màu, 5 lọ)', colorCount: 3, bottleCount: 5 },
  { id: 'medium', label: 'Trung bình (4 màu, 6 lọ)', colorCount: 4, bottleCount: 6 },
  { id: 'hard', label: 'Khó (6 màu, 8 lọ)', colorCount: 6, bottleCount: 8 },
]

export const DIFFICULTY_OPTIONS = DIFFICULTY_LEVELS.map((level) => ({
  value: level.id,
  label: level.label,
}))

export const DEFAULT_DIFFICULTY = 'easy'

export function getDifficultyConfig(difficultyId = DEFAULT_DIFFICULTY) {
  const level =
    DIFFICULTY_LEVELS.find((item) => item.id === difficultyId) ??
    DIFFICULTY_LEVELS.find((item) => item.id === DEFAULT_DIFFICULTY)

  return {
    id: level.id,
    label: level.label,
    capacity: CAPACITY,
    bottleCount: level.bottleCount,
    colors: PUZZLE_COLORS.slice(0, level.colorCount),
  }
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
