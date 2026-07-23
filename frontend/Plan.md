Prompt refactor Water Sort Puzzle

Đây là một task khó và có nguy cơ làm thay đổi kết quả của các thuật toán tìm kiếm. Hãy thực hiện theo hướng refactor tối thiểu, ưu tiên giữ nguyên hành vi hiện tại của chương trình.

Trước khi sửa code, hãy đọc và phân tích toàn bộ các phần liên quan đến:

Màu sắc.
Lọ thủy tinh.
Trạng thái bài toán.
Hành động đổ nước.
Hàm sinh trạng thái kế tiếp.
Kiểm tra trạng thái đích.
So sánh hai trạng thái.
equals, hashCode hoặc cơ chế nhận diện trạng thái trùng.
Frontier/open list.
Visited/closed set.
Các thuật toán DFS, BFS, UCS, Greedy và A* nếu có.
Heuristic.
Truy vết đường đi.
Phần hiển thị trạng thái trên giao diện hoặc console.

Sau khi kiểm tra, hãy lập kế hoạch cụ thể, liệt kê các file dự kiến sửa và giải thích lý do. Sau đó mới tiến hành refactor.

1. Mục tiêu chính

Refactor phần biểu diễn trạng thái của Water Sort Puzzle để trạng thái trong code có thể được chuyển sang ký hiệu ngắn gọn như sau:

S0 = (R | GGBR | BBR | GGBR | _)

Quy ước:

R là màu đỏ.
G là màu xanh lá.
B là màu xanh dương.
_ là một lọ thủy tinh rỗng.
Ký hiệu | dùng để phân cách các lọ.
Toàn bộ trạng thái được đặt trong cặp dấu ngoặc tròn.
Các phần tử trong mỗi lọ được ghi từ đáy đến đỉnh.
Phần tử ngoài cùng bên phải là phần tử đang nằm trên đỉnh lọ.

Ví dụ:

GGBR

được hiểu là:

Đáy: G, G, B, R :Đỉnh

Trong đó R là phần tử trên đỉnh và sẽ được lấy ra trước nếu thực hiện thao tác đổ.

Trạng thái:

(R | GGBR | BBR | GGBR | _)

tương ứng với:

Lọ 1: [R]
Lọ 2: [G, G, B, R]
Lọ 3: [B, B, R]
Lọ 4: [G, G, B, R]
Lọ 5: []

Hãy bảo đảm code luôn thống nhất về chiều biểu diễn này. Không được có trường hợp một nơi hiểu ký tự bên trái là đỉnh nhưng nơi khác lại hiểu ký tự bên phải là đỉnh.

2. Giới hạn bài toán

Bài toán hiện tại có:

Số lọ: 5
Dung tích mỗi lọ: 4
Số màu: 3
Mỗi màu có tổng cộng 4 đơn vị chất lỏng

Các màu được sử dụng:

R: Red
G: Green
B: Blue

Không được tự ý bổ sung màu mới, thay đổi dung tích lọ hoặc thay đổi số lượng lọ trong quá trình refactor, trừ khi code hiện tại đã thiết kế các giá trị này thành cấu hình tổng quát. Nếu code đang tổng quát thì giữ nguyên khả năng tổng quát đó.

3. Phân biệt mô hình nội bộ và ký hiệu trạng thái

Ký hiệu:

(R | GGBR | BBR | GGBR | _)

là cách biểu diễn trạng thái ngắn gọn để:

Hiển thị.
Debug.
Ghi log.
Viết test.
Đối chiếu kết quả thuật toán.
Trình bày trạng thái tìm kiếm.

Không được chuyển toàn bộ thuật toán sang thao tác trực tiếp trên chuỗi nếu code hiện tại đang sử dụng cấu trúc dữ liệu phù hợp như:

Stack.
List.
Array.
Deque.
Enum màu sắc.
Bottle object.
State object.

Hãy ưu tiên giữ cấu trúc dữ liệu nội bộ hiện tại và bổ sung một cơ chế chuyển đổi rõ ràng, chẳng hạn:

state.toCompactString()

hoặc:

StateFormatter.format(state)

Kết quả phải có dạng:

(R | GGBR | BBR | GGBR | _)

Nếu chương trình cần đọc trạng thái từ chuỗi, có thể bổ sung:

StateParser.parse("(R | GGBR | BBR | GGBR | _)")

Tuy nhiên, parser chỉ cần được thêm nếu thực sự có nhu cầu trong chương trình hoặc test. Không thêm chức năng không cần thiết.

4. Định nghĩa trạng thái

Một trạng thái S gồm năm lọ:

S = (B1 | B2 | B3 | B4 | B5)

Mỗi lọ Bi là một dãy có tối đa bốn phần tử màu sắc.

Ví dụ:

B1 = R
B2 = GGBR
B3 = BBR
B4 = GGBR
B5 = _

Một lọ rỗng phải được format thành:

_

Không format thành:

[]
null
empty
----

trong ký hiệu trạng thái rút gọn.

5. Trạng thái ban đầu

Trạng thái ban đầu chuẩn cần được biểu diễn như sau:

S0 = (R | GGBR | BBR | GGBR | _)

Nếu trạng thái ban đầu trong code hiện tại được khởi tạo bằng object, list, stack hoặc enum thì vẫn giữ cách khởi tạo nội bộ phù hợp. Chỉ cần bảo đảm khi format, kết quả chính xác là:

(R | GGBR | BBR | GGBR | _)

Không được đảo ngược thành:

(R | RBGG | RBB | RBGG | _)

Vì trong quy ước của bài toán, ký tự bên phải là đỉnh lọ.

6. Điều kiện trạng thái đích

Một trạng thái S được xem là trạng thái đích khi và chỉ khi mọi lọ trong trạng thái thỏa mãn một trong hai điều kiện:

Lọ rỗng.
Lọ chứa đúng bốn phần tử và cả bốn phần tử có cùng màu.

Có thể mô tả bằng giả mã:

isGoal(S):
    for each bottle in S:
        if bottle is empty:
            continue

        if bottle.size != 4:
            return false

        if not all elements in bottle have the same color:
            return false

    return true

Ví dụ hợp lệ:

(RRRR | GGGG | BBBB | _ | _)

Kết quả:

isGoal = true

Thứ tự các màu trong các lọ không quan trọng. Các trạng thái sau đều có thể là trạng thái đích:

(RRRR | GGGG | BBBB | _ | _)
(_ | BBBB | RRRR | _ | GGGG)
(GGGG | _ | BBBB | RRRR | _)

Không được kiểm tra trạng thái đích bằng cách so sánh với duy nhất một cấu hình cố định.

Không được kiểm tra trạng thái đích chỉ dựa vào việc có hai lọ rỗng.

Ví dụ sau có hai lọ rỗng nhưng không phải trạng thái đích:

(RGBR | GGBB | RBGR | _ | _)

Kết quả bắt buộc:

isGoal = false

Ví dụ sau cũng không phải trạng thái đích vì có một lọ chưa đủ bốn phần tử:

(RRR | GGGG | BBBB | R | _)

Kết quả bắt buộc:

isGoal = false
7. Định nghĩa lọ hoàn thiện

Một lọ được xem là hoàn thiện khi:

bottle.size == 4

và:

mọi phần tử trong lọ có cùng màu

Ví dụ:

RRRR
GGGG
BBBB

là các lọ hoàn thiện.

Các lọ sau không hoàn thiện:

RRR
RGBR
GGBB
_

Lọ rỗng không được xem là “lọ hoàn thiện có màu”. Nó chỉ là lọ rỗng.

Nên có một method rõ nghĩa tương tự:

isCompletedBottle()

hoặc:

isSolvedBottle()

Không bắt buộc đổi tên nếu code hiện tại đã có method tương đương và tên của nó đã rõ nghĩa.

8. Hành động đổ nước

Một hành động được ký hiệu:

P(i, j)

hoặc:

i -> j

với ý nghĩa đổ chất lỏng từ lọ nguồn i sang lọ đích j.

Hành động chỉ hợp lệ khi tất cả các điều kiện sau đều đúng:

Điều kiện 1: Hai lọ phải khác nhau
i != j

Không được đổ một lọ vào chính nó.

Điều kiện 2: Lọ nguồn không được rỗng
source is not empty
Điều kiện 3: Lọ nguồn chưa hoàn thiện

Không được sử dụng một lọ đã chứa đủ bốn phần tử cùng màu làm lọ nguồn.

Ví dụ:

RRRR

không được đổ sang lọ khác.

Điều kiện 4: Lọ đích chưa đầy
destination.size < 4
Điều kiện 5: Màu trên đỉnh phải tương thích

Lọ đích phải thỏa mãn một trong hai trường hợp:

destination is empty

hoặc:

top(source) == top(destination)

Ví dụ hợp lệ:

Source: GGRR
Destination: RR

vì đỉnh của cả hai lọ đều là R.

Ví dụ không hợp lệ:

Source: GGRR
Destination: GG

vì đỉnh nguồn là R, còn đỉnh đích là G.

9. Số lượng phần tử được đổ

Một hành động đổ phải chuyển các phần tử có cùng màu nằm liên tiếp trên đỉnh lọ nguồn.

Ví dụ:

Source: GGRR

Có hai phần tử R liên tiếp trên đỉnh.

Nếu lọ đích còn đủ chỗ:

Destination: RR

thì kết quả là:

Source: GG
Destination: RRRR

Không được chỉ chuyển một phần tử R nếu luật hiện tại của chương trình là đổ tối đa số phần tử cùng màu liên tiếp.

Số lượng phần tử chuyển được xác định bởi:

pourAmount =
    min(
        số phần tử cùng màu liên tiếp trên đỉnh lọ nguồn,
        số vị trí trống trong lọ đích
    )

Ví dụ:

Source: GGRR
Destination: RRR

Lọ đích chỉ còn một vị trí trống nên kết quả phải là:

Source: GGR
Destination: RRRR

Không được vượt quá dung tích bốn.

Hãy kiểm tra logic đổ hiện tại. Nếu nó đã thực hiện đúng quy tắc trên thì không viết lại không cần thiết.

10. Chi phí hành động

Mỗi lần đổ từ một lọ sang một lọ khác được tính là một hành động có chi phí:

cost = 1

Dù trong một lần đổ có chuyển một, hai, ba hoặc bốn phần tử cùng màu thì vẫn chỉ tính là một bước.

Không được thay đổi cách tính chi phí hiện tại nếu nó đã là một đơn vị cho mỗi hành động đổ.

11. Bất biến của trạng thái

Sau mỗi hành động hợp lệ, phải bảo đảm:

Mỗi lọ có từ 0 đến 4 phần tử.
Không có lọ nào vượt quá dung tích 4.
Không làm mất phần tử màu.
Không tự tạo thêm phần tử màu.
Tổng số phần tử của từng màu không thay đổi.
Tổng số phần tử trong toàn bộ trạng thái không thay đổi.
Chỉ các phần tử cùng màu liên tiếp trên đỉnh nguồn được di chuyển.
Thứ tự các phần tử còn lại trong lọ nguồn không bị thay đổi.
Thứ tự các phần tử đã có trong lọ đích không bị thay đổi.
Trạng thái cha không bị mutate khi sinh trạng thái con.
Mỗi trạng thái con phải độc lập với trạng thái cha.
Không được chia sẻ collection mutable khiến sửa trạng thái con làm thay đổi trạng thái cha hoặc trạng thái anh em.

Với trạng thái ban đầu đã cho, tổng số lượng màu phải luôn là:

R = 4
G = 4
B = 4
12. So sánh và nhận diện trạng thái trùng

Hai trạng thái được xem là giống nhau khi năm lọ tương ứng có cùng nội dung và cùng thứ tự phần tử từ đáy đến đỉnh.

Ví dụ:

(R | GGBR | BBR | GGBR | _)

phải bằng một trạng thái khác có đúng nội dung trên.

Nếu trạng thái được sử dụng trong:

HashSet
HashMap
visited set
closed set
frontier membership check
duplicate detection

thì equals và hashCode, hoặc cơ chế tương đương, phải nhất quán.

Yêu cầu:

Nếu stateA.equals(stateB) == true
thì stateA.hashCode() == stateB.hashCode()

Không dùng chuỗi hiển thị có khoảng trắng không ổn định làm cơ sở nhận diện trạng thái, trừ khi code đã chuẩn hóa chuỗi một cách chắc chắn. Ưu tiên so sánh dữ liệu trạng thái thực tế.

13. Yêu cầu giữ nguyên thuật toán

Đây là yêu cầu quan trọng nhất.

Task này không nhằm tối ưu thuật toán tìm kiếm. Chỉ refactor cách biểu diễn trạng thái và bảo đảm các luật nghiệp vụ được diễn đạt rõ ràng trong code.

Không được thay đổi:

Loại thuật toán đang sử dụng.
DFS thành graph search khác.
BFS thành bidirectional BFS.
UCS thành BFS.
Greedy thành A*.
Công thức A*.
Công thức heuristic.
Giá trị heuristic.
Cách tính g(n).
Cách tính h(n).
Cách tính f(n).
Cấu trúc frontier.
Priority queue comparator.
Tie-breaking.
Thứ tự sinh hành động.
Thứ tự duyệt lọ nguồn.
Thứ tự duyệt lọ đích.
Cách đánh dấu visited.
Thời điểm thêm trạng thái vào visited.
Cách phát hiện trạng thái trùng.
Điều kiện dừng.
Cách truy vết parent.
Cách tạo danh sách hành động kết quả.
Cách đếm số node đã mở rộng.
Cách đếm số node đã sinh.
Cách đo độ sâu.
Cách tính path cost.
Giới hạn độ sâu nếu có.
Kết quả đầu ra của thuật toán, ngoại trừ định dạng hiển thị trạng thái.

Không thêm:

Pruning mới.
Symmetry reduction.
Canonicalization bằng cách sắp xếp lại các lọ.
Loại bỏ hành động đảo ngược.
Ưu tiên đổ vào lọ cùng màu.
Ưu tiên hoàn thành lọ.
Bỏ qua việc đổ vào lọ rỗng.
Cache mới.
Memoization mới.
Heuristic mới.
Randomization.
Parallel processing.
Tối ưu hóa hiệu năng ngoài phạm vi.

Ngay cả khi một tối ưu hóa có vẻ hợp lý, không được tự ý thêm vì nó có thể làm thay đổi cây tìm kiếm, thứ tự mở rộng hoặc số liệu dùng để đánh giá thuật toán.

14. Không chuẩn hóa bằng cách đổi vị trí lọ

Không được tự động sắp xếp các lọ trong một trạng thái.

Ví dụ:

(R | GGBR | BBR | GGBR | _)

không được tự động đổi thành:

(_ | R | BBR | GGBR | GGBR)

Mặc dù về mặt trò chơi hai cấu hình có thể có tính đối xứng, vị trí lọ vẫn phải được giữ nguyên để:

Truy vết hành động i -> j.
Hiển thị đúng.
Giữ nguyên cây tìm kiếm.
Giữ nguyên thứ tự sinh trạng thái.
Giữ nguyên kết quả thuật toán hiện tại.

Không thêm symmetry detection hoặc symmetry pruning.

15. Không thay đổi giao diện

Không thay đổi:

Layout.
Widget.
Component giao diện.
Màu giao diện.
Flow màn hình.
Điều hướng.
Nút bấm.
Cách người dùng bắt đầu thuật toán.
Cách người dùng chọn thuật toán.
Cách kết quả được trình bày về mặt bố cục.

Chỉ cập nhật nơi hiển thị chuỗi trạng thái nếu cần để dùng định dạng mới:

(R | GGBR | BBR | GGBR | _)

Không thực hiện redesign UI.

16. Cấu trúc refactor được ưu tiên

Ưu tiên thiết kế có trách nhiệm rõ ràng, chẳng hạn:

Color
Bottle
PuzzleState
PourAction
StateFormatter

Đây chỉ là gợi ý. Không bắt buộc tạo class mới nếu kiến trúc hiện tại đã có các thành phần tương đương.

Các trách nhiệm nên được phân tách:

Color
Đại diện cho màu.
Có ký hiệu ngắn R, G, B.
Bottle
Chứa các màu theo thứ tự đáy đến đỉnh.
Kiểm tra rỗng.
Kiểm tra đầy.
Lấy màu trên đỉnh.
Đếm số phần tử cùng màu liên tiếp trên đỉnh.
Kiểm tra lọ hoàn thiện.
PuzzleState
Chứa năm lọ.
Kiểm tra trạng thái đích.
Sinh hoặc áp dụng hành động nếu kiến trúc hiện tại đặt trách nhiệm tại đây.
So sánh trạng thái.
Không phụ thuộc vào UI.
StateFormatter
Chuyển trạng thái thành dạng:
(R | GGBR | BBR | GGBR | _)

Không dồn toàn bộ logic nghiệp vụ vào formatter.

17. Test bắt buộc

Hãy kiểm tra test hiện tại trước khi sửa. Sau đó bổ sung hoặc cập nhật test tối thiểu cho các trường hợp sau.

Test 1: Format trạng thái ban đầu

Dữ liệu nội bộ:

Bottle 1: [R]
Bottle 2: [G, G, B, R]
Bottle 3: [B, B, R]
Bottle 4: [G, G, B, R]
Bottle 5: []

Kết quả:

(R | GGBR | BBR | GGBR | _)
Test 2: Hướng đáy đến đỉnh

Với lọ:

[G, G, B, R]

format phải là:

GGBR

và top phải là:

R
Test 3: Trạng thái đích hợp lệ
(RRRR | GGGG | BBBB | _ | _)

Kết quả:

true
Test 4: Trạng thái đích hợp lệ với vị trí màu khác
(_ | BBBB | RRRR | _ | GGGG)

Kết quả:

true
Test 5: Có hai lọ rỗng nhưng chưa giải
(RGBR | GGBB | RBGR | _ | _)

Kết quả:

false
Test 6: Lọ đơn sắc nhưng chưa đủ bốn phần tử
(RRR | GGGG | BBBB | R | _)

Kết quả:

false
Test 7: Không được đổ từ lọ rỗng
Source: _
Destination: R

Kết quả:

invalid
Test 8: Không được đổ vào chính nó
1 -> 1

Kết quả:

invalid
Test 9: Không được đổ vào lọ đầy
Source: R
Destination: GGGG

Kết quả:

invalid
Test 10: Không được đổ hai màu khác nhau
Source: GGR
Destination: GG

Đỉnh nguồn là R, đỉnh đích là G.

Kết quả:

invalid
Test 11: Không được đổ từ lọ hoàn thiện
Source: RRRR
Destination: _

Kết quả:

invalid
Test 12: Đổ vào lọ rỗng
Source: GGRR
Destination: _

Nếu mỗi hành động đổ tối đa nhóm cùng màu trên đỉnh, kết quả phải là:

Source: GG
Destination: RR
Test 13: Đổ vào lọ có cùng màu trên đỉnh
Source: GGRR
Destination: RR

Kết quả:

Source: GG
Destination: RRRR
Test 14: Lọ đích không đủ chỗ
Source: GGRR
Destination: RRR

Kết quả:

Source: GGR
Destination: RRRR
Test 15: Không mutate trạng thái cha

Tạo một trạng thái con bằng một hành động hợp lệ.

Sau đó xác nhận:

Trạng thái con thay đổi đúng.
Trạng thái cha vẫn giữ nguyên hoàn toàn.
Test 16: Equality và hash code

Hai state có cùng nội dung phải:

equals == true
hashCode giống nhau

Hai state khác nội dung phải:

equals == false
Test 17: Bảo toàn số lượng màu

Sau một hành động hợp lệ:

R = 4
G = 4
B = 4
Test 18: Regression test thuật toán

Chạy các thuật toán hiện có trên cùng trạng thái đầu trước và sau refactor.

So sánh tối thiểu:

Có tìm được lời giải hay không.
Độ dài lời giải.
Chuỗi hành động.
Path cost.
Số node sinh ra nếu chương trình có thống kê.
Số node mở rộng nếu chương trình có thống kê.
Thứ tự trạng thái trên đường đi kết quả.
Giá trị heuristic nếu có.
Kết quả cuối cùng.

Ngoại trừ định dạng chuỗi trạng thái, kết quả phải giữ nguyên.

Nếu kết quả khác, hãy dừng lại, xác định nguyên nhân và không kết luận refactor thành công.

18. Quy trình thực hiện

Thực hiện theo thứ tự sau:

Bước 1: Khảo sát code

Xác định:

Class nào đại diện cho màu.
Class nào đại diện cho lọ.
Class nào đại diện cho trạng thái.
Cách xác định top của lọ.
Chiều lưu trữ phần tử.
Nơi thực hiện hành động đổ.
Nơi kiểm tra hành động hợp lệ.
Nơi kiểm tra trạng thái đích.
Nơi sinh successor.
Nơi format trạng thái.
Cách so sánh trạng thái.
Các thuật toán nào sử dụng state.
Các test hiện có.
Bước 2: Báo cáo phát hiện

Trước khi sửa, trình bày:

Cấu trúc hiện tại.
Chiều biểu diễn hiện tại.
Những điểm chưa thống nhất.
Những điểm có nguy cơ gây bug.
Các file dự kiến sửa.
Những file không cần sửa.
Kế hoạch refactor tối thiểu.
Bước 3: Thiết lập regression baseline

Trước khi thay đổi, chạy test hiện tại.

Nếu có thể, ghi lại kết quả của từng thuật toán với trạng thái đầu chuẩn:

(R | GGBR | BBR | GGBR | _)

Baseline nên gồm:

Chuỗi hành động lời giải.
Độ dài lời giải.
Path cost.
Trạng thái kết thúc.
Số node sinh.
Số node mở rộng.
Các thông số khác mà chương trình đang cung cấp.
Bước 4: Refactor tối thiểu

Thực hiện thay đổi nhỏ nhất có thể.

Không viết lại toàn bộ search engine nếu không cần thiết.

Bước 5: Chạy test

Chạy:

Unit test mới.
Unit test cũ.
Integration test nếu có.
Regression test thuật toán.
Bước 6: Kiểm tra diff

Tự review diff và xác nhận không có thay đổi ngoài phạm vi.

Đặc biệt tìm:

Thay đổi comparator.
Thay đổi thứ tự loop sinh hành động.
Thay đổi visited.
Thay đổi heuristic.
Thay đổi path cost.
Thay đổi pruning.
Thay đổi cấu trúc frontier.
Thay đổi UI.

Nếu phát hiện thay đổi ngoài phạm vi, hãy hoàn tác chúng.

19. Yêu cầu báo cáo sau khi hoàn thành

Sau khi hoàn thành, hãy trả lời theo cấu trúc sau:

A. Phân tích code ban đầu
Các class liên quan.
Cách trạng thái được lưu.
Chiều đáy và đỉnh.
Cách kiểm tra goal.
Cách kiểm tra pour.
Cách nhận diện state trùng.
B. Kế hoạch đã thực hiện
Các bước refactor.
Lý do chọn cách làm đó.
C. Các file đã thay đổi

Với mỗi file:

Đường dẫn.
Nội dung thay đổi.
Lý do cần thay đổi.
D. Cách biểu diễn sau refactor

Ví dụ cụ thể:

S0 = (R | GGBR | BBR | GGBR | _)

Giải thích ký tự bên phải là đỉnh.

E. Các test đã chạy
Tên test.
Kết quả pass hoặc fail.
Lệnh dùng để chạy test.
F. Kết quả regression

So sánh trước và sau:

Thuật toán.
Chuỗi hành động.
Độ dài lời giải.
Path cost.
Node sinh.
Node mở rộng.
G. Xác nhận phạm vi

Xác nhận rõ:

Không thay đổi UI.
Không thay đổi flow chức năng.
Không thay đổi thuật toán tìm kiếm.
Không thay đổi heuristic.
Không thêm tối ưu hóa.
Không thêm pruning.
Không thay đổi thứ tự sinh hành động.
Không thay đổi cách quản lý frontier và visited.
Chỉ thay đổi phần biểu diễn trạng thái và các phần tối thiểu cần thiết để bảo đảm đặc tả trên.
20. Khi có mâu thuẫn hoặc không chắc chắn

Nếu phát hiện code hiện tại có hành vi khác với đặc tả này, không được âm thầm lựa chọn một cách xử lý.

Hãy báo cáo rõ:

Code hiện tại đang làm gì.
Đặc tả yêu cầu gì.
Sự khác biệt nằm ở đâu.
Việc sửa có làm thay đổi kết quả thuật toán hay không.

Nếu thay đổi đó vượt quá phạm vi “chỉ thay đổi cách biểu diễn”, hãy dừng và hỏi trước khi thực hiện.

Không được đoán và không được tự ý sửa thêm nghiệp vụ.

Mục tiêu cuối cùng:

Trạng thái được hiển thị nhất quán theo dạng:
(R | GGBR | BBR | GGBR | _)

Trong khi:

Toàn bộ logic và hành vi của các thuật toán tìm kiếm được giữ nguyên.

Chỉ được coi task là hoàn thành khi toàn bộ test pass và kết quả regression chứng minh thuật toán không thay đổi.
