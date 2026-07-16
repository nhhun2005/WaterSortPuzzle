import { generateNextStates, isEnd, isTimedOut, serializeState } from '../core/state'
import {
  createNode,
  createSearchTreeTracker,
  reconstructMoves,
} from '../core/searchNode'


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
    if (isTimedOut(startTime)) {
      return buildResult(false, null, visited.size, exploredStates, startTime, tree, true)
    }

    const current = stack.pop()
    exploredStates += 1
    tree.markExpanded(current)

    if (isEnd(current.bottles)) {
      return buildResult(true, current, visited.size, exploredStates, startTime, tree)
    }

    const nextStates = generateNextStates(current.bottles)
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

function buildResult(solved, goalNode, visited, explored, startTime, tree, timedOut = false) {
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
    timedOut,
  }
}
