import { useContext } from "react";
import LikeItem from "./LikeItem.jsx";
import { LikeProvider, LikeStateContext } from "./LikeContext.jsx";
import "./App.css";

function LikeBoard() {
  const items = useContext(LikeStateContext);
  const totalLikes = items.reduce((sum, item) => sum + item.likes, 0);

  return (
    <main className="like-board">
      <h1>좋아요 보드</h1>
      <p className="total-likes">총 좋아요: {totalLikes}</p>
      <ul className="like-list">
        {items.map((item) => (
          <LikeItem key={item.id} item={item} />
        ))}
      </ul>
    </main>
  );
}

function App() {
  return (
    <LikeProvider>
      <LikeBoard />
    </LikeProvider>
  );
}

export default App;
