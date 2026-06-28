function SelectorGroup({ label, onChange, options, value }) {
  return (
    <div className="selector-group">
      <span className="field-label">{label}</span>
      <div className="segmented-control">
        {options.map((option) => (
          <button
            className={option === value ? 'active' : ''}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SelectorGroup
