import Button from '../components/common/Button'
import TopBar from '../components/common/TopBar'

function LevelSelectScreen({ completedLevels, levels, onBack, onSelect }) {
  return (
    <section className="screen">
      <TopBar
        action={
          <Button variant="ghost" onClick={onBack}>
            Back Home
          </Button>
        }
        subtitle="Choose a puzzle board"
        title="Level Select"
      />

      <div className="level-grid">
        {levels.map((level) => {
          const completed = completedLevels.includes(level.id)
          const status = completed ? 'Completed' : level.unlocked ? 'Unlocked' : 'Locked'

          return (
            <button
              className="level-card"
              disabled={!level.unlocked}
              key={level.id}
              onClick={() => onSelect(level)}
              type="button"
            >
              <span className="level-number">{String(level.id).padStart(2, '0')}</span>
              <strong>{level.name}</strong>
              <span>{level.difficulty}</span>
              <small>{status}</small>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default LevelSelectScreen
