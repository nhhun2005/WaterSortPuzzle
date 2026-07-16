import { CAPACITY } from '../../constants/game'
import LiquidLayer from './LiquidLayer'

function Bottle({ bottle, index }) {
  const slots = Array.from({ length: CAPACITY }, (_, slotIndex) => {
    const bottleIndex = CAPACITY - slotIndex - 1
    return bottle[bottleIndex] ?? null
  })

  return (
    <div aria-label={`Lọ ${index + 1}`} className="bottle-button static">
      <span className="bottle-shell">
        {slots.map((color, slotIndex) => (
          <LiquidLayer color={color} key={`${index}-${slotIndex}`} />
        ))}
      </span>
      <span className="bottle-label">{index + 1}</span>
    </div>
  )
}

export default Bottle
