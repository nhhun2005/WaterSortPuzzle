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
    return 'Khong tim thay loi giai cho trang thai nay.'
  }

  const notes = {
    BFS: 'Tim theo chieu rong, dam bao it nuoc di nhat khi moi buoc co cung chi phi.',
    DFS: 'Tim theo chieu sau, khong dam bao duong di ngan nhat.',
    UCS: 'Tim theo chi phi deu, toi uu khi moi hanh dong co chi phi 1.',
    Greedy: 'Uu tien trang thai co heuristic tot nhat, nhanh nhung khong dam bao toi uu.',
    'A*': 'Ket hop chi phi da di va heuristic de huong den loi giai.',
  }

  return notes[algorithm] ?? 'Da tim thay loi giai.'
}

export function validatePuzzle(bottles) {
  if (bottles.length !== BOTTLE_COUNT) {
    return `Bai toan phai co dung ${BOTTLE_COUNT} lo.`
  }

  const counts = Object.fromEntries(PUZZLE_COLORS.map((color) => [color, 0]))
  let totalLayers = 0

  for (let bottleIndex = 0; bottleIndex < bottles.length; bottleIndex += 1) {
    const bottle = bottles[bottleIndex]

    if (bottle.length > CAPACITY) {
      return `Lo ${bottleIndex + 1} vuot qua suc chua ${CAPACITY} lop.`
    }

    for (const color of bottle) {
      if (!PUZZLE_COLORS.includes(color)) {
        return `Lo ${bottleIndex + 1} co mau khong hop le.`
      }
      counts[color] += 1
      totalLayers += 1
    }
  }

  if (totalLayers !== PUZZLE_COLORS.length * CAPACITY) {
    return `Bai toan phai co dung ${PUZZLE_COLORS.length * CAPACITY} lop mau.`
  }

  for (const color of PUZZLE_COLORS) {
    if (counts[color] !== CAPACITY) {
      return `Mau ${COLOR_LABELS[color]} phai xuat hien dung ${CAPACITY} lan.`
    }
  }

  return ''
}
