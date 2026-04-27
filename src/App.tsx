import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AddProduct from "./components/AddProduct";
import Contact from "./pages/Contact";
import CartModal from "./components/CartModal";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Footer from "./components/Footer";
import Auth from "./components/Auth";
import Chatbot from "./components/Chatbot";

const App: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Router>
      <div className="relative min-h-screen bg-black dark:bg-gray-900 text-white dark:text-gray-100">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-fuchsia-600/15 blur-3xl"></div>
          <div className="absolute -bottom-24 -right-16 w-[28rem] h-[28rem] rounded-full bg-cyan-500/10 blur-3xl"></div>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_25%_10%,#22d3ee_0%,transparent_35%),radial-gradient(circle_at_80%_80%,#f472b6_0%,transparent_35%)]"></div>
        </div>
        <Navbar />
        <CartModal />
        <Chatbot />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
