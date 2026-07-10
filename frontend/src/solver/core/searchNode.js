/**
 * A node in the search tree.
 *
 * @property {string[][]} bottles - the state this node represents
 * @property {SearchNode|null} parent - the node we came from
 * @property {object|null} move - the action taken to reach this node
 *   ({ from, to, color, amount } with 1-based bottle indices)
 * @property {number} depth - number of moves from the initial state
 * @property {number} cost - accumulated path cost g(n)
 * @property {number} heuristic - heuristic estimate h(n)
 */
export function createNode(bottles, parent, move, depth, cost, heuristic) {
  return { bottles, parent, move, depth, cost, heuristic, treeId: null }
}

/** f(n) = g(n) + h(n), used by A*. */
export function fScore(node) {
  return node.cost + node.heuristic
}

/**
 * Walk parent pointers from a goal node back to the root and return the
 * ordered list of moves that produced the solution.
 */
export function reconstructMoves(goalNode) {
  const moves = []
  let current = goalNode

  while (current && current.move) {
    moves.unshift(current.move)
    current = current.parent
  }

  return moves
}

export const MAX_TREE_NODES = 500

export function createSearchTreeTracker(maxNodes = MAX_TREE_NODES) {
  const nodes = []
  let nextId = 1
  let truncated = false

  function add(searchNode, stateKey) {
    if (nodes.length >= maxNodes) {
      truncated = true
      return
    }

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
