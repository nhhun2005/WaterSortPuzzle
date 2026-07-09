import { cloneBottles } from '../lib/gameLogic'
import { algorithmUsesHeuristic } from '../constants/game'
import { bfs } from './algorithms/bfs'
import { dfs } from './algorithms/dfs'
import { ucs } from './algorithms/ucs'
import { greedy } from './algorithms/greedy'
import { astar } from './algorithms/astar'

/**
 * Solver entry point.
 *
 * Maps the UI algorithm labels (see ALGORITHMS in constants/game.js) to their
 * implementations. Uninformed searches ignore the heuristic argument; Greedy
 * and A* use it.
 */
const ALGORITHM_IMPLEMENTATIONS = {
  BFS: bfs,
  DFS: dfs,
  UCS: ucs,
  Greedy: greedy,
  'A*': astar,
}

/**
 * Run a search and return a normalized result.
 *
 * @param {string[][]} initialBottles - starting puzzle state
 * @param {string} algorithm - one of the ALGORITHMS labels
 * @param {string} [heuristicLabel] - heuristic label for Greedy / A*
 * @returns {{
 *   solved: boolean,
 *   moves: object[],
 *   visited: number,
 *   explored: number,
 *   timeMs: number,
 * }}
 */
export function solve(initialBottles, algorithm, heuristicLabel) {
  const run = ALGORITHM_IMPLEMENTATIONS[algorithm]
  if (!run) {
    throw new Error(`Unknown algorithm: ${algorithm}`)
  }

  // Work on a defensive copy so the caller's state is never mutated.
  const startState = cloneBottles(initialBottles)

  return algorithmUsesHeuristic(algorithm)
    ? run(startState, heuristicLabel)
    : run(startState)
}

export { bfs, dfs, ucs, greedy, astar }
