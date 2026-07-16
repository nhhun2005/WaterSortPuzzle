import { generateNextStates, isEnd, isTimedOut, serializeState } from '../core/state'
import {
  createNode,
  createSearchTreeTracker,
  reconstructMoves,
} from '../core/searchNode'


/**
 * Depth-First Search (Tìm kiếm theo chiều sâu).
 *
 * Explores as deep as possible along one branch before backtracking, using a
 * LIFO stack. A 10-second time limit (SOLVER_TIMEOUT_MS) stops runaway
 * branches on hard puzzles instead of a fixed depth cap.
 *
 * Completeness: yes within the depth bound. Optimality: no - the first
 * solution found is rarely the shortest, but DFS uses far less memory than
 * BFS and often reaches a goal quickly.
 *
 * -----------------------------------------------------------------------------
 * ƯU ĐIỂM (điểm mạnh):
 *  - Tốn RẤT ÍT BỘ NHỚ: chỉ cần lưu một nhánh đang đi (theo chiều sâu) chứ
 *    không phải toàn bộ một tầng như BFS.
 *  - Thường tìm thấy MỘT lời giải rất nhanh khi lời giải nằm sâu trên nhánh
 *    mà DFS đi trúng.
 *  - Cài đặt đơn giản bằng một ngăn xếp (stack), không cần heuristic.
 *
 * NHƯỢC ĐIỂM (điểm yếu):
 *  - KHÔNG tối ưu: lời giải tìm được thường dài (nhiều bước thừa), hiếm khi là
 *    ngắn nhất.
 *  - Có thể "lạc" sâu vào một nhánh sai và tốn công; cần giới hạn thời gian
 *    (SOLVER_TIMEOUT_MS = 10 giây) để tránh đi mãi không dừng.
 *  - Nếu chọn sai nhánh đầu tiên, có thể chậm hơn BFS rất nhiều.
 *
 * KHI NÀO TỐI ƯU: chỉ cần TÌM ĐƯỢC một lời giải (không quan tâm ngắn hay dài)
 *  và bộ nhớ hạn chế; lời giải thường nằm sâu.
 * KHI NÀO YẾU: cần lời giải NGẮN NHẤT, hoặc cây tìm kiếm có nhiều nhánh sai/
 *  vòng lặp khiến DFS đi sai hướng.
 * -----------------------------------------------------------------------------
 */

export function dfs(initialBottles) {
  const startTime = performance.now()

  const visited = new Set()
  const stack = []
  let exploredStates = 0
  const tree = createSearchTreeTracker()

  const rootKey = serializeState(initialBottles)
  const root = createNode(initialBottles, null, null, 0, 0, 0)
  tree.add(root, rootKey)
  stack.push(root)
  visited.add(rootKey)

  while (stack.length > 0) {
    // Dung lai neu vuot qua gioi han thoi gian (mac dinh 10 giay).
    if (isTimedOut(startTime)) {
      return buildResult(false, null, visited.size, exploredStates, startTime, tree, true)
    }

    const current = stack.pop()
    exploredStates += 1
    tree.markExpanded(current)

    if (isEnd(current.bottles)) {
      return buildResult(true, current, visited.size, exploredStates, startTime, tree)
    }

    const nextStates = generateNextStates(current.bottles)
    // Push in reverse so the first-generated successor is expanded first.
    for (let i = nextStates.length - 1; i >= 0; i -= 1) {
      const next = nextStates[i]
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
        stack.push(child)
      }
    }
  }

  return buildResult(false, null, visited.size, exploredStates, startTime, tree)
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
