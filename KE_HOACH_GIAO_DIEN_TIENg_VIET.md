# Ke hoach dieu chinh giao dien Water Sort Puzzle sang tieng Viet

## 1. Muc tieu

Dieu chinh ung dung Water Sort Puzzle thanh mot page duy nhat bang tieng Viet. Page nay phuc vu truc tiep bai toan AI tim kiem, gom:

- Mot man choi duy nhat co dung 8 lo, 6 mau, moi lo suc chua 4 lop.
- Bang chon thuat toan: BFS, DFS, UCS, Greedy, A*.
- Bang chon ham heuristic chi hien khi dung tim kiem co thong tin: Greedy va A*.
- Nut tao bai ngau nhien moi bang cach bat dau tu trang thai dich roi shuffle cac hanh dong hop le.
- Khu vuc nhap bai cu the bang trinh chinh sua truc quan: moi o trong 8 lo la mot combobox chon mau hoac de trong.
- Ket qua giai duoc bieu dien bang cay tim kiem, khong con chia thanh danh sach tung step nho de xem.

## 2. Context hien tai cho agent tiep tuc

Repo hien tai la Vite + React, phan frontend nam trong `frontend/`.

Nhung file lien quan truc tiep:

- `frontend/src/App.jsx`: hien dang dieu huong nhieu man hinh bang state `screen`, gom `home`, `game`, `solver`, `visualizer`, `levels`, `info`. Yeu cau moi nen rut ve mot page duy nhat, co the dung `SolverScreen` lam man chinh hoac tao man moi thay the flow cu.
- `frontend/src/screens/SolverScreen.jsx`: hien la UI tieng Anh cho solver, gom preview puzzle, selector algorithm, selector heuristic, nut `Find Solution`, va `ResultPanel`.
- `frontend/src/components/solver/ResultPanel.jsx`: hien thi ket qua giai, thong ke va `StepList`; co nut `Visualize Steps`. Yeu cau moi can thay `StepList`/visualizer bang cay tim kiem.
- `frontend/src/components/solver/SelectorGroup.jsx`: co the tai su dung cho combobox thuat toan va heuristic.
- `frontend/src/components/bottle/Bottle.jsx` va `BottleRack.jsx`: hien thi lo nuoc. State cua moi lo la mang mau theo thu tu day -> mieng lo, phan tu cuoi la lop tren cung.
- `frontend/src/constants/game.js`: hien co `CAPACITY = 4`, `ALGORITHMS = ['BFS', 'DFS', 'UCS', 'Greedy', 'A*']`, `HEURISTIC_ALGORITHMS = ['Greedy', 'A*']`, `HEURISTICS` dang dung label tieng Anh, va `COLOR_LABELS` co 8 mau.
- `frontend/src/lib/gameLogic.js`: chua logic copy state, lay mau tren cung, dem top run, `pourBetween`, `isWinState`, `buildTimeline`, `actionText`.
- `frontend/src/solver/core/state.js`: chua `serializeState`, `isEnd`, `generateNextStates`. `generateNextStates` goi `pourBetween` cho moi cap lo source/target va tra ve `{ bottles, move, cost }`.
- `frontend/src/solver/index.js`: map label thuat toan sang ham `bfs`, `dfs`, `ucs`, `greedy`, `astar`; chi truyen heuristic cho Greedy/A*.
- `frontend/src/hooks/useSolver.js`: quan ly algorithm, heuristic, result, solution steps va timeline hien tai. Yeu cau moi can luu them `searchTree` va state bai toan dang chinh sua.
- `frontend/src/solver/algorithms/*.js`: moi thuat toan hien chi tra `{ solved, moves, visited, explored, timeMs }`. Can mo rong de tra them du lieu cay tim kiem.
- `frontend/src/solver/heuristics.js`: co cac ham `misplacedColorBlocks`, `incompleteBottles`, `colorTransitionCount`; registry hien key bang label tieng Anh.
- `frontend/src/styles/layout.css`, `screens.css`, `responsive.css`, `bottle.css`, `buttons.css`: can cap nhat layout mot page, editor combobox va cay tim kiem.

## 3. Rang buoc va quy uoc du lieu

- So lo co dinh: 8.
- So mau co dinh: 6.
- Suc chua moi lo: `CAPACITY = 4`.
- Tong so lop mau hop le: 6 * 4 = 24.
- Trang thai dich nen gom 6 lo day, moi lo mot mau rieng, va 2 lo rong.
- State bottle dung quy uoc san co: moi lo la array theo thu tu day -> mieng lo. Vi du `['red', 'red', 'blue']` nghia la day co red, lop tren cung la blue.
- Action tu `pourBetween` co dang `{ from, to, color, amount }`, trong do `from` va `to` la chi so 1-based de hien thi cho nguoi dung.
- Cac thao tac sinh state moi nen dung `generateNextStates` hoac `pourBetween` san co de dong nhat luat choi voi solver.

## 4. Ke hoach trien khai

### Buoc 1: Gom ung dung thanh mot page duy nhat

- Sua `frontend/src/App.jsx` de render truc tiep man chinh moi, vi du `SolverScreen` da refactor hoac `SinglePageSolverScreen`.
- Loai bo phu thuoc UI vao `HomeScreen`, `LevelSelectScreen`, `GameplayScreen`, `VisualizationScreen` trong flow chinh. Co the giu file cu neu khong can xoa.
- Page chinh nen gom bon vung:
  - Ban choi 8 lo.
  - Dieu khien thuat toan/heuristic.
  - Trinh chinh sua bai cu the.
  - Ket qua va cay tim kiem.

### Buoc 2: Viet hoa giao dien

- Doi nhan UI sang tieng Viet:
  - `AI Solver` -> `Bo giai Water Sort` hoac `Giai bai Water Sort`.
  - `Puzzle state` -> `Trang thai bai toan`.
  - `Algorithm` -> `Thuat toan`.
  - `Heuristic` -> `Ham heuristic`.
  - `Find Solution` -> `Tim loi giai`.
  - `Solution result` -> `Ket qua giai`.
  - `Visited states` -> `Trang thai da sinh`.
  - `Explored` -> `Trang thai da mo rong`.
  - `Time` -> `Thoi gian`.
- Viet hoa `COLOR_LABELS` cho 6 mau chinh. Nen giu key mau bang tieng Anh de khong phai sua CSS `data-color`, chi doi label hien thi.

### Buoc 3: Chuan hoa 8 lo, 6 mau

- Trong `constants/game.js`, them cac hang so ro rang:
  - `BOTTLE_COUNT = 8`.
  - `PUZZLE_COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'cyan']`.
  - Giu `CAPACITY = 4`.
- Cac component va generator dung `BOTTLE_COUNT`, `PUZZLE_COLORS`, `CAPACITY` thay vi lay tu level cu.
- Neu can state mac dinh, tao state dich:

```js
const solvedState = [
  ['red', 'red', 'red', 'red'],
  ['green', 'green', 'green', 'green'],
  ['blue', 'blue', 'blue', 'blue'],
  ['yellow', 'yellow', 'yellow', 'yellow'],
  ['purple', 'purple', 'purple', 'purple'],
  ['cyan', 'cyan', 'cyan', 'cyan'],
  [],
  [],
]
```

### Buoc 4: Tao bai random bang shuffle hanh dong hop le

- Tao file moi, vi du `frontend/src/lib/puzzleGenerator.js`.
- Export cac ham:
  - `createSolvedPuzzle()` tra state dich 8 lo/6 mau.
  - `generateRandomPuzzle(options)` bat dau tu state dich roi lap N lan.
- Moi lan lap:
  - Goi `generateNextStates(current)` de lay cac hanh dong hop le.
  - Chon ngau nhien mot successor.
  - Cap nhat `current = successor.bottles`.
- De tranh bai qua de:
  - Dung so buoc shuffle mac dinh khoang 40-80.
  - Neu state cuoi van la win state thi shuffle lai hoac tiep tuc them buoc.
  - Co the tranh dao nguoc ngay hanh dong truoc do neu muon bai da dang hon, nhung khong bat buoc.
- Vi sinh tu trang thai dich bang hanh dong hop le, bai sinh ra dam bao co loi giai.

### Buoc 5: Trinh chinh sua bai cu the bang combobox

- Tao component moi, vi du `frontend/src/components/solver/PuzzleEditor.jsx`.
- Hien 8 lo, moi lo 4 o combobox.
- Moi combobox co cac lua chon:
  - `Trong` -> `null` hoac empty string.
  - 6 mau trong `PUZZLE_COLORS` voi label tieng Viet.
- Quy uoc UI nen ghi ngan gon: o duoi la day lo, o tren la mieng lo.
- Khi nguoi dung doi combobox:
  - Chuyen grid thanh `string[][]` theo thu tu day -> mieng.
  - Loai bo o trong phia tren, nhung validate khong cho co o trong nam duoi o co mau.
- Validate truoc khi goi solver:
  - Dung 8 lo.
  - Moi lo khong vuot `CAPACITY`.
  - Khong co khoang trong nam duoi lop mau.
  - Moi mau trong 6 mau xuat hien dung 4 lan.
  - Tong so lop mau la 24.
- Loi validate hien bang tieng Viet trong vung editor/result, khong chay solver khi invalid.

### Buoc 6: Dieu khien thuat toan va heuristic

- Giu danh sach thuat toan hien co: BFS, DFS, UCS, Greedy, A*.
- Chi hien combobox `Ham heuristic` khi `algorithmUsesHeuristic(algorithm)` la true.
- Nen tach label hien thi tieng Viet khoi key noi bo:

```js
export const HEURISTIC_OPTIONS = [
  { value: 'Misplaced color blocks', label: 'So khoi mau sai vi tri' },
  { value: 'Incomplete bottles', label: 'So lo chua hoan thanh' },
  { value: 'Color transition count', label: 'So lan chuyen mau' },
]
```

- Cach nay giu `getHeuristic(label)` trong `heuristics.js` khong bi vo.

### Buoc 7: Mo rong solver de ghi cay tim kiem

- Hien tai cac thuat toan chi tra `moves`. Can them tracking node trong `bfs.js`, `dfs.js`, `ucs.js`, `greedy.js`, `astar.js`.
- Moi node trong cay nen co schema toi thieu:

```js
{
  id: number,
  parentId: number | null,
  depth: number,
  move: { from: number, to: number, color: string, amount: number } | null,
  cost: number,
  heuristic: number,
  stateKey: string,
  expanded: boolean,
  isGoal: boolean,
  isSolutionPath: boolean,
}
```

- Khi tao successor va dua vao frontier/queue/stack, tao tree node moi va gan `parentId` la id cua current.
- Khi node duoc pop/dequeue de mo rong, dat `expanded = true`.
- Khi tim thay goal:
  - Dung `reconstructMoves(goalNode)` nhu hien tai de lay loi giai.
  - Di nguoc parentId trong tree de danh dau `isSolutionPath = true`.
  - Return them `searchTree`.
- Ket qua moi nen co dang:

```js
{
  solved,
  moves,
  visited,
  explored,
  timeMs,
  searchTree,
  truncated: boolean,
}
```

- Nen gioi han so node luu/render, vi BFS/A* co the sinh rat lon. De xuat `MAX_TREE_NODES = 500` cho UI. Solver co the tiep tuc chay binh thuong nhung chi luu 500 node dau de hien thi, hoac dung co `truncated`.

### Buoc 8: Hien thi cay tim kiem

- Tao component moi, vi du `frontend/src/components/solver/SearchTree.jsx`.
- Input: `nodes`, `truncated`, `algorithm`, `usesHeuristic`.
- Build map `parentId -> children[]` de render phan cap.
- Moi node hien:
  - Ten node: `Goc` neu `move === null`, nguoc lai `Lo X -> Lo Y`.
  - `d=` depth.
  - `g=` cost.
  - `h=` heuristic neu Greedy/A*.
  - `f=g+h` neu A*.
  - Badge `Duong loi giai` neu `isSolutionPath`.
  - Badge `Dich` neu `isGoal`.
- Co the dung `<details><summary>` de cay co the thu gon/mo rong ma khong can state phuc tap.
- `ResultPanel.jsx` can thay `StepList` bang `SearchTree`; bo nut `Visualize Steps` vi yeu cau khong xem step tung buoc nho.

### Buoc 9: Cap nhat hook state

- Refactor `useSolver(initialBottles)` de phu hop state dong:
  - Co the doi thanh `useSolver()` va truyen `bottles` vao `findSolution(bottles)`.
  - Hoac giu hook nhung `initialBottles` den tu state bai toan trong page.
- `solverResult` can luu:
  - algorithm, heuristic, solved, steps/moves, stats, searchTree, truncated.
- `buildNote` nen doi sang tieng Viet.
- Co the bo cac ham timeline `nextStep`, `previousStep`, `selectStep` neu khong con visualizer.

### Buoc 10: CSS va responsive

- Cap nhat `layout.css`:
  - Layout desktop: `main puzzle area` + `control/editor panel`, cay tim kiem nam ben duoi hoac cot rong.
  - Dung grid/flex nhung giu card radius 8px theo style hien tai.
- Them CSS cho:
  - `.puzzle-editor`.
  - `.editor-bottle`.
  - `.editor-cell` / select combobox.
  - `.search-tree`.
  - `.tree-node`, `.tree-node.solution-path`, `.tree-node.goal`.
- Cap nhat `responsive.css`:
  - Mobile xep doc.
  - 8 lo co the hien 4 cot x 2 hang hoac scroll nhe.
  - Combobox khong bi tran text.
  - Cay tim kiem co `overflow-x: auto` neu can.

## 5. Tieu chi hoan thanh

- Mo ung dung len la vao mot page duy nhat, khong can Home/Level/Visualizer.
- Toan bo UI chinh bang tieng Viet.
- Page hien dung 8 lo va chi dung 6 mau chinh.
- Nut tao bai ngau nhien sinh bai tu trang thai dich bang chuoi hanh dong hop le.
- Nguoi dung nhap bai cu the bang combobox tung o trong 8 lo.
- Validate bai nhap va hien loi tieng Viet khi sai.
- Chon BFS/DFS/UCS thi khong hien heuristic.
- Chon Greedy/A* thi hien combobox heuristic.
- Chay solver xong hien thong ke va cay tim kiem.
- Cay tim kiem danh dau duong loi giai neu tim thay.
- Khong con bat buoc xem loi giai qua danh sach step nho hay man visualizer rieng.
- `npm run build` trong thu muc `frontend` thanh cong.

## 6. Ruu ro va luu y ky thuat

- Cay tim kiem co the rat lon, bat buoc gioi han so node render de tranh treo UI.
- `serializeState` hien dang sort cac lo truoc khi tao key, tuc la cac state chi khac thu tu lo duoc xem la trung nhau. Dieu nay tot cho giam khong gian tim kiem, nhung khi gan node cay can chap nhan viec mot so nhanh tuong duong se khong xuat hien.
- Neu doi label heuristic sang tieng Viet truc tiep, `getHeuristic()` se khong tim thay key cu. Nen dung object `{ value, label }` hoac them mapping.
- CSS mau hien tai dua vao `data-color='red'`, `green`, `blue`, `yellow`, `purple`, `cyan`, `pink`, `orange`. Neu chi dung 6 mau thi nen giu key hien co de khong can sua gradient.
- Generator random phai dung cung logic voi solver (`generateNextStates`/`pourBetween`) de tranh tao state ma solver khong xu ly dung.
- Trinh editor can ton trong thu tu day -> mieng lo cua state noi bo; neu UI ve tu tren xuong duoi thi phai reverse khi doc/ghi.

## 7. Checklist de agent trien khai

- [x] Tao hang so 8 lo/6 mau va label tieng Viet trong `constants/game.js`.
- [x] Tao `puzzleGenerator.js` voi solved state va random shuffle tu hanh dong hop le.
- [x] Tao `PuzzleEditor.jsx` cho combobox tung o va validation.
- [x] Refactor `App.jsx` de render mot page duy nhat.
- [x] Refactor `SolverScreen.jsx` thanh giao dien tieng Viet mot page.
- [x] Refactor `useSolver.js` de nhan puzzle state dong va luu search tree.
- [x] Mo rong BFS/DFS/UCS/Greedy/A* de tra `searchTree`.
- [x] Tao `SearchTree.jsx` va thay `StepList` trong `ResultPanel.jsx`.
- [x] Cap nhat CSS layout/responsive cho editor va cay tim kiem.
- [x] Chay `npm run build` trong `frontend` va sua loi neu co.

## 8. Goi y thu tu kiem thu thu cong

1. Mo app va xac nhan chi co mot page.
2. Bam `Tao bai ngau nhien`, xac nhan co 8 lo va 6 mau.
3. Chon BFS, bam `Tim loi giai`, xac nhan khong hien heuristic va co cay tim kiem.
4. Chon A*, xac nhan hien heuristic va node cay co thong tin h/f.
5. Sua bai bang combobox thanh state sai, xac nhan validate chan solver.
6. Sua lai state hop le, xac nhan solver chay va cay danh dau duong loi giai.
7. Chay `npm run build`.