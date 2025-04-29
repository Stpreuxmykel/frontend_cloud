"use client";

import React, { useEffect, useState } from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
  } from "@/components/ui/dialog";

  import { Button } from "@/components/ui/button";
import { capitalize, formatFrenchDate, getId, getPlanData } from '../api/action';
import { useRouter } from 'next/navigation';
import { BsExclamationTriangle } from "react-icons/bs";
import axios from 'axios';
import toast from 'react-hot-toast';

  

const Manage = () => {
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  console.log("plan data here checking : ",planData )


  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;



  useEffect(()=> {
    setLoading(true)
     const fetchPlanData = async () => {
      setLoading(true)
        try {
          const plan_data = await getPlanData();
          console.log("Fetched plan data:", plan_data.membership); // Debugging log

     
          setPlanData(plan_data.membership)
    

    
        } catch (error) {
          console.error("Error fetching plan data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPlanData()

  }, [router])


  const deactivatePlan = async() => {

    const userId = getId()

    try {
     const response = await axios.post(`${api_url}/deactivate_plan/`, {
      user_id : userId
     })

     toast.success('Membership deactivated')

     console.log('✅ Membership deactivated:', response.data);

     setIsModalOpen(false)
     router.push("/plan")



    } catch (error) {
      console.error('❌ Error deactivating membership:', error.response?.data || error.message);
    } 
  };

  

  const expiry_date = Number(planData.expiration_progress)
  console.log("Epirery date : ", expiry_date)


  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 backdrop-blur-xl">
        {/* Animated ring */}
        <div className="absolute h-32 w-32 rounded-full border-8 border-green-400/20 animate-pulse" />
        
        {/* Floating text */}
        <div className="relative flex flex-col items-center">
          {/* Glowing text */}
          <div className="text-4xl font-bold cyber-font">
            <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent drop-shadow-glow">
              LOADING
            </span>
            <span className="text-cyan-400 animate-[blink_1.5s_infinite]">...</span>
          </div>
          
          {/* Animated particles */}
          <div className="mt-4 flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
        
        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('/circuit-pattern.svg')] bg-repeat animate-[move_20s_linear_infinite]" />
      </div>
    );
  }
  




  return (
    <>
      <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Fond animé */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 animate-pulse" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* En-tête */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 cyber-font bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
              GESTION D'ABONNEMENT
            </h1>
            <p className="text-gray-400 text-lg">Contrôlez votre expérience premium</p>
          </div>
  
          {planData.is_activated ? (
            <div className="group relative mb-16 bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(52,211,153,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-2xl" />
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-3 w-3 bg-emerald-400 rounded-full animate-pulse" />
                      <h2 className="text-3xl font-bold text-emerald-400 cyber-font">VOTRE ABONNEMENT ACTUEL</h2>
                    </div>
                    <div className="text-2xl text-emerald-300">Plan {capitalize(planData.name)}</div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="text-4xl font-bold text-emerald-400 mb-1">{planData.price} HTG</div>
                    <div className="text-gray-400 text-sm">Renouvellement dans {planData.days_remaining} jours</div>
                  </div>
                </div>
  
                {/* Timeline d'expiration */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-emerald-400">Prochain renouvellement</span>
                    <span className="text-gray-400">le {formatFrenchDate(planData.end_date)}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400" 
                      style={{ width: `${expiry_date}%`}}
                    />
                  </div>
                </div>
  
                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => router.push("/plan")} className="py-3 px-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all duration-300">
                    Modifier votre plan
                  </button>
                  <button onClick={() => setIsModalOpen(true)} className="py-3 px-6 bg-gradient-to-r from-rose-400 to-pink-400 rounded-lg text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all duration-300">
                    Annuler l'abonnement
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="group relative mb-16 bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-rose-400/20 hover:border-rose-400/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(244,63,94,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 to-transparent rounded-2xl" />
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-3 w-3 bg-rose-400 rounded-full" />
                      <h2 className="text-3xl font-bold text-rose-400 cyber-font">ABONNEMENT DÉSACTIVÉ</h2>
                    </div>
                    <div className="text-2xl text-rose-300">Ancien Plan {capitalize(planData.name)}</div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="text-4xl font-bold text-rose-400 mb-1">{planData.price} HTG</div>
                    <div className="text-gray-400 text-sm">Expiré le {formatFrenchDate(planData.end_date)}</div>
                  </div>
                </div>
  
                {/* Message de désactivation */}
                <div className="mb-8 p-6 bg-rose-900/20 rounded-xl border border-rose-400/20">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl text-rose-400">⚠️</div>
                    <div>
                      <h3 className="text-xl font-bold text-rose-300 mb-2">Accès restreint</h3>
                      <p className="text-gray-300">
                        Votre abonnement premium a été désactivé. Pour retrouver toutes les fonctionnalités, 
                        veuillez souscrire à un nouveau plan.
                      </p>
                    </div>
                  </div>
                </div>
  
                {/* Bouton de réactivation */}
                <button 
                  onClick={() => router.push("/plan")} 
                  className="w-full py-3 bg-gradient-to-r from-purple-400 to-rose-400 rounded-lg text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
                >
                  Réactiver votre abonnement
                </button>
              </div>
            </div>
          )}
  
          {/* Options de mise à niveau */}
          <h2 className="text-3xl font-bold text-center mb-12 cyber-font bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            OPTIONS DE MISE À NIVEAU
          </h2>
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Entreprise */}
            <div className="relative group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent rounded-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-3 w-3 bg-purple-400 rounded-full animate-pulse" />
                  <h2 className="text-2xl font-bold text-purple-400 cyber-font">ENTREPRISE</h2>
                </div>
                <div className="mb-8">
                  <div className="text-4xl font-bold text-purple-400 mb-2">5000 HTG</div>
                  <div className="text-gray-400">par mois</div>
                </div>
                <ul className="space-y-4 mb-8 text-gray-300">
                  <li className="flex items-center gap-2">✦ Comptes multi-utilisateurs</li>
                  <li className="flex items-center gap-2">✦ Tableau de bord analytique</li>
                  <li className="flex items-center gap-2">✦ Support prioritaire 24/7</li>
                  <li className="flex items-center gap-2">✦ Branding personnalisé</li>
                </ul>
                <button className="w-full py-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
                  Passer au niveau supérieur
                </button>
              </div>
            </div>
  
            {/* Plan Personnalisé */}
            <div className="relative group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-3 w-3 bg-cyan-400 rounded-full animate-pulse" />
                  <h2 className="text-2xl font-bold text-cyan-400 cyber-font">PERSONNALISÉ</h2>
                </div>
                <div className="mb-8">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">Sur mesure</div>
                  <div className="text-gray-400">Solution adaptée</div>
                </div>
                <ul className="space-y-4 mb-8 text-gray-300">
                  <li className="flex items-center gap-2">✦ Forfaits personnalisables</li>
                  <li className="flex items-center gap-2">✦ Intégrations API</li>
                  <li className="flex items-center gap-2">✦ Développement sur mesure</li>
                  <li className="flex items-center gap-2">✦ Contrat flexible</li>
                </ul>
                <button className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300">
                  Contacter un conseiller
                </button>
              </div>
            </div>
          </div>
  
          {/* Section d'annulation */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-rose-600/20 to-pink-600/20 backdrop-blur-lg p-8 rounded-2xl border border-rose-400/20">
              <h3 className="text-2xl text-rose-400 mb-4">Annuler l'abonnement</h3>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Vous perdrez immédiatement l'accès aux fonctionnalités premium.<br />
                Voulez-vous vraiment continuer ?
              </p>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <button className="py-2 px-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all duration-300">
                    Confirmer l'annulation
                  </button>
                </DialogTrigger>
                <DialogContent className="backdrop-blur-xl bg-gray-900/80 border border-rose-400/20 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-rose-400">Confirmation d'annulation</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Êtes-vous sûr de vouloir annuler votre abonnement premium ?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="text-center p-4 bg-rose-900/20 rounded-lg border border-rose-400/20">
                      <span className="text-rose-400">⚠️ Attention : </span>
                      <span className="text-gray-300">Tous les avantages premium seront désactivés immédiatement</span>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={deactivatePlan} variant="destructive" className="bg-gradient-to-r from-rose-400 to-pink-400">
                      Confirmer l'annulation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
  
      </div>
    </>
  );
}

export default Manage