"use client"

import axios from 'axios';
import { useState } from 'react';
import { getId } from '../api/action';
import { getToken } from '../lib/auth';

const RechargePage = () => {
  const [amount, setAmount] = useState('');
  const adminPaymentNumber = 'HTG-3102-2885'; // Replace with actual admin number
  const adminPaymentNatcashNumber = '4097-0794'; // Replace with actual admin number

  const userId = getId()
  const token = getToken()
  const [loading, setLoading] = useState(false)

  console.log("userId: ", userId)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true); // start loading
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/recharges/",
        {
          amount,
          user: userId, // optional if handled by backend
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert("Recharge saved successfully");
      console.log("Recharge saved successfully: ", response.data);
      setLoading("")
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoading(false); // stop loading
    }
  };
  
  

  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center relative overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 w-0.5 bg-cyan-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Main card */}
      <div className="relative max-w-2xl w-full bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-cyan-400/20 p-8 space-y-8 neon-glow">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold cyber-font bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            CARD RECHARGE PORTAL
          </h1>
          <p className="text-cyan-400/80 mt-2">Secure Digital Transaction Interface</p>
        </div>

        {/* Recharge Amount Input */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-green-400 rounded-xl blur opacity-30 group-focus-within:opacity-60 transition-opacity" />
          <div className="relative bg-gray-900/50 rounded-xl p-6">
            <label className="block text-sm text-cyan-400 mb-4">ENTER RECHARGE AMOUNT (HTG)</label>
            <div className="flex items-center gap-4">
              <span className="text-2xl text-cyan-400">HTG</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent border-none text-3xl text-cyan-300 placeholder-cyan-400/50 focus:ring-0"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Admin Payment Info */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-xl blur opacity-20 transition-opacity" />
          <div className="relative bg-gray-900/50 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm text-cyan-400 mb-2">SEND PAYMENT VIA MONCASH OR NATCASH TO</h3>
                <div className="text-xl font-mono text-cyan-300">{adminPaymentNumber} / {adminPaymentNatcashNumber}</div>
              </div>
              <button className="px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-cyan-400 hover:bg-cyan-400/20 transition-colors">
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="space-y-4 text-cyan-400/80 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse" />
            Transfer exact amount to the payment number above
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse" />
            Include your card number in transaction memo
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse" />
            Allow 2-5 minutes for balance update
          </div>
        </div>

        {/* Submit Button */}
        {/* <button onSubmit={handleSubmit} className="w-full py-4 bg-gradient-to-r from-cyan-400 to-green-400 rounded-xl text-gray-900 font-bold text-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-300 hover:scale-[1.02]">
          CONFIRM RECHARGE
          <span className="ml-2 animate-pulse">⚡</span>
        </button> */}

<button
  onClick={handleSubmit}
  disabled={loading}
  className={`w-full py-4 rounded-xl text-gray-900 font-bold text-xl transition-all duration-300 hover:scale-[1.02] ${
    loading
      ? "bg-gray-300 cursor-not-allowed"
      : "bg-gradient-to-r from-cyan-400 to-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
  }`}
>
  {loading ? (
    <div className="flex items-center justify-center gap-2">
      <svg
        className="animate-spin h-5 w-5 text-gray-900"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        />
      </svg>
      Loading...
    </div>
  ) : (
    <>
      CONFIRM RECHARGE <span className="ml-2 animate-pulse">⚡</span>
    </>
  )}
</button>


        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-cyan-400/50 text-sm">
          <div className="h-4 w-4 bg-cyan-400/20 rounded-full animate-pulse" />
          256-BIT SSL ENCRYPTED TRANSACTION
          <div className="h-4 w-4 bg-cyan-400/20 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// Add these global styles
const styles = `
  @keyframes float {
    0% { transform: translateY(0); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(-100vh); opacity: 0; }
  }

  .neon-glow {
    box-shadow: 0 0 50px rgba(34, 197, 94, 0.1);
  }

  .cyber-font {
    font-family: 'Orbitron', sans-serif;
    letter-spacing: 0.05em;
  }

  .animate-float {
    animation: float 8s linear infinite;
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

export default RechargePage;