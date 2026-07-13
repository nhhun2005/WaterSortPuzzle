import { generateNextStates, isEnd, serializeState } from '../core/state'
import {
  createNode,
  createSearchTreeTracker,
  reconstructMoves,
} from '../core/searchNode'

/**
 * Breadth-First Search (Tìm kiếm theo chiều rộng).
 *
 * Explores the search tree level by level using a FIFO queue. Because every
 * move has the same cost, the first time BFS reaches the goal it has found a
 * solution with the fewest possible moves (optimal in path length).
 *
 * Completeness: yes. Optimality: yes (uniform step cost). Memory is the main
 * cost, since the frontier can grow very wide.
 *
 * -----------------------------------------------------------------------------
 * ƯU ĐIỂM (điểm mạnh):
 *  - Luôn tìm ra lời giải NGẮN NHẤT (ít bước đi nhất) vì mỗi bước có chi phí
 *    bằng nhau và BFS duyệt theo từng tầng.
 *  - Đầy đủ (complete): nếu bài toán có lời giải, BFS chắc chắn tìm thấy.
 *  - Đơn giản, dễ hiểu, không cần hàm heuristic.
 *
 * NHƯỢC ĐIỂM (điểm yếu):
 *  - Tốn BỘ NHỚ rất lớn: hàng đợi (frontier) phình to theo cấp số nhân vì phải
 *    lưu toàn bộ các node của mỗi tầng trước khi sang tầng sau.
 *  - Chậm khi bài toán sâu (lời giải cần nhiều bước) hoặc có nhiều màu/lọ, vì
 *    số trạng thái bùng nổ theo cấp số nhân.
 *
 * KHI NÀO TỐI ƯU: lời giải nông (ít bước), số lọ / số màu nhỏ, và ta CẦN lời
 *  giải ngắn nhất một cách chắc chắn.
 * KHI NÀO YẾU: bài toán lớn/sâu khiến số trạng thái quá nhiều -> hết RAM và
 *  chạy rất chậm.
 * -----------------------------------------------------------------------------
 */

export function bfs(initialBottles) {
  const startTime = performance.now()

  const visited = new Set()
  const queue = []
  let head = 0 // index-based dequeue to avoid O(n) Array.shift
  let exploredStates = 0
  const tree = createSearchTreeTracker()

  const rootKey = serializeState(initialBottles)
  const root = createNode(initialBottles, null, null, 0, 0, 0)
  tree.add(root, rootKey)
  queue.push(root)
  visited.add(rootKey)

  while (head < queue.length) {
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
