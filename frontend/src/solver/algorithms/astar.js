import { generateNextStates, isEnd, serializeState } from '../core/state'
import { createNode, fScore, reconstructMoves } from '../core/searchNode'
import { PriorityQueue } from '../core/priorityQueue'
import { getHeuristic } from '../heuristics'

/**
 * A* Search.
 *
 * Expands the node with the lowest f(n) = g(n) + h(n), balancing the cost paid
 * so far against the estimated cost to the goal. A `bestCost` map relaxes
 * nodes so cheaper paths replace more expensive ones.
 *
 * Because all heuristics in heuristics.js are admissible (they never
 * overestimate the remaining pours), A* returns an optimal, fewest-move
 * solution while exploring far fewer states than BFS/UCS.
 *
 * Completeness: yes. Optimality: yes (with an admissible heuristic).
 *
 * @param {string[][]} initialBottles
 * @param {string} heuristicLabel - which heuristic to use (see heuristics.js)
 */
export function astar(initialBottles, heuristicLabel) {
  const startTime = performance.now()
  const heuristic = getHeuristic(heuristicLabel)

  const frontier = new PriorityQueue((a, b) => fScore(a) - fScore(b))
  const bestCost = new Map()
  let exploredStates = 0

  const rootKey = serializeState(initialBottles)
  frontier.push(
    createNode(initialBottles, null, null, 0, 0, heuristic(initialBottles)),
  )
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
            heuristic(next.bottles),
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
