import { BOTTLE_COUNT, CAPACITY, COLOR_LABELS, PUZZLE_COLORS } from '../../constants/game'

const EMPTY_VALUE = ''

function PuzzleEditor({ bottles, error, onChange }) {
  function setCell(bottleIndex, layerIndex, value) {
    const next = Array.from({ length: BOTTLE_COUNT }, (_, index) => [
      ...(bottles[index] ?? []),
    ])

    const cells = Array.from({ length: CAPACITY }, (_, index) => next[bottleIndex][index] ?? null)
    cells[layerIndex] = value || null
    next[bottleIndex] = cells.filter(Boolean)
    onChange(next)
  }

  return (
    <div className="puzzle-editor">
      <div className="section-heading">
        <div>
          <h2>Nhap bai cu the</h2>
          <p>Moi cot la mot lo, o duoi la day lo va o tren la mieng lo.</p>
        </div>
      </div>

      <div className="editor-grid">
        {Array.from({ length: BOTTLE_COUNT }, (_, bottleIndex) => (
          <div className="editor-bottle" key={bottleIndex}>
            <span>Lo {bottleIndex + 1}</span>
            <div className="editor-cells">
              {Array.from({ length: CAPACITY }, (_, reverseIndex) => {
                const layerIndex = CAPACITY - 1 - reverseIndex
                const value = bottles[bottleIndex]?.[layerIndex] ?? EMPTY_VALUE
                return (
                  <select
                    aria-label={`Lo ${bottleIndex + 1}, lop ${layerIndex + 1}`}
                    className="editor-cell"
                    data-color={value || undefined}
                    key={layerIndex}
                    onChange={(event) => setCell(bottleIndex, layerIndex, event.target.value)}
                    value={value}
                  >
                    <option value={EMPTY_VALUE}>Trong</option>
                    {PUZZLE_COLORS.map((color) => (
                      <option key={color} value={color}>
                        {COLOR_LABELS[color]}
                      </option>
                    ))}
                  </select>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="validation-message">{error}</p>}
    </div>
  )
}

export default PuzzleEditor
