import { generateNextStates, isEnd, isTimedOut, serializeState } from '../core/state'
import {
  createNode,
  createSearchTreeTracker,
  fScore,
  reconstructMoves,
} from '../core/searchNode'
import { PriorityQueue } from '../core/priorityQueue'
import { getHeuristic } from '../heuristics'

/**
 * A* Search (Tìm kiếm A sao).
 *
 * Expands the node with the lowest f(n) = g(n) + h(n), balancing the cost paid
 * so far against the estimated cost to the goal. A `bestCost` map relaxes
 * nodes so cheaper paths replace more expensive ones.
 *
 * By combining g(n) and h(n) it usually reaches the goal after expanding far
 * fewer nodes than BFS/UCS.
 *
 * -----------------------------------------------------------------------------
 * ƯU ĐIỂM (điểm mạnh):
 *  - Vừa NHANH vừa "có định hướng": kết hợp chi phí đã đi g(n) và ước lượng
 *    còn lại h(n), nên thường mở rộng ít node hơn BFS/UCS.
 *  - Đầy đủ (complete): có lời giải thì tìm thấy.
 *  - Thường là lựa chọn cân bằng tốt giữa tốc độ và chất lượng lời giải.
 *
 * NHƯỢC ĐIỂM (điểm yếu):
 *  - Tốn BỘ NHỚ nhiều: phải lưu frontier và bảng bestCost, có thể phình to với
 *    bài toán lớn.
 *  - Chậm lại nếu heuristic yếu (gần bằng 0) -> lúc đó A* thoái hóa thành UCS.
 *  - Chất lượng lời giải phụ thuộc vào hàm heuristic được chọn.
 *
 * KHI NÀO MẠNH: cần lời giải nhanh với heuristic dẫn đường tốt.
 * KHI NÀO YẾU: bộ nhớ hạn chế với bài toán cực lớn, hoặc heuristic quá kém
 *  khiến nó chậm như UCS.
 * -----------------------------------------------------------------------------
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
  const tree = createSearchTreeTracker()

  const rootKey = serializeState(initialBottles)
  const root = createNode(initialBottles, null, null, 0, 0, heuristic(initialBottles))
  tree.add(root, rootKey)
  frontier.push(root)
  bestCost.set(rootKey, 0)

  while (!frontier.isEmpty()) {
    // Dung lai neu vuot qua gioi han thoi gian (mac dinh 10 giay).
    if (isTimedOut(startTime)) {
      return buildResult(false, null, bestCost.size, exploredStates, startTime, tree, true)
    }

    const current = frontier.pop()
    const currentKey = serializeState(current.bottles)

    // Skip stale entries left behind after a cheaper relaxation.
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
          heuristic(next.bottles),
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
