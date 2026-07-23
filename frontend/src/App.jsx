import { useEffect, useState } from 'react'
import { useSolver } from './hooks/useSolver'
import SolverScreen from './screens/SolverScreen'
import PaperScreen from './screens/PaperScreen'

function getRoute() {
  const hash = window.location.hash.replace(/^#/, '')
  if (hash) {
    return hash
  }
  return window.location.pathname || '/'
}

function App() {
  const solver = useSolver()
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    function onHashChange() {
      setRoute(getRoute())
    }
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('popstate', onHashChange)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('popstate', onHashChange)
    }
  }, [])

  if (route === '/paper') {
    return <PaperScreen />
  }

  return (
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
  )
}

export default App
