import { generateNextStates, isEnd, serializeState } from '../core/state'
import {
  createNode,
  createSearchTreeTracker,
  reconstructMoves,
} from '../core/searchNode'

/** Safety bound on search depth, mirrors the original Java DFS_MAX_DEPTH. */
const DFS_MAX_DEPTH = 100

/**
 * Depth-First Search.
 *
 * Explores as deep as possible along one branch before backtracking, using a
 * LIFO stack. A depth limit prevents runaway branches on hard puzzles.
 *
 * Completeness: yes within the depth bound. Optimality: no - the first
 * solution found is rarely the shortest, but DFS uses far less memory than
 * BFS and often reaches a goal quickly.
 */
export function dfs(initialBottles) {
  const startTime = performance.now()

  const visited = new Set()
  const stack = []
  let exploredStates = 0
  const tree = createSearchTreeTracker()

  const rootKey = serializeState(initialBottles)
  const root = createNode(initialBottles, null, null, 0, 0, 0)
  tree.add(root, rootKey)
  stack.push(root)
  visited.add(rootKey)

  while (stack.length > 0) {
    const current = stack.pop()
    exploredStates += 1
    tree.markExpanded(current)

    if (isEnd(current.bottles)) {
      return buildResult(true, current, visited.size, exploredStates, startTime, tree)
    }

    if (current.depth >= DFS_MAX_DEPTH) {
      continue
    }

    const nextStates = generateNextStates(current.bottles)
    // Push in reverse so the first-generated successor is expanded first.
    for (let i = nextStates.length - 1; i >= 0; i -= 1) {
      const next = nextStates[i]
      const key = serializeState(next.bottles)
      if (!visited.has(key)) {
        visited.add(key)
        const child = createNode(
          next.bottles,
          current,
          next.move,
          current.depth + 1,
          current.cost + next.cost,
          0,
        )
        tree.add(child, key)
        stack.push(child)
      }
    }
  }

  return buildResult(false, null, visited.size, exploredStates, startTime, tree)
}

function buildResult(solved, goalNode, visited, explored, startTime, tree) {
  if (solved) {
    tree.markGoal(goalNode)
    tree.markSolutionPath(goalNode)
  }
  const treeResult = tree.getResult()
  return {
    solved,
    moves: solved ? reconstructMoves(goalNode) : [],
    visited,
    explored,
    timeMs: performance.now() - startTime,
    searchTree: treeResult.searchTree,
    truncated: treeResult.truncated,
  }
}
