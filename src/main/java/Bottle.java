import java.util.List;
import java.util.Stack;

public class Bottle {
    // Chiều cao của mỗi lọ
    public static int MAX_HEIGHT = 4;
    /**
     * Mỗi lọ thủy tinh là một stack chứa các dung dịch với màu của nó.
     * Và phải đổ từ trên xuống dưới theo thứ tự của stack luôn nên tổ chức stack là hợp lý
     */
    private final Stack<WaterColor> waters = new Stack<>();;

    //Tạo lọ từ list các màu, thứ tự thì vẫn là index 0 sẽ ra sau cùng
    public Bottle(List<WaterColor> waters) {
        if(waters.size() > MAX_HEIGHT){
            throw new IllegalArgumentException("Chiều cao tối đa của một lọ là " + MAX_HEIGHT);
        }
        this.waters.addAll(waters);
    }

    public Stack<WaterColor> getWaters() {
        return waters;
    }

    public boolean pourTo(Bottle other){
        if(this.waters.isEmpty()){
            return false; //Lọ rỗng không đổ được
        }
        if(other.getWaters().size()>=MAX_HEIGHT){
            return false; //Lọ đầy rồi không thêm được nữa
        }
        else if(!other.getWaters().isEmpty()
            && other.getWaters().peek()!=this.waters.peek()){
            return false; // Không cùng loại màu nên thất bại
        }
        WaterColor colorToPour = this.waters.peek();

        while(!this.waters.isEmpty()
                && this.waters.peek()==colorToPour
                && other.getWaters().size()<MAX_HEIGHT){
            //Đổ hết nước cùng màu sang lọ kia
            other.getWaters().push(this.waters.pop());
        }
        return true;

    }

    public boolean isCorrected(){
        if(this.waters.isEmpty()){
            return true; //Rỗng cũng tính là hợp lệ
        }
        if(this.waters.size()!=MAX_HEIGHT){
            return false; //Nếu nó không rỗng mà cũng không đầy thì nó không hợp lệ
        }

        //Kiểm tra tất cả phần tử phải có cùng màu
        WaterColor color =  waters.peek();
        for(WaterColor item: waters){//Cơ bản là stack kế thừa vector nên nó cỏ foreach, này là vi
            //phạm tính đóng gói nhưng mà không sao
            if(item!=color){
                return false;
            }
        }
        return true;
    }

    public String toString(){
        return this.waters.toString();
    }

}
