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
              Trang thai dich
            </Button>
            <Button variant="primary" onClick={createRandomPuzzle}>
              Tao bai ngau nhien
            </Button>
          </div>
        }
        subtitle="Mot trang duy nhat de nhap bai, chon thuat toan va xem cay tim kiem"
        title="Bo giai Water Sort"
      />

      <div className="solver-layout">
        <div className="solver-preview">
          <div className="section-heading">
            <div>
              <h2>Trang thai bai toan</h2>
              <p>Co dinh 8 lo, 6 mau, moi lo chua toi da 4 lop.</p>
            </div>
          </div>
          <BottleRack bottles={bottles} compact />
        </div>

        <div className="solver-controls">
          <SelectorGroup
            label="Thuat toan"
            onChange={onAlgorithmChange}
            options={ALGORITHMS}
            value={algorithm}
          />
          {usesHeuristic ? (
            <SelectorGroup
              label="Ham heuristic"
              onChange={onHeuristicChange}
              options={HEURISTIC_OPTIONS}
              value={heuristic}
            />
          ) : (
            <p className="solver-note">Thuat toan nay khong su dung heuristic.</p>
          )}
          <Button variant="primary" onClick={() => onFindSolution(bottles)}>
            Tim loi giai
          </Button>
        </div>
      </div>

      <PuzzleEditor bottles={bottles} error={validationError} onChange={updateBottles} />

      <ResultPanel result={result} usesHeuristic={usesHeuristic} />
    </section>
  )
}

export default SolverScreen
