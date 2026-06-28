import Bottle from './Bottle'

function BottleRack({
  bottles,
  compact = false,
  highlightSource = null,
  highlightTarget = null,
  onBottleClick,
  selectedBottle = null,
}) {
  return (
    <div className={compact ? 'bottle-rack compact' : 'bottle-rack'}>
      {bottles.map((bottle, index) => (
        <Bottle
          bottle={bottle}
          highlightedAs={
            highlightSource === index ? 'source' : highlightTarget === index ? 'target' : null
          }
          index={index}
          key={`bottle-${index}`}
          onClick={onBottleClick}
          selected={selectedBottle === index}
        />
      ))}
    </div>
  )
}

export default BottleRack
