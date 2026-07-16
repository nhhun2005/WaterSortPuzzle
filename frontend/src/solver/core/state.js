import { isWinState, pourBetween } from '../../lib/gameLogic'

/**
 * Gioi han thoi gian chay cho moi thuat toan tim kiem (mili giay).
 *
 * Thay cho viec gioi han so buoc / so node toi da, cac thuat toan se chay cho
 * toi khi tim ra loi giai HOAC vuot qua moc thoi gian nay thi dung lai va bao
 * "het thoi gian". Nho vay khong con truong hop dung lung chung do cham tran
 * so node, dong thoi tranh treo trinh duyet voi bai toan qua lon.
 */
export const SOLVER_TIMEOUT_MS = 10000

/** Tien ich kiem tra xem da vuot qua gioi han thoi gian hay chua. */
export function isTimedOut(startTime, limitMs = SOLVER_TIMEOUT_MS) {
  return performance.now() - startTime > limitMs
}


/**
 * State representation
 * -------------------
 * A state is simply an array of bottles, where each bottle is an array of
 * color strings ordered bottom -> top (the last element is the "top" that
 * gets poured out first). This mirrors the representation used across the
 * gameplay UI so the solver and the game share the exact same pour rules.
 */

/**
 * Serialize a state into a string key used for the visited set.
 *
 * Bottles are joined in their given order, so two states that differ only by
 * the position (index) of their bottles are treated as DIFFERENT states.
 */
export function serializeState(bottles) {
  return bottles
    .map((bottle) => bottle.join(','))
    .join('|')
}

/** A state is a goal when every bottle is empty or a single completed color. */
export function isEnd(bottles) {
  return isWinState(bottles)
}

/**
 * Generate every legal successor state.
 *
 * We try to pour from bottle i into bottle j for every ordered pair (i, j).
 * `pourBetween` already enforces the rules (matching top color, capacity,
 * pours the whole top run) and returns the resulting bottles plus a
 * human-readable action ({ from, to, color, amount } with 1-based indices).
 * Each move has a uniform cost of 1.
 */
export function generateNextStates(bottles) {
  const nextStates = []

  for (let source = 0; source < bottles.length; source += 1) {
    for (let target = 0; target < bottles.length; target += 1) {
      if (source === target) {
        continue
      }

      const result = pourBetween(bottles, source, target)
      if (result) {
        nextStates.push({
          bottles: result.bottles,
          move: result.action,
          cost: 1,
        })
      }
    }
  }

  return nextStates
}
