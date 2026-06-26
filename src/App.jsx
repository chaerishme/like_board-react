import { useCallback, useState } from "react";
import LikeItem from "./LikeItem.jsx";
import "./App.css";

const INITIAL_ITEMS = [
  { id: 1, name: "인셉션", likes: 0 },
  { id: 2, name: "기생충", likes: 0 },
  { id: 3, name: "라라랜드", likes: 0 },
  { id: 4, name: "어벤져스: 엔드게임", likes: 0 },
  { id: 5, name: "타이타닉", likes: 0 },
];

function App() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const handleLike = useCallback((id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item,
      ),
    );
  }, []); // 함수형 업데이트를 사용했으므로 의존성 배열을 비울 수 있음

  const totalLikes = items.reduce((sum, item) => sum + item.likes, 0);

  return (
    <main className="like-board">
      <h1>좋아요 보드</h1>
      <p className="total-likes">총 좋아요: {totalLikes}</p>
      <ul className="like-list">
        {items.map((item) => (
          <LikeItem key={item.id} item={item} onLike={handleLike} />
        ))}
      </ul>
    </main>
  );
}

export default App;
