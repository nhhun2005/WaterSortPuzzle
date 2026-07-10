import { generateNextStates, isEnd, serializeState } from '../core/state'
import {
  createNode,
  createSearchTreeTracker,
  reconstructMoves,
} from '../core/searchNode'
import { PriorityQueue } from '../core/priorityQueue'
import { getHeuristic } from '../heuristics'

/**
 * Greedy Best-First Search.
 *
 * Always expands the node that looks closest to the goal according to the
 * heuristic h(n) alone, ignoring the cost already paid. This makes it fast and
 * memory-light, but it can be led astray and does not guarantee the shortest
 * solution.
 *
 * Completeness: yes (with a visited set on a finite graph). Optimality: no.
 *
 * @param {string[][]} initialBottles
 * @param {string} heuristicLabel - which heuristic to use (see heuristics.js)
 */
export function greedy(initialBottles, heuristicLabel) {
  const startTime = performance.now()
  const heuristic = getHeuristic(heuristicLabel)

  const frontier = new PriorityQueue((a, b) => a.heuristic - b.heuristic)
  const visited = new Set()
  let exploredStates = 0
  const tree = createSearchTreeTracker()

  const rootKey = serializeState(initialBottles)
  const root = createNode(initialBottles, null, null, 0, 0, heuristic(initialBottles))
  tree.add(root, rootKey)
  frontier.push(root)
  visited.add(rootKey)

  while (!frontier.isEmpty()) {
    const current = frontier.pop()
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
          heuristic(next.bottles),
        )
        tree.add(child, key)
        frontier.push(child)
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
