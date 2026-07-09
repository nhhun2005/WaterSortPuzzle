import { generateNextStates, isEnd, serializeState } from '../core/state'
import { createNode, reconstructMoves } from '../core/searchNode'

/**
 * Breadth-First Search.
 *
 * Explores the search tree level by level using a FIFO queue. Because every
 * move has the same cost, the first time BFS reaches the goal it has found a
 * solution with the fewest possible moves (optimal in path length).
 *
 * Completeness: yes. Optimality: yes (uniform step cost). Memory is the main
 * cost, since the frontier can grow very wide.
 */
export function bfs(initialBottles) {
  const startTime = performance.now()

  const visited = new Set()
  const queue = []
  let head = 0 // index-based dequeue to avoid O(n) Array.shift
  let exploredStates = 0

  const rootKey = serializeState(initialBottles)
  queue.push(createNode(initialBottles, null, null, 0, 0, 0))
  visited.add(rootKey)

  while (head < queue.length) {
    const current = queue[head]
    head += 1
    exploredStates += 1

    if (isEnd(current.bottles)) {
      return buildResult(true, current, visited.size, exploredStates, startTime)
    }

    for (const next of generateNextStates(current.bottles)) {
      const key = serializeState(next.bottles)
      if (!visited.has(key)) {
        visited.add(key)
        queue.push(
          createNode(
            next.bottles,
            current,
            next.move,
            current.depth + 1,
            current.cost + next.cost,
            0,
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
