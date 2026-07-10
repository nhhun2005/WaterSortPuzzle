import StatCard from '../common/StatCard'
import { HEURISTIC_OPTIONS } from '../../constants/game'
import SearchTree from './SearchTree'

function ResultPanel({ result, usesHeuristic }) {
  if (!result) {
    return (
      <div className="result-panel empty">
        <h2>Ket qua giai</h2>
        <p>
          Chon thuat toan roi bam Tim loi giai. Ket qua se hien thong ke va cay
          tim kiem cua qua trinh mo rong trang thai.
        </p>
      </div>
    )
  }

  const heuristicLabel =
    HEURISTIC_OPTIONS.find((option) => option.value === result.heuristic)?.label ??
    result.heuristic

  return (
    <div className="result-panel">
      <div className="result-header">
        <div>
          <p className="eyebrow">{result.solved ? 'Da tim thay loi giai' : 'Khong co loi giai'}</p>
          <h2>
            {result.heuristic
              ? `${result.algorithm} voi ${heuristicLabel}`
              : result.algorithm}
          </h2>
          <p>{result.stats.note}</p>
        </div>
      </div>

      <div className="game-stats">
        <StatCard label="So buoc" value={result.stats.steps} />
        <StatCard label="Trang thai da sinh" value={result.stats.visited.toLocaleString()} />
        <StatCard label="Trang thai da mo rong" value={result.stats.explored.toLocaleString()} />
        <StatCard label="Thoi gian" value={result.stats.time} />
      </div>

      <SearchTree
        algorithm={result.algorithm}
        nodes={result.searchTree}
        truncated={result.truncated}
        usesHeuristic={result.usesHeuristic ?? usesHeuristic}
      />
    </div>
  )
}

export default ResultPanel
