import Bottle from './Bottle'

// Hien thi day cac lo thuy tinh o che do chi doc de minh hoa trang thai bai toan.
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
