
import React, { useEffect, useState } from 'react';
import { CaughtFish, Rarity } from '../types';
import { FISH_TYPES, RARITY_INFO } from '../constants';
import FishIcon from './FishIcon';
import PixelCard from './PixelCard';
import { Coins, Waves, Recycle, Sparkles, Gem } from 'lucide-react';
import { formatNumber } from '../services/gameService';

interface CatchModalProps {
  fish: CaughtFish;
  onKeep: () => void;
  onSell: () => void;
  isTankFull: boolean;
}

const CatchModal: React.FC<CatchModalProps> = ({ fish, onKeep, onSell, isTankFull }) => {
  const type = FISH_TYPES.find(t => t.id === fish.typeId);
  const rarity = type ? RARITY_INFO[type.rarity] : RARITY_INFO['Common'];
  const isJunk = type?.rarity === 'Junk';
  const isTreasure = type?.rarity === 'Treasure';
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Small delay for entrance animation
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Determine glow color based on rarity
  let glowColor = 'shadow-white/20';
  let bgColor = 'bg-slate-900';
  
  switch(type?.rarity) {
      case 'Mythic': glowColor = 'shadow-red-500/80'; bgColor = 'bg-red-950'; break;
      case 'Legendary': glowColor = 'shadow-yellow-400/80'; bgColor = 'bg-yellow-950'; break;
      case 'Epic': glowColor = 'shadow-purple-500/60'; bgColor = 'bg-purple-950'; break;
      case 'Rare': glowColor = 'shadow-cyan-400/50'; bgColor = 'bg-cyan-950'; break;
      case 'Treasure': glowColor = 'shadow-amber-400/80'; bgColor = 'bg-amber-950'; break;
      case 'Junk': glowColor = 'shadow-stone-500/20'; bgColor = 'bg-stone-900'; break;
  }

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in">
      
      {/* Light Rays Background for Rare+ */}
      {(type?.rarity === 'Legendary' || type?.rarity === 'Mythic' || type?.rarity === 'Treasure') && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.1)_20deg,transparent_40deg,rgba(255,255,255,0.1)_60deg,transparent_80deg)] animate-[spin_10s_linear_infinite]"></div>
          </div>
      )}

      <div className={`relative w-full max-w-sm transition-all duration-500 transform ${show ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10'}`}>
        <PixelCard className={`border-4 border-white/20 ${bgColor} shadow-[0_0_50px_0_rgba(0,0,0,0.5)] ${glowColor}`}>
            
            {/* Header: Rarity Badge */}
            <div className="flex justify-center -mt-8 mb-4">
                <div className={`
                    px-4 py-1 rounded-full border-2 border-black shadow-lg font-bold text-sm tracking-widest uppercase
                    ${rarity.color.replace('text-', 'bg-').replace('-400', '-600').replace('-500', '-600')} text-white
                    animate-bounce-small
                `}>
                    {rarity.label}
                </div>
            </div>

            {/* Fish Display */}
            <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Glow behind fish */}
                    <div className={`absolute inset-0 rounded-full blur-[40px] opacity-60 ${rarity.color.replace('text-', 'bg-')}`}></div>
                    
                    <div className="relative z-10 animate-float-slow transform scale-150 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                        <FishIcon speciesId={fish.typeId} size={96} />
                    </div>
                    
                    {fish.isNewSpecies && (
                        <div className="absolute -top-2 -right-4 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded border border-white animate-pulse">
                            NEW!
                        </div>
                    )}
                    
                    {/* Record Badge */}
                    {!isJunk && !isTreasure && fish.isNewRecord && !fish.isNewSpecies && (
                        <div className="absolute -bottom-2 -right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white animate-pulse">
                            RECORD!
                        </div>
                    )}
                </div>

                <div className="text-center space-y-1">
                    <h2 className={`text-2xl font-bold ${rarity.color} drop-shadow-md`}>{type?.name}</h2>
                    {!isJunk && !isTreasure && (
                        <p className="text-slate-300 font-mono text-sm">{fish.size} cm</p>
                    )}
                    {type?.description && (
                        <p className="text-xs text-slate-400 max-w-[200px] mx-auto italic">{type.description}</p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-2">
                {/* Sell / Recycle Action */}
                <button 
                    onClick={onSell}
                    className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 rounded active:scale-95 transition-all group"
                >
                    {isJunk ? (
                        <>
                            <span className="text-xs font-bold text-blue-300 mb-1 group-hover:text-white">回收</span>
                            <div className="flex items-center gap-1 text-yellow-400 font-mono text-lg">
                                <Recycle size={16} /> +{fish.price}
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="text-xs font-bold text-red-300 mb-1 group-hover:text-white">出售</span>
                            <div className="flex items-center gap-1 text-yellow-400 font-mono text-lg">
                                <Coins size={16} /> +{formatNumber(fish.price)}
                            </div>
                        </>
                    )}
                </button>

                {/* Keep Action */}
                {!isJunk && !isTreasure ? (
                    <button 
                        onClick={onKeep}
                        disabled={isTankFull}
                        className={`
                            flex flex-col items-center justify-center p-3 border-2 rounded active:scale-95 transition-all group
                            ${isTankFull 
                                ? 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed' 
                                : 'bg-cyan-900/50 hover:bg-cyan-800 border-cyan-500 hover:border-cyan-400'}
                        `}
                    >
                        <span className={`text-xs font-bold mb-1 ${isTankFull ? 'text-slate-500' : 'text-cyan-300 group-hover:text-white'}`}>
                            {isTankFull ? '魚缸已滿' : '放入魚缸'}
                        </span>
                        <div className={`flex items-center gap-1 font-mono text-lg ${isTankFull ? 'text-slate-500' : 'text-cyan-400'}`}>
                            <Waves size={16} />
                        </div>
                    </button>
                ) : (
                    /* Treasure/Junk Keep alternative (maybe just close or grab item) */
                    <button 
                        onClick={onSell} // Treasure/Junk technically "sold" or "claimed" immediately in this simplified flow, but for Treasure let's simulate claiming
                        className="flex flex-col items-center justify-center p-3 bg-amber-900/50 hover:bg-amber-800 border-2 border-amber-500 rounded active:scale-95 transition-all group"
                    >
                         <span className="text-xs font-bold text-amber-200 mb-1 group-hover:text-white">收下</span>
                         <div className="flex items-center gap-1 text-amber-400 font-mono text-lg">
                            <Sparkles size={16} />
                         </div>
                    </button>
                )}
            </div>

        </PixelCard>
      </div>
      
      <style>{`
        @keyframes float-slow {
            0%, 100% { transform: translateY(0) scale(1.5); }
            50% { transform: translateY(-10px) scale(1.5); }
        }
        .animate-float-slow {
            animation: float-slow 3s ease-in-out infinite;
        }
        @keyframes bounce-small {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }
        .animate-bounce-small {
            animation: bounce-small 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default CatchModal;
