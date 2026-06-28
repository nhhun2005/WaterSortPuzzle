import { useMemo, useState } from 'react'
import { HEURISTICS, algorithmUsesHeuristic } from '../constants/game'
import { ALGORITHM_STATS, MOCK_SOLUTION_STEPS } from '../data/solverMock'
import { buildTimeline } from '../lib/gameLogic'

export function useSolver(initialBottles) {
  const [algorithm, setAlgorithm] = useState('BFS')
  const [heuristic, setHeuristic] = useState(HEURISTICS[0])
  const [solverResult, setSolverResult] = useState(null)
  const [visualStep, setVisualStep] = useState(0)

  const solverTimeline = useMemo(
    () => buildTimeline(initialBottles, MOCK_SOLUTION_STEPS),
    [initialBottles],
  )
  const usesHeuristic = algorithmUsesHeuristic(algorithm)
  const maxStep = solverTimeline.length - 1
  const currentTimelineState = solverTimeline[visualStep] ?? solverTimeline[0]

  function findSolution() {
    const baseStats = ALGORITHM_STATS[algorithm]

    setSolverResult({
      algorithm,
      heuristic: usesHeuristic ? heuristic : null,
      steps: MOCK_SOLUTION_STEPS,
      stats: {
        steps: MOCK_SOLUTION_STEPS.length,
        visited: baseStats.visited,
        time: baseStats.time,
        note: baseStats.note,
      },
    })
    setVisualStep(0)
  }

  function nextStep() {
    setVisualStep((step) => Math.min(step + 1, maxStep))
  }

  function previousStep() {
    setVisualStep((step) => Math.max(step - 1, 0))
  }

  function selectStep(stepNumber) {
    setVisualStep(Math.min(Math.max(stepNumber, 0), maxStep))
  }

  return {
    algorithm,
    currentTimelineState,
    findSolution,
    heuristic,
    maxStep,
    nextStep,
    previousStep,
    selectStep,
    setAlgorithm,
    setHeuristic,
    solverResult,
    steps: MOCK_SOLUTION_STEPS,
    usesHeuristic,
    visualStep,
  }
}
