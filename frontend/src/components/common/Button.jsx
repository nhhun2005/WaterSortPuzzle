function Button({ children, disabled = false, onClick, variant = 'secondary' }) {
  return (
    <button
      className={`button button-${variant}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

export default Button
