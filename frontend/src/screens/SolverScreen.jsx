import { useState } from 'react'
import BottleRack from '../components/bottle/BottleRack'
import Button from '../components/common/Button'
import TopBar from '../components/common/TopBar'
import PuzzleEditor from '../components/solver/PuzzleEditor'
import ResultPanel from '../components/solver/ResultPanel'
import SelectorGroup from '../components/solver/SelectorGroup'
import { ALGORITHMS, HEURISTIC_OPTIONS } from '../constants/game'
import { createSolvedPuzzle, generateRandomPuzzle } from '../lib/puzzleGenerator'

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

  function createRandomPuzzle() {
    setBottles(generateRandomPuzzle())
    onPuzzleChange()
  }

  function resetSolvedPuzzle() {
    setBottles(createSolvedPuzzle())
    onPuzzleChange()
  }

  function updateBottles(nextBottles) {
    setBottles(nextBottles)
    onPuzzleChange()
  }

  return (
    <section className="screen solver-screen">
      <TopBar
        action={
          <div className="toolbar compact-toolbar">
            <Button variant="secondary" onClick={resetSolvedPuzzle}>
              Trạng thái đích
            </Button>
            <Button variant="primary" onClick={createRandomPuzzle}>
              Tạo bài ngẫu nhiên
            </Button>
          </div>
        }
        subtitle="Một trang duy nhất để nhập bài, chọn thuật toán và xem cây tìm kiếm"
        title="Bộ giải Water Sort"
      />

      <div className="solver-layout">
        <div className="solver-preview">
          <div className="section-heading">
            <div>
              <h2>Trạng thái bài toán</h2>
              <p>Cố định 8 lọ, 6 màu, mỗi lọ chứa tối đa 4 lớp.</p>
            </div>
          </div>
          <BottleRack bottles={bottles} compact />
        </div>

        <div className="solver-controls">
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
          <Button variant="primary" onClick={() => onFindSolution(bottles)}>
            Tìm lời giải
          </Button>
        </div>
      </div>

      <PuzzleEditor bottles={bottles} error={validationError} onChange={updateBottles} />

      <ResultPanel result={result} usesHeuristic={usesHeuristic} />
    </section>
  )
}

export default SolverScreen
