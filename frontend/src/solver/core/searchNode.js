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
  return { bottles, parent, move, depth, cost, heuristic }
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
