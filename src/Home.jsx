import { useEffect, useState } from "react";
import {
  Play,
  Zap,
  Globe,
  ShieldCheck,
  Link,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import bg from "./assets/bg.png";
import car from "./assets/hero.png";

export default function Home() {

  const navigate = useNavigate();

  const [showVideo, setShowVideo] = useState(false);
  const [feature, setFeature] = useState(null);

  /* ========================= */
  /* ⚡ CURSOR LIGHTNING */
  /* ========================= */
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;

    const createLightning = (x, y) => {
      const line = document.createElement("div");
      line.className = "lightning-line";

      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      line.style.width = dist + "px";
      line.style.left = lastX + "px";
      line.style.top = lastY + "px";
      line.style.transform = `rotate(${angle}deg)`;

      document.body.appendChild(line);
      setTimeout(() => line.remove(), 200);
    };

    const move = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      createLightning(x, y);
      lastX = x;
      lastY = y;
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* BG (SAFE) */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: bg ? `url(${bg})` : "none"
        }}
      />
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12">

        {/* NAVBAR */}
        <div className="flex justify-between items-center pt-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            ChargeFlow
          </h1>

          <button className="bg-gradient-to-r from-purple-500 to-cyan-400 px-7 py-3 rounded-full text-sm font-semibold hover:scale-105 transition">
            Try Multi-Pass
          </button>
        </div>

        {/* HERO */}
        <div className="grid lg:grid-cols-2 items-center mt-14 gap-10">

          {/* LEFT */}
          <div>

            <div className="inline-block px-4 py-1 rounded-full border border-cyan-400/40 text-sm text-cyan-400 mb-5">
              Universal Payment Layer
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              One Layer. <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Every Charger.
              </span>
            </h1>

            <p className="mt-5 text-gray-300">
              Scan → Charge → Auto Payment. No apps. No friction.
            </p>

            {/* BUTTONS */}
            <div className="flex items-center gap-6 mt-7">

              <button
                onClick={() => navigate("/demo")}
                className="bg-gradient-to-r from-purple-500 to-cyan-400 px-6 py-3 rounded-full hover:scale-105 transition"
              >
                Start Charging
              </button>

              <button
                onClick={() => setShowVideo(true)}
                className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
                  <Play size={16} />
                </div>
                Watch Demo
              </button>

            </div>

            {/* FLOW */}
            <div className="flex items-center gap-6 mt-6 text-sm">

              <div className="flex items-center gap-2 text-cyan-400">
                <div className="w-7 h-7 rounded-full border border-cyan-400 flex items-center justify-center text-xs">1</div>
                Scan
              </div>

              <div className="w-10 h-[2px] bg-gray-600" />

              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-7 h-7 rounded-full border border-gray-500 flex items-center justify-center text-xs">2</div>
                Charge
              </div>

              <div className="w-10 h-[2px] bg-gray-600" />

              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-7 h-7 rounded-full border border-gray-500 flex items-center justify-center text-xs">3</div>
                Auto Pay
              </div>

            </div>

          </div>

          {/* RIGHT (SAFE IMAGE / FALLBACK) */}
          <div className="relative flex justify-center">

            {car ? (
              <img
                src={car}
                className="w-[560px] car-animate"
                onError={(e)=>e.target.style.display="none"}
              />
            ) : (
              <div className="w-[560px] h-[360px] bg-white/5 rounded-2xl flex items-center justify-center text-gray-500">
                EV Charger Preview
              </div>
            )}

            {/* LIVE CARD */}
            <div className="absolute bottom-16 right-6 bg-white/10 backdrop-blur-xl p-5 rounded-xl border border-white/20 w-[260px]">

              <div className="flex justify-between text-sm">
                <div className="flex gap-2 items-center">
                  <Zap size={16} className="text-cyan-400" />
                  Live Charging
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>

              <p className="text-gray-400 text-sm mt-2">
                Waiting session...
              </p>

              <h2 className="text-2xl font-bold mt-2 text-cyan-400">
                0.00 kWh
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                IDR → USDC
              </p>

              <div className="mt-2 text-sm text-gray-300">
                ⚡ Ready to start
              </div>

            </div>

          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">

          {[
            { title: "Cross-Border", desc: "Pay anywhere in SEA", icon: <Globe /> },
            { title: "Streaming", desc: "Real-time billing", icon: <Zap /> },
            { title: "Secure", desc: "Enterprise-grade", icon: <ShieldCheck /> },
            { title: "Universal", desc: "All chargers", icon: <Link /> }
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => setFeature(item)}
              className="feature-card bg-white/5 p-5 rounded-xl cursor-pointer"
            >
              <div className="mb-2">{item.icon}</div>
              <h3 className="text-lg">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}

        </div>
      </div>

      {/* VIDEO MODAL */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black p-4 rounded-xl relative w-[90%] max-w-2xl">
            <button onClick={() => setShowVideo(false)} className="absolute top-2 right-2">
              <X />
            </button>

            <iframe
              className="w-full h-[300px]"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* FEATURE MODAL */}
      {feature && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl w-[300px] relative">
            <button onClick={() => setFeature(null)} className="absolute top-2 right-2">
              <X />
            </button>

            <h2 className="text-xl font-bold">{feature.title}</h2>
            <p className="text-gray-300 mt-2">{feature.desc}</p>
          </div>
        </div>
      )}

    </div>
  );
}