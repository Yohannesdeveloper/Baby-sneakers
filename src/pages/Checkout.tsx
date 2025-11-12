import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { clearCart } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";

const Checkout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((s: RootState) => s.cart.items);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentLink = (import.meta as any).env?.VITE_STRIPE_PAYMENT_LINK as string | undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }
    if (!name.trim() || !email.trim() || !address.trim()) {
      alert("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);

    // If a Stripe Payment Link is configured, redirect to it
    if (paymentLink) {
      const url = new URL(paymentLink);
      // best-effort prefill hints
      url.searchParams.set("prefilled_email", email);
      window.location.href = url.toString();
      return;
    }

    // Fallback: simulate payment success
    setTimeout(() => {
      dispatch(clearCart());
      navigate("/success");
    }, 900);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-10">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-16 -left-16 w-96 h-96 rounded-full bg-fuchsia-500/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-10 w-[28rem] h-[28rem] rounded-full bg-cyan-400/10 blur-3xl"></div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-400" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Checkout</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-7 transition-transform duration-300 hover:-translate-y-0.5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Customer Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Shipping Address</label>
                <textarea
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:opacity-90 disabled:opacity-60 text-white font-medium py-3 px-4 rounded-md transition-all duration-300"
              >
                {paymentLink ? "Pay with Stripe" : "Place Order (Demo)"}
              </button>
              {!paymentLink && (
                <p className="text-xs text-gray-600 dark:text-gray-400">Add a Stripe Payment Link in <code>VITE_STRIPE_PAYMENT_LINK</code> to enable real payments.</p>
              )}
            </form>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-7 lg:sticky lg:top-24 h-max">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.id} className="flex items-center gap-3">
                  {i.image && (
                    <img src={i.image} alt={i.name} className="h-12 w-12 object-contain bg-white dark:bg-gray-900 rounded shadow" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{i.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Qty {i.quantity} • ${(i.price * i.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-200">Total</span>
              <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-cyan-500">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


