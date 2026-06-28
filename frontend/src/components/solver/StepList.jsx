import { COLOR_LABELS } from '../../constants/game'

function StepList({ activeStep = null, onStepSelect, steps }) {
  const interactive = typeof onStepSelect === 'function'

  return (
    <ol className="step-list">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const content = (
          <>
            <span>{String(stepNumber).padStart(2, '0')}</span>
            <strong>{`Bottle ${step.from} -> Bottle ${step.to}`}</strong>
            <small>{`${COLOR_LABELS[step.color]} x ${step.amount}`}</small>
          </>
        )

        return (
          <li
            className={[
              activeStep === stepNumber ? 'active' : '',
              interactive ? 'interactive' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            key={`${step.from}-${step.to}-${index}`}
          >
            {interactive ? (
              <button onClick={() => onStepSelect(stepNumber)} type="button">
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default StepList
