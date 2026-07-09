import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        State state = new State();
        List<WaterColor> b1 = new ArrayList<>();
        b1.add(WaterColor.YELLOW);
        b1.add(WaterColor.YELLOW);
        b1.add(WaterColor.YELLOW);
        b1.add(WaterColor.CYAN);
        state.addBottle(new Bottle(b1));

        List<WaterColor> b2 = new ArrayList<>();
        b2.add(WaterColor.BLUE);
        b2.add(WaterColor.BLUE);
        b2.add(WaterColor.CYAN);
        b2.add(WaterColor.CYAN);
        state.addBottle(new Bottle(b2));

        List<WaterColor> b3 = new ArrayList<>();
        b3.add(WaterColor.BLUE);
        b3.add(WaterColor.BLUE);
        b3.add(WaterColor.CYAN);
        b3.add(WaterColor.YELLOW);
        state.addBottle(new Bottle(b3));

        List<WaterColor> b4 = new ArrayList<>();
        state.addBottle(new Bottle(b4));

        List<WaterColor> b5 = new ArrayList<>();
        state.addBottle(new Bottle(b5));

        state.printBottles();

        GameManager gm = new GameManager();
        for (Algorithm algorithm : Algorithm.values()) {
            SolverResult result = gm.solve(new State(state), algorithm);
            System.out.println("==============================");
            System.out.println(result);

            if (result.isSolved()) {
                System.out.println("Solution moves:");
                for (Move move : result.getMoves()) {
                    System.out.println(move);
                }
            }
        }

    }
}
