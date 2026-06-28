import java.sql.SQLOutput;
import java.util.ArrayList;
import java.util.List;

public class GameManager {
    private final List<Bottle> bottles = new ArrayList<>();

    public void addBottle(Bottle bottle) {
        bottles.add(bottle);
    }

    public void printBottles() {
        int index = 1;
        for (Bottle bottle : bottles) {
            System.out.println("Lọ thứ: "+index++);
            System.out.println(bottle);
            System.out.println("________________");
        }
    }


    public void bruteForce(){
        System.out.println("Trạng thái ban đầu:");
        printBottles();

    }
}
