import { generateNextStates, isEnd, serializeState } from '../core/state'
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
 * Because all heuristics in heuristics.js are admissible (they never
 * overestimate the remaining pours), A* returns an optimal, fewest-move
 * solution while exploring far fewer states than BFS/UCS.
 *
 * Completeness: yes. Optimality: yes (with an admissible heuristic).
 *
 * -----------------------------------------------------------------------------
 * ƯU ĐIỂM (điểm mạnh):
 *  - Vừa NHANH vừa TỐI ƯU: kết hợp chi phí đã đi g(n) và ước lượng còn lại
 *    h(n), nên tìm được lời giải ngắn nhất mà mở rộng ít node hơn BFS/UCS.
 *  - Đầy đủ (complete) và tối ưu KHI heuristic là "admissible" (không bao giờ
 *    ước lượng quá số bước còn lại) - đúng như các heuristic trong file này.
 *  - Thường là lựa chọn cân bằng tốt nhất giữa tốc độ và chất lượng lời giải.
 *
 * NHƯỢC ĐIỂM (điểm yếu):
 *  - Tốn BỘ NHỚ nhiều: phải lưu frontier và bảng bestCost, có thể phình to với
 *    bài toán lớn.
 *  - Chậm lại nếu heuristic yếu (gần bằng 0) -> lúc đó A* thoái hóa thành UCS.
 *  - Nếu heuristic KHÔNG admissible (ước lượng quá tay) thì mất tính tối ưu.
 *
 * KHI NÀO TỐI ƯU: cần lời giải NGẮN NHẤT mà vẫn muốn nhanh, và có heuristic
 *  admissible tốt.
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
