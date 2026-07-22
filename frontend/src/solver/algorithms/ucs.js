import { generateNextStates, isEnd, isTimedOut, serializeState } from '../core/state'
import {
  createNode,
  createSearchTreeTracker,
  reconstructMoves,
} from '../core/searchNode'
import { PriorityQueue } from '../core/priorityQueue'

export function ucs(initialBottles) {
  const startTime = performance.now()

  const frontier = new PriorityQueue(
    (a, b) => a.cost - b.cost || a.treeId - b.treeId,
  )
  const bestCost = new Map()
  let exploredStates = 0
  const tree = createSearchTreeTracker()

  const rootKey = serializeState(initialBottles)
  const root = createNode(initialBottles, null, null, 0, 0, 0)
  tree.add(root, rootKey)
  frontier.push(root)
  bestCost.set(rootKey, 0)

  while (!frontier.isEmpty()) {
    if (isTimedOut(startTime)) {
      return buildResult(false, null, bestCost.size, exploredStates, startTime, tree, true)
    }

    const current = frontier.pop()
    const currentKey = serializeState(current.bottles)

    const knownCost = bestCost.get(currentKey)
    if (knownCost !== undefined && current.cost > knownCost) {
      continue
    }

    exploredStates += 1
    tree.markExpanded(current)

    if (isEnd(current.bottles)) {
      return buildResult(true, current, bestCost.size, exploredStates, startTime, tree)
    }

    for (const next of generateNextStates(current.bottles)) {
      const key = serializeState(next.bottles)
      const newCost = current.cost + next.cost
      const oldCost = bestCost.get(key)

      if (oldCost === undefined || newCost < oldCost) {
        bestCost.set(key, newCost)
        const child = createNode(
          next.bottles,
          current,
          next.move,
          current.depth + 1,
          newCost,
          0,
        )
        tree.add(child, key)
        frontier.push(child)
      }
    }
  }

  return buildResult(false, null, bestCost.size, exploredStates, startTime, tree)
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
