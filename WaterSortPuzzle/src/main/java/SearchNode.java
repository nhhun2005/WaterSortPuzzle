public class SearchNode {
    private final State state;
    private final SearchNode parent;
    private final Move move;
    private final int depth;
    private final int cost;
    private final int heuristic;

    public SearchNode(State state, SearchNode parent, Move move, int depth, int cost, int heuristic) {
        this.state = state;
        this.parent = parent;
        this.move = move;
        this.depth = depth;
        this.cost = cost;
        this.heuristic = heuristic;
    }

    public State getState() {
        return state;
    }

    public SearchNode getParent() {
        return parent;
    }

    public Move getMove() {
        return move;
    }

    public int getDepth() {
        return depth;
    }

    public int getCost() {
        return cost;
    }

    public int getHeuristic() {
        return heuristic;
    }

    public int getF() {
        return cost + heuristic;
    }
}
