import Button from '../components/common/Button'
import TopBar from '../components/common/TopBar'
import { ALGORITHMS } from '../constants/game'
import { INFO_ITEMS } from '../data/projectInfo'

function ProjectInfoScreen({ onBack }) {
  return (
    <section className="screen">
      <TopBar
        action={
          <Button variant="ghost" onClick={onBack}>
            Back Home
          </Button>
        }
        subtitle="How the AI problem maps to Water Sort Puzzle"
        title="Project Info"
      />

      <div className="info-grid">
        {INFO_ITEMS.map((item) => (
          <article className="info-card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </div>

      <div className="algorithm-band">
        <h2>Algorithms in scope</h2>
        <div className="algorithm-list">
          {ALGORITHMS.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectInfoScreen
