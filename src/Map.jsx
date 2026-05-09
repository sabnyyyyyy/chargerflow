import { useNavigate } from "react-router-dom";
import mapImage from "./assets/maps.png";

export default function MapPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex bg-black text-white overflow-hidden">

      {/* ================= LEFT - MAP ================= */}
      <div className="w-[70%] h-full relative">

        {/* MAP BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] to-[#0f172a]" />

        {/* GRID */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,rgba(0,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* MARKERS */}
        <div className="absolute top-[40%] left-[50%]">
          <div className="w-10 h-10 rounded-full bg-cyan-400/20 flex items-center justify-center 
          shadow-[0_0_20px_rgba(34,211,238,0.7)] animate-pulse">
            ⚡
          </div>
        </div>

        <div className="absolute top-[30%] left-[30%] opacity-50">⚡</div>
        <div className="absolute top-[60%] left-[20%] opacity-50">⚡</div>
        <div className="absolute top-[50%] left-[70%] opacity-50">⚡</div>

        {/* SEARCH */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-2">
          <input
            placeholder="Search location..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm"
          />
          <button className="px-4 py-2 bg-cyan-400/20 rounded-full text-cyan-400 text-sm">
            Fast Charger
          </button>
        </div>

      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="w-[30%] h-full p-6 border-l border-white/10 flex flex-col">

        <div className="flex-1 flex items-center justify-center">

          {/* CARD */}
          <div className="w-full max-w-sm bg-[#0b1220] border border-white/10 rounded-2xl 
          overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.15)] flex flex-col h-full">

            {/* IMAGE */}
            <div className="relative h-[200px] overflow-hidden">
              <img 
                src={mapImage}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              {/* STATUS */}
              <div className="absolute top-3 right-3 px-3 py-1 text-xs rounded-full 
                bg-green-400/10 text-green-400 border border-green-400/20">
                ● Available
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-5 flex-1">

              <p className="text-cyan-400 text-sm font-medium">
                CCS2 • Fast Charging
              </p>

              <h2 className="text-lg font-semibold mt-1">
                ChargeFlow Station — SCBD
              </h2>

              <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">
                <div>📍 1.2 km</div>
                <div>🕒 24/7</div>
                <div>⚡ 200 kW</div>
              </div>

              <div className="mt-6">
                <p className="text-gray-400 text-xs">Estimated cost</p>
                <p className="text-2xl font-bold text-cyan-400">
                  Rp 4.850 / kWh
                </p>
              </div>

            </div>

            {/* BUTTON */}
            <div className="p-5 pt-0">
              <button
                onClick={() => navigate("/demo")}
                className="w-full py-4 rounded-full font-semibold text-black
                bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
                hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Start Charging →
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}