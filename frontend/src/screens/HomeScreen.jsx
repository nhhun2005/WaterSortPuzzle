import BottleRack from '../components/bottle/BottleRack'
import Button from '../components/common/Button'

function HomeScreen({ onInfo, onLevels, onPlay, onSolver, previewBottles }) {
  return (
    <section className="screen home-screen">
      <div className="home-copy">
        <p className="eyebrow">AI Search Algorithm Project</p>
        <h1>Water Sort Puzzle</h1>
        <p className="lead">
          Sort the colored liquid by pouring between bottles, then compare the
          gameplay with classic AI search strategies.
        </p>

        <div className="home-actions" aria-label="Main navigation">
          <Button variant="primary" onClick={onPlay}>
            Play
          </Button>
          <Button variant="secondary" onClick={onSolver}>
            AI Solver
          </Button>
          <Button variant="secondary" onClick={onLevels}>
            Level Select
          </Button>
          <Button variant="ghost" onClick={onInfo}>
            Project Info
          </Button>
        </div>
      </div>

      <div className="home-board" aria-label="Puzzle preview">
        <div className="mini-status">
          <span>Capacity 4</span>
          <span>BFS ready</span>
        </div>
        <BottleRack bottles={previewBottles} compact />
      </div>
    </section>
  )
}

export default HomeScreen
