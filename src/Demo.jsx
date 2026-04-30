// --- IMPORT (SAMA PERSIS PUNYA KAMU) ---
import { useEffect, useState } from "react";
 import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction
} from "@solana/web3.js";

import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction
} from "@solana/spl-token";

import {
  Zap,
  CreditCard,
  CheckCircle,
  Wallet,
  Landmark
} from "lucide-react";

import { useNavigate } from "react-router-dom";

/* ================= WEB3 ================= */

const USDC_MINT = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

// 🔴 GANTI WALLET INI
let RECEIVER;

try {
 RECEIVER = new PublicKey(
  "HEC7zBuCKG55Z7g8qerXvn823wFeA1VhcENoRM4dJ3qA"
);
} catch {
  console.error("Invalid wallet address");
}

const sendUSDC = async (provider, amount) => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const sender = provider.publicKey;

  const fromTokenAccount = await getAssociatedTokenAddress(
    USDC_MINT,
    sender
  );

  const toTokenAccount = await getAssociatedTokenAddress(
    USDC_MINT,
    RECEIVER
  );

  const instructions = [];

  const toAccountInfo = await connection.getAccountInfo(toTokenAccount);

  if (!toAccountInfo) {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        sender,
        toTokenAccount,
        RECEIVER,
        USDC_MINT
      )
    );
  }

  instructions.push(
    createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      sender,
      Math.floor(amount * 1_000_000)
    )
  );

  const tx = new Transaction().add(...instructions);

  tx.feePayer = sender;
  tx.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  const signed = await provider.signTransaction(tx);
  const signature = await connection.sendRawTransaction(signed.serialize());

  await connection.confirmTransaction(signature);

  return signature;
};

/* ================= COMPONENT ================= */

export default function Demo() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(null);

  const [battery, setBattery] = useState(() => Math.floor(Math.random()*40)+20);
  const [targetBattery, setTargetBattery] = useState(80);

  const [kwh, setKwh] = useState(0);
  const [cost, setCost] = useState(0);

  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const [escrow, setEscrow] = useState(0);
  const [charging, setCharging] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [refundValue, setRefundValue] = useState("");
  const disconnectWallet = async () => {
  const provider = getProvider();
  

  if (provider?.isConnected) {
    await provider.disconnect();
  }

  setWalletConnected(false);
  setWalletAddress("");
  setMethod(null); // optional biar reset pilihan payment
};

  const [txStatus, setTxStatus] = useState("idle");

  const price = 2500;
  const capacity = 50;

const [mode, setMode] = useState("auto");
const [amount, setAmount] = useState(5000);

const short = walletAddress
  ? walletAddress.slice(0,4)+"..."+walletAddress.slice(-4)
  : "";
  const getProvider = () => window?.phantom?.solana;

  const connectWallet = async () => {
    const provider = getProvider();
    const res = await provider.connect();
    setWalletConnected(true);
    setWalletAddress(res.publicKey.toString());
  };

  const safeTarget = Math.max(targetBattery, battery);
  const needed = ((safeTarget - battery) / 100) * capacity;
  const total = needed * price;

  const startCharging = async () => {
    if (!method) {
      setRefundValue("Pilih metode dulu");
      setShowPopup(true);
      return;
    }

    if (!walletConnected) {
      setRefundValue("Connect wallet dulu");
      setShowPopup(true);
      return;
    }

    try {
      const provider = getProvider();
      setTxStatus("pending");

      const escrowAmount = total / 15500;

      await sendUSDC(provider, escrowAmount);

      setEscrow(escrowAmount);
      setTxStatus("success");

      setCharging(true);
      setStep(3);

    } catch (err) {
  console.error("ERROR FULL:", err);

  let message = "Transaksi gagal";

  // ❌ saldo tidak cukup
  if (err.message?.includes("insufficient funds")) {
    message = "Saldo USDC tidak cukup";
  }

  // ❌ ATA belum ada
  else if (err.message?.includes("TokenAccountNotFoundError")) {
    message = "Wallet belum siap (USDC belum pernah diterima)";
  }

  // ❌ invalid account
  else if (err.message?.includes("invalid account data")) {
    message = "Error akun token (coba refresh / ganti wallet)";
  }

  // ❌ user cancel
  else if (err.message?.includes("User rejected")) {
    message = "Transaksi dibatalkan user";
  }

  // ❌ fallback
  else if (err.message) {
    message = err.message;
  }

  setRefundValue(message);
  setShowPopup(true);
}
  };

  useEffect(() => {
    if (!charging) return;

    const i = setInterval(() => {
      setBattery(b => {
        const next = b + 1;

        if (next >= safeTarget) {
          clearInterval(i);

          const used = (kwh * price) / 15500;
          const refund = escrow - used;

          setRefundValue(`Refund ${Math.max(refund,0).toFixed(3)} USDC`);
          setShowPopup(true);

          setStep(4);
          setCharging(false);
        }

        return next;
      });

      setKwh(k => +(k + 0.25).toFixed(2));
      setCost(c => c + 600);

    }, 600);

    return () => clearInterval(i);
  }, [charging, kwh, escrow]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-[360px]">
   
        {/* STEP 1 🔥 CAMERA DEMO */}
        {step===1 && (
          <>
            <h2 className="text-center mb-4">Scan Charger</h2>

            <div className="relative w-[260px] h-[260px] bg-black rounded-xl mx-auto overflow-hidden flex items-center justify-center">

              {/* fake camera grid */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 border border-white/10">
                {[...Array(9)].map((_,i)=>(
                  <div key={i} className="border border-white/10"/>
                ))}
              </div>

              {/* scan line */}
              <div className="absolute w-full h-[2px] bg-cyan-400 animate-pulse"/>

              <p className="text-gray-400 text-sm z-10">
                Camera Preview
              </p>
            </div>

            <button
              onClick={()=>setStep(2)}
              className="mt-6 w-full py-3 bg-cyan-500 rounded-xl"
            >
              Simulate Scan
            </button>
          </>
        )}

    
        {/* STEP 2 */}
{step===2 && (
  <>
    <h2 className="text-center mb-6 flex justify-center gap-2 text-lg font-semibold">
      <CreditCard className="text-cyan-400"/> Payment
    </h2>

    {/* MODE SWITCH */}
    <div className="flex bg-white/5 rounded-2xl p-1 mb-6 backdrop-blur-xl border border-white/10">
      <button
        onClick={()=>setMode("auto")}
        className={`flex-1 py-2 rounded-xl transition 
        ${mode==="auto"
          ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg"
          : "text-gray-400"
        }`}
      >
        Auto
      </button>

      <button
        onClick={()=>setMode("manual")}
        className={`flex-1 py-2 rounded-xl transition 
        ${mode==="manual"
          ? "bg-gradient-to-r from-purple-400 to-pink-500 text-black shadow-lg"
          : "text-gray-400"
        }`}
      >
        IDR
      </button>
    </div>

    {/* SLIDER */}
    {mode==="auto" && (
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2 text-gray-400">
          <span>{battery}%</span>
          <span>{targetBattery}%</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={targetBattery}
          onChange={(e)=>setTargetBattery(+e.target.value)}
          className="w-full accent-cyan-400"
        />
      </div>
    )}

    {/* IDR INPUT PREMIUM */}
{mode==="manual" && (
  <div className="mb-6">

    {/* INPUT */}
    <div className="relative">

      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        Rp
      </span>

      <input
        value={amount.toLocaleString("id-ID")}
        onChange={(e)=>{
          const raw = e.target.value.replace(/\D/g,"");
          setAmount(Number(raw));
        }}
        className="w-full pl-12 pr-4 py-4 text-2xl font-semibold tracking-wide
        bg-black/40 rounded-2xl border border-white/10 text-white text-center
        focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20
        transition"
      />

    </div>

    {/* QUICK SELECT */}
    <div className="grid grid-cols-3 gap-2 mt-3">

      {[5000,10000,20000].map((val)=>(
        <button
          key={val}
          onClick={()=>setAmount(val)}
          className={`py-2 rounded-xl text-sm transition
          ${amount===val
            ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black"
            : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          Rp {val.toLocaleString("id-ID")}
        </button>
      ))}

    </div>

  </div>
)}

    {/* PAYMENT METHODS */}
    <div className="space-y-3 mb-6">

      {/* WALLET */}
      <button
   onClick={()=>{
  if (walletConnected) {
    disconnectWallet();
  } else {
    connectWallet();
    setMethod("wallet");
  }
}}
        className={`w-full p-4 rounded-2xl flex items-center justify-between border transition
        ${method==="wallet"
          ? "border-cyan-400 bg-white/10 shadow-lg"
          : "border-white/10 hover:bg-white/5"
        }`}
      >
        <div className="flex items-center gap-3">
          <Wallet size={18} className="text-cyan-400"/>
          <span>
  {walletConnected ? `Disconnect (${short})` : "Connect Wallet"}
</span>
        </div>
        {method==="wallet" && <span className="text-cyan-400">●</span>}
      </button>

      {/* QRIS */}
      <button
        onClick={()=>setMethod("qris")}
        className={`w-full p-4 rounded-2xl flex items-center justify-between border transition
        ${method==="qris"
          ? "border-cyan-400 bg-white/10 shadow-lg"
          : "border-white/10 hover:bg-white/5"
        }`}
      >
        <span>QRIS</span>
        {method==="qris" && <span className="text-cyan-400">●</span>}
      </button>

      {/* BANK */}
      <button
        onClick={()=>setMethod("bank")}
        className={`w-full p-4 rounded-2xl flex items-center justify-between border transition
        ${method==="bank"
          ? "border-cyan-400 bg-white/10 shadow-lg"
          : "border-white/10 hover:bg-white/5"
        }`}
      >
        <div className="flex items-center gap-3">
          <Landmark size={18}/>
          <span>Bank Transfer</span>
        </div>
        {method==="bank" && <span className="text-cyan-400">●</span>}
      </button>

    </div>

    {/* SUMMARY */}
    <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10 backdrop-blur-xl">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">kWh</span>
        <span>{needed.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span className="text-gray-400">Cost</span>
        <span>Rp {total}</span>
      </div>
      <div className="flex justify-between text-sm mt-1 text-cyan-400">
        <span>Escrow</span>
        <span>{(total/15500).toFixed(3)} USDC</span>
      </div>
    </div>

    {/* START BUTTON */}
    <button
      onClick={startCharging}
      className="w-full py-4 rounded-full font-semibold text-black 
      bg-gradient-to-r from-purple-500 to-cyan-400 
      hover:scale-105 transition shadow-lg flex items-center justify-center gap-2"
    >
      <Zap size={16}/> Start Charging
    </button>
  </>
)}
        {/* STEP 3 */}
{step===3 && (
  <div className="text-center">

    {/* ICON GLOW */}
    <div className="mb-4 flex justify-center">
      <div className="w-16 h-16 flex items-center justify-center rounded-full 
        bg-gradient-to-r from-cyan-400/20 to-purple-500/20 
        shadow-[0_0_40px_rgba(34,211,238,0.4)] animate-pulse">
        <Zap className="text-cyan-400" size={28}/>
      </div>
    </div>

    {/* ENERGY NUMBER */}
    <h1 className="text-5xl font-bold tracking-tight animate-pulse">
      {kwh} kWh
    </h1>

    <p className="text-gray-400 mt-1">
      Rp {cost}
    </p>

    {/* STATUS */}
   <div className="flex items-center justify-center gap-2 mt-3 text-cyan-400">

  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"/>

  <span className="text-sm tracking-wide">
    Charging in progress...
  </span>

</div>
    {/* PROGRESS BAR PREMIUM */}
    <div className="mt-6 relative">

      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full 
          bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
          animate-[pulse_2s_infinite]"
          style={{ width: `${(battery/targetBattery)*100}%` }}
        />
      </div>

      {/* GLOW OVERLAY */}
      <div
        className="absolute top-0 h-3 rounded-full blur-md opacity-60
        bg-gradient-to-r from-cyan-400 to-purple-500"
        style={{ width: `${(battery/targetBattery)*100}%` }}
      />

    </div>

    {/* PERCENT */}
    <p className="text-xs text-gray-400 mt-3">
      {battery}% / {targetBattery}%
    </p>

  </div>
)}

        {/* STEP 4 🔥 DONE FIX */}
    {/* STEP 4 💎 ULTRA FINISH */}
{step===4 && (
  <div className="text-center relative">

    {/* GLOW BACKGROUND */}
    <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
      <div className="w-40 h-40 bg-green-400/20 blur-3xl rounded-full animate-pulse"/>
    </div>

    {/* ICON */}
    <div className="relative flex justify-center mb-4">
      <div className="w-20 h-20 rounded-full flex items-center justify-center
        bg-gradient-to-br from-green-400/20 to-emerald-500/20
        shadow-[0_0_60px_rgba(34,197,94,0.6)]">

        <CheckCircle size={40} className="text-green-400 animate-[scaleIn_0.4s_ease]"/>
      </div>
    </div>

    {/* TITLE */}
    <h2 className="text-3xl font-bold text-green-400 tracking-tight">
      Charging Complete
    </h2>

    <p className="text-gray-400 text-sm mt-1">
      Energy delivered successfully ⚡
    </p>

    {/* SUMMARY GLASS */}
    <div className="mt-6 bg-gradient-to-br from-white/5 to-white/0 
      border border-white/10 rounded-2xl p-5 backdrop-blur-xl
      shadow-[0_0_30px_rgba(255,255,255,0.05)]">

      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Energy</span>
        <span className="font-semibold">{kwh} kWh</span>
      </div>

      <div className="flex justify-between text-sm mt-3">
        <span className="text-gray-400">Total Cost</span>
        <span className="font-semibold">Rp {cost}</span>
      </div>

      <div className="flex justify-between text-sm mt-3 text-cyan-400">
        <span>Escrow Used</span>
        <span className="font-semibold">
          {((kwh * 2500)/15500).toFixed(3)} USDC
        </span>
      </div>

    </div>

    {/* BUTTON */}
    <div className="mt-6 space-y-3">

      <button
        onClick={()=>navigate("/")}
        className="w-full py-4 rounded-full font-semibold text-black
        bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
        hover:scale-105 active:scale-95 transition-all duration-200
        shadow-[0_10px_40px_rgba(34,211,238,0.4)]"
      >
        Back to Home
      </button>

      <button
        onClick={()=>{
          setStep(1);
          setKwh(0);
          setCost(0);
        }}
        className="text-gray-400 text-sm hover:text-white transition"
      >
        Start New Session
      </button>

    </div>

  </div>
)}
{showPopup && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-[300px] text-center">

      <p className="text-white font-semibold">
        {refundValue}
      </p>

      <button
        onClick={()=>setShowPopup(false)}
        className="mt-4 w-full py-2 bg-cyan-400 text-black rounded-xl"
      >
        OK
      </button>

    </div>

  </div>
)}
      </div>
    </div>
  );
}