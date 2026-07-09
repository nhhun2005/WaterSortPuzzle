import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Set;

public class WaterSortSolver {
    private static final int DFS_MAX_DEPTH = 100;

    public SolverResult solve(State initialState, Algorithm algorithm) {
        if (initialState == null) {
            throw new IllegalArgumentException("Initial state must not be null");
        }
        if (algorithm == null) {
            throw new IllegalArgumentException("Algorithm must not be null");
        }

        return switch (algorithm) {
            case BFS -> bfs(initialState);
            case DFS -> dfs(initialState);
            case UCS -> ucs(initialState);
            case GREEDY -> greedy(initialState);
            case ASTAR -> astar(initialState);
        };
    }

    private SolverResult bfs(State initialState) {
        long startTime = System.currentTimeMillis();
        Queue<SearchNode> frontier = new LinkedList<>();
        Set<State> visited = new HashSet<>();
        int exploredStates = 0;

        SearchNode initialNode = new SearchNode(new State(initialState), null, null, 0, 0, 0);
        frontier.add(initialNode);
        visited.add(initialNode.getState());

        while (!frontier.isEmpty()) {
            SearchNode current = frontier.poll();
            exploredStates++;

            if (current.getState().isEnd()) {
                return buildSuccessResult(Algorithm.BFS, current, visited.size(), exploredStates, startTime);
            }

            for (NextState nextState : current.getState().generateNextStates()) {
                if (visited.add(nextState.getState())) {
                    frontier.add(new SearchNode(
                            nextState.getState(),
                            current,
                            nextState.getMove(),
                            current.getDepth() + 1,
                            current.getCost() + nextState.getCost(),
                            0
                    ));
                }
            }
        }

        return buildFailureResult(Algorithm.BFS, visited.size(), exploredStates, startTime);
    }

    private SolverResult dfs(State initialState) {
        long startTime = System.currentTimeMillis();
        Deque<SearchNode> frontier = new ArrayDeque<>();
        Set<State> visited = new HashSet<>();
        int exploredStates = 0;

        SearchNode initialNode = new SearchNode(new State(initialState), null, null, 0, 0, 0);
        frontier.push(initialNode);
        visited.add(initialNode.getState());

        while (!frontier.isEmpty()) {
            SearchNode current = frontier.pop();
            exploredStates++;

            if (current.getState().isEnd()) {
                return buildSuccessResult(Algorithm.DFS, current, visited.size(), exploredStates, startTime);
            }

            if (current.getDepth() >= DFS_MAX_DEPTH) {
                continue;
            }

            List<NextState> nextStates = current.getState().generateNextStates();
            for (int i = nextStates.size() - 1; i >= 0; i--) {
                NextState nextState = nextStates.get(i);
                if (visited.add(nextState.getState())) {
                    frontier.push(new SearchNode(
                            nextState.getState(),
                            current,
                            nextState.getMove(),
                            current.getDepth() + 1,
                            current.getCost() + nextState.getCost(),
                            0
                    ));
                }
            }
        }

        return buildFailureResult(Algorithm.DFS, visited.size(), exploredStates, startTime);
    }

    private SolverResult ucs(State initialState) {
        long startTime = System.currentTimeMillis();
        PriorityQueue<SearchNode> frontier = new PriorityQueue<>(Comparator.comparingInt(SearchNode::getCost));
        Map<State, Integer> bestCost = new HashMap<>();
        int exploredStates = 0;

        SearchNode initialNode = new SearchNode(new State(initialState), null, null, 0, 0, 0);
        frontier.add(initialNode);
        bestCost.put(initialNode.getState(), 0);

        while (!frontier.isEmpty()) {
            SearchNode current = frontier.poll();
            Integer knownCost = bestCost.get(current.getState());
            if (knownCost != null && current.getCost() > knownCost) {
                continue;
            }

            exploredStates++;

            if (current.getState().isEnd()) {
                return buildSuccessResult(Algorithm.UCS, current, bestCost.size(), exploredStates, startTime);
            }

            for (NextState nextState : current.getState().generateNextStates()) {
                int newCost = current.getCost() + nextState.getCost();
                Integer oldCost = bestCost.get(nextState.getState());

                if (oldCost == null || newCost < oldCost) {
                    bestCost.put(nextState.getState(), newCost);
                    frontier.add(new SearchNode(
                            nextState.getState(),
                            current,
                            nextState.getMove(),
                            current.getDepth() + 1,
                            newCost,
                            0
                    ));
                }
            }
        }

        return buildFailureResult(Algorithm.UCS, bestCost.size(), exploredStates, startTime);
    }

    private SolverResult greedy(State initialState) {
        long startTime = System.currentTimeMillis();
        PriorityQueue<SearchNode> frontier = new PriorityQueue<>(Comparator.comparingInt(SearchNode::getHeuristic));
        Set<State> visited = new HashSet<>();
        int exploredStates = 0;

        State initialCopy = new State(initialState);
        SearchNode initialNode = new SearchNode(initialCopy, null, null, 0, 0, Heuristic.estimate(initialCopy));
        frontier.add(initialNode);
        visited.add(initialNode.getState());

        while (!frontier.isEmpty()) {
            SearchNode current = frontier.poll();
            exploredStates++;

            if (current.getState().isEnd()) {
                return buildSuccessResult(Algorithm.GREEDY, current, visited.size(), exploredStates, startTime);
            }

            for (NextState nextState : current.getState().generateNextStates()) {
                if (visited.add(nextState.getState())) {
                    frontier.add(new SearchNode(
                            nextState.getState(),
                            current,
                            nextState.getMove(),
                            current.getDepth() + 1,
                            current.getCost() + nextState.getCost(),
                            Heuristic.estimate(nextState.getState())
                    ));
                }
            }
        }

        return buildFailureResult(Algorithm.GREEDY, visited.size(), exploredStates, startTime);
    }

    private SolverResult astar(State initialState) {
        long startTime = System.currentTimeMillis();
        PriorityQueue<SearchNode> frontier = new PriorityQueue<>(Comparator.comparingInt(SearchNode::getF));
        Map<State, Integer> bestCost = new HashMap<>();
        int exploredStates = 0;

        State initialCopy = new State(initialState);
        SearchNode initialNode = new SearchNode(initialCopy, null, null, 0, 0, Heuristic.estimate(initialCopy));
        frontier.add(initialNode);
        bestCost.put(initialNode.getState(), 0);

        while (!frontier.isEmpty()) {
            SearchNode current = frontier.poll();
            Integer knownCost = bestCost.get(current.getState());
            if (knownCost != null && current.getCost() > knownCost) {
                continue;
            }

            exploredStates++;

            if (current.getState().isEnd()) {
                return buildSuccessResult(Algorithm.ASTAR, current, bestCost.size(), exploredStates, startTime);
            }

            for (NextState nextState : current.getState().generateNextStates()) {
                int newCost = current.getCost() + nextState.getCost();
                Integer oldCost = bestCost.get(nextState.getState());

                if (oldCost == null || newCost < oldCost) {
                    bestCost.put(nextState.getState(), newCost);
                    frontier.add(new SearchNode(
                            nextState.getState(),
                            current,
                            nextState.getMove(),
                            current.getDepth() + 1,
                            newCost,
                            Heuristic.estimate(nextState.getState())
                    ));
                }
            }
        }

        return buildFailureResult(Algorithm.ASTAR, bestCost.size(), exploredStates, startTime);
    }

    private SolverResult buildSuccessResult(
            Algorithm algorithm,
            SearchNode goalNode,
            int visitedStates,
            int exploredStates,
            long startTime
    ) {
        return new SolverResult(
                true,
                algorithm,
                reconstructPath(goalNode),
                reconstructMoves(goalNode),
                visitedStates,
                exploredStates,
                System.currentTimeMillis() - startTime
        );
    }

    private SolverResult buildFailureResult(
            Algorithm algorithm,
            int visitedStates,
            int exploredStates,
            long startTime
    ) {
        return new SolverResult(
                false,
                algorithm,
                new ArrayList<>(),
                new ArrayList<>(),
                visitedStates,
                exploredStates,
                System.currentTimeMillis() - startTime
        );
    }

    private List<State> reconstructPath(SearchNode goalNode) {
        LinkedList<State> path = new LinkedList<>();
        SearchNode current = goalNode;

        while (current != null) {
            path.addFirst(current.getState());
            current = current.getParent();
        }

        return path;
    }

    private List<Move> reconstructMoves(SearchNode goalNode) {
        LinkedList<Move> moves = new LinkedList<>();
        SearchNode current = goalNode;

        while (current != null && current.getMove() != null) {
            moves.addFirst(current.getMove());
            current = current.getParent();
        }

        return moves;
    }
}
