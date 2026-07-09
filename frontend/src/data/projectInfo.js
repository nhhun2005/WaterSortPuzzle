export const INFO_ITEMS = [
  {
    title: 'State',
    body: 'A full list of bottles. Each bottle stores a stack of water colors from bottom to top.',
  },
  {
    title: 'Initial state',
    body: 'The starting arrangement before any pour action is made.',
  },
  {
    title: 'Action',
    body: 'Pour the top color group from one bottle to another valid bottle.',
  },
  {
    title: 'Goal test',
    body: 'Every bottle is empty or filled with 4 layers of the same color.',
  },
  {
    title: 'Path cost',
    body: 'Each valid pour costs 1, so the path cost is the number of moves.',
  },
  {
    title: 'Heuristic',
    body: 'An estimate such as misplaced blocks, incomplete bottles, or color transitions.',
  },
]
