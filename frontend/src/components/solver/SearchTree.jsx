import { useMemo, useRef, useState } from 'react'


const NODE_WIDTH = 132
const NODE_HEIGHT = 68
const H_GAP = 26
const V_GAP = 54
const PADDING = 24

/**
 * Ve cay tim kiem theo dang so do cay tu tren xuong: node goc o tren cung,
 * cac node con toa xuong duoi va duoc noi voi node cha bang duong cong.
 */
function SearchTree({ algorithm, nodes = [], truncated, usesHeuristic }) {
  const layout = useMemo(() => buildLayout(nodes), [nodes])
  const scrollRef = useRef(null)
  const dragState = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function handlePointerDown(event) {
    // Chi keo bang chuot trai hoac cham, khong chan tuong tac khac.
    if (event.button !== 0) {
      return
    }
    const scroller = scrollRef.current
    if (!scroller) {
      return
    }
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: scroller.scrollLeft,
      scrollTop: scroller.scrollTop,
      moved: false,
    }
    setIsDragging(true)
    scroller.setPointerCapture?.(event.pointerId)
  }

  function handlePointerMove(event) {
    const state = dragState.current
    const scroller = scrollRef.current
    if (!state || !scroller) {
      return
    }
    const dx = event.clientX - state.startX
    const dy = event.clientY - state.startY
    if (!state.moved && Math.abs(dx) + Math.abs(dy) > 3) {
      state.moved = true
    }
    scroller.scrollLeft = state.scrollLeft - dx
    scroller.scrollTop = state.scrollTop - dy
  }

  function endDrag(event) {
    if (!dragState.current) {
      return
    }
    dragState.current = null
    setIsDragging(false)
    scrollRef.current?.releasePointerCapture?.(event.pointerId)
  }

  if (nodes.length === 0) {
    return <p className="tree-empty">Chưa có cây tìm kiếm.</p>
  }

  if (!layout) {
    return <p className="tree-empty">Không dựng được cây tìm kiếm.</p>
  }

  const { positioned, edges, width, height } = layout


  return (
    <div className="search-tree">
      <div className="tree-toolbar">
        <h3>Cây tìm kiếm</h3>
        {truncated && <span>Đang hiển thị 500 node đầu tiên</span>}
      </div>

      <div className="tree-legend">
        <span className="legend-item legend-solution">Đường lời giải</span>
        <span className="legend-item legend-goal">Đích</span>
        <span className="legend-item legend-expanded">Đã mở rộng</span>
      </div>

      <div
        className={isDragging ? 'tree-canvas-scroll dragging' : 'tree-canvas-scroll'}
        onPointerDown={handlePointerDown}
        onPointerLeave={endDrag}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        ref={scrollRef}
      >
        <div className="tree-canvas" style={{ width, height }}>

          <svg
            className="tree-edges"
            height={height}
            width={width}
            xmlns="http://www.w3.org/2000/svg"
          >
            {edges.map((edge) => (
              <path
                className={edge.solution ? 'tree-edge solution-edge' : 'tree-edge'}
                d={edge.path}
                fill="none"
                key={edge.key}
              />
            ))}
          </svg>

          {positioned.map((node) => {
            const label = node.move
              ? `Lọ ${node.move.from} → Lọ ${node.move.to}`
              : 'Gốc'
            const fScore = algorithm === 'A*' ? node.cost + node.heuristic : null
            const className = [
              'tree-node',
              node.isSolutionPath ? 'solution-path' : '',
              node.isGoal ? 'goal' : '',
              node.expanded ? 'expanded' : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <div
                className={className}
                key={node.id}
                style={{
                  left: node.px,
                  top: node.py,
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                }}
              >
                <strong>{label}</strong>
                <div className="tree-node-metrics">
                  <small>d={node.depth}</small>
                  <small>g={node.cost}</small>
                  {usesHeuristic && <small>h={node.heuristic}</small>}
                  {fScore !== null && <small>f={fScore}</small>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/**
 * Tinh toa do cho tung node bang thuat toan bo tri cay don gian:
 * la duoc xep tuan tu theo truc ngang, node cha duoc can giua cac con.
 */
function buildLayout(nodes) {
  if (nodes.length === 0) {
    return null
  }

  const byId = new Map()
  nodes.forEach((node) => {
    byId.set(node.id, { ...node, children: [] })
  })

  let root = null
  byId.forEach((node) => {
    const parent = node.parentId != null ? byId.get(node.parentId) : null
    if (parent) {
      parent.children.push(node)
    } else if (!root) {
      root = node
    }
  })

  if (!root) {
    return null
  }

  let nextColumn = 0
  let maxDepth = 0

  function assign(node, depth) {
    node.depth = depth
    maxDepth = Math.max(maxDepth, depth)

    if (node.children.length === 0) {
      node.column = nextColumn
      nextColumn += 1
    } else {
      node.children.forEach((child) => assign(child, depth + 1))
      const first = node.children[0].column
      const last = node.children[node.children.length - 1].column
      node.column = (first + last) / 2
    }
  }

  assign(root, 0)

  const positioned = []
  byId.forEach((node) => {
    node.px = PADDING + node.column * (NODE_WIDTH + H_GAP)
    node.py = PADDING + node.depth * (NODE_HEIGHT + V_GAP)
    positioned.push(node)
  })

  const edges = []
  byId.forEach((node) => {
    node.children.forEach((child) => {
      const startX = node.px + NODE_WIDTH / 2
      const startY = node.py + NODE_HEIGHT
      const endX = child.px + NODE_WIDTH / 2
      const endY = child.py
      const midY = (startY + endY) / 2
      edges.push({
        key: `${node.id}-${child.id}`,
        solution: node.isSolutionPath && child.isSolutionPath,
        path: `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`,
      })
    })
  })

  const width = PADDING * 2 + (nextColumn > 0 ? nextColumn : 1) * (NODE_WIDTH + H_GAP)
  const height = PADDING * 2 + (maxDepth + 1) * (NODE_HEIGHT + V_GAP)

  return { positioned, edges, width, height }
}

export default SearchTree
