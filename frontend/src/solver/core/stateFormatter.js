import { PUZZLE_COLORS } from '../../constants/game'

// Colors are stored internally as single-letter symbols (R, G, B), which already
// match the compact notation. An empty bottle is rendered as "_".
const EMPTY_SYMBOL = '_'

function colorSymbol(color) {
  if (color == null) {
    return ''
  }
  return String(color)
}

// Formats a single bottle bottom-to-top. The rightmost character is the top of
// the bottle (the element poured first). An empty bottle becomes "_".
export function formatBottle(bottle) {
  if (!bottle || bottle.length === 0) {
    return EMPTY_SYMBOL
  }
  return bottle.map(colorSymbol).join('')
}

// Formats a full puzzle state as: (R | GGBR | BBR | GGBR | _)
// Bottles keep their original position; nothing is reordered.
export function formatState(bottles) {
  const inner = bottles.map(formatBottle).join(' | ')
  return `(${inner})`
}

// Convenience helper for display code that also wants a label, e.g. "S0 = ...".
export function formatStateWithLabel(label, bottles) {
  return `${label} = ${formatState(bottles)}`
}

export const COMPACT_COLORS = PUZZLE_COLORS
