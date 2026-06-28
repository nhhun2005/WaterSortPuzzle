import { CAPACITY } from '../../constants/game'
import LiquidLayer from './LiquidLayer'

function Bottle({ bottle, highlightedAs, index, onClick, selected }) {
  const clickable = typeof onClick === 'function'
  const slots = Array.from({ length: CAPACITY }, (_, slotIndex) => {
    const bottleIndex = CAPACITY - slotIndex - 1
    return bottle[bottleIndex] ?? null
  })

  return (
    <button
      aria-disabled={!clickable}
      aria-label={`Bottle ${index + 1}`}
      className={[
        'bottle-button',
        clickable ? '' : 'static',
        selected ? 'selected' : '',
        highlightedAs ? `highlight-${highlightedAs}` : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={clickable ? () => onClick(index) : undefined}
      tabIndex={clickable ? 0 : -1}
      type="button"
    >
      <span className="bottle-shell">
        {slots.map((color, slotIndex) => (
          <LiquidLayer color={color} key={`${index}-${slotIndex}`} />
        ))}
      </span>
      <span className="bottle-label">{index + 1}</span>
    </button>
  )
}

export default Bottle
