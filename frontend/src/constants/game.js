// Cau hinh co dinh cua bai toan theo dung pham vi bao cao:
// 3 mau sac, moi mau 4 vach chat long, tong cong 5 lo thuy tinh.
export const CAPACITY = 4

export const BOTTLE_COUNT = 5

export const PUZZLE_COLORS = ['red', 'green', 'blue']

export const COLOR_LABELS = {
  red: 'Đỏ',
  green: 'Xanh lá',
  blue: 'Xanh dương',
}

export const ALGORITHMS = ['BFS', 'DFS', 'UCS', 'Greedy', 'A*']

export const HEURISTIC_ALGORITHMS = ['Greedy', 'A*']

export const HEURISTICS = [
  'Misplaced color blocks',
  'Incomplete bottles',
  'Color transition count',
]

export const HEURISTIC_OPTIONS = [
  { value: 'Misplaced color blocks', label: 'Kết hợp' },
  { value: 'Incomplete bottles', label: 'Số lọ chưa hoàn thiện' },
  { value: 'Color transition count', label: 'Số lần chuyển màu' },
]


export function algorithmUsesHeuristic(algorithm) {
  return HEURISTIC_ALGORITHMS.includes(algorithm)
}
