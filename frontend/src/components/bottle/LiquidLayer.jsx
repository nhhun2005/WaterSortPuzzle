import { COLOR_LABELS } from '../../constants/game'

function LiquidLayer({ color }) {
  return (
    <span className="liquid-slot">
      {color && (
        <span
          aria-label={COLOR_LABELS[color]}
          className="liquid-layer"
          data-color={color}
        />
      )}
    </span>
  )
}

export default LiquidLayer
