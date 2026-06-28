import BottleRack from '../components/bottle/BottleRack'
import Button from '../components/common/Button'
import TopBar from '../components/common/TopBar'
import ResultPanel from '../components/solver/ResultPanel'
import SelectorGroup from '../components/solver/SelectorGroup'
import { ALGORITHMS, HEURISTICS } from '../constants/game'

function SolverScreen({
  algorithm,
  heuristic,
  onAlgorithmChange,
  onBack,
  onFindSolution,
  onHeuristicChange,
  onVisualize,
  previewBottles,
  result,
  usesHeuristic,
}) {
  return (
    <section className="screen solver-screen">
      <TopBar
        action={
          <Button variant="ghost" onClick={onBack}>
            Back Home
          </Button>
        }
        subtitle="Mocked frontend result until Java integration is connected"
        title="AI Solver"
      />

      <div className="solver-layout">
        <div className="solver-preview">
          <h2>Puzzle state</h2>
          <BottleRack bottles={previewBottles} compact />
        </div>

        <div className="solver-controls">
          <SelectorGroup
            label="Algorithm"
            onChange={onAlgorithmChange}
            options={ALGORITHMS}
            value={algorithm}
          />
          {usesHeuristic ? (
            <SelectorGroup
              label="Heuristic"
              onChange={onHeuristicChange}
              options={HEURISTICS}
              value={heuristic}
            />
          ) : (
            <p className="solver-note">This algorithm does not use a heuristic.</p>
          )}
          <Button variant="primary" onClick={onFindSolution}>
            Find Solution
          </Button>
        </div>
      </div>

      <ResultPanel result={result} onVisualize={onVisualize} />
    </section>
  )
}

export default SolverScreen
