import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { closeCart, decrementQty, incrementQty, removeFromCart, clearCart } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";

const CartModal: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, items } = useSelector((s: RootState) => s.cart);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 animate-[fadeIn_180ms_ease-out]" onClick={() => dispatch(closeCart())}></div>
      <div className="absolute right-0 top-0 h-full w-full sm:w-[28rem] bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-[slideIn_220ms_cubic-bezier(0.16,1,0.3,1)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Cart</h2>
          <button
            onClick={() => dispatch(closeCart())}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 border border-gray-200 dark:border-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
                {item.image && (
                  <img src={item.image} alt={item.name} className="h-16 w-16 object-contain bg-white dark:bg-gray-800 rounded" />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</div>
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart({ id: item.id }))}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => dispatch(decrementQty({ id: item.id }))}
                      className="h-8 w-8 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:scale-105 transition"
                    >
                      −
                    </button>
                    <span className="min-w-[2ch] text-center">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(incrementQty({ id: item.id }))}
                      className="h-8 w-8 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:scale-105 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-200">Total</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">${total.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(clearCart())}
              className="flex-1 border border-gray-300 dark:border-gray-700 rounded-md py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 transition"
            >
              Clear
            </button>
            <button
              className="flex-1 bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:opacity-90 text-white rounded-md py-2 transition"
              onClick={() => { dispatch(closeCart()); navigate("/checkout"); }}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <style>
        {`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0%); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}
      </style>
    </div>
  );
};

export default CartModal;


