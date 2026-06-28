function TopBar({ action, subtitle, title }) {
  return (
    <header className="top-bar">
      <div>
        <p className="eyebrow">{subtitle}</p>
        <h1>{title}</h1>
      </div>
      {action}
    </header>
  )
}

export default TopBar
