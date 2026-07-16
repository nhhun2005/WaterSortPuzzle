import Bottle from './Bottle'

function BottleRack({ bottles }) {
  return (
    <div className="bottle-rack">
      {bottles.map((bottle, index) => (
        <Bottle bottle={bottle} index={index} key={`bottle-${index}`} />
      ))}
    </div>
  )
}

export default BottleRack
