function SelectorGroup({ label, onChange, options, value }) {
  return (
    <div className="selector-group">
      <span className="field-label">{label}</span>
      <div className="segmented-control">
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value
          const optionLabel = typeof option === 'string' ? option : option.label

          return (
            <button
              className={optionValue === value ? 'active' : ''}
              key={optionValue}
              onClick={() => onChange(optionValue)}
              type="button"
            >
              {optionLabel}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SelectorGroup
