
import React, { useState } from 'react';
import { LocationId, ActiveBait, WeatherType } from '../types';
import { BAITS, LOCATIONS, BOBBERS } from '../constants';
import { Map, Bug, Zap, CloudRain, CloudLightning, AlertCircle } from 'lucide-react';
import ParticleOverlay, { Particle } from './ParticleOverlay';

interface FishingSceneProps {
  status: 'IDLE' | 'CASTING' | 'WAITING' | 'BITING' | 'REELING';
  progress: number;
  onClick: (e: React.MouseEvent) => void;
  dayTime: number;
  location: LocationId;
  activeBait: ActiveBait | null;
  activeBobberId: string;
  onSwitchLocation: () => void;
  onCycleBait: () => void;
  particles: Particle[];
  combo: number;
  weather: WeatherType;
}

const FishingScene: React.FC<FishingSceneProps> = ({ 
  status, progress, onClick, dayTime, location, activeBait, activeBobberId, onSwitchLocation, onCycleBait, particles, combo, weather
}) => {
  
  const locationDef = LOCATIONS.find(l => l.id === location) || LOCATIONS[0];
  const isNight = dayTime >= 0.5;

  // Generate random stars once
  const [stars] = useState(() => Array.from({ length: 30 }, () => ({
    top: `${Math.random() * 50}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3
  })));

  // --- Dynamic Styling ---
  const getSkyClass = () => {
    if (location === 'sky') return isNight ? "bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900" : "bg-gradient-to-b from-sky-300 via-blue-300 to-indigo-200";
    if (location === 'deep_sea') return "bg-black"; // Pure black for deep sea
    
    // Weather overrides
    if (weather === 'Storm') return "bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950";
    if (weather === 'Rain') return "bg-gradient-to-b from-slate-600 via-slate-500 to-blue-900";

    if (dayTime < 0.2) return "bg-gradient-to-b from-orange-400 via-rose-300 to-indigo-900"; // Dawn
    if (dayTime < 0.4) return "bg-gradient-to-b from-cyan-400 via-sky-300 to-blue-200"; // Day
    if (dayTime < 0.5) return "bg-gradient-to-b from-indigo-900 via-purple-600 to-orange-500"; // Dusk
    return "bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950"; // Night
  };

  const getWaterClass = () => {
    const opacity = isNight || weather === 'Storm' ? 'opacity-90' : 'opacity-80';
    switch(location) {
      case 'ocean': return `${opacity} bg-gradient-to-b from-blue-600 to-slate-900`;
      case 'river': return `${opacity} bg-gradient-to-b from-cyan-600 to-teal-900`;
      case 'swamp': return `${opacity} bg-gradient-to-b from-purple-800 to-black`;
      case 'deep_sea': return `${opacity} bg-gradient-to-b from-blue-950 to-black`;
      case 'sky': return `${opacity} bg-gradient-to-b from-white/40 to-white/10`; 
      case 'pond': default: return `${opacity} bg-gradient-to-b from-emerald-600 to-slate-900`;
    }
  };

  const renderBobber = () => {
      switch(activeBobberId) {
          case 'duck':
              return (
                  <svg width="24" height="24" viewBox="0 0 24 24" className="drop-shadow-md">
                      <path fill="#facc15" d="M4 14 h12 v6 h-12 z" /> {/* Body */}
                      <path fill="#facc15" d="M12 8 h8 v8 h-8 z" /> {/* Head */}
                      <path fill="#f97316" d="M20 10 h4 v3 h-4 z" /> {/* Beak */}
                      <path fill="#000" d="M16 10 h2 v2 h-2 z" /> {/* Eye */}
                  </svg>
              );
          case 'skull':
              return (
                  <svg width="20" height="20" viewBox="0 0 24 24" className="drop-shadow-md">
                      <path fill="#e2e8f0" d="M4 4 h16 v14 h-16 z" /> 
                      <path fill="#000" d="M6 8 h4 v4 h-4 z M14 8 h4 v4 h-4 z" /> {/* Eyes */}
                      <path fill="#000" d="M10 16 h4 v2 h-4 z" /> {/* Nose */}
                  </svg>
              );
          case 'bulb':
              return (
                  <div className="relative">
                      <div className="w-4 h-6 bg-cyan-200 rounded-full border border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse"></div>
                      <div className="absolute bottom-0 w-4 h-2 bg-slate-700"></div>
                  </div>
              );
          case 'burger':
              return (
                  <div className="flex flex-col items-center">
                      <div className="w-5 h-2 bg-yellow-600 rounded-t-full"></div> {/* Bun */}
                      <div className="w-6 h-1 bg-green-500 rounded"></div> {/* Lettuce */}
                      <div className="w-5 h-2 bg-red-800 rounded"></div> {/* Meat */}
                      <div className="w-5 h-2 bg-yellow-600 rounded-b-lg"></div> {/* Bun */}
                  </div>
              );
          case 'classic':
          default:
              return (
                <div className={`
                    w-4 h-4 rounded-sm border border-black shadow-lg relative z-10 transition-colors duration-200
                    ${status === 'BITING' ? 'bg-red-600 border-red-900 translate-y-2' : 'bg-red-500'}
                    ${status === 'REELING' ? 'bg-yellow-500 border-yellow-800' : ''}
                `}>
                    <div className="absolute top-0 w-full h-1/2 bg-white/90"></div>
                </div>
              );
      }
  };

  return (
    <div 
      className={`relative w-full h-64 sm:h-72 shrink-0 overflow-hidden border-b-4 border-slate-950 shadow-2xl cursor-pointer select-none group transition-colors duration-[3000ms] ${getSkyClass()}`}
      onClick={onClick}
    >
      <style>{`
        @keyframes water-surface {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        .water-texture {
          background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: water-surface 10s linear infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes rain-fall {
          0% { transform: translateY(-100vh) translateX(0); }
          100% { transform: translateY(100vh) translateX(-20px); }
        }
        @keyframes lightning {
          0%, 90%, 100% { opacity: 0; }
          92%, 94% { opacity: 0.8; }
          93% { opacity: 0.2; }
        }
        .rain-drop {
           position: absolute;
           background: rgba(255,255,255,0.4);
           width: 1px;
           height: 10px;
           animation: rain-fall 0.8s linear infinite;
        }
      `}</style>
      
      {/* Particle Overlay Layer */}
      <ParticleOverlay particles={particles} />

      {/* --- HUD --- */}
      <div className="absolute top-2 left-2 z-30 flex gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onSwitchLocation(); }}
          className="bg-black/50 hover:bg-black/70 border border-slate-500 rounded px-2 py-1 flex items-center gap-2 text-[10px] text-white backdrop-blur-sm transition-transform active:scale-95 shadow-md"
        >
          <Map size={12} className="text-yellow-400" />
          <span className="font-bold tracking-wide drop-shadow-md">{locationDef.name}</span>
        </button>
      </div>
      
      {/* Weather Indicator */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30">
        {weather === 'Rain' && (
          <div className="flex items-center gap-1 bg-blue-900/40 px-2 py-0.5 rounded-full border border-blue-500/30">
             <CloudRain size={10} className="text-blue-300" />
             <span className="text-[9px] text-blue-200">雨天</span>
          </div>
        )}
        {weather === 'Storm' && (
          <div className="flex items-center gap-1 bg-purple-900/40 px-2 py-0.5 rounded-full border border-purple-500/30">
             <CloudLightning size={10} className="text-purple-300 animate-pulse" />
             <span className="text-[9px] text-purple-200">暴風雨</span>
          </div>
        )}
      </div>

      {/* Active Bait / Cycle Bait */}
      <div 
        onClick={(e) => { e.stopPropagation(); onCycleBait(); }}
        className="absolute top-2 right-2 z-30 bg-black/50 hover:bg-black/70 border border-green-500/50 rounded px-2 py-1 flex items-center gap-2 text-[10px] text-white backdrop-blur-sm shadow-md cursor-pointer active:scale-95 transition-all"
      >
        {activeBait ? (
            <>
                <Bug size={12} className="text-green-400" />
                <span>{BAITS.find(b => b.id === activeBait.id)?.name}</span>
                <span className="text-green-300 font-bold">x{activeBait.chargesRemaining}</span>
            </>
        ) : (
            <>
                <Bug size={12} className="text-slate-500" />
                <span className="text-slate-400 italic">無魚餌</span>
            </>
        )}
      </div>

      {/* Combo Indicator */}
      {combo > 1 && (
         <div className="absolute top-10 right-2 z-20 flex flex-col items-end animate-bounce">
            <div className="text-yellow-400 font-bold italic text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,1)] flex items-center gap-1">
              <Zap size={20} fill="currentColor" /> 
              COMBO x{combo}
            </div>
            <div className="text-[10px] text-white bg-red-600 px-1 rounded font-bold">SPEED UP!</div>
         </div>
      )}

      {/* --- SKY OBJECTS --- */}
      
      {/* Rain / Storm Effects */}
      {(weather === 'Rain' || weather === 'Storm') && (
        <div className="absolute inset-0 pointer-events-none z-10 opacity-50">
           {/* Generate fixed number of raindrops */}
           {Array.from({length: 40}).map((_,i) => (
              <div key={i} className="rain-drop" style={{
                 left: `${Math.random() * 100}%`,
                 top: `-${Math.random() * 20}%`,
                 animationDelay: `${Math.random()}s`,
                 animationDuration: weather === 'Storm' ? '0.5s' : '0.8s'
              }}></div>
           ))}
        </div>
      )}
      
      {/* Lightning Flash */}
      {weather === 'Storm' && (
        <div className="absolute inset-0 bg-white z-0 pointer-events-none" style={{ animation: 'lightning 5s infinite' }}></div>
      )}

      {/* Stars */}
      <div className={`absolute inset-0 transition-opacity duration-[3000ms] ${isNight || location === 'sky' || location === 'deep_sea' ? 'opacity-100' : 'opacity-0'}`}>
        {weather !== 'Storm' && stars.map((s, i) => ( // Hide stars in storm
           <div 
             key={i}
             className="absolute bg-white rounded-full"
             style={{
               top: s.top,
               left: s.left,
               width: s.size,
               height: s.size,
               animation: `twinkle ${2 + s.delay}s infinite ease-in-out`,
               opacity: location === 'deep_sea' ? 0.3 : 1 // Dimmer stars in abyss
             }}
           ></div>
        ))}
      </div>

      {/* Sun/Moon - Hidden in Deep Sea */}
      {(weather === 'Sunny' || weather === 'Rain') && location !== 'deep_sea' && (
        <div 
          className={`absolute w-16 h-16 rounded-full blur-[4px] transition-all duration-[5000ms]
            ${isNight ? 'bg-slate-100 shadow-[0_0_50px_rgba(255,255,255,0.5)] opacity-90' : 'bg-yellow-200 shadow-[0_0_60px_rgba(255,200,50,0.9)] opacity-100'}
          `}
          style={{
            top: `${20 + Math.sin(dayTime * Math.PI) * 15}%`,
            right: `${95 - (dayTime * 90)}%`
          }}
        ></div>
      )}

      {/* Clouds - Hidden in Deep Sea */}
      {location !== 'deep_sea' && (
          <>
            <div className={`absolute top-10 left-10 w-32 h-8 rounded-full blur-md animate-pulse duration-[8s] ${isNight ? 'bg-white/5' : 'bg-white/60'}`}></div>
            <div className={`absolute top-24 left-1/2 w-48 h-10 rounded-full blur-md animate-pulse duration-[12s] ${isNight ? 'bg-white/5' : 'bg-white/40'}`}></div>
          </>
      )}

      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute bottom-[30%] left-0 w-full h-40 flex items-end opacity-90 pointer-events-none">
        {location === 'ocean' ? (
           <div className="w-full h-8 bg-blue-900/40 blur-sm translate-y-4"></div>
        ) : location === 'river' ? (
           <>
             <div className={`w-1/3 h-full transform skew-x-12 origin-bottom-left transition-colors duration-[3000ms] -ml-12 ${isNight ? 'bg-slate-900' : 'bg-slate-800'}`}></div>
             <div className={`w-1/3 h-full transform -skew-x-12 origin-bottom-right transition-colors duration-[3000ms] ml-auto -mr-12 ${isNight ? 'bg-slate-900' : 'bg-slate-800'}`}></div>
           </>
        ) : location === 'swamp' ? (
           <>
             <div className={`absolute bottom-0 left-10 w-8 h-32 bg-slate-900/80 rounded-full blur-[1px]`}></div>
             <div className={`absolute bottom-0 right-20 w-12 h-24 bg-slate-900/80 rounded-full blur-[1px]`}></div>
             <div className={`w-full h-20 bg-gradient-to-t from-black to-transparent opacity-60`}></div>
           </>
        ) : location === 'deep_sea' ? (
            <>
               <div className="absolute top-0 left-0 w-full h-full bg-black"></div>
               {/* Bioluminescent plants */}
               <div className="absolute bottom-5 left-10 w-2 h-10 bg-cyan-500/20 blur-sm rounded-full animate-pulse"></div>
               <div className="absolute bottom-8 right-20 w-2 h-14 bg-purple-500/20 blur-sm rounded-full animate-pulse delay-500"></div>
            </>
        ) : location === 'sky' ? (
            <>
               <div className="absolute top-0 left-0 w-full h-full bg-white/10 blur-xl"></div>
               <div className="absolute bottom-10 left-10 w-32 h-16 bg-slate-800 rounded-full blur-[2px] opacity-50"></div>
            </>
        ) : (
           <>
             <div className={`w-1/2 h-32 rounded-tr-[100px] transition-colors duration-[3000ms] ${isNight ? 'bg-slate-900' : 'bg-emerald-900'}`}></div>
             <div className={`w-1/2 h-24 rounded-tl-[80px] transition-colors duration-[3000ms] ${isNight ? 'bg-slate-900' : 'bg-emerald-950'} -ml-10`}></div>
           </>
        )}
      </div>

      {/* --- WATER LAYER --- */}
      <div className={`absolute bottom-0 w-full h-[35%] border-t backdrop-blur-[2px] overflow-hidden transition-colors duration-1000 ${getWaterClass()}`}>
        
        {/* Animated Texture */}
        <div className="absolute inset-0 opacity-20 water-texture"></div>
        
        {/* Dynamic Reflection (Hidden in Deep Sea) */}
        {location !== 'deep_sea' && (
            <div 
            className="absolute h-full w-20 bg-white/10 blur-xl transform skew-x-12 transition-all duration-[5000ms]"
            style={{ right: `${95 - (dayTime * 90)}%` }}
            ></div>
        )}

        {/* Fishing Line Reflection */}
        {status !== 'IDLE' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-white/20 blur-[1px]"></div>
        )}
      </div>

      {/* --- ACTION TEXT --- */}
      <div className="absolute top-1/4 w-full text-center pointer-events-none z-20">
        <span className={`
          inline-block pixel-font font-bold text-xl tracking-widest drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]
          transition-all duration-200
          ${status === 'BITING' ? 'text-red-400 scale-125 animate-bounce' : 'text-white'}
          ${status === 'REELING' ? 'text-yellow-300 scale-110' : ''}
        `}>
          {status === 'IDLE' && (isNight ? "夜晚垂釣" : "點擊拋竿")}
          {status === 'CASTING' && "拋竿..."}
          {status === 'WAITING' && "等待中..."}
          {status === 'BITING' && "咬鉤了!"}
          {status === 'REELING' && "收竿!"}
        </span>
      </div>

      {/* --- BOBBER & LINE --- */}
      <div className={`
        absolute left-1/2 z-10 transition-all duration-300 origin-top
        ${status === 'IDLE' ? 'bottom-[35%] opacity-0 translate-y-10' : 'opacity-100'}
        ${status === 'WAITING' ? 'bottom-[33%] -translate-x-1/2 animate-bob' : ''}
        ${status === 'BITING' ? 'bottom-[30%] animate-shake' : ''} 
        ${status === 'REELING' ? 'bottom-[32%] -translate-x-1/2' : ''} 
        ${status === 'CASTING' ? 'bottom-[35%] -translate-x-1/2' : ''}
      `}
      style={{
         // Add dynamic shake based on progress during reeling
         animation: status === 'REELING' ? `shake-hard ${1.1 - progress}s infinite` : undefined
      }}
      >
        {/* Line */}
        <div className={`
          absolute bottom-4 left-1/2 -translate-x-1/2 w-[1px] origin-bottom transition-all duration-150
          ${status === 'IDLE' ? 'h-0 bg-transparent' : 'h-[300px] bg-white/60'}
          ${status === 'BITING' ? 'bg-red-400 w-[2px]' : ''}
          ${status === 'REELING' ? 'bg-yellow-300 w-[2px]' : ''}
        `}></div>

        {/* Foolproof visual: Bite Exclamation */}
        {status === 'BITING' && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-red-500 animate-bounce">
                <AlertCircle size={32} fill="white" />
            </div>
        )}

        {/* Bobber Container */}
        <div className="relative flex items-center justify-center">
           {/* Splash Effect when biting */}
           {status === 'BITING' && (
             <div className="absolute -inset-4 border-2 border-white/50 rounded-full animate-ping"></div>
           )}

           {renderBobber()}
        </div>
      </div>

      {/* --- PROGRESS BAR --- */}
      {(status === 'CASTING' || status === 'REELING') && (
        <div className={`
          absolute bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-4 rounded-full border-2 z-20 overflow-hidden shadow-lg
          ${status === 'REELING' ? 'bg-black/60 border-yellow-500' : 'bg-black/60 border-blue-400'}
        `}>
          <div 
            className={`h-full transition-all duration-75 ease-linear relative ${status === 'REELING' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' : 'bg-blue-400'}`}
            style={{ width: `${progress * 100}%` }}
          >
             {/* Shine effect on bar */}
             <div className="absolute inset-0 bg-white/20"></div>
          </div>
        </div>
      )}

      {/* Click Hint */}
      {status === 'IDLE' && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center hover:bg-transparent transition-colors">
           <div className="w-16 h-16 border-2 border-dashed border-white/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
        </div>
      )}
    </div>
  );
};

export default FishingScene;
