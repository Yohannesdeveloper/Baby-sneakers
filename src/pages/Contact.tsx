import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validate form data
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5177";
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      };
      
      console.log("Sending contact message to:", `${API_BASE}/api/contact`);
      console.log("Payload:", payload);
      
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send message");
      }

      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("Contact form error:", err);
      
      // Check if it's a connection error
      const isConnectionError = err instanceof TypeError && err.message.includes("Failed to fetch");
      
      let errorMessage = "Failed to send message. Please try again.";
      if (isConnectionError) {
        errorMessage = "Unable to connect to server. Your message has been saved locally and will be sent when the server is available.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Also save to localStorage as backup
      try {
        const savedMessages = JSON.parse(localStorage.getItem("contactMessages") || "[]");
        savedMessages.push({
          ...formData,
          timestamp: new Date().toISOString(),
          status: "pending",
        });
        localStorage.setItem("contactMessages", JSON.stringify(savedMessages));
        console.log("Message saved to localStorage as backup");
      } catch (storageErr) {
        console.error("Failed to save to localStorage:", storageErr);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-fuchsia-700 via-indigo-900 to-black text-white">
      {/* chaotic background shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-fuchsia-500 blur-3xl opacity-30 animate-pulse"></div>
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500 blur-3xl opacity-30 animate-ping"></div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.05),transparent_35%)]"></div>

      {/* header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-indigo-100">
            Chaos-friendly support. We answer faster than a particle in a
            collider.
          </p>
        </div>

        {/* marquee chaos */}
        <div className="mt-10 overflow-hidden border border-white/20 rounded-xl bg-white/5 backdrop-blur">
          <div className="whitespace-nowrap animate-[marquee_18s_linear_infinite]">
            <span className="mx-6 inline-block py-3 text-fuchsia-200">
              24/7 SUPPORT
            </span>
            <span className="mx-6 inline-block py-3 text-cyan-200">
              LIVE CHAT
            </span>
            <span className="mx-6 inline-block py-3 text-rose-200">
              EMAIL MAGIC
            </span>
            <span className="mx-6 inline-block py-3 text-amber-200">
              CARRIER PIGEONS
            </span>
            <span className="mx-6 inline-block py-3 text-lime-200">
              SMOKE SIGNALS
            </span>
            <span className="mx-6 inline-block py-3 text-sky-200">
              QUANTUM REPLIES
            </span>
            <span className="mx-6 inline-block py-3 text-fuchsia-200">
              24/7 SUPPORT
            </span>
            <span className="mx-6 inline-block py-3 text-cyan-200">
              LIVE CHAT
            </span>
            <span className="mx-6 inline-block py-3 text-rose-200">
              EMAIL MAGIC
            </span>
          </div>
        </div>

        {/* content grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* form */}
          <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-6 sm:p-8 shadow-2xl transition-transform duration-300 hover:-translate-y-0.5">
            <div className="absolute -top-6 -left-6 rotate-[-6deg] bg-fuchsia-500 text-black font-bold px-4 py-2 rounded shadow-xl">
              TALK TO US
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {success && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-400 text-sm p-3 rounded-md">
                  ✓ Message sent successfully! We'll get back to you soon.
                </div>
              )}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm p-3 rounded-md">
                  ⚠ {error}
                </div>
              )}
              <div>
                <label className="block text-sm text-indigo-100 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-white placeholder-gray-400"
                  placeholder="Your dazzling name"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm text-indigo-100 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
                  placeholder="you@awesome.com"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm text-indigo-100 mb-1">
                  Message
                </label>
                <textarea
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400 text-white placeholder-gray-400 resize-y"
                  placeholder="Let the chaos flow..."
                  disabled={loading}
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-fuchsia-500 via-rose-500 to-amber-400 px-5 py-2 font-semibold text-black shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send It"}
                  <span className="inline-block animate-pulse">✨</span>
                </button>
              </div>
            </form>
          </div>

          {/* contacts, map and chaos */}
          <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-xl bg-black/40 p-5 border border-white/10 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-sm text-indigo-200">Email</div>
                <div className="mt-1 text-lg font-bold">
                  zenamarkosdesalneg@gmail.com
                </div>
              </div>
              <div className="rounded-xl bg-black/40 p-5 border border-white/10 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-sm text-indigo-200">Phone</div>
                <div className="mt-1 text-lg font-bold">+0733857648</div>
              </div>

              <div className="rounded-xl bg-black/40 p-5 border border-white/10 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-sm text-indigo-200">HQ</div>
                <div className="mt-1 text-lg font-bold">
                  Somewhere between Johannesburg
                </div>
              </div>

              <div className="rounded-xl bg-black/40 p-5 border border-white/10 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-sm text-indigo-200">Location</div>
                <div className="mt-1 text-lg font-bold">
                  26°12'02.5"S 28°02'48.8"E
                </div>
              </div>
            </div>

            <div className="mt-8">
              <MapContainer
                center={[-26.20025, 28.0488]}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[-26.20025, 28.0488]}>
                  <Popup>
                    Baby Sneakers HQ
                    <br />
                    Somewhere in Johannesburg
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="mt-8 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 to-cyan-400 rounded-2xl blur opacity-30"></div>
              <div className="relative rounded-2xl bg-black/50 border border-white/10 p-6">
                <div className="text-sm text-indigo-200">Pro Tip</div>
                <p className="mt-1 text-indigo-100">
                  We reply fastest if you include memes. The rarer the better.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* keyframes for marquee */}
      <style>
        {`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}
      </style>
    </div>
  );
};

export default Contact;
