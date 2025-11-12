import React from "react";
import { Link } from "react-router-dom";

const Cancel: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Canceled</h1>
        <p className="mt-2 text-gray-700 dark:text-gray-300">You can try checking out again anytime.</p>
        <Link to="/checkout" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Return to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cancel;


