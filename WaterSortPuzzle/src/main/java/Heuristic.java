import java.util.Stack;

public class Heuristic {
    public static int estimate(State state) {
        return colorBlockHeuristic(state);
    }

    public static int unfinishedBottleHeuristic(State state) {
        int score = 0;

        for (Bottle bottle : state.getBottles()) {
            if (bottle.getWaters().isEmpty()) {
                continue;
            }

            if (!bottle.isCorrected()) {
                score++;
            }
        }

        return score;
    }

    public static int colorBlockHeuristic(State state) {
        int score = 0;

        for (Bottle bottle : state.getBottles()) {
            Stack<WaterColor> waters = bottle.getWaters();

            if (waters.isEmpty()) {
                continue;
            }

            for (int i = 1; i < waters.size(); i++) {
                if (waters.get(i) != waters.get(i - 1)) {
                    score++;
                }
            }

            if (!bottle.isCorrected()) {
                score++;
            }
        }

        return score;
    }
}
