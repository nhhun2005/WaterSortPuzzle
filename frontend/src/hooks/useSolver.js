import { useState } from 'react'
import {
  BOTTLE_COUNT,
  CAPACITY,
  COLOR_LABELS,
  HEURISTICS,
  PUZZLE_COLORS,
  algorithmUsesHeuristic,
} from '../constants/game'
import { solve } from '../solver'

export function useSolver() {
  const [algorithm, setAlgorithm] = useState('BFS')
  const [heuristic, setHeuristic] = useState(HEURISTICS[0])
  const [solverResult, setSolverResult] = useState(null)
  const [validationError, setValidationError] = useState('')

  const usesHeuristic = algorithmUsesHeuristic(algorithm)

  function clearResult() {
    setSolverResult(null)
    setValidationError('')
  }

  function findSolution(bottles) {
    const error = validatePuzzle(bottles)
    setValidationError(error)

    if (error) {
      setSolverResult(null)
      return false
    }

    const result = solve(bottles, algorithm, usesHeuristic ? heuristic : undefined)
    const steps = result.moves

    setSolverResult({
      algorithm,
      heuristic: usesHeuristic ? heuristic : null,
      solved: result.solved,
      steps,
      searchTree: result.searchTree,
      truncated: result.truncated,
      usesHeuristic,
      stats: {
        steps: steps.length,
        visited: result.visited,
        explored: result.explored,
        time: `${(result.timeMs / 1000).toFixed(3)}s`,
        note: buildNote(result, algorithm),
      },
    })
    return true
  }

  return {
    algorithm,
    clearResult,
    findSolution,
    heuristic,
    setAlgorithm,
    setHeuristic,
    solverResult,
    validationError,
    usesHeuristic,
  }
}

function buildNote(result, algorithm) {
  if (!result.solved) {
    return 'Không tìm thấy lời giải cho trạng thái này.'
  }

  const notes = {
    BFS: 'Tìm theo chiều rộng, đảm bảo ít nước đi nhất khi mỗi bước có cùng chi phí.',
    DFS: 'Tìm theo chiều sâu, không đảm bảo đường đi ngắn nhất.',
    UCS: 'Tìm theo chi phí đều, tối ưu khi mỗi hành động có chi phí 1.',
    Greedy: 'Ưu tiên trạng thái có heuristic tốt nhất, nhanh nhưng không đảm bảo tối ưu.',
    'A*': 'Kết hợp chi phí đã đi và heuristic để hướng đến lời giải.',
  }

  return notes[algorithm] ?? 'Đã tìm thấy lời giải.'
}

export function validatePuzzle(bottles) {
  if (bottles.length !== BOTTLE_COUNT) {
    return `Bài toán phải có đúng ${BOTTLE_COUNT} lọ.`
  }

  const counts = Object.fromEntries(PUZZLE_COLORS.map((color) => [color, 0]))
  let totalLayers = 0

  for (let bottleIndex = 0; bottleIndex < bottles.length; bottleIndex += 1) {
    const bottle = bottles[bottleIndex]

    if (bottle.length > CAPACITY) {
      return `Lọ ${bottleIndex + 1} vượt quá sức chứa ${CAPACITY} lớp.`
    }

    for (const color of bottle) {
      if (!PUZZLE_COLORS.includes(color)) {
        return `Lọ ${bottleIndex + 1} có màu không hợp lệ.`
      }
      counts[color] += 1
      totalLayers += 1
    }
  }

  if (totalLayers !== PUZZLE_COLORS.length * CAPACITY) {
    return `Bài toán phải có đúng ${PUZZLE_COLORS.length * CAPACITY} lớp màu.`
  }

  for (const color of PUZZLE_COLORS) {
    if (counts[color] !== CAPACITY) {
      return `Màu ${COLOR_LABELS[color]} phải xuất hiện đúng ${CAPACITY} lần.`
    }
  }

  return ''
}
