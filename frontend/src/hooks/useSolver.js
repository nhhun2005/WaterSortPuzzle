import { useMemo, useState } from 'react'
import { HEURISTICS, algorithmUsesHeuristic } from '../constants/game'
import { buildTimeline } from '../lib/gameLogic'
import { solve } from '../solver'

/**
 * useSolver
 * ---------
 * Owns the solver UI state and runs the search entirely in the frontend
 * (see src/solver). It exposes the selected algorithm/heuristic, the computed
 * result, and a step-by-step timeline for the visualizer.
 */
export function useSolver(initialBottles) {
  const [algorithm, setAlgorithm] = useState('BFS')
  const [heuristic, setHeuristic] = useState(HEURISTICS[0])
  const [solverResult, setSolverResult] = useState(null)
  const [solutionSteps, setSolutionSteps] = useState([])
  const [visualStep, setVisualStep] = useState(0)

  const usesHeuristic = algorithmUsesHeuristic(algorithm)

  const solverTimeline = useMemo(
    () => buildTimeline(initialBottles, solutionSteps),
    [initialBottles, solutionSteps],
  )
  const maxStep = solverTimeline.length - 1
  const currentTimelineState = solverTimeline[visualStep] ?? solverTimeline[0]

  function findSolution() {
    const result = solve(initialBottles, algorithm, usesHeuristic ? heuristic : undefined)
    const steps = result.moves

    setSolutionSteps(steps)
    setSolverResult({
      algorithm,
      heuristic: usesHeuristic ? heuristic : null,
      solved: result.solved,
      steps,
      stats: {
        steps: steps.length,
        visited: result.visited,
        explored: result.explored,
        time: `${(result.timeMs / 1000).toFixed(3)}s`,
        note: buildNote(result, algorithm),
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
    steps: solutionSteps,
    usesHeuristic,
    visualStep,
  }
}

function buildNote(result, algorithm) {
  if (!result.solved) {
    return 'No solution found for this state.'
  }

  const notes = {
    BFS: 'Shortest path in moves (optimal).',
    DFS: 'Depth-first route (not guaranteed shortest).',
    UCS: 'Lowest uniform action cost (optimal).',
    Greedy: 'Heuristic-first estimate (fast, not optimal).',
    'A*': 'Cost plus heuristic (optimal with admissible h).',
  }

  return notes[algorithm] ?? 'Solution found.'
}
