// --- IMPORT (SAMA PERSIS PUNYA KAMU) ---
import { useEffect, useState } from "react";
 import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
 import { AlertTriangle, X, Power } from "lucide-react";
 import bs58 from "bs58";
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
const ESCROW_WALLET = new PublicKey(
  "HEC7zBuCKG55Z7g8qerXvn823wFeA1VhcENoRM4dJ3qA"
);

const sendUSDC = async (provider, amount) => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const sender = provider.publicKey;

  const fromTokenAccount = await getAssociatedTokenAddress(
    USDC_MINT,
    sender
  );

  const toTokenAccount = await getAssociatedTokenAddress(
    USDC_MINT,
    ESCROW_WALLET
  );

  const instructions = [];

  const toAccountInfo = await connection.getAccountInfo(toTokenAccount);

  if (!toAccountInfo) {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        sender,
        toTokenAccount,
        ESCROW_WALLET,
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
  const [charging, setCharging] = useState(false);

  // ✅ TARO DI SINI
 const stopCharging = () => {

  setStopping(true);

  setTimeout(async () => {

    const used =
  Math.min(
    (kwh * price) / 15500,
    escrow
  );

const refund =
  Math.max(
    escrow - used,
    0
  );
   
    await fetch(
      "http://127.0.0.1:8080/api/v1/charging/stop",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization:
            `Bearer ${localStorage.getItem("token")}`
        },

        body: JSON.stringify({

  wallet_address:
    walletAddress,

  used_amount:
    used,

  refund_amount:
    refund
})

      }
    );

    setCharging(false);

    setRefundValue(`Refund ${Math.max(refund, 0).toFixed(3)} USDC`);
    setShowPopup(true);

    setStep(4);
    setStopping(false);
  }, 800); // biar ada feel loading dikit
};

  useEffect(() => {
    
  }, []);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(null);
  const [showStopModal, setShowStopModal] = useState(false);

  const [battery, setBattery] = useState(() => Math.floor(Math.random()*40)+20);
  const [targetBattery, setTargetBattery] = useState(80);

  const [kwh, setKwh] = useState(0);
  const [cost, setCost] = useState(0);

  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(0);
const [usdcBalance, setUsdcBalance] = useState(0);
  

const fetchBalance = async (pubkey) => {
  const connection = new Connection(clusterApiUrl("devnet"));

  const lamports = await connection.getBalance(pubkey);
  const sol = lamports / 1_000_000_000;

  setBalance(sol.toFixed(2));
};

// 🔥 TARO DI SINI
const fetchUSDC = async (pubkey) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"));

    const ata = await getAssociatedTokenAddress(
      USDC_MINT,
      pubkey
    );

    const acc = await connection.getTokenAccountBalance(ata);

    setUsdcBalance(acc.value.uiAmount || 0);
  } catch {
    setUsdcBalance(0);
  }
};
const [stopping, setStopping] = useState(false);

  const [escrow, setEscrow] = useState(0);
  const [showQR, setShowQR] = useState(false);

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

  setWalletAddress(
    res.publicKey.toString()
  );

  fetchBalance(res.publicKey);

  // 🔥 GET NONCE
  const nonceRes = await fetch(
    "http://127.0.0.1:8080/api/v1/auth/nonce"
  );

  const nonce = await nonceRes.text();

  // 🔥 SIGN MESSAGE
  const encodedMessage =
    new TextEncoder().encode(nonce);

  const signedMessage =
    await provider.signMessage(
      encodedMessage,
      "utf8"
    );

  // 🔥 SEND VERIFY
  const verifyRes = await fetch(
    "http://127.0.0.1:8080/api/v1/auth/verify",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        wallet:
          provider.publicKey.toString(),

        signature:
          bs58.encode(
            signedMessage.signature
          ),

        nonce
      })
    }
  );

  // 🔥 GET JWT
  const data = await verifyRes.json();

  console.log(data.token);

  // 🔥 SAVE JWT
  localStorage.setItem(
    "token",
    data.token
  );
  const profileRes = await fetch(
  "http://127.0.0.1:8080/api/v1/auth/profile",
  {
    headers: {
      Authorization:
        `Bearer ${data.token}`
    }
  }
);

const profileData =
  await profileRes.text();

console.log(profileData);
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

  if (method === "qris") {
    setShowQR(true);
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

    // 🔥 SEND USDC
    await sendUSDC(
      provider,
      escrowAmount
    );

    fetchBalance(provider.publicKey);

    fetchUSDC(provider.publicKey);

    // 🔥 SAVE SESSION TO BACKEND
    console.log("CALLING START API");
    await fetch(
      "http://127.0.0.1:8080/api/v1/charging/start",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization:
            `Bearer ${localStorage.getItem("token")}`
        },

        body: JSON.stringify({

          wallet_address:
            provider.publicKey.toString(),

          charger_id:
            "CHARGER-001",

          escrow_amount:
            escrowAmount
        })
      }
    );

    setEscrow(escrowAmount);

    setTxStatus("success");

    setCharging(true);

    setStep(3);

  } catch (err) {

    console.error("ERROR FULL:", err);

    let message = "Transaksi gagal";

    if (err.message?.includes("insufficient funds")) {
      message = "Saldo USDC tidak cukup";
    }

    else if (
      err.message?.includes(
        "TokenAccountNotFoundError"
      )
    ) {
      message =
        "Wallet belum siap";
    }

    else if (
      err.message?.includes(
        "invalid account data"
      )
    ) {
      message =
        "Error akun token";
    }

    else if (
      err.message?.includes(
        "User rejected"
      )
    ) {
      message =
        "Transaksi dibatalkan";
    }

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

        stopCharging();
      }

      return next;
    });

    setKwh(k => +(k + 0.25).toFixed(2));

    setCost(c => c + 600);

  }, 600);

  return () => clearInterval(i);

}, [charging, kwh, escrow]);

  useEffect(() => {
  if (!walletConnected) return;

  const interval = setInterval(() => {
    const provider = getProvider();
    if (provider?.publicKey) {
      fetchBalance(provider.publicKey);
      fetchUSDC(provider.publicKey);
    }
  }, 5000);

  return () => clearInterval(interval);
}, [walletConnected]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-[360px]">
        
        {showQR && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="bg-[#0f172a] p-6 rounded-2xl text-center">

      <h2 className="mb-4">Scan QRIS</h2>

      <img
        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=chargeflow-demo"
        className="mx-auto"
      />

      <p className="text-gray-400 text-sm mt-3">
        Bayar untuk melanjutkan charging
      </p>

      <button
        onClick={()=>{
          setShowQR(false);
          setStep(3);
          setCharging(true);
        }}
        className="mt-4 w-full py-2 bg-cyan-400 text-black rounded-xl"
      >
        Simulate Paid
      </button>

    </div>
  </div>
)}
          {/* 🔥 STEP INDICATOR TARO DI SINI */}
      <div className="flex justify-center gap-6 text-sm mb-6">
        {["scan", "connect & Pay", "Charging"].map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 ${
              step === i + 1 ? "text-cyan-400" : "text-gray-500"
            }`}
          >
            <div className="w-6 h-6 rounded-full border flex items-center justify-center">
              {i + 1}
            </div>
            {s}
          </div>
        ))}
      </div>

   
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
    {/* 🔥 WALLET PANEL TARO DI SINI */}
    {walletConnected && (
      <div className="bg-white/5 p-3 rounded-xl mb-4 border border-white/10">
        <p className="text-xs text-gray-400">Wallet</p>
        <p className="font-semibold">{short}</p>

        <div className="flex justify-between text-sm mt-2">
          <span>{balance} SOL</span>
          <span>{usdcBalance} USDC</span>
        </div>
      </div>
    )}


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
  {walletConnected
    ? `Disconnect (${short}) • ${balance} SOL`
    : "Connect Wallet"}
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
{step === 3 && (
  <div className="text-center">

    {/* ICON */}
    <div className="mb-4 flex justify-center">
      <div className="w-16 h-16 flex items-center justify-center rounded-full 
        bg-gradient-to-r from-cyan-400/20 to-purple-500/20 
        shadow-[0_0_40px_rgba(34,211,238,0.4)] animate-pulse">
        <Zap className="text-cyan-400" size={28}/>
      </div>
    </div>

    {/* ENERGY */}
    <h1 className="text-5xl font-bold tracking-tight">
      {kwh} kWh
    </h1>

    <p className="text-gray-400 mt-1">
      Rp {cost}
    </p>

    {/* STATUS */}
    <div className="flex items-center justify-center gap-2 mt-3 text-cyan-400">
      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm tracking-wide">
        Charging in progress...
      </span>
    </div>

    {/* PROGRESS */}
    <div className="mt-6 relative">
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full 
          bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
          style={{ width: `${(battery / targetBattery) * 100}%` }}
        />
      </div>

      <div
        className="absolute top-0 h-3 rounded-full blur-md opacity-60
        bg-gradient-to-r from-cyan-400 to-purple-500"
        style={{ width: `${(battery / targetBattery) * 100}%` }}
      />
    </div>

    {/* PERCENT */}
    <p className="text-xs text-gray-400 mt-3">
      {battery}% / {targetBattery}%
    </p>

    {/* STOP */}
<button
  onClick={() => setShowStopModal(true)}
  disabled={stopping}
  className="mt-6 w-full py-3 rounded-full 
  bg-red-500/20 text-red-400 border border-red-500/30
  hover:bg-red-500/30 transition flex items-center justify-center gap-2
  disabled:opacity-50"
>
  <Power size={16}/>
  {stopping ? "Stopping..." : "Stop Charging"}
</button>

  </div>
  
)}
  {/* STEP 4 💎 ULTRA FINISH */}
{step===4 && (
  <div className="text-center relative">

    {/* GLOW BACKGROUND */}
    <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
      <div className="w-40 h-40 bg-green-400/20 blur-3xl rounded-full animate-pulse"/>
    </div>

    {/* 🔥 ICON */}
<div className="flex justify-center mb-6">
  <div className="p-6 rounded-full bg-green-500/10 
    shadow-[0_0_40px_rgba(34,197,94,0.4)]">
    <CheckCircle className="w-14 h-14 text-green-400" />
  </div>
</div>

{/* 🔥 TITLE */}
<h2 className="text-3xl font-bold text-green-400 tracking-tight text-center">
  Charging Complete
</h2>

<p className="text-gray-400 text-sm mt-2 text-center">
  Energy delivered successfully ⚡
</p>

{/* 🔥 SUMMARY CARD */}
<div className="mt-8 bg-white/5 border border-white/10 
  rounded-2xl p-5 backdrop-blur-md shadow-xl">

  <div className="space-y-4 text-sm">

    {/* ENERGY */}
    <div className="flex justify-between items-center">
      <span className="text-gray-400">Energy</span>
      <span className="text-white font-semibold text-base">
        {kwh} kWh
      </span>
    </div>

    {/* COST */}
    <div className="flex justify-between items-center">
      <span className="text-gray-400">Total Cost</span>
      <span className="text-white font-semibold text-base">
        Rp {cost}
      </span>
    </div>

    {/* DIVIDER */}
    <div className="border-t border-white/10"></div>

    {/* ESCROW */}
    <div className="flex justify-between items-center">
      <span className="text-cyan-400">Escrow Used</span>
      <span className="text-cyan-400 font-semibold text-base">
        {((kwh * 2500)/15500).toFixed(3)} USDC
      </span>
    </div>

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
{showStopModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-[320px] text-center shadow-2xl">

      {/* ICON */}
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 flex items-center justify-center rounded-full 
          bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="text-red-400" size={26}/>
        </div>
      </div>

      {/* TITLE */}
      <h2 className="text-lg font-semibold text-white">
        Stop Charging?
      </h2>

      <p className="text-sm text-gray-400 mt-1 mb-5">
        Sisa saldo akan direfund ke wallet kamu
      </p>

      {/* BUTTON */}
      <div className="flex gap-3">

        <button
          onClick={() => setShowStopModal(false)}
          className="flex-1 py-2 rounded-xl 
          bg-white/5 text-gray-300 border border-white/10
          hover:bg-white/10 transition flex items-center justify-center gap-2"
        >
          <X size={16}/>
          Cancel
        </button>

        <button
          onClick={() => {
            setShowStopModal(false);
            stopCharging();
          }}
          className="flex-1 py-2 rounded-xl 
          bg-gradient-to-r from-red-500 to-red-600 
          text-white font-semibold 
          hover:scale-105 active:scale-95 transition 
          flex items-center justify-center gap-2"
        >
          <Power size={16}/>
          Stop
        </button>

      </div>

    </div>

  </div>
)}
      </div>
    </div>
  );

}
