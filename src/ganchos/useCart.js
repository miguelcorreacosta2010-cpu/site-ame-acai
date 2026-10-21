import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ame-cart';

function readStoredCart() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      // armazenamento indisponível — o carrinho segue em memória
    }
  }, [items]);

  const addItem = (item) => {
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setItems((current) => [...current, { ...item, uid }]);
  };

  const updateQuantity = (uid, quantity) => {
    setItems((current) =>
      current.map((item) =>
        item.uid === uid
          ? { ...item, quantity, line_total: Number(item.unit_price) * quantity }
          : item
      )
    );
  };

  const removeItem = (uid) => setItems((current) => current.filter((item) => item.uid !== uid));

  const clear = () => setItems([]);

  const count = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const subtotal = items.reduce((sum, item) => sum + Number(item.line_total || 0), 0);

  return { items, addItem, updateQuantity, removeItem, clear, count, subtotal };
}