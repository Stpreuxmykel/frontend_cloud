"use client";

import React from 'react'

const Support = () => {
  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 relative">
  {/* Fond animé */}
  <div className="absolute inset-0 bg-[url('/circuit-board.svg')] opacity-10 animate-pulse" />
  
  <div className="max-w-7xl mx-auto relative z-10">
    {/* En-tête */}
    <div className="text-center mb-16">
      <h1 className="text-5xl font-bold mb-4 cyber-font bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
        CENTRE D'AIDE
      </h1>
      <p className="text-gray-400 text-lg">Maîtrisez toutes les fonctionnalités de la plateforme</p>
    </div>

    {/* Grille de guides */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
      {/* Création de compte */}
      <div className="relative group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.1)]">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-3 w-3 bg-cyan-400 rounded-full animate-pulse" />
            <h2 className="text-2xl font-bold text-cyan-400 cyber-font">PREMIERS PAS</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-cyan-400/10 rounded-lg">
                <span className="text-cyan-400 text-2xl">①</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-cyan-200 mb-2">Création de compte</h3>
                <p className="text-gray-400">
                  1. Cliquez sur "S'inscrire"<br />
                  2. Entrez votre email et mot de passe<br />
                  3. Confirmez votre adresse email<br />
                  4. Complétez votre profil
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-cyan-400/10 rounded-lg">
                <span className="text-cyan-400 text-2xl">②</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-cyan-200 mb-2">Vérification</h3>
                <p className="text-gray-400">
                  • Téléchargez une pièce d'identité<br />
                  • Attendez la confirmation par email<br />
                  • Complétez votre profil
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gestion d'abonnement */}
      <div className="relative group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent rounded-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-3 w-3 bg-purple-400 rounded-full animate-pulse" />
            <h2 className="text-2xl font-bold text-purple-400 cyber-font">ABONNEMENTS</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-400/10 rounded-lg">
                <span className="text-purple-400 text-2xl">🔄</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-200 mb-2">Changer de plan</h3>
                <p className="text-gray-400">
                  1. Allez dans "Mon Abonnement"<br />
                  2. Choisissez un nouveau plan<br />
                  3. Confirmez le paiement<br />
                  4. Profitez des nouvelles fonctionnalités
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-400/10 rounded-lg">
                <span className="text-purple-400 text-2xl">💳</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-200 mb-2">Recharger la carte</h3>
                <p className="text-gray-400">
                  1. Accédez à "Portefeuille"<br />
                  2. Sélectionnez le montant<br />
                  3. Choisissez le mode de paiement<br />
                  4. Confirmez la transaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Section FAQ */}
    <div className="relative group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(52,211,153,0.1)]">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-2xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-3 w-3 bg-emerald-400 rounded-full animate-pulse" />
          <h2 className="text-2xl font-bold text-emerald-400 cyber-font">FOIRE AUX QUESTIONS</h2>
        </div>
        
        <div className="space-y-6">
          <div className=" border border-emerald-400/20 rounded-lg">
            <input type="checkbox" /> 
            <div className="collapse-title text-xl font-medium text-emerald-200">
              Comment réinitialiser mon mot de passe ?
            </div>
            <div className="collapse-content text-gray-400"> 
              <p>1. Cliquez sur "Mot de passe oublié"<br />
              2. Entrez votre email<br />
              3. Suivez le lien dans l'email<br />
              4. Créez un nouveau mot de passe</p>
            </div>
          </div>

          <div className=" border border-emerald-400/20 rounded-lg">
            <input type="checkbox" /> 
            <div className="collapse-title text-xl font-medium text-emerald-200">
              Puis-je annuler un paiement ?
            </div>
            <div className="collapse-content text-gray-400"> 
              <p>Toutes les transactions sont finales. Contactez le support pour toute exception.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Support en direct */}
    <div className="text-center mt-20">
      <div className="inline-block bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-lg p-8 rounded-2xl border border-cyan-400/20">
        <h3 className="text-2xl text-cyan-400 mb-4">Besoin d'aide supplémentaire ?</h3>
        <p className="text-gray-400 mb-6">Notre équipe est disponible 24h/24</p>
        <button className="py-3 px-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full text-gray-900 font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300">
          Contacter le support
        </button>
      </div>
    </div>
  </div>
</div>
  )
}

export default Support