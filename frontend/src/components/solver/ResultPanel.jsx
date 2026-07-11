import StatCard from '../common/StatCard'
import { HEURISTIC_OPTIONS } from '../../constants/game'
import SearchTree from './SearchTree'

function ResultPanel({ result, usesHeuristic }) {
  if (!result) {
    return (
      <div className="result-panel empty">
        <h2>Kết quả giải</h2>
        <p>
          Chọn thuật toán rồi bấm Tìm lời giải. Kết quả sẽ hiển thị thống kê và
          cây tìm kiếm của quá trình mở rộng trạng thái.
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
          <p className="eyebrow">{result.solved ? 'Đã tìm thấy lời giải' : 'Không có lời giải'}</p>
          <h2>
            {result.heuristic
              ? `${result.algorithm} với ${heuristicLabel}`
              : result.algorithm}
          </h2>
          <p>{result.stats.note}</p>
        </div>
      </div>

      <div className="game-stats">
        <StatCard label="Số bước" value={result.stats.steps} />
        <StatCard label="Trạng thái đã sinh" value={result.stats.visited.toLocaleString()} />
        <StatCard label="Trạng thái đã mở rộng" value={result.stats.explored.toLocaleString()} />
        <StatCard label="Thời gian" value={result.stats.time} />
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
