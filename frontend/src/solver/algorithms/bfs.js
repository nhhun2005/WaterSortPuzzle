import { generateNextStates, isEnd, isTimedOut, serializeState } from '../core/state'

import {
  createNode,
  createSearchTreeTracker,
  reconstructMoves,
} from '../core/searchNode'

export function bfs(initialBottles) {
  const startTime = performance.now()

  const visited = new Set()
  const queue = []
  let head = 0
  let exploredStates = 0
  const tree = createSearchTreeTracker()

  const rootKey = serializeState(initialBottles)
  const root = createNode(initialBottles, null, null, 0, 0, 0)
  tree.add(root, rootKey)
  queue.push(root)
  visited.add(rootKey)

  while (head < queue.length) {
    if (isTimedOut(startTime)) {
      return buildResult(false, null, visited.size, exploredStates, startTime, tree, true)
    }

    const current = queue[head]
    head += 1
    exploredStates += 1
    tree.markExpanded(current)


    if (isEnd(current.bottles)) {
      return buildResult(true, current, visited.size, exploredStates, startTime, tree)
    }

    for (const next of generateNextStates(current.bottles)) {
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
        queue.push(child)
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
