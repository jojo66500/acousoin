import React from 'react';

export default function Offline() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-100 p-4">
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-xl font-bold text-emerald-700 mb-4">SonoThérapie</h1>
        <p className="mb-6">Vous êtes actuellement hors ligne. Veuillez vous reconnecter pour utiliser l'application.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
