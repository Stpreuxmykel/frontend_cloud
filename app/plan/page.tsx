"use client";
import { useState } from "react"
import {useRouter} from "next/navigation"
import { getToken } from "../lib/auth";


export default function MemberShip() {

  const token = getToken();
    
    const router = useRouter();
    const redirect = (plan:any) => {
        if(!token) {
          router.push("/login")
          return;
        }
        localStorage.setItem("plan", plan)
        router.push("/checkout")

    }
 return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
  {/* Animated background overlay */}
  <div className="absolute inset-0 bg-[url('/circuit-board.svg')] opacity-10 animate-pulse" />
  
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="text-center mb-16">
      <h1 className="text-5xl font-bold mb-4 cyber-font bg-gradient-to-r from-green-400 via-blue-400 to-rose-400 bg-clip-text text-transparent">
        PREMIUM MEMBERSHIPS
      </h1>
      <p className="text-gray-400 text-lg">Déverrouillez l'avenir avec nos plans nouvelle génération.</p>
      <p className="text-lg bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Valable 3 mois lors de la première souscription, puis renouvellement mensuel.</p>
    </div>

    {/* Plans Container */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Basic Plan */}
      <div className="relative group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/10 to-transparent rounded-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-3 w-3 bg-blue-400 rounded-full animate-pulse" />
            <h2 className="text-2xl font-bold text-blue-400 cyber-font">BASIC</h2>
          </div>
          <div className="mb-8">
            <div className="text-4xl font-bold text-blue-400 mb-2">500 HTG</div>
            <div className="text-gray-400">per month </div>
          </div>
          <ul className="space-y-4 mb-8 text-gray-300">
            <li className="flex items-center gap-2">✦ Publiez jusqu'à 2 propriétés</li>
            <li className="flex items-center gap-2">✦ Carte virtuelle gratuite avec 100 HTG</li>
            <li className="flex items-center gap-2">✦ Support : 3 jours/semaine</li>
           
          </ul>
          <button onClick={()=> redirect("basic")} className="w-full py-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-shadow duration-300">
            GET STARTED
          </button>
        </div>
      </div>

      {/* Silver Plan */}
      <div className="relative group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] transform hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 to-transparent rounded-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-3 w-3 bg-cyan-400 rounded-full animate-pulse" />
            <h2 className="text-2xl font-bold text-cyan-400 cyber-font">SILVER</h2>
          </div>
          <div className="mb-8">
            <div className="text-4xl font-bold text-cyan-400 mb-2">1000 HTG</div>
            <div className="text-gray-400">per month</div>
          </div>
          <ul className="space-y-4 mb-8 text-gray-300">
            <li className="flex items-center gap-2">✦ Publiez jusqu'à 5 propriétés</li>
            <li className="flex items-center gap-2">✦ Carte virtuelle gratuite avec 200 HTG</li>
            <li className="flex items-center gap-2">✦ Support : 5 jours/semaine</li>
            <li className="flex items-center gap-2">✦ Apparaît dans le Top 50 des recherches</li>
          </ul>
          <button onClick={()=> redirect("silver")} className="w-full py-3 bg-gradient-to-r from-cyan-400 to-green-400 rounded-lg text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-shadow duration-300">
            UPGRADE NOW
          </button>
        </div>
      </div>

      {/* Gold Plan */}
      <div className="relative group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-amber-400/20 hover:border-amber-400/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] transform hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-400/10 to-transparent rounded-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-3 w-3 bg-amber-400 rounded-full animate-pulse" />
            <h2 className="text-2xl font-bold text-amber-400 cyber-font">GOLD</h2>
          </div>
          <div className="mb-8">
            <div className="text-4xl font-bold text-amber-400 mb-2">2000 HTG</div>
            <div className="text-gray-400">per month</div>
          </div>
          <ul className="space-y-4 mb-8 text-gray-300">
            <li className="flex items-center gap-2">✦ Accès VIP</li>
            <li className="flex items-center gap-2">✦ Publications illimitées de propriétés</li>
            <li className="flex items-center gap-2">✦ Carte virtuelle gratuite avec 300 HTG</li>
            <li className="flex items-center gap-2">✦ Support prioritaire 24/7</li>
            <li className="flex items-center gap-2">✦ Apparaît dans le Top 10 des recherches</li>
            <li className="flex items-center gap-2">✦ Recommandations basées sur l'IA pour attirer des acheteurs potentiels</li>
            <li className="flex items-center gap-2">✦ Badge vérifié gratuit pour plus de crédibilité</li>
            <li className="flex items-center gap-2">✦ Promotion exclusive en page d'accueil pour une visibilité maximale</li>
          </ul>
          <button onClick={()=> redirect("gold")} className="w-full py-3 bg-gradient-to-r from-amber-400 to-rose-400 rounded-lg text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-shadow duration-300">
            GO PREMIUM
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
 )

}