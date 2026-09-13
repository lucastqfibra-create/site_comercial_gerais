import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartFloatingButton() {
  const { totalItemsCount, setIsDrawerOpen } = useCart();

  if (totalItemsCount === 0) return null;

  return (
    <button
      onClick={() => setIsDrawerOpen(true)}
      className="fixed bottom-6 right-6 z-40 bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
      aria-label="Abrir carrinho"
    >
      <span className="text-xl">🛒</span>
      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
        {totalItemsCount}
      </span>
    </button>
  );
}
