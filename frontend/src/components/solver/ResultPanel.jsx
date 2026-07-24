import StatCard from '../common/StatCard'
import { HEURISTIC_OPTIONS } from '../../constants/game'
import SearchTree from './SearchTree'

function ResultPanel({ result, usesHeuristic, onStepChange, bottles }) {
  if (!result) {
    const rootTree = [
      {
        id: 1,
        parentId: null,
        depth: 0,
        move: null,
        cost: 0,
        heuristic: 0,
        bottles: bottles ?? [],
        generatedAtStep: 0,
        expandedAtStep: null,
        expanded: false,
        isGoal: false,
        isSolutionPath: false,
      },
    ]

    return (
      <div className="result-panel">
        <div className="result-header">
          <div>
            <h2>Cây tìm kiếm</h2>
            <p>
              Chọn thuật toán rồi nhấn "Tìm lời giải" để mở rộng cây từ nút gốc bên dưới.
            </p>
          </div>
        </div>

        <SearchTree
          algorithm=""
          nodes={rootTree}
          truncated={false}
          usesHeuristic={usesHeuristic}
          onStepChange={onStepChange}
        />
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
        onStepChange={onStepChange}
      />
    </div>
  )
}

export default ResultPanel
