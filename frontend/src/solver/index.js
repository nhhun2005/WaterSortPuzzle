import { cloneBottles } from '../lib/gameLogic'
import { algorithmUsesHeuristic } from '../constants/game'
import { bfs } from './algorithms/bfs'
import { dfs } from './algorithms/dfs'
import { ucs } from './algorithms/ucs'
import { greedy } from './algorithms/greedy'
import { astar } from './algorithms/astar'

const ALGORITHM_IMPLEMENTATIONS = {
  BFS: bfs,
  DFS: dfs,
  UCS: ucs,
  Greedy: greedy,
  'A*': astar,
}

export function solve(initialBottles, algorithm, heuristicLabel) {
  const run = ALGORITHM_IMPLEMENTATIONS[algorithm]
  if (!run) {
    throw new Error(`Unknown algorithm: ${algorithm}`)
  }

  const startState = cloneBottles(initialBottles)

  return algorithmUsesHeuristic(algorithm)
    ? run(startState, heuristicLabel)
    : run(startState)
}

export { bfs, dfs, ucs, greedy, astar }
