# Kết quả benchmark các thuật toán Water Sort Puzzle

## Thiết lập benchmark

- Ngày chạy: 2026-07-23.
- Môi trường: Node.js v26.5.0; Linux 7.0.0-28-generic x86_64; Intel Core i5-12450H (12 luồng CPU).
- Quy mô: 10 đề dùng chung cho mọi cấu hình; mỗi đề được tạo bằng 120–200 bước xáo trộn ngược (lớn hơn mức mặc định 40–80 của ứng dụng).
- Seed cố định: `20260723`, giúp tái lập đúng 10 trạng thái đầu vào.
- Mỗi cấu hình được chạy 1 lượt khởi động không ghi nhận, sau đó đo đủ 10 lượt, tổng cộng 90 lượt được ghi dưới đây.
- Giới hạn thời gian của solver: 10.000 ms/lượt.
- Ký hiệu trạng thái: các ký tự trong mỗi lọ được ghi từ đáy lên miệng; `_` là lọ rỗng.

## Bộ đề đầu vào

| Lượt | Trạng thái ban đầu |
|---:|---|
| 1 | `G | GRG | BRRG | BBBR | _` |
| 2 | `RRG | _ | BBBG | RBRG | G` |
| 3 | `RGB | GBGB | _ | RRRG | B` |
| 4 | `RRG | G | BBRG | _ | BBGR` |
| 5 | `RBR | R | BBBG | _ | GGGR` |
| 6 | `RRB | B | _ | GGRB | GGRB` |
| 7 | `RGRB | GGRB | B | _ | GRB` |
| 8 | `RRRB | _ | G | BGBG | RBG` |
| 9 | `RRRG | _ | BBG | G | BBGR` |
| 10 | `RRB | GGRB | B | _ | GGBR` |

## Tóm tắt trung bình

| Cấu hình | Giải thành công | Bước TB | Trạng thái sinh TB | Trạng thái mở rộng TB | Thời gian TB (ms) |
|---|---:|---:|---:|---:|---:|
| BFS | 10/10 | 6.300 | 628.800 | 413.600 | 3.963039 |
| DFS | 10/10 | 24.900 | 92.000 | 27.100 | 0.248228 |
| UCS | 10/10 | 6.300 | 628.800 | 413.600 | 3.485720 |
| Greedy — Combined | 10/10 | 6.300 | 39.900 | 7.700 | 0.097366 |
| Greedy — Incomplete bottles | 10/10 | 7.100 | 74.400 | 19.500 | 0.186539 |
| Greedy — Color transition count | 10/10 | 7.200 | 45.700 | 11.200 | 0.163959 |
| A* — Combined | 10/10 | 6.300 | 51.500 | 10.800 | 0.152503 |
| A* — Incomplete bottles | 10/10 | 6.300 | 158.200 | 63.500 | 0.693175 |
| A* — Color transition count | 10/10 | 6.300 | 305.200 | 164.200 | 1.479436 |

## Chi tiết đầy đủ 10 lượt của từng cấu hình

### BFS

| Lượt | Kết quả | Bước | Trạng thái sinh | Trạng thái mở rộng | Thời gian (ms) |
|---:|---|---:|---:|---:|---:|
| 1 | Thành công | 7 | 788 | 524 | 6.523623 |
| 2 | Thành công | 6 | 499 | 308 | 4.694015 |
| 3 | Thành công | 7 | 827 | 563 | 5.105623 |
| 4 | Thành công | 6 | 532 | 359 | 2.705347 |
| 5 | Thành công | 5 | 301 | 166 | 0.900756 |
| 6 | Thành công | 6 | 531 | 347 | 3.447169 |
| 7 | Thành công | 8 | 1030 | 676 | 5.765353 |
| 8 | Thành công | 7 | 918 | 641 | 5.729166 |
| 9 | Thành công | 5 | 347 | 212 | 1.707470 |
| 10 | Thành công | 6 | 515 | 340 | 3.051864 |

### DFS

| Lượt | Kết quả | Bước | Trạng thái sinh | Trạng thái mở rộng | Thời gian (ms) |
|---:|---|---:|---:|---:|---:|
| 1 | Thành công | 18 | 73 | 22 | 0.201449 |
| 2 | Thành công | 25 | 88 | 29 | 0.764455 |
| 3 | Thành công | 15 | 56 | 19 | 0.109440 |
| 4 | Thành công | 25 | 94 | 26 | 0.176844 |
| 5 | Thành công | 13 | 49 | 17 | 0.091976 |
| 6 | Thành công | 33 | 131 | 34 | 0.266163 |
| 7 | Thành công | 31 | 118 | 32 | 0.221191 |
| 8 | Thành công | 40 | 136 | 41 | 0.290989 |
| 9 | Thành công | 24 | 81 | 25 | 0.170944 |
| 10 | Thành công | 25 | 94 | 26 | 0.188827 |

### UCS

| Lượt | Kết quả | Bước | Trạng thái sinh | Trạng thái mở rộng | Thời gian (ms) |
|---:|---|---:|---:|---:|---:|
| 1 | Thành công | 7 | 788 | 524 | 5.253639 |
| 2 | Thành công | 6 | 499 | 308 | 2.180600 |
| 3 | Thành công | 7 | 827 | 563 | 4.653453 |
| 4 | Thành công | 6 | 532 | 359 | 2.537485 |
| 5 | Thành công | 5 | 301 | 166 | 1.983042 |
| 6 | Thành công | 6 | 531 | 347 | 2.426637 |
| 7 | Thành công | 8 | 1030 | 676 | 5.247314 |
| 8 | Thành công | 7 | 918 | 641 | 4.895100 |
| 9 | Thành công | 5 | 347 | 212 | 3.316149 |
| 10 | Thành công | 6 | 515 | 340 | 2.363779 |

### Greedy — Combined

| Lượt | Kết quả | Bước | Trạng thái sinh | Trạng thái mở rộng | Thời gian (ms) |
|---:|---|---:|---:|---:|---:|
| 1 | Thành công | 7 | 48 | 10 | 0.159154 |
| 2 | Thành công | 6 | 36 | 7 | 0.090153 |
| 3 | Thành công | 7 | 46 | 9 | 0.120454 |
| 4 | Thành công | 6 | 37 | 7 | 0.089162 |
| 5 | Thành công | 5 | 28 | 6 | 0.061701 |
| 6 | Thành công | 6 | 41 | 7 | 0.088372 |
| 7 | Thành công | 8 | 51 | 9 | 0.125819 |
| 8 | Thành công | 7 | 44 | 9 | 0.083787 |
| 9 | Thành công | 5 | 31 | 6 | 0.060954 |
| 10 | Thành công | 6 | 37 | 7 | 0.094105 |

### Greedy — Incomplete bottles

| Lượt | Kết quả | Bước | Trạng thái sinh | Trạng thái mở rộng | Thời gian (ms) |
|---:|---|---:|---:|---:|---:|
| 1 | Thành công | 8 | 157 | 51 | 0.426420 |
| 2 | Thành công | 6 | 63 | 16 | 0.139354 |
| 3 | Thành công | 8 | 77 | 20 | 0.164423 |
| 4 | Thành công | 6 | 75 | 17 | 0.152574 |
| 5 | Thành công | 6 | 33 | 8 | 0.058887 |
| 6 | Thành công | 7 | 61 | 13 | 0.119104 |
| 7 | Thành công | 8 | 86 | 24 | 0.257492 |
| 8 | Thành công | 8 | 79 | 19 | 0.204140 |
| 9 | Thành công | 6 | 45 | 11 | 0.125190 |
| 10 | Thành công | 8 | 68 | 16 | 0.217811 |

### Greedy — Color transition count

| Lượt | Kết quả | Bước | Trạng thái sinh | Trạng thái mở rộng | Thời gian (ms) |
|---:|---|---:|---:|---:|---:|
| 1 | Thành công | 7 | 45 | 11 | 0.151569 |
| 2 | Thành công | 7 | 44 | 11 | 0.130198 |
| 3 | Thành công | 8 | 55 | 14 | 0.219971 |
| 4 | Thành công | 7 | 47 | 11 | 0.160511 |
| 5 | Thành công | 6 | 33 | 8 | 0.110321 |
| 6 | Thành công | 6 | 41 | 8 | 0.128689 |
| 7 | Thành công | 9 | 52 | 12 | 0.206034 |
| 8 | Thành công | 8 | 45 | 11 | 0.206894 |
| 9 | Thành công | 7 | 48 | 15 | 0.191865 |
| 10 | Thành công | 7 | 47 | 11 | 0.133539 |

### A* — Combined

| Lượt | Kết quả | Bước | Trạng thái sinh | Trạng thái mở rộng | Thời gian (ms) |
|---:|---|---:|---:|---:|---:|
| 1 | Thành công | 7 | 74 | 17 | 0.244472 |
| 2 | Thành công | 6 | 45 | 10 | 0.136672 |
| 3 | Thành công | 7 | 56 | 11 | 0.169488 |
| 4 | Thành công | 6 | 49 | 9 | 0.119629 |
| 5 | Thành công | 5 | 31 | 7 | 0.088599 |
| 6 | Thành công | 6 | 53 | 10 | 0.148077 |
| 7 | Thành công | 8 | 67 | 16 | 0.205556 |
| 8 | Thành công | 7 | 63 | 13 | 0.200620 |
| 9 | Thành công | 5 | 31 | 6 | 0.078273 |
| 10 | Thành công | 6 | 46 | 9 | 0.133643 |

### A* — Incomplete bottles

| Lượt | Kết quả | Bước | Trạng thái sinh | Trạng thái mở rộng | Thời gian (ms) |
|---:|---|---:|---:|---:|---:|
| 1 | Thành công | 7 | 217 | 86 | 0.860189 |
| 2 | Thành công | 6 | 103 | 38 | 0.402379 |
| 3 | Thành công | 7 | 251 | 106 | 1.091144 |
| 4 | Thành công | 6 | 126 | 39 | 0.461992 |
| 5 | Thành công | 5 | 65 | 23 | 0.224224 |
| 6 | Thành công | 6 | 149 | 49 | 1.567508 |
| 7 | Thành công | 8 | 284 | 154 | 1.280709 |
| 8 | Thành công | 7 | 203 | 84 | 0.608450 |
| 9 | Thành công | 5 | 57 | 17 | 0.135050 |
| 10 | Thành công | 6 | 127 | 39 | 0.300101 |

### A* — Color transition count

| Lượt | Kết quả | Bước | Trạng thái sinh | Trạng thái mở rộng | Thời gian (ms) |
|---:|---|---:|---:|---:|---:|
| 1 | Thành công | 7 | 507 | 277 | 2.272845 |
| 2 | Thành công | 6 | 273 | 147 | 1.416821 |
| 3 | Thành công | 7 | 350 | 188 | 2.256829 |
| 4 | Thành công | 6 | 277 | 147 | 1.533765 |
| 5 | Thành công | 5 | 161 | 80 | 0.649495 |
| 6 | Thành công | 6 | 271 | 137 | 1.864078 |
| 7 | Thành công | 8 | 243 | 137 | 0.817714 |
| 8 | Thành công | 7 | 456 | 258 | 2.202391 |
| 9 | Thành công | 5 | 195 | 95 | 0.623691 |
| 10 | Thành công | 6 | 319 | 176 | 1.156727 |
