import { generateNextStates, isEnd, serializeState } from '../core/state'
import {
  createNode,
  createSearchTreeTracker,
  reconstructMoves,
} from '../core/searchNode'
import { PriorityQueue } from '../core/priorityQueue'

/**
 * Uniform-Cost Search (Tìm kiếm theo chi phí đều).
 *
 * Expands the frontier node with the lowest accumulated path cost g(n) first,
 * using a min-heap keyed on cost. A `bestCost` map lets us relax nodes: if we
 * find a cheaper way to reach a state we re-add it with the lower cost.
 *
 * With uniform step costs UCS behaves like BFS but is written generally so it
 * stays correct if move costs ever change. Completeness: yes. Optimality: yes.
 *
 * -----------------------------------------------------------------------------
 * ƯU ĐIỂM (điểm mạnh):
 *  - Luôn tìm ra lời giải có TỔNG CHI PHÍ THẤP NHẤT (tối ưu), ngay cả khi
 *    các bước đi có chi phí khác nhau.
 *  - Đầy đủ (complete): có lời giải thì chắc chắn tìm thấy.
 *  - Tổng quát hơn BFS: vẫn đúng khi chi phí mỗi bước thay đổi trong tương lai.
 *
 * NHƯỢC ĐIỂM (điểm yếu):
 *  - Khi mỗi bước có chi phí bằng nhau (đúng như bài toán này), UCS chỉ là BFS
 *    "đội lốt" nhưng LẠI CHẬM HƠN vì phải duy trì hàng đợi ưu tiên (min-heap).
 *  - Tốn BỘ NHỚ tương đương BFS: lưu rất nhiều trạng thái trong frontier.
 *  - Không dùng heuristic nên không biết hướng về đích -> mở rộng thừa nhiều
 *    node không cần thiết.
 *
 * KHI NÀO TỐI ƯU: các bước đi có CHI PHÍ KHÁC NHAU và ta cần lời giải rẻ nhất.
 * KHI NÀO YẾU: mỗi bước chi phí như nhau (như đây) -> nên dùng BFS cho nhanh;
 *  hoặc bài toán lớn khiến tốn nhiều bộ nhớ và thời gian.
 * -----------------------------------------------------------------------------
 */

export function ucs(initialBottles) {
  const startTime = performance.now()

  const frontier = new PriorityQueue((a, b) => a.cost - b.cost)
  const bestCost = new Map()
  let exploredStates = 0
  const tree = createSearchTreeTracker()

  const rootKey = serializeState(initialBottles)
  const root = createNode(initialBottles, null, null, 0, 0, 0)
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
          0,
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
