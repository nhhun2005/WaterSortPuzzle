import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;

public class GameManager {
    public static final HashSet<State> visited = new HashSet<>();
    public static boolean isEnd = false;

    public void BFS(State state){
        visited.clear();
        isEnd = false;

        Queue<State> queue = new LinkedList<>();
        queue.add(state);
        visited.add(state);

        while(!queue.isEmpty()){
            State current = queue.poll();

            if(current.isEnd()){
                isEnd = true;
                System.out.println("Đã tìm được trạng thái cuối");
                current.printBottles();
                return;
            }

            for(State next : current.performOperators()){
                if(visited.add(next)){
                    queue.add(next);
                }
            }
        }

        System.out.println("Không tìm được lời giải");

    }

}
