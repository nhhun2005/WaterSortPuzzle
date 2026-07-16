export function createNode(bottles, parent, move, depth, cost, heuristic) {
  return { bottles, parent, move, depth, cost, heuristic, treeId: null }
}

export function fScore(node) {
  return node.cost + node.heuristic
}

export function reconstructMoves(goalNode) {
  const moves = []
  let current = goalNode

  while (current && current.move) {
    moves.unshift(current.move)
    current = current.parent
  }

  return moves
}

export function createSearchTreeTracker() {
  const nodes = []
  let nextId = 1
  const truncated = false

  function add(searchNode, stateKey) {
    const id = nextId

    nextId += 1
    searchNode.treeId = id
    nodes.push({
      id,
      parentId: searchNode.parent?.treeId ?? null,
      depth: searchNode.depth,
      move: searchNode.move,
      cost: searchNode.cost,
      heuristic: searchNode.heuristic,
      bottles: searchNode.bottles.map((bottle) => [...bottle]),
      stateKey,
      expanded: false,
      isGoal: false,
      isSolutionPath: false,
    })

  }

  function update(id, patch) {
    if (id == null) {
      return
    }

    const node = nodes.find((item) => item.id === id)
    if (node) {
      Object.assign(node, patch)
    }
  }

  function markExpanded(searchNode) {
    update(searchNode.treeId, { expanded: true })
  }

  function markGoal(searchNode) {
    update(searchNode.treeId, { isGoal: true })
  }

  function markSolutionPath(goalNode) {
    let current = goalNode
    while (current) {
      update(current.treeId, { isSolutionPath: true })
      current = current.parent
    }
  }

  function getResult() {
    return {
      searchTree: nodes,
      truncated,
    }
  }

  return {
    add,
    markExpanded,
    markGoal,
    markSolutionPath,
    getResult,
  }
}
