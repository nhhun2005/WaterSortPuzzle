import java.util.*;

public class State {
    private final List<Bottle> bottles = new ArrayList<>();
    public State(){

    }
    public State(State state){
        for (Bottle bottle : state.bottles) {
            bottles.add(new Bottle(bottle));
        }
    }

    public List<Bottle> getBottles() {
        return bottles;
    }

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

    public List<NextState> generateNextStates() {
        List<NextState> nextStates = new ArrayList<>();
        for(int i = 0 ; i< bottles.size() ; i++){
            for(int j = 0 ; j<bottles.size() ; j++){
                if(i==j){
                    continue;
                }
                State temp = new State(this);
                if(temp.bottles.get(i).pourTo(temp.bottles.get(j))){
                    nextStates.add(new NextState(
                            temp,
                            new Move(i, j),
                            1
                    ));
                }
            }
        }
        return nextStates;
    }

    public List<State> performOperators(){
        List<State> states = new ArrayList<>();
        for (NextState nextState : generateNextStates()) {
            states.add(nextState.getState());
        }
        return states;
    }
    public boolean isEnd(){
        for (Bottle bottle : bottles) {
            if (!bottle.isCorrected()) {
                return false;
            }
        }
        return true;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }
        if (!(object instanceof State state)) {
            return false;
        }
        return bottles.equals(state.bottles);
    }

    @Override
    public int hashCode() {
        return bottles.hashCode();
    }

}
