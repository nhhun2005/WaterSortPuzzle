import { generateNextStates, isEnd, serializeState } from '../core/state'
import { createNode, reconstructMoves } from '../core/searchNode'
import { PriorityQueue } from '../core/priorityQueue'

/**
 * Uniform-Cost Search.
 *
 * Expands the frontier node with the lowest accumulated path cost g(n) first,
 * using a min-heap keyed on cost. A `bestCost` map lets us relax nodes: if we
 * find a cheaper way to reach a state we re-add it with the lower cost.
 *
 * With uniform step costs UCS behaves like BFS but is written generally so it
 * stays correct if move costs ever change. Completeness: yes. Optimality: yes.
 */
export function ucs(initialBottles) {
  const startTime = performance.now()

  const frontier = new PriorityQueue((a, b) => a.cost - b.cost)
  const bestCost = new Map()
  let exploredStates = 0

  const rootKey = serializeState(initialBottles)
  frontier.push(createNode(initialBottles, null, null, 0, 0, 0))
  bestCost.set(rootKey, 0)

  while (!frontier.isEmpty()) {
    const current = frontier.pop()
    const currentKey = serializeState(current.bottles)

    // Skip stale entries left behind after a cheaper relaxation.
    const knownCost = bestCost.get(currentKey)
    if (knownCost !== undefined && current.cost > knownCost) {
      continue
    }

    exploredStates += 1

    if (isEnd(current.bottles)) {
      return buildResult(true, current, bestCost.size, exploredStates, startTime)
    }

    for (const next of generateNextStates(current.bottles)) {
      const key = serializeState(next.bottles)
      const newCost = current.cost + next.cost
      const oldCost = bestCost.get(key)

      if (oldCost === undefined || newCost < oldCost) {
        bestCost.set(key, newCost)
        frontier.push(
          createNode(
            next.bottles,
            current,
            next.move,
            current.depth + 1,
            newCost,
            0,
          ),
        )
      }
    }
  }

  return buildResult(false, null, bestCost.size, exploredStates, startTime)
}

function buildResult(solved, goalNode, visited, explored, startTime) {
  return {
    solved,
    moves: solved ? reconstructMoves(goalNode) : [],
    visited,
    explored,
    timeMs: performance.now() - startTime,
  }
}
