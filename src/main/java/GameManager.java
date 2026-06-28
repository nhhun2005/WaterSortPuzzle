import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;

public class GameManager {
    public static final HashSet<State> visited = new HashSet<>();
    public static boolean isEnd = false;

    public void BFS(State state){
        visited.clear();

        Queue<State> queue = new LinkedList<>();
        visited.add(state);
        queue.addAll(state.performOperators());
        while(!queue.isEmpty()){
            State current = queue.poll();
            queue.addAll(current.performOperators());
            if(isEnd){
                return;
            }
        }

    }

}
