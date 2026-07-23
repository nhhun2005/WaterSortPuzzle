import { useCallback, useMemo, useState } from 'react'
import Button from '../components/common/Button'
import PuzzleEditor from '../components/solver/PuzzleEditor'
import SelectorGroup from '../components/solver/SelectorGroup'
import SearchTree from '../components/solver/SearchTree'
import {
  ALGORITHMS,
  HEURISTIC_OPTIONS,
  algorithmUsesHeuristic,
} from '../constants/game'
import { solve } from '../solver'
import { formatState } from '../solver/core/stateFormatter'
import { generateRandomPuzzle } from '../lib/puzzleGenerator'
import { validatePuzzle } from '../hooks/useSolver'

function formatMove(move) {
  if (!move) {
    return 'Gốc'
  }
  return `${move.from} -> ${move.to}`
}

function PaperScreen() {
  const [bottles, setBottles] = useState(() => generateRandomPuzzle())
  const [algorithm, setAlgorithm] = useState('BFS')
  const [heuristic, setHeuristic] = useState(HEURISTIC_OPTIONS[0].value)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [stepBottles, setStepBottles] = useState(null)

  const usesHeuristic = algorithmUsesHeuristic(algorithm)

  const initialCompact = useMemo(() => formatState(bottles), [bottles])

  function updateBottles(next) {
    setBottles(next)
    setResult(null)
    setError('')
    setStepBottles(null)
  }

  function createRandomPuzzle() {
    setBottles(generateRandomPuzzle())
    setResult(null)
    setError('')
    setStepBottles(null)
  }

  function runSolver() {
    const validationError = validatePuzzle(bottles)
    if (validationError) {
      setError(validationError)
      setResult(null)
      return
    }
    setError('')
    setStepBottles(null)
    const solved = solve(bottles, algorithm, usesHeuristic ? heuristic : undefined)

    const pathMoves = solved.moves.map(formatMove)

    setResult({
      algorithm,
      heuristic: usesHeuristic ? heuristic : null,
      solved: solved.solved,
      moves: solved.moves,
      pathMoves,
      visited: solved.visited,
      explored: solved.explored,
      timeMs: solved.timeMs,
      searchTree: solved.searchTree,
      truncated: solved.truncated,
      timedOut: solved.timedOut,
    })
  }

  const handleStepChange = useCallback((nextBottles) => {
    setStepBottles(nextBottles)
  }, [])

  // Rebuild the compact solution trace from the solver's recorded
  // solution-path nodes so states match exactly what the algorithm produced.
  const solutionTrace = useMemo(() => {
    if (!result?.solved) {
      return []
    }
    const solutionNodes = (result.searchTree ?? []).filter((node) => node.isSolutionPath)
    solutionNodes.sort((a, b) => a.depth - b.depth)
    return solutionNodes.map((node) => ({
      depth: node.depth,
      move: formatMove(node.move),
      compact: formatState(node.bottles),
    }))
  }, [result])

  const selectedCompact = stepBottles ? formatState(stepBottles) : null

  return (
    <div className="paper-screen">
      <header className="paper-header">
        <h1>Water Sort Puzzle — Biểu diễn trạng thái</h1>
        <p>
          Trạng thái được ghi dạng <code>(B1 | B2 | B3 | B4 | B5)</code>. Trong mỗi lọ,
          ký tự ngoài cùng bên phải là đỉnh lọ (đổ ra trước); <code>_</code> là lọ rỗng.
        </p>
        <a className="paper-link" href="#/">
          ← Về giao diện chính
        </a>
      </header>

      <section className="paper-controls">
        <div className="paper-controls-row">
          <Button variant="primary" onClick={createRandomPuzzle}>
            Tạo bài ngẫu nhiên
          </Button>
          <Button variant="primary" onClick={runSolver}>
            Chạy thuật toán
          </Button>
        </div>

        <SelectorGroup
          label="Thuật toán"
          onChange={(value) => {
            setAlgorithm(value)
            setResult(null)
            setStepBottles(null)
          }}
          options={ALGORITHMS}
          value={algorithm}
        />
        {usesHeuristic ? (
          <SelectorGroup
            label="Hàm heuristic"
            onChange={(value) => {
              setHeuristic(value)
              setResult(null)
              setStepBottles(null)
            }}
            options={HEURISTIC_OPTIONS}
            value={heuristic}
          />
        ) : (
          <p className="solver-note">Thuật toán này không sử dụng heuristic.</p>
        )}

        <PuzzleEditor bottles={bottles} error={error} onChange={updateBottles} />
      </section>

      <section className="paper-state">
        <h2>Trạng thái ban đầu</h2>
        <pre className="paper-compact">{`S0 = ${initialCompact}`}</pre>
      </section>

      {result && (
        <section className="paper-result">
          <h2>
            {result.solved ? 'Lời giải' : 'Không tìm thấy lời giải'} — {result.algorithm}
            {result.heuristic ? ` (${result.heuristic})` : ''}
          </h2>
          <div className="paper-stats">
            <span>Số bước: {result.moves.length}</span>
            <span>Trạng thái đã sinh: {result.visited.toLocaleString()}</span>
            <span>Trạng thái đã mở rộng: {result.explored.toLocaleString()}</span>
            <span>Thời gian: {(result.timeMs / 1000).toFixed(3)}s</span>
          </div>

          {result.timedOut && (
            <p className="paper-note">Đã dừng vì vượt quá thời gian tìm kiếm.</p>
          )}

          <h3>Trạng thái node đang chọn</h3>
          <pre className="paper-compact">
            {selectedCompact ?? `S0 = ${initialCompact}`}
          </pre>

          <h3>Cây tìm kiếm</h3>
          <div className="paper-tree">
            <SearchTree
              algorithm={result.algorithm}
              nodes={result.searchTree}
              truncated={result.truncated}
              usesHeuristic={result.heuristic != null}
              onStepChange={handleStepChange}
            />
          </div>

          {result.solved && (
            <>
              <h3>Chuỗi hành động</h3>
              <pre className="paper-compact">
                {result.pathMoves.length > 0 ? result.pathMoves.join('  ') : '(không có)'}
              </pre>

              <h3>Đường đi trạng thái</h3>
              <ol className="paper-trace">
                {solutionTrace.map((entry, index) => (
                  <li key={index}>
                    <span className="paper-trace-move">{entry.move}</span>
                    <code className="paper-trace-state">{entry.compact}</code>
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>
      )}
    </div>
  )
}

export default PaperScreen
