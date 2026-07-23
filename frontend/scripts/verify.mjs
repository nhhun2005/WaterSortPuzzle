// Standalone verification for the Water Sort Puzzle refactor.
// Runs the 18 spec cases plus an algorithm regression check.
// Usage: node scripts/verify.mjs
//
// Extensionless ESM imports (Vite-style) are resolved via a loader hook.
import { register } from 'node:module'
import { pathToFileURL } from 'node:url'

register('./scripts/resolve-hook.mjs', pathToFileURL('./'))

const { formatState, formatBottle } = await import('../src/solver/core/stateFormatter.js')
const { pourBetween, isWinState, topColor } = await import('../src/lib/gameLogic.js')
const { serializeState } = await import('../src/solver/core/state.js')
const { solve } = await import('../src/solver/index.js')

let passed = 0
let failed = 0
const failures = []

function check(name, actual, expected) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  if (a === e) {
    passed += 1
    console.log(`  PASS  ${name}`)
  } else {
    failed += 1
    failures.push(name)
    console.log(`  FAIL  ${name}\n        expected ${e}\n        actual   ${a}`)
  }
}

function ok(name, condition) {
  check(name, Boolean(condition), true)
}

// Helper: build bottle from top-notation string, e.g. "GGBR" => [G,G,B,R] (R top).
function bottle(str) {
  if (str === '_' || str === '') {
    return []
  }
  return str.split('')
}

console.log('== Test 1: Format initial state ==')
const initial = [
  bottle('R'),
  bottle('GGBR'),
  bottle('BBR'),
  bottle('GGBR'),
  [],
]
check('Test 1 initial format', formatState(initial), '(R | GGBR | BBR | GGBR | _)')

console.log('== Test 2: bottom-to-top direction ==')
check('Test 2 bottle format', formatBottle(['G', 'G', 'B', 'R']), 'GGBR')
check('Test 2 top color', topColor(['G', 'G', 'B', 'R']), 'R')

console.log('== Test 3: valid goal ==')
ok('Test 3 goal', isWinState([bottle('RRRR'), bottle('GGGG'), bottle('BBBB'), [], []]))

console.log('== Test 4: valid goal with different positions ==')
ok('Test 4 goal', isWinState([[], bottle('BBBB'), bottle('RRRR'), [], bottle('GGGG')]))

console.log('== Test 5: two empty but not solved ==')
check('Test 5 not goal', isWinState([bottle('RGBR'), bottle('GGBB'), bottle('RBGR'), [], []]), false)

console.log('== Test 6: monochrome but not full ==')
check('Test 6 not goal', isWinState([bottle('RRR'), bottle('GGGG'), bottle('BBBB'), bottle('R'), []]), false)

console.log('== Test 7: cannot pour from empty ==')
check('Test 7 invalid', pourBetween([[], bottle('R')], 0, 1), null)

console.log('== Test 8: cannot pour into itself ==')
check('Test 8 invalid', pourBetween([bottle('R')], 0, 0), null)

console.log('== Test 9: cannot pour into full ==')
check('Test 9 invalid', pourBetween([bottle('R'), bottle('GGGG')], 0, 1), null)

console.log('== Test 10: cannot pour mismatched colors ==')
check('Test 10 invalid', pourBetween([bottle('GGR'), bottle('GG')], 0, 1), null)

console.log('== Test 11: cannot pour from complete bottle ==')
check('Test 11 invalid', pourBetween([bottle('RRRR'), []], 0, 1), null)

console.log('== Test 12: pour into empty (top run only) ==')
{
  const res = pourBetween([bottle('GGRR'), []], 0, 1)
  check('Test 12 source', formatBottle(res.bottles[0]), 'GG')
  check('Test 12 dest', formatBottle(res.bottles[1]), 'RR')
}

console.log('== Test 13: pour onto same top color ==')
{
  const res = pourBetween([bottle('GGRR'), bottle('RR')], 0, 1)
  check('Test 13 source', formatBottle(res.bottles[0]), 'GG')
  check('Test 13 dest', formatBottle(res.bottles[1]), 'RRRR')
}

console.log('== Test 14: dest limited capacity ==')
{
  const res = pourBetween([bottle('GGRR'), bottle('RRR')], 0, 1)
  check('Test 14 source', formatBottle(res.bottles[0]), 'GGR')
  check('Test 14 dest', formatBottle(res.bottles[1]), 'RRRR')
}

console.log('== Test 15: parent not mutated ==')
{
  const parent = [bottle('GGRR'), bottle('RR')]
  const snapshot = formatState(parent)
  const res = pourBetween(parent, 0, 1)
  check('Test 15 parent unchanged', formatState(parent), snapshot)
  ok('Test 15 child differs', formatState(res.bottles) !== snapshot)
  ok('Test 15 arrays not shared', res.bottles[0] !== parent[0])
}

console.log('== Test 16: equality and hash (serializeState) ==')
{
  const a = [bottle('R'), bottle('GGBR'), bottle('BBR'), bottle('GGBR'), []]
  const b = [bottle('R'), bottle('GGBR'), bottle('BBR'), bottle('GGBR'), []]
  const c = [bottle('R'), bottle('GGBR'), bottle('BBR'), bottle('GGBB'), []]
  check('Test 16 equal keys', serializeState(a), serializeState(b))
  ok('Test 16 different keys', serializeState(a) !== serializeState(c))
}

console.log('== Test 17: color conservation ==')
{
  const start = [
    bottle('R'),
    bottle('GGBR'),
    bottle('BBR'),
    bottle('GGBR'),
    [],
  ]
  function counts(state) {
    const c = { R: 0, G: 0, B: 0 }
    for (const b of state) {
      for (const color of b) {
        c[color] += 1
      }
    }
    return c
  }
  const before = counts(start)
  const res = pourBetween(start, 3, 4)
  const after = counts(res.bottles)
  check('Test 17 before counts', before, { R: 4, G: 4, B: 4 })
  check('Test 17 after counts', after, { R: 4, G: 4, B: 4 })
}

console.log('== Test 18: algorithm regression ==')
{
  // Baseline captured before the color refactor on the canonical initial state.
  const initialState = [
    bottle('R'),
    bottle('GGBR'),
    bottle('BBR'),
    bottle('GGBR'),
    [],
  ]
  const movesToStr = (moves) => moves.map((m) => `${m.from}->${m.to}`).join(' ')

  const baseline = {
    'BFS|': { solved: true, steps: 6, visited: 558, explored: 356, moves: '2->1 3->1 2->3 4->1 4->3 2->4' },
    'DFS|': { solved: true, steps: 20, visited: 69, explored: 21 },
    'UCS|': { solved: true, steps: 6, visited: 558, explored: 356, moves: '2->1 3->1 2->3 4->1 4->3 2->4' },
    'Greedy|Combined': { solved: true, steps: 6, visited: 43, explored: 8, moves: '2->3 3->1 4->1 2->3 4->3 2->4' },
    'Greedy|Incomplete bottles': { solved: true, steps: 6, visited: 56, explored: 12, moves: '2->3 4->1 3->1 2->3 4->3 2->4' },
    'Greedy|Color transition count': { solved: true, steps: 7, visited: 46, explored: 11, moves: '2->1 2->5 3->1 4->1 4->3 2->4 5->3' },
    'A*|Combined': { solved: true, steps: 6, visited: 51, explored: 10, moves: '4->1 2->1 3->1 2->3 4->3 2->4' },
    'A*|Incomplete bottles': { solved: true, steps: 6, visited: 149, explored: 51, moves: '2->3 4->1 3->1 4->3 2->3 2->4' },
    'A*|Color transition count': { solved: true, steps: 6, visited: 329, explored: 185, moves: '2->1 3->1 2->3 4->1 4->3 4->2' },
  }

  const runs = [
    ['BFS', undefined],
    ['DFS', undefined],
    ['UCS', undefined],
    ['Greedy', 'Combined'],
    ['Greedy', 'Incomplete bottles'],
    ['Greedy', 'Color transition count'],
    ['A*', 'Combined'],
    ['A*', 'Incomplete bottles'],
    ['A*', 'Color transition count'],
  ]

  for (const [algo, heur] of runs) {
    const bkey = `${algo}|${heur ?? ''}`
    const base = baseline[bkey]
    const r = solve(initialState, algo, heur)
    const actual = {
      solved: r.solved,
      steps: r.moves.length,
      visited: r.visited,
      explored: r.explored,
    }
    const expected = {
      solved: base.solved,
      steps: base.steps,
      visited: base.visited,
      explored: base.explored,
    }
    check(`Test 18 ${bkey} stats`, actual, expected)
    if (base.moves) {
      check(`Test 18 ${bkey} moves`, movesToStr(r.moves), base.moves)
    }
  }
}

console.log(`\n==== ${passed} passed, ${failed} failed ====`)
if (failed > 0) {
  console.log('Failures:', failures.join(', '))
  process.exit(1)
}
