import { useSolver } from './hooks/useSolver'
import SolverScreen from './screens/SolverScreen'

function App() {
  const solver = useSolver()

  return (
    <main className="app">
      <SolverScreen
        algorithm={solver.algorithm}
        onPuzzleChange={solver.clearResult}
        heuristic={solver.heuristic}
        onAlgorithmChange={solver.setAlgorithm}
        onFindSolution={solver.findSolution}
        onHeuristicChange={solver.setHeuristic}
        result={solver.solverResult}
        usesHeuristic={solver.usesHeuristic}
        validationError={solver.validationError}
      />
    </main>
  )
}

export default App
