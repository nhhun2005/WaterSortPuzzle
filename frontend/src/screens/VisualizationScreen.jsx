import BottleRack from '../components/bottle/BottleRack'
import Button from '../components/common/Button'
import TopBar from '../components/common/TopBar'
import StepList from '../components/solver/StepList'
import { actionText } from '../lib/gameLogic'

function VisualizationScreen({
  current,
  maxStep,
  onBack,
  onNext,
  onPrevious,
  onStepSelect,
  step,
  steps,
}) {
  const highlight = current.action
    ? {
        source: current.action.from - 1,
        target: current.action.to - 1,
      }
    : null

  return (
    <section className="screen">
      <TopBar
        action={
          <Button variant="ghost" onClick={onBack}>
            Back Solver
          </Button>
        }
        subtitle={`Step ${step} / ${maxStep}`}
        title="Step Visualization"
      />

      <div className="visual-layout">
        <div className="visual-panel">
          <BottleRack
            bottles={current.bottles}
            highlightSource={highlight?.source}
            highlightTarget={highlight?.target}
          />
        </div>

        <aside className="visual-steps">
          <h2>Moves</h2>
          <StepList activeStep={step} onStepSelect={onStepSelect} steps={steps} />
        </aside>
      </div>

      <div className="status-strip visual-action">
        <span>{actionText(current.action)}</span>
      </div>

      <div className="toolbar">
        <Button variant="secondary" onClick={onPrevious} disabled={step === 0}>
          Previous
        </Button>
        <Button variant="primary" onClick={onNext} disabled={step === maxStep}>
          Next
        </Button>
      </div>
    </section>
  )
}

export default VisualizationScreen
