import { useCallback, useState } from 'react'
import BottleRack from '../components/bottle/BottleRack'
import Button from '../components/common/Button'
import PuzzleEditor from '../components/solver/PuzzleEditor'
import ResultPanel from '../components/solver/ResultPanel'
import SelectorGroup from '../components/solver/SelectorGroup'
import { ALGORITHMS, HEURISTIC_OPTIONS } from '../constants/game'
import { generateRandomPuzzle } from '../lib/puzzleGenerator'

function SolverScreen({
  algorithm,
  heuristic,
  onAlgorithmChange,
  onFindSolution,
  onHeuristicChange,
  onPuzzleChange,
  result,
  validationError,
  usesHeuristic,
}) {
  const [bottles, setBottles] = useState(() => generateRandomPuzzle())
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [stepBottles, setStepBottles] = useState(null)

  function createRandomPuzzle() {
    setBottles(generateRandomPuzzle())
    setStepBottles(null)
    onPuzzleChange()
  }

  function updateBottles(nextBottles) {
    setBottles(nextBottles)
    setStepBottles(null)
    onPuzzleChange()
  }

  const handleStepChange = useCallback((nextBottles) => {
    setStepBottles(nextBottles)
  }, [])

  const displayedBottles = stepBottles ?? bottles


  return (
    <div className="solver-fullscreen">
      <aside className={`solver-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="app-title">Water Sort Puzzle</h1>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Ẩn sidebar' : 'Hiện sidebar'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section">
            <h2>Điều khiển</h2>
            <div className="sidebar-buttons">
              <Button variant="primary" onClick={createRandomPuzzle}>
                Tạo bài ngẫu nhiên
              </Button>
            </div>
          </div>

          <div className="sidebar-section">
            <h2>Nhập bài cụ thể</h2>
            <p>Mỗi cột là một lọ, ô dưới là đáy lọ và ô trên là miệng lọ.</p>
            <PuzzleEditor
              bottles={bottles}
              error={validationError}
              onChange={updateBottles}
              showHeading={false}
            />
          </div>

          <div className="sidebar-section">
            <SelectorGroup
              label="Thuật toán"
              onChange={onAlgorithmChange}
              options={ALGORITHMS}
              value={algorithm}
            />
            {usesHeuristic ? (
              <SelectorGroup
                label="Hàm heuristic"
                onChange={onHeuristicChange}
                options={HEURISTIC_OPTIONS}
                value={heuristic}
              />
            ) : (
              <p className="solver-note">Thuật toán này không sử dụng heuristic.</p>
            )}
          </div>

          <div className="sidebar-section">
            <Button variant="primary" onClick={() => onFindSolution(bottles)} fullWidth>
              Tìm lời giải
            </Button>
          </div>
        </div>
      </aside>

      {!sidebarOpen && (
        <button
          className="sidebar-open-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Hiện sidebar"
        >
          ▶
        </button>
      )}

      <main className="solver-main">
        <section className="solver-state-panel">
          <div className="solver-state-header">
            <h2>Trạng thái bài toán</h2>

          </div>
          <BottleRack bottles={displayedBottles} />
        </section>

        <ResultPanel
          result={result}
          usesHeuristic={usesHeuristic}
          onStepChange={handleStepChange}
          bottles={bottles}
        />
      </main>

    </div>
  )
}

export default SolverScreen
