public class NextState {
    private final State state;
    private final Move move;
    private final int cost;

    public NextState(State state, Move move, int cost) {
        this.state = state;
        this.move = move;
        this.cost = cost;
    }

    public State getState() {
        return state;
    }

    public Move getMove() {
        return move;
    }

    public int getCost() {
        return cost;
    }
}
