import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../store/productsSlice";
import nikeVideo from "../videos/Nike.mp4";

export default function Hero() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    try {
      // Make the background feel snappier
      node.playbackRate = 1.25;
      const playPromise = node.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          // Autoplay might be blocked; try muted play again
          node.muted = true;
          node.play().catch(() => {});
        });
      }
    } catch {}
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(setSearchQuery(query.trim()));
      // Scroll to products section
      const productsSection = document.getElementById("products-section");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative w-full min-h-[80vh] sm:min-h-[85vh] md:min-h-screen overflow-hidden bg-black dark:bg-gray-900">
      {/* 🎬 Background Video */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={nikeVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        onLoadedMetadata={() => {
          const v = videoRef.current;
          if (v) {
            v.playbackRate = 1;
          }
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent dark:from-gray-900/70 dark:via-gray-900/50 dark:to-transparent backdrop-blur-none"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] sm:min-h-[75vh] md:min-h-[90vh] text-center text-white dark:text-gray-100 px-4">
        {/*  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 drop-shadow-[0_0_18px_#22d3ee] dark:drop-shadow-[0_0_18px_#f472b6] animate-pulse">
          HERO
        </h1> */}

        <p className="mb-8 text-base sm:text-xl md:text-2xl text-gray-200 dark:text-gray-300 max-w-2xl">
          Embrace the storm — find your way through the chaos.
        </p>

        <form
          onSubmit={handleSearch}
          className="w-full max-w-lg flex items-center bg-white/10 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 rounded-full overflow-hidden"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the unknown..."
            className="flex-grow bg-transparent px-5 sm:px-6 py-3 sm:py-4 text-white dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-fuchsia-600 to-cyan-400 dark:from-purple-600 dark:to-pink-400 text-black dark:text-white font-bold hover:opacity-90 transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Floating glow elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-56 sm:w-72 h-56 sm:h-72 bg-fuchsia-500/20 dark:bg-purple-500/30 rounded-full blur-3xl animate-pulse top-[-80px] sm:top-[-100px] left-[5%] sm:left-[10%]"></div>
        <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-cyan-400/20 dark:bg-pink-400/30 rounded-full blur-3xl animate-spin-slow bottom-[-120px] sm:bottom-[-150px] right-[5%] sm:right-[10%]"></div>
      </div>
    </div>
  );
}
