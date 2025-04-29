"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { getToken, } from "../lib/auth";
import axios from 'axios';
import { getId, getPlan, getMembership } from "../api/action";


export default function Success(){

    const router = useRouter()

    const token = getToken()

    const [isLoaded, setIsLoaded] = useState(false)
  
   
    const userId = getId()

    console.log("userId: ",userId)

    const membership = getMembership()

    console.log("membership plan : ", membership )
    useEffect(()=> {
      setIsLoaded(true);
    

    }, [])

    if(!isLoaded) return null;



    return (

        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
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
          {/* Animated checkmark */}
          <div className="flex justify-center">
            <div className="relative h-24 w-24 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center animate-float">
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" />
              <span className="text-4xl">✓</span>
            </div>
          </div>
      
          {/* Success message */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold cyber-font bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              PAYMENT SUCCESSFUL
            </h1>
            <p className="text-cyan-300/80 text-xl">Welcome to the future of digital membership</p>
          </div>
      
          {/* Transaction details */}
          {membership ? (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Details */}
            <div className="p-6 bg-gray-800/30 rounded-xl border border-cyan-400/20">
              <h2 className="text-xl text-cyan-400 cyber-font mb-4">MEMBERSHIP ACTIVATED</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-300/80">Plan Type:</span>
                  <span className="font-mono text-cyan-400">{membership.plan_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-300/80">Amount Paid:</span>
                  <span className="font-mono text-green-400">{membership.amount_paid} HTG</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-300/80">Expiry Date:</span>
                  <span className="font-mono text-cyan-400">2028-23-83</span>
                </div>
              </div>
            </div>
      
            {/* User Details */}
            <div className="p-6 bg-gray-800/30 rounded-xl border border-cyan-400/20">
              <h2 className="text-xl text-cyan-400 cyber-font mb-4">ACCOUNT DETAILS</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-300/80">User:</span>
                  <span className="font-mono text-cyan-400">{membership.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-300/80">Status:</span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400">ACTIVE</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-300/80">Member Since:</span>
                  <span className="font-mono text-cyan-400">2434</span>
                </div>
              </div>
            </div>
          </div>

          ) : (
            <p>Loading membership details...</p>
        )}
      
          {/* Next Steps */}
          <div className="p-6 bg-gray-800/30 rounded-xl border border-cyan-400/20 space-y-4">
            <h3 className="text-lg text-cyan-400 cyber-font">YOUR NEXT STEPS</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-cyan-400/10 rounded-full flex items-center justify-center">🎮</div>
                <span className="text-cyan-300">Access Dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-cyan-400/10 rounded-full flex items-center justify-center">⚙️</div>
                <span className="text-cyan-300">Configure Settings</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-cyan-400/10 rounded-full flex items-center justify-center">📚</div>
                <span className="text-cyan-300">View Documentation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-cyan-400/10 rounded-full flex items-center justify-center">💬</div>
                <span className="text-cyan-300">Join Community</span>
              </div>
            </div>
          </div>
      
          {/* Return button */}
          <button 
            className="w-full py-4 bg-gradient-to-r from-cyan-400 to-green-400 rounded-xl text-gray-900 font-bold text-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-300 hover:scale-[1.02]"
            onClick={() => router.push('/')}
          >
            RETURN TO PORTAL
            <span className="ml-2">⌂</span>
          </button>
      
          {/* Security assurance */}
          <div className="flex items-center justify-center gap-3 text-cyan-400/50 text-sm">
            <div className="h-4 w-4 bg-cyan-400/20 rounded-full animate-pulse" />
            <span>24/7 SUPPORT: support@cybernexa.io</span>
            <div className="h-4 w-4 bg-cyan-400/20 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    )
}