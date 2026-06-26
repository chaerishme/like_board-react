import { createContext, useCallback, useState } from "react";

export const INITIAL_ITEMS = [
  { id: 1, name: "인셉션", likes: 0 },
  { id: 2, name: "기생충", likes: 0 },
  { id: 3, name: "라라랜드", likes: 0 },
  { id: 4, name: "어벤져스: 엔드게임", likes: 0 },
  { id: 5, name: "타이타닉", likes: 0 },
];

export const LikeStateContext = createContext(null);
export const LikeDispatchContext = createContext(null);

export function LikeProvider({ children }) {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const handleLike = useCallback((id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item,
      ),
    );
  }, []);

  return (
    <LikeDispatchContext.Provider value={handleLike}>
      <LikeStateContext.Provider value={items}>{children}</LikeStateContext.Provider>
    </LikeDispatchContext.Provider>
  );
}
