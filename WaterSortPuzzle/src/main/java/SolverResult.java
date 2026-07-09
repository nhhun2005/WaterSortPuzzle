import java.util.ArrayList;
import java.util.List;

public class SolverResult {
    private final boolean solved;
    private final Algorithm algorithm;
    private final List<State> path;
    private final List<Move> moves;
    private final int visitedStates;
    private final int exploredStates;
    private final long elapsedMs;

    public SolverResult(
            boolean solved,
            Algorithm algorithm,
            List<State> path,
            List<Move> moves,
            int visitedStates,
            int exploredStates,
            long elapsedMs
    ) {
        this.solved = solved;
        this.algorithm = algorithm;
        this.path = path == null ? new ArrayList<>() : path;
        this.moves = moves == null ? new ArrayList<>() : moves;
        this.visitedStates = visitedStates;
        this.exploredStates = exploredStates;
        this.elapsedMs = elapsedMs;
    }

    public boolean isSolved() {
        return solved;
    }

    public Algorithm getAlgorithm() {
        return algorithm;
    }

    public List<State> getPath() {
        return path;
    }

    public List<Move> getMoves() {
        return moves;
    }

    public int getMoveCount() {
        return moves.size();
    }

    public int getVisitedStates() {
        return visitedStates;
    }

    public int getExploredStates() {
        return exploredStates;
    }

    public long getElapsedMs() {
        return elapsedMs;
    }

    @Override
    public String toString() {
        return "Algorithm: " + algorithm +
                "\nSolved: " + solved +
                "\nMoves: " + getMoveCount() +
                "\nVisited states: " + visitedStates +
                "\nExplored states: " + exploredStates +
                "\nElapsed: " + elapsedMs + " ms";
    }
}
