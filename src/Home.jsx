import { useState, useEffect } from "react";

const stations = [
  { id: 1, name: "ChargeFlow Station – SCBD", lat: 51, lng: 30, type: "CCS2", power: "200 kW", status: "Available", rating: 4.9, distance: "1.2 km" },
  { id: 2, name: "ChargeFlow Station – Kuningan", lat: 38, lng: 62, type: "CCS2", power: "150 kW", status: "Available", rating: 4.8, distance: "2.1 km" },
  { id: 3, name: "ChargeFlow Station – Senayan", lat: 68, lng: 18, type: "AC Type 2", power: "22 kW", status: "Busy", rating: 4.7, distance: "3.4 km" },
  { id: 4, name: "ChargeFlow Station – Pancoran", lat: 42, lng: 78, type: "CCS2", power: "200 kW", status: "Available", rating: 4.6, distance: "4.8 km" },
  { id: 5, name: "ChargeFlow Station – Tebet", lat: 58, lng: 85, type: "CHAdeMO", power: "50 kW", status: "Available", rating: 4.5, distance: "5.2 km" },
];

const recentSessions = [
  {
    location: "CCS2 • SCBD",
    time: "Today, 10:24 AM",
    status: "Escrow Released",
    kwh: "7.21 kWh",
    price: "Rp 16.800"
  },

  {
    location: "CCS2 • Kuningan City",
    time: "Yesterday, 08:15 PM",
    status: "Refund Complete",
    kwh: "12.45 kWh",
    price: "Rp 29.250"
  },

  {
    location: "CCS2 • Senayan",
    time: "2 May 2024, 11:02 AM",
    status: "Settlement Complete",
    kwh: "5.32 kWh",
    price: "Rp 12.750"
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const BoltIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" />
  </svg>
);

const LocationIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const ShieldIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
  </svg>
);

const QRIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
    <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
    <path d="M14 14h2v2h-2zM18 14h3M18 18h3M14 18v3M14 21h2" />
  </svg>
);

const KeyboardIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
  </svg>
);

const ChevronRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const StarIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const RefreshIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const CreditCardIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const GlobeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const WalletIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
  </svg>
);

const PlayIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const FilterIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

const CrosshairIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" />
    <line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" />
  </svg>
);

const TimerIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><polyline points="12 6 12 12 15.5 14" /><line x1="9" y1="2" x2="15" y2="2" />
  </svg>
);

// ─── Map ──────────────────────────────────────────────────────────────────────

function MapView({ selectedStation, onSelectStation, searchQuery }) {
  const filtered = stations.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const pinPositions = [
    { left: "22%", top: "65%" },
    { left: "52%", top: "40%" },
    { left: "62%", top: "18%" },
    { left: "72%", top: "38%" },
    { left: "82%", top: "58%" },
  ];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "#0d1117" }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30,41,59,0.8)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapgrid)" />
        {/* Blocks */}
        <rect x="5%" y="10%" width="18%" height="12%" rx="2" fill="rgba(15,20,45,0.9)" />
        <rect x="5%" y="26%" width="10%" height="18%" rx="2" fill="rgba(15,20,45,0.9)" />
        <rect x="18%" y="26%" width="8%" height="14%" rx="2" fill="rgba(15,20,45,0.9)" />
        <rect x="35%" y="8%" width="15%" height="20%" rx="2" fill="rgba(15,20,45,0.9)" />
        <rect x="55%" y="10%" width="20%" height="10%" rx="2" fill="rgba(15,20,45,0.9)" />
        <rect x="40%" y="35%" width="12%" height="18%" rx="2" fill="rgba(15,20,45,0.9)" />
        <rect x="55%" y="60%" width="18%" height="20%" rx="2" fill="rgba(15,20,45,0.9)" />
        <rect x="5%" y="55%" width="15%" height="20%" rx="2" fill="rgba(15,20,45,0.9)" />
        <rect x="22%" y="60%" width="12%" height="15%" rx="2" fill="rgba(15,20,45,0.9)" />
        <rect x="78%" y="10%" width="15%" height="18%" rx="2" fill="rgba(15,20,45,0.9)" />
        <rect x="78%" y="42%" width="16%" height="14%" rx="2" fill="rgba(15,20,45,0.9)" />
        {/* Roads */}
        <line x1="0" y1="47%" x2="100%" y2="47%" stroke="#1a2744" strokeWidth="10" />
        <line x1="0" y1="72%" x2="100%" y2="72%" stroke="#1a2744" strokeWidth="7" />
        <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#1a2744" strokeWidth="10" />
        <line x1="65%" y1="0" x2="65%" y2="100%" stroke="#1a2744" strokeWidth="7" />
        <line x1="0" y1="28%" x2="100%" y2="58%" stroke="#132035" strokeWidth="5" />
        <line x1="12%" y1="0" x2="58%" y2="100%" stroke="#0f1a30" strokeWidth="4" />
        <line x1="0" y1="47%" x2="100%" y2="47%" stroke="rgba(26,39,68,0.6)" strokeWidth="1" strokeDasharray="12 8" />
        <line x1="30%" y1="0" x2="30%" y2="100%" stroke="rgba(26,39,68,0.6)" strokeWidth="1" strokeDasharray="12 8" />
      </svg>

      {/* Area labels */}
      {[
        { text: "SCBD", left: "28%", top: "28%" },
        { text: "Senayan", left: "6%", top: "56%" },
        { text: "Kuningan", left: "55%", top: "45%" },
        { text: "Mega Kuningan", left: "44%", top: "62%" },
        { text: "Pancoran", left: "72%", top: "30%" },
        { text: "Tebet", left: "76%", top: "55%" },
      ].map(l => (
        <span key={l.text} style={{
          position: "absolute", left: l.left, top: l.top,
          color: "rgba(120,140,180,0.7)", fontSize: 10, fontWeight: 600,
          pointerEvents: "none", letterSpacing: "0.5px", textTransform: "uppercase",
        }}>{l.text}</span>
      ))}

      {/* Pins */}
      {filtered.map((s, i) => {
        const pos = pinPositions[i] || { left: "50%", top: "50%" };
        const isSelected = selectedStation?.id === s.id;
        return (
          <div key={s.id} onClick={() => onSelectStation(s)} style={{
            position: "absolute", left: pos.left, top: pos.top,
            transform: "translate(-50%, -100%)", cursor: "pointer", zIndex: isSelected ? 10 : 5,
          }}>
            <div style={{
              width: isSelected ? 40 : 30, height: isSelected ? 52 : 40,
              background: isSelected
                ? "linear-gradient(160deg, #7c3aed, #3b82f6)"
                : "linear-gradient(160deg, #4f46e5, #2563eb)",
              borderRadius: "50% 50% 50% 50% / 55% 55% 45% 45%",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: isSelected
                ? "0 0 24px rgba(124,58,237,0.9), 0 4px 12px rgba(0,0,0,0.5)"
                : "0 0 12px rgba(79,70,229,0.6), 0 2px 8px rgba(0,0,0,0.4)",
              border: isSelected ? "2px solid rgba(255,255,255,0.35)" : "2px solid rgba(255,255,255,0.15)",
              transition: "all 0.2s",
            }}>
              <BoltIcon size={isSelected ? 16 : 13} color="white" />
            </div>
            {isSelected && (
              <div style={{
                position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
                width: 6, height: 6, borderRadius: "50%",
                background: "rgba(124,58,237,0.6)", boxShadow: "0 0 10px rgba(124,58,237,0.8)",
              }} />
            )}
          </div>
        );
      })}

      {/* Map controls */}
      <div style={{
        position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
        display: "flex", flexDirection: "column", gap: 3,
      }}>
        {["+", "−", <CrosshairIcon key="c" size={14} />].map((label, i) => (
          <button key={i} style={{
            width: 28, height: 28, background: "rgba(8,12,30,0.95)",
            border: "1px solid rgba(30,40,70,0.8)", color: "#8899bb", borderRadius: 6,
            cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          }}>{label}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Home({ onStartCharging }) {
  const [selectedStation, setSelectedStation] = useState(stations[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pulse, setPulse] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showIDModal, setShowIDModal] = useState(false);
  const [navActive, setNavActive] = useState("Home");
  const [selectedPlan, setSelectedPlan] = useState("Pro");
 useEffect(() => {

  const handleScroll = () => {

    const stations = document.getElementById("stations");
    const pricing = document.getElementById("pricing");
    const about = document.getElementById("about");

    const scrollY = window.scrollY;

    if (
      about &&
      scrollY >= about.offsetTop - 200
    ) {
      setNavActive("About");
    }

    else if (
      pricing &&
      scrollY >= pricing.offsetTop - 200
    ) {
      setNavActive("Pricing");
    }

    else if (
      stations &&
      scrollY >= stations.offsetTop - 200
    ) {
      setNavActive("Stations");
    }

    else {
      setNavActive("Home");
    }

  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };

}, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050714",
      color: "#fff",
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflowX: "hidden",
    }}>
      {/* ── Navbar ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 58,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(5,7,20,0.94)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
       position: "fixed",
                top: 0,
               left: 0,
              right: 0,
            zIndex: 9999,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            border: "1.5px solid #7c3aed",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(124,58,237,0.15)",
          }}>
            <BoltIcon size={14} color="#a78bfa" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.3px" }}>
            Charge<span style={{ color: "#7c3aed" }}>Flow</span>
          </span>
        </div>

        {/* Nav links */}
<div style={{ display: "flex", gap: 28, alignItems: "center" }}>
{["Home", "Stations", "About"].map(item => (

  <span
    key={item}

    onClick={() => {

      setNavActive(item);

      if (item === "About") {
        document
          .getElementById("about")
          ?.scrollIntoView({ behavior: "smooth" });
      }

      if (item === "Stations") {
        document
          .getElementById("stations")
          ?.scrollIntoView({ behavior: "smooth" });
      }

      if (item === "Home") {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        
      }
if (item === "Pricing") {
  document
    .getElementById("pricing")
    ?.scrollIntoView({ behavior: "smooth" });
}
    }}

    style={{
      cursor: "pointer",
      fontSize: 13.5,
      fontWeight: 500,
      color: navActive === item ? "#7c3aed" : "#94a3b8",
      borderBottom:
        navActive === item
          ? "2px solid #7c3aed"
          : "2px solid transparent",
      paddingBottom: 2,
      transition: "all 0.2s ease",
    }}
  >
    {item}
  </span>

))}
</div>

        {/* CTA */}
        <button onClick={onStartCharging} style={{
          padding: "8px 22px", borderRadius: 24,
          background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
          border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13.5,
          boxShadow: "0 0 20px rgba(124,58,237,0.35)", transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.target.style.boxShadow = "0 0 30px rgba(124,58,237,0.6)"; e.target.style.transform = "scale(1.03)"; }}
          onMouseLeave={e => { e.target.style.boxShadow = "0 0 20px rgba(124,58,237,0.35)"; e.target.style.transform = "scale(1)"; }}
        >Try Multi-Pass</button>
      </nav>

      {/* ── Hero ── */}
      <div style={{ position: "relative", height: 490, overflow: "hidden" }}>
        {/* bg.png as the real background */}
        <img
          src="/bg.png"
          alt=""
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center right",
            pointerEvents: "none",
          }}
        />

        {/* Left dark overlay so text is readable */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(5,7,20,0.97) 0%, rgba(5,7,20,0.88) 35%, rgba(5,7,20,0.55) 55%, rgba(5,7,20,0.1) 75%, transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* Bottom fade into page */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 110,
          background: "linear-gradient(to top, #050714 0%, transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* Hero content */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", padding: "0 52px",
        }}>
          <div style={{ maxWidth: 530 }}>
            {/* Headline */}
            <h1 style={{ margin: 0, lineHeight: 1.07 }}>
              <div style={{ fontSize: 58, fontWeight: 900, letterSpacing: "-2.5px", color: "#fff" }}>Settlement Infrastructure</div>
              <div style={{
                fontSize: 58, fontWeight: 900, letterSpacing: "-2.5px",
                background: "linear-gradient(135deg, #06b6d4 0%, #7c3aed 50%, #a855f7 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>For EV Charging.</div>
            </h1>

            <div style={{
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: 20,
  marginBottom: 30,
  flexWrap: "wrap"
}}>

  <span style={{
    padding: "6px 14px",
    borderRadius: 999,
    background: "rgba(34,211,238,0.08)",
    border: "1px solid rgba(34,211,238,0.2)",
    color: "#67e8f9",
    fontSize: 14
  }}>
    Connect
  </span>

  <span style={{ color: "rgba(255,255,255,0.3)" }}>→</span>

  <span style={{
    padding: "6px 14px",
    borderRadius: 999,
    background: "rgba(168,85,247,0.08)",
    border: "1px solid rgba(168,85,247,0.2)",
    color: "#d8b4fe",
    fontSize: 14
  }}>
    Escrow
  </span>

  <span style={{ color: "rgba(255,255,255,0.3)" }}>→</span>

  <span style={{
    padding: "6px 14px",
    borderRadius: 999,
    background: "rgba(59,130,246,0.08)",
    border: "1px solid rgba(59,130,246,0.2)",
    color: "#93c5fd",
    fontSize: 14
  }}>
    Charge
  </span>

  <span style={{ color: "rgba(255,255,255,0.3)" }}>→</span>
  
<span style={{
  padding: "6px 14px",
  borderRadius: 999,
  background: "rgba(40, 184, 232, 0.34)",
  border: "1px solid rgba(16, 111, 220, 0.81)",
  color: "#cbd5e1",
  fontSize: 14
}}>
  Settle
</span>
</div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={onStartCharging} style={{
                padding: "12px 26px", borderRadius: 12,
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                border: "none", color: "#fff", fontWeight: 700, cursor: "pointer",
                fontSize: 14.5, display: "flex", alignItems: "center", gap: 8,
                boxShadow: "0 0 32px rgba(124,58,237,0.45)", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 44px rgba(124,58,237,0.7)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 32px rgba(124,58,237,0.45)"; }}
              >
                <BoltIcon size={15} color="white" /> Launch Demo
              </button>
              <button style={{
                padding: "12px 26px", borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "#e2e8f0", fontWeight: 600, cursor: "pointer", fontSize: 14.5,
                display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
              >
                <PlayIcon size={12} /> Watch Demo
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 26, marginTop: 32 }}>
              {[
                { icon: <BoltIcon size={17} color="#7c3aed" />, val: "Cross-border", label: "Stablecoin Settlement" },
                { icon: <ClockIcon size={17} />, val: "Real-time", label: "Escrow Engine" },
                { icon: <TimerIcon size={17} />, val: "OCPP", label: "Compatible" },
                { icon: <ShieldIcon size={17} />, val: "Multi-operator", label: "Infrastructure" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#64748b", display: "flex" }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, letterSpacing: "-0.3px" }}>{s.val}</div>
                    <div style={{ color: "#64748b", fontSize: 11.5, marginTop: 1 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Charging Card */}
          <div style={{
            position: "absolute", right: 44, top: "50%", transform: "translateY(-50%)",
            width: 256,
            background: "rgba(6,8,24,0.88)",
            borderRadius: 18, border: "1px solid rgba(124,58,237,0.28)",
            padding: "20px",
            backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 0 50px rgba(124,58,237,0.18), 0 20px 40px rgba(0,0,0,0.5)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: 14.5, letterSpacing: "-0.3px" }}>Live Charging</span>
              <div style={{
                width: 9, height: 9, borderRadius: "50%", background: "#22c55e",
                boxShadow: `0 0 ${pulse ? "10px" : "5px"} #22c55e, 0 0 ${pulse ? "20px" : "8px"} rgba(34,197,94,0.4)`,
                transition: "box-shadow 0.6s ease",
              }} />
            </div>
            <div style={{ color: "#475569", fontSize: 12, marginBottom: 18 }}>Charging in progress</div>

            <div style={{ color: "#06b6d4", fontSize: 40, fontWeight: 900, lineHeight: 1, letterSpacing: "-1.5px" }}>0.52 kWh</div>
            <div style={{ color: "#475569", fontSize: 12.5, marginBottom: 18, marginTop: 3 }}>Rp 1.248</div>

            {/* Progress bar */}
            <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, marginBottom: 14, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: "35%", borderRadius: 3,
                background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
                boxShadow: "0 0 8px rgba(6,182,212,0.4)",
              }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 18 }}>
              <div>
                <div style={{ color: "#475569", marginBottom: 3 }}>Used</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>0.077 USDC</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#475569", marginBottom: 3 }}>Est. Refund</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#22c55e" }}>3.06 USDC</div>
              </div>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569",
              paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)",
            }}>
              <WalletIcon size={13} /> Wallet: Connected
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Panel ── */}
   {/* ── Bottom Panel ── */}
<div
  id="stations"
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 370px",
    gap: 0,
    padding: "0 20px 20px",
    background: "#050714"
  }}
>

        {/* Map section */}
        <div style={{
          background: "rgba(6,8,24,0.98)", borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.07)",
          margin: "14px 8px 0 0", overflow: "hidden",
        }}>
          <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 11 }}>
              <LocationIcon size={15} color="#94a3b8" />
              <span style={{ fontWeight: 700, fontSize: 14.5, letterSpacing: "-0.3px" }}>Unified Charging Network</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search location..."
                style={{
                  flex: 1, padding: "8px 13px", borderRadius: 8, fontSize: 13,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                  color: "#e2e8f0", outline: "none",
                }}
              />
              <button style={{
                width: 36, height: 36, borderRadius: 8,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FilterIcon />
              </button>
            </div>
          </div>

          <div style={{ height: 248 }}>
            <MapView selectedStation={selectedStation} onSelectStation={setSelectedStation} searchQuery={searchQuery} />
          </div>

          {selectedStation && (
            <div style={{
              padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{
                    padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: "rgba(6,182,212,0.12)", color: "#06b6d4",
                    border: "1px solid rgba(6,182,212,0.25)",
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <BoltIcon size={9} color="#06b6d4" /> {selectedStation.type}
                  </span>
                  <span style={{
                    padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: "rgba(6,182,212,0.08)", color: "#06b6d4",
                  }}>Fast Charging</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 5, letterSpacing: "-0.4px" }}>{selectedStation.name}</div>
                <div style={{ display: "flex", gap: 10, fontSize: 12.5, color: "#64748b", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <StarIcon size={11} /> {selectedStation.rating}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <LocationIcon size={11} /> {selectedStation.distance} away
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <BoltIcon size={10} color="#64748b" /> {selectedStation.power}
                  </span>
                  <span style={{
                    display: "flex", alignItems: "center", gap: 4,
                    color: selectedStation.status === "Available" ? "#22c55e" : "#f59e0b", fontWeight: 600,
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: selectedStation.status === "Available" ? "#22c55e" : "#f59e0b",
                      display: "inline-block",
                    }} />
                    {selectedStation.status}
                  </span>
                </div>
              </div>
              <button onClick={onStartCharging} style={{
                padding: "10px 22px", borderRadius: 24,
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13.5,
                boxShadow: "0 0 18px rgba(124,58,237,0.35)", whiteSpace: "nowrap", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 0 26px rgba(124,58,237,0.55)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 18px rgba(124,58,237,0.35)"; }}
              >Launch Demo</button>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ margin: "14px 0 0 8px", display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Quick Access */}
          <div style={{
            background: "rgba(6,8,24,0.98)", borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.07)", padding: "15px",
          }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 12, letterSpacing: "-0.3px" }}>Quick Access</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: <QRIcon size={22} />, title: "Scan QR", sub: "Connect to any supported charger", onClick: () => setShowQRModal(true) },
                { icon: <KeyboardIcon size={22} />, title: "Enter Charger ID", sub: "Direct access to operator stations", onClick: () => setShowIDModal(true) },
              ].map(item => (
                <button key={item.title} onClick={item.onClick} style={{
                  padding: "14px 12px", borderRadius: 11, textAlign: "left",
                  background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                  color: "#fff", cursor: "pointer", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.09)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.28)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                >
                  <div style={{ color: "#7c3aed", marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: "-0.3px" }}>{item.title}</div>
                  <div style={{ color: "#475569", fontSize: 11.5, marginTop: 3 }}>{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
<div style={{
  background: "rgba(6,8,24,0.98)", borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.07)", padding: "15px", flex: 1,
}}>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
    <span style={{ fontWeight: 700, fontSize: 14.5, letterSpacing: "-0.3px" }}>Recent Sessions</span>
    <span style={{ color: "#7c3aed", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>View All</span>
  </div>

  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
    {recentSessions.map((s, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 11px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.055)",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(124,58,237,0.07)";
          e.currentTarget.style.borderColor = "rgba(124,58,237,0.18)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.025)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.055)";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 33,
            height: 33,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.25))",
            border: "1px solid rgba(124,58,237,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <BoltIcon size={14} color="#a78bfa" />
          </div>

          <div>
            <div style={{
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "-0.3px"
            }}>
              {s.location}
            </div>

            <div style={{
              color: "#475569",
              fontSize: 11.5,
              marginTop: 2
            }}>
              {s.time}
            </div>

            <div style={{
              color: "#22c55e",
              fontSize: 11,
              marginTop: 3,
              fontWeight: 500,
            }}>
              {s.status}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>
              {s.kwh}
            </div>

            <div style={{
              color: "#475569",
              fontSize: 11.5,
              marginTop: 2
            }}>
              {s.price}
            </div>
          </div>

          <span style={{ color: "#475569", display: "flex" }}>
            <ChevronRight size={14} />
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
        </div>
      </div>

      {/* ── Feature Cards ── */}
      <div style={{
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: 26,
  padding: "0 34px 40px"
}}>
        {[
          { icon: <BoltIcon size={20} color="#7c3aed" />, title: "Streaming Settlement", sub: "Dynamic payment flow per-kWh", color: "#7c3aed" },
          { icon: <RefreshIcon size={20} />, title: "Smart Escrow", sub: "Automatic refund distribution", color: "#06b6d4" },
          { icon: <CreditCardIcon size={20} />, title: "Cross-border Settlement", sub: "Stablecoin-powered payment rails", color: "#a855f7" },
          { icon: <GlobeIcon size={20} />, title: "Operator Interoperability", sub: "Compatible across charging networks", color: "#3b82f6" },
        ].map(f => (
          <div key={f.title} style={{
            padding: "16px 18px", borderRadius: 13,
            background: "rgba(6,8,24,0.98)", border: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", gap: 13,
            cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + "38"; e.currentTarget.style.background = f.color + "08"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(6,8,24,0.98)"; }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 11, flexShrink: 0,
              background: f.color + "18", border: `1px solid ${f.color}30`,
              display: "flex", alignItems: "center", justifyContent: "center", color: f.color,
            }}>{f.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5, letterSpacing: "-0.3px" }}>{f.title}</div>
              <div style={{ color: "#475569", fontSize: 12, marginTop: 3 }}>{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── QR Modal ── */}
      {showQRModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        }} onClick={() => setShowQRModal(false)}>
          <div style={{
            background: "#090b1e", border: "1px solid rgba(124,58,237,0.35)",
            borderRadius: 20, padding: "30px 28px", width: 310, textAlign: "center",
            boxShadow: "0 0 50px rgba(124,58,237,0.2), 0 30px 60px rgba(0,0,0,0.6)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 800, fontSize: 17.5, marginBottom: 8 }}>Scan QR Code</div>
            <p style={{ color: "#475569", fontSize: 13, marginBottom: 22, lineHeight: 1.5 }}>
              Point your camera at the QR code on the charger
            </p>
            <div style={{
              width: 170, height: 170, margin: "0 auto 22px",
              background: "rgba(124,58,237,0.08)", border: "2px dashed rgba(124,58,237,0.35)",
              borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44,
            }}>📷</div>
            <button onClick={() => { setShowQRModal(false); onStartCharging(); }} style={{
              width: "100%", padding: 13, borderRadius: 11,
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14,
            }}>Simulate Scan</button>
            <button onClick={() => setShowQRModal(false)} style={{
              width: "100%", padding: 11, borderRadius: 11, marginTop: 8,
              background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8", cursor: "pointer", fontSize: 13,
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Charger ID Modal ── */}
      {showIDModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        }} onClick={() => setShowIDModal(false)}>
          <div style={{
            background: "#090b1e", border: "1px solid rgba(124,58,237,0.35)",
            borderRadius: 20, padding: "30px 28px", width: 330,
            boxShadow: "0 0 50px rgba(124,58,237,0.2), 0 30px 60px rgba(0,0,0,0.6)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 800, fontSize: 17.5, marginBottom: 8 }}>Enter Charger ID</div>
            <p style={{ color: "#475569", fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>
              Enter the ID displayed on the charger unit
            </p>
            <input
              placeholder="e.g. CF-SCBD-001"
              defaultValue="CF-SCBD-001"
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 14,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.28)",
                color: "#e2e8f0", outline: "none", marginBottom: 16,
                boxSizing: "border-box",
              }}
            />
            <button onClick={() => { setShowIDModal(false); onStartCharging(); }} style={{
              width: "100%", padding: 13, borderRadius: 11,
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14,
            }}>Connect &amp; Charge</button>
            <button onClick={() => setShowIDModal(false)} style={{
              width: "100%", padding: 11, borderRadius: 11, marginTop: 8,
              background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8", cursor: "pointer", fontSize: 13,
            }}>Cancel</button>
          </div>
        </div>
      )}
     

     {/* ================= ABOUT SECTION ================= */}
<div
  id="about"
  className="px-10 py-32 relative overflow-hidden"
>

  {/* BG GLOW */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2
  w-[700px] h-[700px]
  bg-cyan-500/10 blur-[180px] rounded-full" />

  <div className="relative z-10 max-w-none">

    <p className="text-cyan-400 font-semibold tracking-[0.2em] uppercase text-sm mb-6">
      About ChargeFlow
    </p>

    <h2 className="text-6xl font-black leading-[0.95] tracking-tight mb-8">
      Infrastructure Layer
      <br />
      For EV Payments.
    </h2>

    <p className="text-gray-400 text-lg leading-9 max-w-5xl">
      ChargeFlow is building a unified settlement and payment infrastructure
      for electric vehicle charging networks across Southeast Asia.
      Instead of replacing existing operators, ChargeFlow connects fragmented
      charging ecosystems into one interoperable payment layer using
      real-time settlement architecture, smart escrow systems, and
      cross-border stablecoin infrastructure.
    </p>

    {/* FEATURE GRID */}
    <div className="grid grid-cols-3 gap-6 mt-20">

      {/* CARD 1 */}
      <div className="p-8 rounded-3xl
      bg-white/5 border border-white/10
      backdrop-blur-xl">

        <h3 className="text-2xl font-bold mb-4">
          Real-time Settlement
        </h3>

        <p className="text-gray-400 leading-8">
          Stream charging payments dynamically per-kWh
          with instant escrow settlement and automatic
          refund distribution.
        </p>

      </div>

      {/* CARD 2 */}
      <div className="p-8 rounded-3xl
      bg-white/5 border border-white/10
      backdrop-blur-xl">

        <h3 className="text-2xl font-bold mb-4">
          Cross-border Ready
        </h3>

        <p className="text-gray-400 leading-8">
          Built on stablecoin infrastructure to enable
          seamless EV charging payments across multiple
          Southeast Asian markets.
        </p>

      </div>

      {/* CARD 3 */}
      <div className="p-8 rounded-3xl
      bg-white/5 border border-white/10
      backdrop-blur-xl">

        <h3 className="text-2xl font-bold mb-4">
          Charger Interoperability
        </h3>

        <p className="text-gray-400 leading-8">
          Compatible with existing charging infrastructure
          and designed to support multi-operator EV ecosystems
          without hardware replacement.
        </p>

      </div>

    </div>

    {/* BOTTOM METRICS */}
    <div className="grid grid-cols-4 gap-6 mt-20">

      {[
        {
          value: "Real-time",
          label: "Settlement Engine"
        },
        {
          value: "Cross-border",
          label: "Stablecoin Payments"
        },
        {
          value: "OCPP Ready",
          label: "Infrastructure Compatible"
        },
        {
          value: "SEA Focused",
          label: "Regional EV Expansion"
        }
      ].map((item) => (

        <div
          key={item.label}
          className="p-6 rounded-2xl
          bg-white/5 border border-white/10"
        >

          <div className="text-2xl font-black
          text-cyan-400 mb-2">
            {item.value}
          </div>

          <div className="text-gray-500 text-sm">
            {item.label}
          </div>

        </div>

      ))}

    </div>

  </div>

</div>
</div>

  );
}