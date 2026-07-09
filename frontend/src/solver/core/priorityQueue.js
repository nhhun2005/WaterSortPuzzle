/**
 * Binary min-heap priority queue.
 *
 * Used by UCS, Greedy and A* to always expand the most promising node first.
 * The `compare(a, b)` function must return a negative number when `a` should
 * come out before `b` (i.e. `a` has higher priority / lower score).
 */
export class PriorityQueue {
  constructor(compare) {
    this.compare = compare
    this.heap = []
  }

  get size() {
    return this.heap.length
  }

  isEmpty() {
    return this.heap.length === 0
  }

  push(item) {
    this.heap.push(item)
    this.#bubbleUp(this.heap.length - 1)
  }

  pop() {
    if (this.heap.length === 0) {
      return undefined
    }

    const top = this.heap[0]
    const last = this.heap.pop()

    if (this.heap.length > 0) {
      this.heap[0] = last
      this.#bubbleDown(0)
    }

    return top
  }

  #bubbleUp(index) {
    let current = index

    while (current > 0) {
      const parent = (current - 1) >> 1
      if (this.compare(this.heap[current], this.heap[parent]) < 0) {
        this.#swap(current, parent)
        current = parent
      } else {
        break
      }
    }
  }

  #bubbleDown(index) {
    const length = this.heap.length
    let current = index

    while (true) {
      const left = current * 2 + 1
      const right = current * 2 + 2
      let smallest = current

      if (left < length && this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left
      }
      if (right < length && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right
      }
      if (smallest === current) {
        break
      }

      this.#swap(current, smallest)
      current = smallest
    }
  }

  #swap(a, b) {
    const temp = this.heap[a]
    this.heap[a] = this.heap[b]
    this.heap[b] = temp
  }
}
