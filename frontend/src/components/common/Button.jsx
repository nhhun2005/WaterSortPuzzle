function Button({ children, disabled = false, fullWidth = false, onClick, variant = 'secondary' }) {
  return (
    <button
      className={`button button-${variant}${fullWidth ? ' button-full-width' : ''}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

export default Button
