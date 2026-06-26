import { memo, useContext } from "react";
import { LikeDispatchContext } from "./LikeContext.jsx";

function LikeItem({ item }) {
  const onLike = useContext(LikeDispatchContext);

  return (
    <li className="like-item">
      <span className="like-item-name">{item.name}</span>
      <span className="like-item-count">좋아요 {item.likes}</span>
      <button
        type="button"
        className="like-button"
        onClick={() => onLike(item.id)}
      >
        좋아요
      </button>
    </li>
  );
}

export default memo(LikeItem);
