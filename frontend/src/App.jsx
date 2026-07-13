import { useSolver } from './hooks/useSolver'
import SolverScreen from './screens/SolverScreen'

function App() {
  const solver = useSolver()

  return (
    <SolverScreen
      algorithm={solver.algorithm}
      difficulty={solver.difficulty}
      onPuzzleChange={solver.clearResult}
      heuristic={solver.heuristic}
      onAlgorithmChange={solver.setAlgorithm}
      onDifficultyChange={solver.setDifficulty}
      onFindSolution={solver.findSolution}
      onHeuristicChange={solver.setHeuristic}
      result={solver.solverResult}
      usesHeuristic={solver.usesHeuristic}
      validationError={solver.validationError}
    />
  )
}

export default App
