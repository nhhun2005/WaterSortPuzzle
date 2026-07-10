function SearchTree({ algorithm, nodes = [], truncated, usesHeuristic }) {
  if (nodes.length === 0) {
    return <p className="tree-empty">Chua co cay tim kiem.</p>
  }

  const childMap = new Map()
  nodes.forEach((node) => {
    const list = childMap.get(node.parentId) ?? []
    list.push(node)
    childMap.set(node.parentId, list)
  })

  return (
    <div className="search-tree">
      <div className="tree-toolbar">
        <h3>Cay tim kiem</h3>
        {truncated && <span>Dang hien 500 node dau tien</span>}
      </div>
      <div className="tree-scroll">
        {(childMap.get(null) ?? []).map((node) => (
          <TreeNode
            algorithm={algorithm}
            childMap={childMap}
            key={node.id}
            node={node}
            usesHeuristic={usesHeuristic}
          />
        ))}
      </div>
    </div>
  )
}

function TreeNode({ algorithm, childMap, node, usesHeuristic }) {
  const children = childMap.get(node.id) ?? []
  const label = node.move ? `Lo ${node.move.from} -> Lo ${node.move.to}` : 'Goc'
  const score = algorithm === 'A*' ? node.cost + node.heuristic : null

  return (
    <details className="tree-branch" open={node.depth < 2 || node.isSolutionPath}>
      <summary>
        <span
          className={[
            'tree-node',
            node.isSolutionPath ? 'solution-path' : '',
            node.isGoal ? 'goal' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <strong>{label}</strong>
          <small>d={node.depth}</small>
          <small>g={node.cost}</small>
          {usesHeuristic && <small>h={node.heuristic}</small>}
          {score !== null && <small>f={score}</small>}
          {node.expanded && <em>Da mo rong</em>}
          {node.isSolutionPath && <em>Duong loi giai</em>}
          {node.isGoal && <em>Dich</em>}
        </span>
      </summary>
      {children.length > 0 && (
        <div className="tree-children">
          {children.map((child) => (
            <TreeNode
              algorithm={algorithm}
              childMap={childMap}
              key={child.id}
              node={child}
              usesHeuristic={usesHeuristic}
            />
          ))}
        </div>
      )}
    </details>
  )
}

export default SearchTree
