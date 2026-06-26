# 좋아요/투표 보드 — 마일스톤 문서

> **목적**: React 최적화 4종 세트(`React.memo`, `useCallback`, `useMemo`, Context State/Dispatch 분리)를 "필요해서 쓰는" 흐름으로 복습한다.
> **핵심 원칙**: 기능 먼저 완성 → Profiler로 문제 측정 → 그 다음에만 최적화 적용 → 다시 측정해서 효과 확인.
> **하지 말 것**: 처음부터 memo/useCallback 떡칠하기. 추측으로 최적화 넣기.

---

## 0. 세팅

```bash
npm create vite@latest like-board -- --template react-js
cd like-board
npm install
npm run dev
```

- React DevTools 브라우저 확장 설치 (Profiler 탭 쓸 거라 필수)
- 첫 커밋: `git init && git add . && git commit -m "init: vite react-js 세팅"`

---

## Phase 1 — 기능 완성 (최적화 절대 금지)

> 이 단계에서는 `React.memo`, `useCallback`, `useMemo`를 **쓰지 않는다.** 일부러. 나중에 문제를 눈으로 봐야 하니까.

### 1-1. 항목 목록 + 좋아요 버튼

- [x] 항목 5개 하드코딩 (예: 영화 제목, 또는 음식 이름 — 아무거나)
- [x] 각 항목 = `{ id, name, likes }`
- [x] 전체 목록은 부모 컴포넌트의 `useState`로 관리
- [x] 각 항목마다 "좋아요" 버튼 → 누르면 해당 항목의 `likes`만 +1
- [x] **불변성 지키기**: `likes` 직접 수정 금지. `map`으로 새 배열 만들어서 `setItems`
  - 힌트: `setItems(prev => prev.map(item => item.id === id ? {...item, likes: item.likes + 1} : item))`

### 1-2. 항목을 별도 컴포넌트로 분리

- [x] `<LikeItem>` 컴포넌트로 분리 (props: `item`, `onLike`)
- [x] 부모는 `items.map(item => <LikeItem ... />)`로 렌더

### 1-3. 총 좋아요 수 표시

- [x] 화면 상단 또는 하단에 "총 좋아요: N" 표시
- [x] 일단 `items.reduce((sum, item) => sum + item.likes, 0)`로 그냥 계산 (최적화 X)

### ✅ Phase 1 완료 → Git 커밋

```bash
git add . && git commit -m "feat: 좋아요 보드 기능 완성 (최적화 전)"
```

**이 커밋이 '최적화 전 상태' 박제본이다. 나중에 비교용으로 쓴다.**

---

## Phase 2 — 문제 측정 (코드 수정 X, 관찰만)

> 최적화하기 **전에** 진짜 문제가 있는지부터 확인한다. 이게 이 프로젝트의 핵심.

### 2-1. Profiler로 리렌더 관찰

- [x] React DevTools → Profiler 탭 → 녹화 시작
- [x] 1번 항목의 좋아요 버튼만 한 번 누르기
- [x] 녹화 중지 후 확인: **어떤 컴포넌트들이 리렌더됐나?**
- [x] 관찰 포인트: 1번만 눌렀는데 2~5번 `LikeItem`도 전부 리렌더됐을 것
- [x] "Highlight updates when components render" 켜고 직접 깜빡임 확인

### 2-2. 왜 그런지 한 줄로 적어보기

- [x] "부모의 state가 바뀌면 → 부모가 리렌더 → 자식 전부 리렌더된다" 를 본인 말로 메모

### 🤔 여기서 멈추고 생각: "이게 진짜 문제인가?"

- 항목 5개면 사실 성능 문제 없음. **근데 이게 1000개라면?** 그래서 최적화를 연습하는 것.
- 이 감각("작으면 굳이 최적화 안 해도 됨")을 기억해두기.

---

## Phase 3 — 최적화 적용 (한 번에 하나씩, 매번 측정)

> 한 단계 적용할 때마다 Profiler로 다시 측정해서 효과를 확인한다. 여러 개 한꺼번에 넣지 말 것.

### 3-1. React.memo 씌우기 → 효과 없는 거 확인

- [x] `LikeItem`을 `React.memo(...)`로 감싸기
- [x] Profiler 다시 측정
- [x] **예상과 다를 것**: 여전히 전부 리렌더됨
- [x] 왜? → `onLike` 함수가 부모 리렌더마다 **새로 생성**돼서, props가 "바뀐 걸로" 판단됨
- [x] 이 현상을 직접 확인하는 게 이 단계의 목적

### 3-2. useCallback로 핸들러 고정 → 이제 효과 나타남

- [x] 부모의 `onLike` 함수를 `useCallback`으로 감싸기
- [x] 의존성 배열 주의: 함수형 업데이트(`prev =>`) 쓰면 의존성 비울 수 있음 `[]`
- [x] Profiler 다시 측정
- [x] **이제 확인**: 누른 항목 1개만 리렌더, 나머지는 리렌더 안 됨
- [x] 🎯 여기가 "React.memo + useCallback은 짝으로 움직인다"를 몸으로 배우는 지점

### 3-3. useMemo로 총합 계산 캐싱

- [ ] "총 좋아요 수" reduce 계산을 `useMemo`로 감싸기
- [ ] 의존성 배열: `[items]`
- [ ] 솔직히 이 규모에선 효과 미미함 → 그래도 "어떤 계산에 useMemo를 쓰는지" 패턴 익히는 용도
      -> 총합 계산에 useMemo를 쓰는 건 의미가 없을 것 같아서 넘어감.

### ✅ Phase 3 완료 → Git 커밋

```bash
git add . && git commit -m "perf: memo/useCallback/useMemo 적용"
```

---

## Phase 4 — Context 도입 + State/Dispatch 분리

> props로 `onLike`를 계속 내려주는 게 귀찮아지는 상황을 만들고, Context로 해결한다.

### 4-1. Context로 전환

- [x] `LikeContext` 만들어서 항목 목록과 좋아요 함수를 Context로 제공
- [x] `LikeItem`이 props 대신 Context에서 필요한 값 꺼내쓰게 변경
- [x] Profiler 측정 → **다시 전체 리렌더 터질 것**
- [x] 왜? → Provider의 `value`가 매 렌더마다 새 객체 → 구독하는 컴포넌트 전부 리렌더

### 4-2. State와 Dispatch Context 분리

- [x] `LikeStateContext` (자주 바뀜: 항목 목록) / `LikeDispatchContext` (안 바뀜: 좋아요 함수) 로 쪼개기
- [x] dispatch context의 value는 안 바뀌므로, 좋아요 함수만 쓰는 컴포넌트는 리렌더 안 됨
- [x] Profiler 측정 → 다시 최적화된 상태 확인
- [x] 🎯 "Provider도 컴포넌트다 → value가 바뀌면 하위 전체 리렌더된다" 를 직접 경험

### ✅ Phase 4 완료 → Git 커밋

```bash
git add . && git commit -m "refactor: Context State/Dispatch 분리"
```

---

## Phase 5 — 최종 비교 & 회고

- [x] Phase 1 커밋(최적화 전) vs 현재 상태 Profiler 비교
- [x] 1번 항목 누를 때 리렌더되는 컴포넌트 개수: 최적화 전 N개 → 후 1개
- [x] 회고로 답해보기:
  - [x] React.memo만 단독으로 쓰면 왜 효과가 없었나?

        React.memo는 props를 참조로 비교해서, 이전과 같으면 리렌더를 스킵한다. 하지만 부모가 리렌더될 때마다 onLike 핸들러 함수가 새로 생성되어 매번 다른 참조가 된다. 그러면 memo는 "props가 바뀌었다"고 판단해 리렌더를 막지 못한다. 그래서 함수의 참조를 고정해주는 useCallback이 짝으로 필요하다. (memo와 useCallback은 항상 세트로 움직인다.)

  - [x] useCallback의 의존성 배열을 왜 비울 수 있었나?

        useCallback의 의존성 배열에는 보통 "함수 안에서 읽는 바깥 값"을 넣어야 한다. 안 넣으면 옛날 값을 붙잡는 stale 문제(클로저 함정)가 생긴다. 그런데 setItems(prev => ...) 처럼 함형 업데이트를 쓰면 함수 안에서items를 직접 읽지 않고, React가 최신 값을 prev로 넣어준다. 읽는 바값이 없으니 의존성에 넣을 것도 없어서 []로 비워도 stale이 발생하지 않는다.

  - [x] Context value를 그냥 객체로 넣으면 왜 최적화가 풀리나?

        Provider의 value에 객체 리터럴 {{ items, onLike }}을 넣으면, 부모가 리렌더될 때마다 그 객체가 새로 생성된다. Context는 value가 바뀌었는지를 참조(주소)로 비교하기 때문에, 매번 새 객체 = 다른 주소 → 항상 "바뀐 걸로" 판단한다. 그 결과 이 Context를 구독하는 모든 컴포넌트가 리렌더된다. 게다가 이건 Context 구독으로 인한 리렌더라서 memo로도 막을 수 없다. (해결: value를 useMemo로 감싸거나, State/Dispatch Context로 분리.)

  - [x] 이 앱이 항목 5개가 아니라 1000개라면 최적화 효과가 어떻게 달라질까?
        최적화 전에는 좋아요를 한 번 누를 때마다 1000개가 전부 리렌더된다. 최적화 후에는 클릭한 1개만 리렌더된다 (차이 1000배). 항목이 5개일 때는 이 차이(5 vs 1)가 사람 눈에 안 보였지만, 1000개면 화면 버벅임이 체감된다. 즉 최적화 효과는 리렌더 비용(=항목 수)이 클수록 커지고, 작은 규모에선 굳이 안 해도 된다. "최적화는 필요한 곳에만"의 판단 기준은 결국 규모/비용이다.

---

## ⚠️ 진행 중 자기 점검 (agentic coding 원칙)

- AI(Cursor)가 짠 코드를 **한눈에 이해 못 하면 → 멈추고 질문.** 그게 신호다.
- 각 Phase 끝날 때마다 "방금 뭘 왜 했는지" 본인 말로 설명 가능한지 체크.
- 막히면 그 코드 들고 Claude한테 가져오기.

## Cursor 프롬프트 팁

- 처음부터 "최적화된 좋아요 보드 만들어줘"라고 하지 말 것. → 최적화가 다 들어간 코드가 나와서 **배울 게 없어짐.**
- 대신 Phase 단위로: "Phase 1만 해줘. React.memo, useCallback, useMemo는 절대 쓰지 마." 처럼 **명시적으로 제약**을 걸 것.
