import { generateNextStates, isEnd, serializeState } from '../core/state'
import { createNode, reconstructMoves } from '../core/searchNode'
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

  const rootKey = serializeState(initialBottles)
  frontier.push(
    createNode(initialBottles, null, null, 0, 0, heuristic(initialBottles)),
  )
  visited.add(rootKey)

  while (!frontier.isEmpty()) {
    const current = frontier.pop()
    exploredStates += 1

    if (isEnd(current.bottles)) {
      return buildResult(true, current, visited.size, exploredStates, startTime)
    }

    for (const next of generateNextStates(current.bottles)) {
      const key = serializeState(next.bottles)
      if (!visited.has(key)) {
        visited.add(key)
        frontier.push(
          createNode(
            next.bottles,
            current,
            next.move,
            current.depth + 1,
            current.cost + next.cost,
            heuristic(next.bottles),
          ),
        )
      }
    }
  }

  return buildResult(false, null, visited.size, exploredStates, startTime)
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
