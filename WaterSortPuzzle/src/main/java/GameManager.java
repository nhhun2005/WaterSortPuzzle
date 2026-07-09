public class GameManager {
    private final WaterSortSolver solver = new WaterSortSolver();

    public SolverResult solve(State state, Algorithm algorithm) {
        return solver.solve(state, algorithm);
    }

    public SolverResult BFS(State state) {
        return solve(state, Algorithm.BFS);
    }
}
