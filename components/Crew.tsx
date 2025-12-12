
import React, { useMemo } from 'react';
import { CatDef, GameStats } from '../types';
import { CATS } from '../constants';
import PixelCard from './PixelCard';
import CatIcon from './CatIcon';
import { Award, TrendingUp, Fish, Coins, ArrowBigUp, UserPlus, Star } from 'lucide-react';
import { formatNumber, getCrewUpgradeCost } from '../services/gameService';

interface CrewProps {
  money: number;
  hiredCrew: string[];
  crewLevels: Record<string, number>;
  stats: GameStats;
  onHire: (id: string) => void;
  onUpgrade: (id: string) => void;
}

const LoungeItem: React.FC<{ type: string, x: number }> = ({ type, x }) => {
    return (
        <div 
            className="absolute bottom-4"
            style={{ left: `${x}%`, transform: 'translateX(-50%)' }}
        >
            {type === 'box' && (
                <div className="w-12 h-8 bg-amber-700/80 border-2 border-amber-900 shadow-sm relative">
                    <div className="absolute -top-4 left-0 w-4 h-4 bg-amber-700/80 border-2 border-amber-900 transform -skew-x-12 origin-bottom"></div>
                    <div className="absolute -top-4 right-0 w-4 h-4 bg-amber-700/80 border-2 border-amber-900 transform skew-x-12 origin-bottom"></div>
                </div>
            )}
            {type === 'scratcher' && (
                <div className="w-8 h-12 bg-amber-200 border-2 border-amber-400 relative">
                    <div className="w-6 h-full mx-auto bg-[repeating-linear-gradient(0deg,#d97706,#d97706_1px,transparent_1px,transparent_4px)]"></div>
                    <div className="absolute bottom-0 -left-2 w-12 h-2 bg-amber-800"></div>
                </div>
            )}
            {type === 'cushion' && (
                <div className="w-14 h-6 bg-red-800 rounded-full border-2 border-red-950 shadow-inner"></div>
            )}
        </div>
    );
};

const Crew: React.FC<CrewProps> = ({ money, hiredCrew, crewLevels, stats, onHire, onUpgrade }) => {
  
  // Stable furniture generation based on hired count to avoid flicker
  const furniture = useMemo(() => {
      const items = [];
      const count = hiredCrew.length;
      if (count > 0) items.push({ type: 'cushion', x: 20 });
      if (count > 2) items.push({ type: 'scratcher', x: 80 });
      if (count > 4) items.push({ type: 'box', x: 50 });
      return items;
  }, [hiredCrew.length]);

  return (
    <div className="h-full flex flex-col bg-[#3f2e18]">
      
      {/* --- Guild Hall Scene --- */}
      <div className="h-44 shrink-0 bg-[#271c0f] border-b-4 border-[#181109] relative overflow-hidden shadow-lg">
          {/* Room Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#291d12_0%,#3e2723_100%)]"></div>
          
          {/* Wall Decor */}
          <div className="absolute top-4 left-10 w-8 h-10 bg-black/30 border border-white/10 flex items-center justify-center">
              <div className="text-[8px] text-white/20 font-mono">MAP</div>
          </div>
          <div className="absolute top-6 right-20 w-16 h-4 bg-black/20 rounded-full blur-sm"></div>

          {/* Floor */}
          <div className="absolute bottom-0 w-full h-12 bg-[#5d4037] border-t-2 border-[#8d6e63] shadow-[inset_0_5px_10px_rgba(0,0,0,0.3)]"></div>
          
          {/* Furniture */}
          {furniture.map((item, i) => <LoungeItem key={i} {...item} />)}

          {/* Cats */}
          {hiredCrew.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-[#a1887f] text-xs font-bold tracking-widest opacity-50">
                  招募夥伴來啟用休息室
              </div>
          ) : (
              hiredCrew.map((id, index) => {
                  const cat = CATS.find(c => c.id === id);
                  if (!cat) return null;
                  
                  // Position logic
                  const slots = [20, 50, 80, 35, 65]; 
                  const xPos = slots[index % slots.length];
                  // If on furniture, elevate slightly
                  const isSleeping = index === 0; // First cat sleeps on cushion
                  const isPlaying = index === 2; // Cat on scratcher?
                  
                  let pose: 'sitting' | 'sleeping' = 'sitting';
                  let yOffset = 0;

                  if (isSleeping) {
                      pose = 'sleeping';
                      yOffset = 4; // On cushion
                  }

                  return (
                      <div 
                        key={id} 
                        className="absolute bottom-6 transition-all duration-1000 ease-in-out hover:scale-110 z-10 cursor-help"
                        style={{ left: `${xPos}%`, transform: 'translateX(-50%)', marginBottom: `${yOffset}px` }}
                        title={`${cat.name} (Lv.${crewLevels[id]})`}
                      >
                          <CatIcon color={cat.color} size={40} pose={pose} />
                          {/* Floating Zzz or music note */}
                          {isSleeping && (
                              <div className="absolute -top-4 right-0 text-[10px] text-slate-400 animate-bounce">zZ</div>
                          )}
                      </div>
                  );
              })
          )}
      </div>

      {/* --- Stats Strip --- */}
      <div className="bg-[#4e342e] p-1.5 flex justify-between items-center shadow-md z-10 border-b border-[#3e2723]">
          <div className="flex items-center gap-2 px-2">
              <Award size={14} className="text-yellow-400" />
              <span className="text-[10px] font-bold text-[#efebe9] tracking-wider">貓咪公會成員</span>
          </div>
          <div className="flex gap-3 px-2">
              <div className="flex items-center gap-1 bg-black/20 px-2 rounded-full border border-white/5">
                  <Fish size={10} className="text-blue-300" />
                  <span className="text-[9px] text-[#d7ccc8] font-mono">{formatNumber(stats.totalFishCaught)}</span>
              </div>
          </div>
      </div>

      {/* --- Crew List (ID Cards) --- */}
      <div className="flex-1 overflow-y-auto p-2 bg-[#3f2e18]">
        <div className="grid grid-cols-1 gap-2">
          {CATS.map(cat => {
            const isHired = hiredCrew.includes(cat.id);
            const level = crewLevels?.[cat.id] || 1;
            const upgradeCost = getCrewUpgradeCost(cat.cost, level);
            const canHire = money >= cat.cost;
            const canUpgrade = money >= upgradeCost;

            return (
              <div 
                key={cat.id} 
                className={`relative flex items-stretch border-2 rounded-lg overflow-hidden transition-all shadow-sm ${isHired ? 'bg-[#2d241b] border-[#8d6e63]' : 'bg-[#1e1510] border-[#3e2723] opacity-80'}`}
              >
                {/* Left: ID Photo */}
                <div className={`w-20 shrink-0 flex flex-col items-center justify-center border-r-2 ${isHired ? 'bg-[#3e2e23] border-[#5d4037]' : 'bg-[#2a1e16] border-[#3e2723]'}`}>
                    <CatIcon color={cat.color} size={48} />
                    {isHired ? (
                        <div className="mt-1 bg-black/30 px-2 rounded text-[9px] text-yellow-500 font-mono font-bold border border-yellow-900/50">
                            Lv.{level}
                        </div>
                    ) : (
                        <div className="mt-1 text-[9px] text-slate-500 font-bold">未招募</div>
                    )}
                </div>

                {/* Right: Info & Actions */}
                <div className="flex-1 p-2 flex flex-col justify-between min-w-0">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className={`font-bold text-sm leading-none ${isHired ? 'text-[#efebe9]' : 'text-[#8d6e63]'}`}>{cat.name}</h4>
                                <span className="text-[9px] text-[#a1887f] uppercase tracking-wider">{cat.title}</span>
                            </div>
                            {isHired && <Star size={12} className="text-yellow-600" fill="currentColor" />}
                        </div>
                        <div className="mt-1 h-[1px] bg-[#3e2723] w-full"></div>
                        <p className="text-[10px] text-[#d7ccc8] mt-1 leading-tight">{cat.description}</p>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                        {isHired ? (
                            <>
                                <div className="text-[9px] font-mono text-green-400 bg-green-950/30 px-1.5 py-0.5 rounded border border-green-900/50">
                                    當前加成: <span className="font-bold">+{Math.round(cat.bonusValue * (1 + 0.1 * (level - 1)) * 100)}%</span>
                                </div>
                                <button
                                    onClick={() => onUpgrade(cat.id)}
                                    disabled={!canUpgrade}
                                    className={`flex items-center gap-1 px-3 py-1 rounded text-[10px] font-bold border-b-2 active:border-b-0 active:translate-y-0.5 transition-all ${canUpgrade ? 'bg-amber-700 hover:bg-amber-600 text-white border-amber-900' : 'bg-slate-800 text-slate-500 border-slate-900 cursor-not-allowed'}`}
                                >
                                    <ArrowBigUp size={10} /> 升級 ({formatNumber(upgradeCost)})
                                </button>
                            </>
                        ) : (
                            <div className="w-full flex justify-end">
                                <button
                                    onClick={() => onHire(cat.id)}
                                    disabled={!canHire}
                                    className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded text-xs font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all ${canHire ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-800' : 'bg-slate-800 text-slate-500 border-slate-900 cursor-not-allowed'}`}
                                >
                                    <UserPlus size={14} /> 簽約金: {formatNumber(cat.cost)} G
                                </button>
                            </div>
                        )}
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Crew;
