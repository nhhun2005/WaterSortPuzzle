import BottleRack from '../components/bottle/BottleRack'
import Button from '../components/common/Button'
import StatCard from '../components/common/StatCard'
import TopBar from '../components/common/TopBar'
import WinModal from '../components/common/WinModal'
import { CAPACITY } from '../constants/game'

function GameplayScreen({
  bottles,
  completed,
  currentLevel,
  lastAction,
  moveCount,
  onBack,
  onBottleClick,
  onReset,
  onSolver,
  onUndo,
  selectedBottle,
  statusMessage,
  undoDisabled,
}) {
  return (
    <section className="screen">
      <TopBar
        action={
          <Button variant="ghost" onClick={onBack}>
            Back Home
          </Button>
        }
        subtitle={currentLevel.difficulty}
        title={currentLevel.name}
      />

      <div className="game-stats">
        <StatCard label="Moves" value={moveCount} />
        <StatCard label="Bottles" value={bottles.length} />
        <StatCard label="Capacity" value={CAPACITY} />
      </div>

      <div className="game-panel">
        <BottleRack
          bottles={bottles}
          onBottleClick={onBottleClick}
          selectedBottle={selectedBottle}
        />
      </div>

      <div className="status-strip">
        <span>{statusMessage}</span>
        {lastAction && <strong>{`Bottle ${lastAction.from} -> Bottle ${lastAction.to}`}</strong>}
      </div>

      <div className="toolbar">
        <Button variant="secondary" onClick={onUndo} disabled={undoDisabled}>
          Undo
        </Button>
        <Button variant="danger" onClick={onReset}>
          Reset
        </Button>
        <Button variant="primary" onClick={onSolver}>
          AI Solver
        </Button>
      </div>

      {completed && (
        <WinModal
          moves={moveCount}
          onBack={onBack}
          onNext={onReset}
          onSolver={onSolver}
        />
      )}
    </section>
  )
}

export default GameplayScreen
