import Button from './Button'

function WinModal({ moves, onBack, onNext, onSolver }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section aria-modal="true" className="modal" role="dialog">
        <p className="eyebrow">Goal state reached</p>
        <h2>Puzzle Solved!</h2>
        <p>{`Completed in ${moves} moves.`}</p>
        <div className="modal-actions">
          <Button variant="primary" onClick={onNext}>
            Play Again
          </Button>
          <Button variant="secondary" onClick={onSolver}>
            AI Solver
          </Button>
          <Button variant="ghost" onClick={onBack}>
            Back Home
          </Button>
        </div>
      </section>
    </div>
  )
}

export default WinModal
