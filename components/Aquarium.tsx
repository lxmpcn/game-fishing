
import React, { useMemo, useState } from 'react';
import { CaughtFish, Rarity } from '../types';
import { FISH_TYPES, RARITY_INFO, AQUARIUM_SKINS } from '../constants';
import { calculateAquariumIncome, getTankCapacity, formatNumber } from '../services/gameService';
import FishIcon from './FishIcon';
import PixelCard from './PixelCard';
import { Coins, ArrowDownToLine, ArrowDownUp } from 'lucide-react';

interface AquariumProps {
  fish: CaughtFish[];
  tankLevel: number;
  hiredCrew: string[];
  crewLevels: Record<string, number>;
  activeSkinId: string;
  onSell: (id: string) => void;
  onRetrieve: (id: string) => void;
}

type SortOption = 'INCOME_HIGH' | 'INCOME_LOW' | 'RARITY_HIGH';

const RARITY_WEIGHT: Record<Rarity, number> = {
  'Mythic': 6,
  'Treasure': 5,
  'Legendary': 4,
  'Epic': 3,
  'Rare': 2,
  'Common': 1,
  'Junk': 0,
};

// Deterministic random generator based on string seed
const getStableRandom = (seedStr: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) / 4294967296;
};

const SwimmingFish: React.FC<{ fish: CaughtFish }> = ({ fish }) => {
  const type = FISH_TYPES.find(t => t.id === fish.typeId);
  if (!type) return null;

  // Calculate stable visual properties based on UID
  const props = useMemo(() => {
    const rng1 = getStableRandom(fish.uid + 'pos');
    const rng2 = getStableRandom(fish.uid + 'speed');
    const rng3 = getStableRandom(fish.uid + 'depth');

    const depth = rng3; 

    const actualSize = fish.size || 20; 
    let sizeScale = Math.log10(actualSize + 5) / 1.4;
    sizeScale = Math.max(0.4, Math.min(sizeScale, 2.5));

    const depthScale = 1 - (depth * 0.4); 
    const finalScale = sizeScale * depthScale;

    const zIndex = Math.floor((1 - depth) * 100);
    const opacity = 0.8 + (1 - depth) * 0.2; 
    const brightness = 70 + (1 - depth) * 30; 

    const sizeSpeedFactor = 2 / sizeScale; 
    
    const top = 10 + (rng1 * 70); 
    const duration = (20 + (depth * 10) + (rng2 * 10)) * sizeSpeedFactor; 
    const delay = -(rng2 * duration); 
    
    const floatDuration = 3 + (rng3 * 2);
    const floatDelay = -(rng1 * 10);

    return {
      top: `${top}%`,
      scale: finalScale,
      zIndex,
      filter: `brightness(${brightness}%)`,
      opacity,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      floatDuration: `${floatDuration}s`,
      floatDelay: `${floatDelay}s`
    };
  }, [fish.uid, fish.size]);

  return (
    <div 
      className="absolute left-0 w-full h-0 pointer-events-none"
      style={{ 
        top: props.top, 
        zIndex: props.zIndex,
      }}
    >
      <div 
        className="absolute animate-swim-cycle will-change-transform"
        style={{
          animationDuration: props.animationDuration,
          animationDelay: props.animationDelay,
        }}
      >
        <div 
          className="animate-float-vertical"
          style={{
            animationDuration: props.floatDuration,
            animationDelay: props.floatDelay,
          }}
        >
            <div
                style={{
                    transformOrigin: 'center',
                    transform: `scale(${props.scale})`,
                    filter: props.filter,
                    opacity: props.opacity,
                }}
            >
                <div className="inner-fish-flipper">
                    <FishIcon speciesId={fish.typeId} size={32} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const DecorLayer: React.FC<{ type?: string }> = ({ type }) => {
    if (!type) return null;

    if (type === 'coral') {
        return (
            <>
                <div className="absolute bottom-0 left-10 w-8 h-20 bg-red-400/40 rounded-t-full blur-sm"></div>
                <div className="absolute bottom-0 right-20 w-12 h-14 bg-orange-400/40 rounded-t-full blur-sm"></div>
                <div className="absolute bottom-[-10px] left-[30%] w-24 h-24 bg-pink-500/20 rounded-full blur-md"></div>
            </>
        );
    }
    if (type === 'weed' || type === 'river_stones') {
        return (
            <>
                {/* Reeds */}
                <div className="absolute bottom-0 left-5 w-1 h-32 bg-green-800/40 rounded-t-full transform rotate-3"></div>
                <div className="absolute bottom-0 left-8 w-1 h-24 bg-green-700/40 rounded-t-full transform -rotate-2"></div>
                <div className="absolute bottom-0 right-10 w-2 h-40 bg-emerald-900/30 rounded-t-full blur-[1px]"></div>
                
                {/* Stones for river */}
                {type === 'river_stones' && (
                    <>
                        <div className="absolute bottom-0 left-20 w-10 h-6 bg-stone-700 rounded-t-xl opacity-60"></div>
                        <div className="absolute bottom-0 right-1/4 w-16 h-8 bg-stone-600 rounded-t-full opacity-50"></div>
                    </>
                )}
            </>
        );
    }
    if (type === 'roots') {
        return (
            <>
                <div className="absolute top-0 right-10 w-4 h-[60%] bg-amber-900/40 rounded-b-full blur-[1px]"></div>
                <div className="absolute top-0 right-20 w-2 h-[40%] bg-amber-950/40 rounded-b-full"></div>
                <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-black to-transparent opacity-60"></div>
            </>
        );
    }
    if (type === 'grid') {
        return (
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(0,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.3)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        );
    }
    if (type === 'space') {
        return (
            <>
                <div className="absolute top-10 left-10 w-1 h-1 bg-white animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-1 h-1 bg-white animate-pulse delay-75"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
                {/* Planet */}
                <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-900 opacity-60 shadow-lg"></div>
            </>
        );
    }
    if (type === 'toy_castle') {
        return (
            <>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-20 bg-pink-500/20 rounded-t-lg blur-[1px]"></div>
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-10 h-10 bg-purple-500/20 rounded-t-lg"></div>
                <div className="absolute bottom-0 right-10 w-8 h-8 bg-yellow-400/30 rounded-full"></div>
            </>
        );
    }
    return null;
};

const Aquarium: React.FC<AquariumProps> = ({ fish, tankLevel, hiredCrew, crewLevels, activeSkinId, onSell, onRetrieve }) => {
  const [sortBy, setSortBy] = useState<SortOption>('INCOME_HIGH');
  
  const capacity = getTankCapacity(tankLevel);
  const incomePerTenSec = calculateAquariumIncome(fish, hiredCrew, crewLevels);
  const incomePerMin = incomePerTenSec * 6;
  const skin = AQUARIUM_SKINS.find(s => s.id === activeSkinId) || AQUARIUM_SKINS[0];

  // Sorted list logic
  const sortedFish = useMemo(() => {
     const list = [...fish];
     list.sort((a, b) => {
        const incomeA = Math.floor(a.price * 0.05);
        const incomeB = Math.floor(b.price * 0.05);
        const typeA = FISH_TYPES.find(t => t.id === a.typeId);
        const typeB = FISH_TYPES.find(t => t.id === b.typeId);
        const rankA = typeA ? RARITY_WEIGHT[typeA.rarity] : 0;
        const rankB = typeB ? RARITY_WEIGHT[typeB.rarity] : 0;

        if (sortBy === 'INCOME_HIGH') return incomeB - incomeA;
        if (sortBy === 'INCOME_LOW') return incomeA - incomeB;
        if (sortBy === 'RARITY_HIGH') return rankB - rankA;
        return 0;
     });
     return list;
  }, [fish, sortBy]);

  return (
    <div className="h-full flex flex-col gap-2">
      <style>{`
        @keyframes swim-cycle {
          0% { left: -10%; transform: scaleX(1); }
          49% { left: 110%; transform: scaleX(1); }
          50% { left: 110%; transform: scaleX(-1); }
          99% { left: -10%; transform: scaleX(-1); }
          100% { left: -10%; transform: scaleX(1); }
        }
        .animate-swim-cycle {
          animation-name: swim-cycle;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          width: 40px; 
        }
        @keyframes float-vertical {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float-vertical {
          animation-name: float-vertical;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>

      {/* Tank Status Header */}
      <div className="px-1 flex justify-between items-end">
        <div>
           <h3 className="text-cyan-400 text-xs uppercase tracking-widest font-bold">水族箱</h3>
           <p className="text-[10px] text-slate-400">容量: {fish.length}/{capacity}</p>
        </div>
        
        {/* Sorting & Stats */}
        <div className="flex items-center gap-4">
             {/* Sort Select */}
             <div className="relative group">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <ArrowDownUp size={10} />
                </div>
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-slate-800 text-[9px] font-bold text-slate-300 border border-slate-700 rounded pl-6 pr-2 py-0.5 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
                >
                    <option value="INCOME_HIGH">收益 (高)</option>
                    <option value="INCOME_LOW">收益 (低)</option>
                    <option value="RARITY_HIGH">稀有度</option>
                </select>
             </div>

             <div className="text-right">
                <div className="flex items-center gap-1 text-green-400 font-mono text-xs font-bold bg-green-900/20 px-2 py-0.5 rounded border border-green-900/50">
                    +{formatNumber(incomePerMin)} <Coins size={10} /> / min
                </div>
             </div>
        </div>
      </div>

      {/* Visual Tank View */}
      <PixelCard className="h-48 shrink-0 relative overflow-hidden group shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] border-cyan-900">
        
        {/* Dynamic Background */}
        <div 
            className="absolute inset-0 z-0 transition-all duration-1000"
            style={{ background: skin.bgGradient }}
        ></div>
        
        {/* Decor Layer */}
        <DecorLayer type={skin.decorElement} />
        
        {/* Light Shafts */}
        <div className="absolute -top-10 left-1/4 w-20 h-full bg-gradient-to-b from-white/10 to-transparent transform -skew-x-12 blur-md z-0 pointer-events-none mix-blend-overlay"></div>

        {/* Bubbles Animation */}
        <div className="absolute bottom-0 left-10 w-1 h-1 bg-white/20 rounded-full animate-[bob_3s_infinite] z-0"></div>
        <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-white/10 rounded-full animate-[bob_5s_infinite] z-0"></div>
        <div className="absolute bottom-0 right-20 w-1 h-1 bg-white/30 rounded-full animate-[bob_4s_infinite] z-0"></div>

        {/* Swimming Fish Layer */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          {fish.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs font-bold tracking-widest">
              EMPTY TANK
            </div>
          )}
          {fish.map((f) => (
            <SwimmingFish key={f.uid} fish={f} />
          ))}
        </div>
        
        {/* Foreground Glass Glare */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/05 to-transparent skew-x-12 pointer-events-none z-20"></div>

      </PixelCard>

      {/* Fish List Management */}
      <PixelCard className="flex-1 min-h-0 bg-slate-900/50">
        <div className="h-full overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {sortedFish.map(f => {
            const type = FISH_TYPES.find(t => t.id === f.typeId);
            if (!type) return null;
            const rarity = RARITY_INFO[type.rarity];
            const income = Math.floor(f.price * 0.05);

            return (
              <div key={f.uid} className="flex items-center justify-between bg-slate-800/80 p-2 rounded border border-slate-700/50 hover:bg-slate-800 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 flex items-center justify-center bg-slate-900 rounded border border-slate-700">
                     <FishIcon speciesId={f.typeId} size={24} />
                     <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${rarity.color}`}>{type.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono bg-black/30 px-1 rounded">{f.size}cm</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-green-300 font-mono mt-0.5">
                      <span className="text-slate-400">產出:</span> +{formatNumber(income * 6)} <Coins size={8} /> / min
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => onRetrieve(f.uid)}
                        className="p-1.5 bg-indigo-900/50 hover:bg-indigo-800 border border-indigo-700 hover:border-indigo-500 text-indigo-300 rounded transition-all active:scale-95 flex items-center gap-1"
                        title="收回背包"
                    >
                        <ArrowDownToLine size={12} />
                        <span className="text-[9px] font-bold hidden sm:inline">收回</span>
                    </button>
                    
                    <button 
                        onClick={() => onSell(f.uid)}
                        className="p-1.5 bg-red-950/30 hover:bg-red-900/50 border border-red-900 hover:border-red-500 text-red-400 rounded transition-all active:scale-95 flex items-center gap-1"
                        title="直接出售"
                    >
                        <Coins size={12} />
                        <span className="text-[9px] font-bold hidden sm:inline">出售</span>
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      </PixelCard>
    </div>
  );
};

export default Aquarium;
