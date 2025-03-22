import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Clock, Volume2, Volume1, VolumeX, Moon, Timer, X } from 'lucide-react';
import Offline from './offline';

const App = () => {
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(-20);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(15);
  const [remainingTime, setRemainingTime] = useState(0);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  
  const noiseRef = useRef(null);
  const filterRef = useRef(null);
  const gainRef = useRef(null);
  const timerRef = useRef(null);
  
  // Vérifier l'état de la connexion
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Installer PWA
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Empêcher Chrome 67+ d'afficher automatiquement la notification
      e.preventDefault();
      // Stocker l'événement pour déclencher plus tard
      setInstallPrompt(e);
      setShowInstallButton(true);
    });
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    
    // Afficher la boîte de dialogue d'installation
    installPrompt.prompt();
    
    // Attendre que l'utilisateur réponde à la boîte de dialogue
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Utilisateur a accepté l\'installation');
        setShowInstallButton(false);
      }
      setInstallPrompt(null);
    });
  };
  
  // Types de bruits et leurs caractéristiques
  const noiseTypes = [
    {
      id: 'white',
      name: 'Bruit Blanc',
      description: 'Contient toutes les fréquences avec la même énergie.',
      effects: 'Aide à la déprogrammation des acouphènes et au traitement de l\'hyperacousie.',
      gradient: 'from-emerald-50 to-teal-100',
      iconGradient: 'from-emerald-400 to-teal-500',
      borderColor: 'border-emerald-200',
      hoverGlow: 'hover:shadow-emerald-200',
      activeGlow: 'shadow-emerald-300',
      setup: () => {
        noiseRef.current = new Tone.Noise('white').start();
        filterRef.current = new Tone.Filter();
        gainRef.current = new Tone.Gain(Tone.dbToGain(volume)).toDestination();
        noiseRef.current.connect(filterRef.current);
        filterRef.current.connect(gainRef.current);
      }
    },
    {
      id: 'pink',
      name: 'Bruit Rose',
      description: 'De puissance égale sur des bandes de fréquences.',
      effects: 'Masquage des acouphènes et amélioration du confort auditif.',
      gradient: 'from-rose-50 to-pink-100',
      iconGradient: 'from-rose-400 to-pink-500',
      borderColor: 'border-rose-200',
      hoverGlow: 'hover:shadow-rose-200',
      activeGlow: 'shadow-rose-300',
      setup: () => {
        noiseRef.current = new Tone.Noise('pink').start();
        gainRef.current = new Tone.Gain(Tone.dbToGain(volume)).toDestination();
        noiseRef.current.connect(gainRef.current);
      }
    },
    {
      id: 'brown',
      name: 'Bruit Brown',
      description: 'Décroît de 6dB par octave avec la fréquence.',
      effects: 'Soulage les acouphènes pulsatiles et l\'hypersensibilité.',
      gradient: 'from-amber-50 to-yellow-100',
      iconGradient: 'from-amber-400 to-yellow-500',
      borderColor: 'border-amber-200',
      hoverGlow: 'hover:shadow-amber-200',
      activeGlow: 'shadow-amber-300',
      setup: () => {
        noiseRef.current = new Tone.Noise('brown').start();
        gainRef.current = new Tone.Gain(Tone.dbToGain(volume)).toDestination();
        noiseRef.current.connect(gainRef.current);
      }
    },
    {
      id: 'violet',
      name: 'Bruit Violet',
      description: 'Croît de 6dB par octave avec la fréquence.',
      effects: 'Efficace lors de crises aiguës d\'acouphènes.',
      gradient: 'from-violet-50 to-purple-100',
      iconGradient: 'from-violet-400 to-purple-500',
      borderColor: 'border-violet-200',
      hoverGlow: 'hover:shadow-violet-200',
      activeGlow: 'shadow-violet-300',
      setup: () => {
        noiseRef.current = new Tone.Noise('white').start();
        filterRef.current = new Tone.Filter({
          type: 'highpass',
          frequency: 1000,
          rolloff: 12
        });
        gainRef.current = new Tone.Gain(Tone.dbToGain(volume)).toDestination();
        noiseRef.current.connect(filterRef.current);
        filterRef.current.connect(gainRef.current);
      }
    },
    {
      id: 'blue',
      name: 'Bruit Bleu',
      description: 'Augmente de 3dB par octave jusqu\'à l\'infini.',
      effects: 'Neutralise les bruits extérieurs générateurs de stress.',
      gradient: 'from-sky-50 to-blue-100',
      iconGradient: 'from-sky-400 to-blue-500',
      borderColor: 'border-sky-200',
      hoverGlow: 'hover:shadow-sky-200',
      activeGlow: 'shadow-sky-300',
      setup: () => {
        noiseRef.current = new Tone.Noise('white').start();
        filterRef.current = new Tone.Filter({
          type: 'highpass',
          frequency: 500,
          rolloff: 6
        });
        gainRef.current = new Tone.Gain(Tone.dbToGain(volume)).toDestination();
        noiseRef.current.connect(filterRef.current);
        filterRef.current.connect(gainRef.current);
      }
    },
    {
      id: 'grey',
      name: 'Bruit Gris',
      description: 'Bruit rose avec équilibrage psycho-acoustique.',
      effects: 'Agit sur les hallucinations auditives et troubles de l\'humeur.',
      gradient: 'from-slate-50 to-gray-100',
      iconGradient: 'from-slate-400 to-gray-500',
      borderColor: 'border-slate-200',
      hoverGlow: 'hover:shadow-slate-200',
      activeGlow: 'shadow-slate-300',
      setup: () => {
        noiseRef.current = new Tone.Noise('pink').start();
        filterRef.current = new Tone.EQ3({
          low: -3,
          mid: 0,
          high: -2
        });
        gainRef.current = new Tone.Gain(Tone.dbToGain(volume)).toDestination();
        noiseRef.current.connect(filterRef.current);
        filterRef.current.connect(gainRef.current);
      }
    }
  ];

  // Si hors ligne, afficher le composant hors ligne
  if (!isOnline) {
    return <Offline />;
  }

  // Gestion du volume
  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = Tone.dbToGain(volume);
    }
  }, [volume]);

  // Gestion du timer
  useEffect(() => {
    if (timerActive && remainingTime > 0) {
      timerRef.current = setTimeout(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
    } else if (timerActive && remainingTime === 0) {
      stopNoise();
      setTimerActive(false);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timerActive, remainingTime]);

  // Nettoyage lorsque le composant est démonté
  useEffect(() => {
    return () => {
      stopNoise();
    };
  }, []);

  // Fonction pour arrêter le bruit
  const stopNoise = () => {
    if (noiseRef.current) {
      noiseRef.current.stop();
      if (filterRef.current) {
        filterRef.current.disconnect();
      }
      if (gainRef.current) {
        gainRef.current.disconnect();
      }
      noiseRef.current = null;
      filterRef.current = null;
      gainRef.current = null;
    }
    setPlaying(null);
  };

  // Fonction pour jouer un type de bruit
  const playNoise = async (noiseType) => {
    // Arrêter le bruit actuel s'il y en a un
    stopNoise();

    // Si on clique sur le même bruit qui joue déjà, on l'arrête simplement
    if (playing === noiseType.id) {
      return;
    }

    // Démarrer Tone.js si nécessaire
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }

    // Configurer et jouer le nouveau bruit
    noiseType.setup();
    setPlaying(noiseType.id);

    // Démarrer le timer si actif
    if (timerActive) {
      setRemainingTime(timerDuration * 60);
    }
  };

  // Démarrer le timer
  const startTimer = () => {
    setTimerActive(true);
    setRemainingTime(timerDuration * 60);
    setShowTimerModal(false);
  };

  // Arrêter le timer
  const stopTimer = () => {
    setTimerActive(false);
    setRemainingTime(0);
  };

  // Formater le temps restant au format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Déterminer la classe pour l'icône du volume
  const getVolumeIcon = () => {
    if (volume <= -50) return <VolumeX size={20} />;
    if (volume <= -20) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-cyan-50 to-teal-100 text-gray-800'} transition-colors duration-300`}>
      <div className="max-w-md mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-emerald-700'} transition-colors duration-300`}>
              <span className="mr-2">🎵</span> SonoThérapie
            </h1>
            <div className="flex gap-3">
              {showInstallButton && (
                <button 
                  onClick={handleInstallClick}
                  className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm shadow-md transition-colors duration-200"
                >
                  Installer
                </button>
              )}
              <button 
                onClick={() => setShowTimerModal(true)}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} shadow-md transition-all duration-300`}
              >
                <Timer size={20} className={darkMode ? 'text-white' : 'text-emerald-600'} />
              </button>
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} shadow-md transition-all duration-300`}
              >
                <Moon size={20} className={darkMode ? 'text-white' : 'text-emerald-600'} />
              </button>
            </div>
          </div>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-emerald-600'} transition-colors duration-300`}>
            Thérapie par le son pour soulager vos acouphènes
          </p>
        </header>

        {timerActive && (
          <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md flex justify-between items-center transition-colors duration-300`}>
            <div className="flex items-center">
              <Clock size={18} className={`mr-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span className="font-mono text-lg">{formatTime(remainingTime)}</span>
            </div>
            <button 
              onClick={stopTimer}
              className={`px-3 py-1 rounded-md text-white bg-red-500 hover:bg-red-600 text-sm transition-colors duration-200`}
            >
              Arrêter
            </button>
          </div>
        )}

        <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transition-colors duration-300`}>
          <div className="flex items-center mb-3">
            {getVolumeIcon()}
            <span className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Volume: {volume} dB
            </span>
          </div>
          <input
            type="range"
            min="-60"
            max="0"
            step="1"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {noiseTypes.map((noise) => (
            <div
              key={noise.id}
              className={`relative p-4 rounded-2xl bg-gradient-to-br ${noise.gradient} border ${noise.borderColor} shadow-md ${
                playing === noise.id 
                  ? `shadow-lg ${noise.activeGlow} scale-105` 
                  : `hover:shadow-lg ${noise.hoverGlow} hover:scale-102`
              } transition-all duration-300 cursor-pointer`}
              onClick={() => playNoise(noise)}
            >
              <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br ${noise.iconGradient} shadow-md flex items-center justify-center`}>
                {playing === noise.id ? (
                  <span className="text-white font-bold">■</span>
                ) : (
                  <span className="text-white font-bold ml-1">▶</span>
                )}
              </div>
              <h2 className="text-lg font-bold mb-1">{noise.name}</h2>
              <p className="text-xs mb-2 opacity-80">{noise.description}</p>
              <p className="text-xs font-medium opacity-90">{noise.effects}</p>
            </div>
          ))}
        </div>

        {showTimerModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={`w-full max-w-xs p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Minuterie</h2>
                <button onClick={() => setShowTimerModal(false)} className="p-1">
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Durée (minutes)</label>
                <input
                  type="number"
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)))}
                  className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  min="1"
                  max="120"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowTimerModal(false)}
                  className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors duration-200`}
                >
                  Annuler
                </button>
                <button
                  onClick={startTimer}
                  className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
                >
                  Démarrer
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className={`mt-8 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-emerald-700'} transition-colors duration-300`}>
          <p className="mb-1">Consulter un professionnel de santé avant utilisation thérapeutique.</p>
          <p>© 2025 SonoThérapie - <a href="https://github.com/username/sonotherapie" className="underline">GitHub</a></p>
        </footer>
      </div>
    </div>
  );
};

export default App;
