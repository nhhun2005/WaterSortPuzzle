import Button from '../common/Button'
import StatCard from '../common/StatCard'
import StepList from './StepList'

function ResultPanel({ onVisualize, result }) {
  if (!result) {
    return (
      <div className="result-panel empty">
        <h2>Solution result</h2>
        <p>
          Pick an algorithm and press Find Solution. The search runs in the
          frontend and the panel will show the moves and search stats.
        </p>
      </div>
    )
  }

  return (
    <div className="result-panel">
      <div className="result-header">
        <div>
          <p className="eyebrow">{result.solved ? 'Solution found' : 'No solution'}</p>
          <h2>
            {result.heuristic
              ? `${result.algorithm} with ${result.heuristic}`
              : result.algorithm}
          </h2>
          <p>{result.stats.note}</p>
        </div>
        {result.solved && (
          <Button variant="primary" onClick={onVisualize}>
            Visualize Steps
          </Button>
        )}
      </div>

      <div className="game-stats">
        <StatCard label="Steps" value={result.stats.steps} />
        <StatCard label="Visited states" value={result.stats.visited.toLocaleString()} />
        <StatCard label="Explored" value={result.stats.explored.toLocaleString()} />
        <StatCard label="Time" value={result.stats.time} />
      </div>

      <StepList steps={result.steps} />
    </div>
  )
}

export default ResultPanel
