import { useEffect, useMemo, useRef, useState } from 'react'
import { COLOR_LABELS } from '../../constants/game'


const NODE_WIDTH = 132
const NODE_HEIGHT = 68
const H_GAP = 26
const V_GAP = 54
const PADDING = 24

function SearchTree({ algorithm, nodes = [], truncated, usesHeuristic, onStepChange }) {
  const expandedNodes = useMemo(
    () =>
      nodes
        .filter((node) => node.expandedAtStep != null)
        .sort((a, b) => a.expandedAtStep - b.expandedAtStep),
    [nodes],
  )
  const hasExpansionSteps = expandedNodes.length > 0
  const totalSteps = hasExpansionSteps ? expandedNodes.length : nodes.length

  const maxDepth = useMemo(
    () => nodes.reduce((max, node) => Math.max(max, node.depth ?? 0), 0),
    [nodes],
  )
  const totalLevels = nodes.length > 0 ? maxDepth + 1 : 1

  const [viewMode, setViewMode] = useState('step')
  const [currentStep, setCurrentStep] = useState(1)
  const [currentLevel, setCurrentLevel] = useState(totalLevels)
  const [selectedId, setSelectedId] = useState(1)

  const scrollRef = useRef(null)
  const dragState = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setCurrentStep(1)
    setSelectedId(1)
  }, [nodes])

  useEffect(() => {
    setCurrentLevel(totalLevels)
  }, [totalLevels])

  const stepNode = useMemo(() => {
    if (!hasExpansionSteps) {
      return nodes.find((node) => node.id === currentStep) ?? null
    }
    return expandedNodes.find((node) => node.expandedAtStep === currentStep) ?? null
  }, [nodes, expandedNodes, hasExpansionSteps, currentStep])

  const focusId = viewMode === 'step' ? stepNode?.id : selectedId

  // Only lay out the nodes that are currently visible so early steps/levels
  // are packed tightly instead of inheriting the final tree's spacing.
  const visibleNodes = useMemo(() => {
    if (viewMode === 'level') {
      return nodes.filter((node) => (node.depth ?? 0) < currentLevel)
    }
    if (!hasExpansionSteps) {
      return nodes.filter((node) => node.id <= currentStep)
    }

    // One search step is one frontier expansion. Show the expanded state and
    // every successor accepted from it as a single visual update.
    return nodes.filter((node) => (node.generatedAtStep ?? 0) <= currentStep)
  }, [nodes, viewMode, currentStep, currentLevel, hasExpansionSteps])

  const layout = useMemo(() => buildLayout(visibleNodes), [visibleNodes])

  const currentNode = useMemo(
    () => (viewMode === 'step' ? stepNode : nodes.find((node) => node.id === focusId) ?? null),
    [nodes, focusId, stepNode, viewMode],
  )

  const focusLayoutNode = useMemo(
    () => layout?.positioned.find((node) => node.id === focusId) ?? null,
    [layout, focusId],
  )

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentNode?.bottles ?? null)
    }
  }, [currentNode, onStepChange])

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller || !focusLayoutNode) {
      return
    }
    const targetLeft = focusLayoutNode.px + NODE_WIDTH / 2 - scroller.clientWidth / 2
    const targetTop = focusLayoutNode.py + NODE_HEIGHT / 2 - scroller.clientHeight / 2
    scroller.scrollLeft = Math.max(0, targetLeft)
    scroller.scrollTop = Math.max(0, targetTop)
  }, [focusLayoutNode])

  function clamp(value, min, max) {
    if (value < min) {
      return min
    }
    if (value > max) {
      return max
    }
    return value
  }

  function handleStepInput(event) {
    const raw = event.target.value
    if (raw === '') {
      return
    }
    const parsed = Number.parseInt(raw, 10)
    if (Number.isNaN(parsed)) {
      return
    }
    setCurrentStep(clamp(parsed, 1, totalSteps))
  }

  function goToStep(step) {
    setCurrentStep(clamp(step, 1, totalSteps))
  }

  function handleLevelInput(event) {
    const raw = event.target.value
    if (raw === '') {
      return
    }
    const parsed = Number.parseInt(raw, 10)
    if (Number.isNaN(parsed)) {
      return
    }
    setCurrentLevel(clamp(parsed, 1, totalLevels))
  }

  function handleNodeClick(node) {
    if (viewMode === 'level') {
      setSelectedId(node.id)
    } else {
      goToStep(node.expandedAtStep ?? node.generatedAtStep ?? node.id)
    }
  }

  function handlePointerDown(event) {
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

  const selectedAction = describeAction(currentNode)

  return (
    <div className="search-tree">
      <div className="tree-toolbar">
        <h3>Cây tìm kiếm</h3>
        {truncated && <span>Đang hiển thị 500 node đầu tiên</span>}
      </div>

      <div className="tree-view-controls">
        <div className="tree-mode-switch" role="group" aria-label="Chế độ hiển thị cây">
          <button
            type="button"
            className={viewMode === 'step' ? 'tree-mode-btn active' : 'tree-mode-btn'}
            onClick={() => setViewMode('step')}
            aria-pressed={viewMode === 'step'}
          >
            Theo bước
          </button>
          <button
            type="button"
            className={viewMode === 'level' ? 'tree-mode-btn active' : 'tree-mode-btn'}
            onClick={() => setViewMode('level')}
            aria-pressed={viewMode === 'level'}
          >
            Theo tầng
          </button>
        </div>

        {viewMode === 'step' ? (
          <div className="tree-level-controls">
            <span className="tree-level-label">Bước</span>
            <div className="tree-level-actions">
              <button
                type="button"
                className="tree-level-btn"
                onClick={() => setCurrentStep(1)}
                disabled={currentStep <= 1}
                aria-label="Bước đầu"
                title="Bước đầu"
              >
                «
              </button>
              <button
                type="button"
                className="tree-level-btn"
                onClick={() => setCurrentStep((current) => clamp(current - 1, 1, totalSteps))}
                disabled={currentStep <= 1}
                aria-label="Bước trước"
                title="Bước trước"
              >
                ←
              </button>
              <input
                type="number"
                className="tree-level-input"
                min={1}
                max={totalSteps}
                value={currentStep}
                onChange={handleStepInput}
                aria-label="Nhập số bước muốn tới"
              />
              <button
                type="button"
                className="tree-level-btn"
                onClick={() => setCurrentStep((current) => clamp(current + 1, 1, totalSteps))}
                disabled={currentStep >= totalSteps}
                aria-label="Bước tiếp theo"
                title="Bước tiếp theo"
              >
                →
              </button>
              <button
                type="button"
                className="tree-level-btn"
                onClick={() => setCurrentStep(totalSteps)}
                disabled={currentStep >= totalSteps}
                aria-label="Bước cuối"
                title="Bước cuối"
              >
                »
              </button>
            </div>
            <span className="tree-level-hint">
              Đang xem bước {currentStep}/{totalSteps}
            </span>
          </div>
        ) : (
          <div className="tree-level-controls">
            <span className="tree-level-label">Tầng</span>
            <div className="tree-level-actions">
              <button
                type="button"
                className="tree-level-btn"
                onClick={() => setCurrentLevel(1)}
                disabled={currentLevel <= 1}
                aria-label="Tầng đầu"
                title="Tầng đầu"
              >
                «
              </button>
              <button
                type="button"
                className="tree-level-btn"
                onClick={() => setCurrentLevel((current) => clamp(current - 1, 1, totalLevels))}
                disabled={currentLevel <= 1}
                aria-label="Bớt một tầng"
                title="Bớt một tầng"
              >
                ←
              </button>
              <input
                type="number"
                className="tree-level-input"
                min={1}
                max={totalLevels}
                value={currentLevel}
                onChange={handleLevelInput}
                aria-label="Nhập số tầng muốn hiển thị"
              />
              <button
                type="button"
                className="tree-level-btn"
                onClick={() => setCurrentLevel((current) => clamp(current + 1, 1, totalLevels))}
                disabled={currentLevel >= totalLevels}
                aria-label="Thêm một tầng"
                title="Thêm một tầng"
              >
                →
              </button>
              <button
                type="button"
                className="tree-level-btn"
                onClick={() => setCurrentLevel(totalLevels)}
                disabled={currentLevel >= totalLevels}
                aria-label="Tất cả tầng"
                title="Tất cả tầng"
              >
                »
              </button>
            </div>
            <button
              type="button"
              className="tree-level-all"
              onClick={() => setCurrentLevel(totalLevels)}
              disabled={currentLevel >= totalLevels}
            >
              Toàn bộ tầng
            </button>
            <span className="tree-level-hint">
              Đang hiển thị {currentLevel}/{totalLevels} tầng
            </span>
          </div>
        )}

        <div className="tree-selected-action">
          <span>Hành động đang chọn</span>
          <strong>{selectedAction}</strong>
        </div>
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
            {edges.map((edge) => {
              return (
                <path
                  className={edge.solution ? 'tree-edge solution-edge' : 'tree-edge'}
                  d={edge.path}
                  fill="none"
                  key={edge.key}
                />
              )
            })}
          </svg>

          {positioned.map((node) => {
            const label = node.move
              ? `Lọ ${node.move.from} → Lọ ${node.move.to}`
              : 'Gốc'
            const fScore = algorithm === 'A*' ? node.cost + node.heuristic : null
            const isFocused = node.id === focusId
            const className = [
              'tree-node',
              node.isSolutionPath ? 'solution-path' : '',
              node.isGoal ? 'goal' : '',
              node.expanded ? 'expanded' : '',
              isFocused ? 'focused' : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <div
                aria-label={`Xem ${label}`}
                className={className}
                key={node.id}
                onClick={() => handleNodeClick(node)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleNodeClick(node)
                  }
                }}
                onPointerDown={(event) => event.stopPropagation()}
                role="button"
                style={{
                  left: node.px,
                  top: node.py,
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                }}
                tabIndex={0}
              >
                <strong>{label}</strong>
                <div className="tree-node-metrics">
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

  // Tree node IDs reflect each algorithm's frontier/exploration order. They
  // must not determine the visual order of actions belonging to one state.
  // Always render sibling actions in the canonical source/target order used
  // by generateNextStates, without changing the solver's stored nodes.
  byId.forEach((node) => {
    node.children.sort(compareActions)
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
        fromId: node.id,
        toId: child.id,
        solution: node.isSolutionPath && child.isSolutionPath,
        path: `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`,
      })
    })
  })

  const width = PADDING * 2 + (nextColumn > 0 ? nextColumn : 1) * (NODE_WIDTH + H_GAP)
  const height = PADDING * 2 + (maxDepth + 1) * (NODE_HEIGHT + V_GAP)

  return { positioned, edges, width, height, byId, maxDepth }
}

function compareActions(a, b) {
  const fromDifference = (a.move?.from ?? 0) - (b.move?.from ?? 0)
  if (fromDifference !== 0) {
    return fromDifference
  }

  return (a.move?.to ?? 0) - (b.move?.to ?? 0)
}

function describeAction(node) {
  if (!node) {
    return 'Chưa có node được chọn'
  }

  if (!node.move) {
    return 'Gốc - trạng thái ban đầu'
  }

  const color = COLOR_LABELS[node.move.color] ?? node.move.color
  return `Đổ ${node.move.amount} vạch ${color.toLowerCase()} từ lọ ${node.move.from} sang lọ ${node.move.to}`
}

export default SearchTree
