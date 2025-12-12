
import React, { useState } from 'react';
import { GameState } from '../types';
import { UPGRADES, LOCATIONS, BAITS, CATS, BOBBERS, AQUARIUM_SKINS } from '../constants';
import { getUpgradeCost, formatNumber } from '../services/gameService';
import { Zap, Star, Cog, Map, ArrowUpCircle, Check, Coins, Briefcase, Gem, Lock, ShoppingCart, Anchor } from 'lucide-react';
import PixelCard from './PixelCard';
import CatIcon from './CatIcon';
import ItemIcon from './ItemIcon';

interface ShopProps {
  state: GameState;
  onBuyUpgrade: (id: string) => void;
  onBuyBait: (id: string) => void;
  onEquipBait: (id: string) => void;
  onBuyBobber: (id: string) => void;
  onEquipBobber: (id: string) => void;
  onBuySkin: (id: string) => void;
  onEquipSkin: (id: string) => void;
  onUnlockLocation: (id: string) => void;
}

type ShopCategory = 'ESSENTIALS' | 'CONSUMABLES' | 'TRAVEL' | 'LUXURY';

const Shop: React.FC<ShopProps> = ({ state, onBuyUpgrade, onBuyBait, onEquipBait, onBuyBobber, onEquipBobber, onUnlockLocation, onBuySkin, onEquipSkin }) => {
  const [category, setCategory] = useState<ShopCategory>('ESSENTIALS');

  // Shop is always run by Ginger (Shopkeeper)
  const shopkeeperColor = '#fb923c'; 
  const shopkeeperName = '橘子';
  const shopkeeperTitle = '雜貨商';

  return (
    <div className="h-full flex flex-col bg-[#3f2e18] relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[repeating-linear-gradient(90deg,#271c0f,#271c0f_20px,#3f2e18_20px,#3f2e18_40px)]"></div>

      {/* --- Merchant Area (Top) --- */}
      <div className="relative h-36 shrink-0 bg-[#271c0f] border-b-4 border-[#181109] shadow-lg flex items-end justify-center pb-2">
         {/* Shelves Background */}
         <div className="absolute inset-0 opacity-30 flex flex-col justify-evenly px-4 py-2">
             <div className="h-2 bg-[#181109] w-full rounded shadow-inner"></div>
             <div className="h-2 bg-[#181109] w-full rounded shadow-inner"></div>
             <div className="h-2 bg-[#181109] w-full rounded shadow-inner"></div>
         </div>

         {/* Speech Bubble */}
         <div className="absolute top-2 left-2 right-2 flex justify-center z-20">
             <div className="bg-white text-black text-xs font-bold px-3 py-2 rounded-xl rounded-bl-none shadow-md border-2 border-slate-300 max-w-[200px] text-center animate-bounce-small">
                 {category === 'ESSENTIALS' && "工欲善其事，必先利其器！"}
                 {category === 'CONSUMABLES' && "今天的魚餌特別新鮮喔！"}
                 {category === 'TRAVEL' && "世界那麼大，不想去看看嗎？"}
                 {category === 'LUXURY' && "這些可是有錢也買不到的珍品。"}
             </div>
         </div>

         {/* The Shopkeeper (Static) */}
         <div className="relative z-10">
             <div className="absolute -bottom-2 -left-8 w-32 h-8 bg-black/30 rounded-full blur-md"></div>
             <CatIcon color={shopkeeperColor} size={80} pose="merchant" />
             {/* Counter Top */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-4 bg-[#5d4037] border-t border-[#8d6e63] rounded-t shadow-lg translate-y-2"></div>
         </div>

         {/* Name Plate */}
         <div className="absolute bottom-4 right-4 bg-[#181109] border border-[#8d6e63] px-2 py-1 rounded text-[9px] text-[#d7ccc8] font-bold tracking-widest shadow">
             {shopkeeperTitle}: {shopkeeperName}
         </div>
      </div>

      {/* --- Category Tabs --- */}
      <div className="flex bg-[#271c0f] p-1 gap-1 shrink-0 overflow-x-auto custom-scrollbar border-b border-[#5d4037]">
          {[
              { id: 'ESSENTIALS', label: '生存裝備', icon: Anchor },
              { id: 'CONSUMABLES', label: '釣具耗材', icon: ShoppingCart },
              { id: 'TRAVEL', label: '冒險地圖', icon: Map },
              { id: 'LUXURY', label: '珍寶外觀', icon: Gem },
          ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id as ShopCategory)}
                className={`
                    flex-1 min-w-[70px] py-2 flex flex-col items-center gap-1 rounded transition-all border-b-4 active:border-b-0 active:translate-y-1
                    ${category === tab.id 
                        ? 'bg-[#5d4037] border-[#8d6e63] text-yellow-400 shadow-inner' 
                        : 'bg-[#3e2723] border-[#271c0f] text-[#a1887f] hover:bg-[#4e342e]'}
                `}
              >
                  <tab.icon size={16} />
                  <span className="text-[9px] font-bold">{tab.label}</span>
              </button>
          ))}
      </div>

      {/* --- Items Grid --- */}
      <div className="flex-1 overflow-y-auto p-2 bg-[#3f2e18]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-4">
              
              {/* UPGRADES */}
              {category === 'ESSENTIALS' && UPGRADES.map(u => {
                  const level = state.upgrades[u.id] || 0;
                  const cost = getUpgradeCost(u, level);
                  const canAfford = state.money >= cost;
                  const isMaxed = level >= u.maxLevel;
                  
                  let Icon = Cog;
                  if (u.type === 'SPEED') Icon = Zap;
                  if (u.type === 'LUCK') Icon = Star;
                  if (u.type === 'AUTO_CAST' || u.type === 'AUTO_REEL') Icon = ArrowUpCircle;

                  return (
                      <div key={u.id} className="bg-[#271c0f] border-2 border-[#5d4037] p-2 rounded flex gap-2 relative group">
                          <div className={`w-12 h-12 shrink-0 bg-[#181109] rounded flex items-center justify-center border border-[#3e2723] ${isMaxed ? 'opacity-50' : ''}`}>
                              <Icon size={24} className={isMaxed ? 'text-slate-500' : 'text-yellow-500'} />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                  <h4 className="text-xs font-bold text-[#efebe9] truncate">{u.name}</h4>
                                  <p className="text-[9px] text-[#a1887f] leading-tight truncate">{u.description}</p>
                              </div>
                              <div className="flex justify-between items-end mt-1">
                                  <span className="text-[9px] text-[#8d6e63] font-mono">Lv.{level}</span>
                                  {isMaxed ? (
                                      <span className="text-[10px] text-green-500 font-bold">MAX</span>
                                  ) : (
                                      <button 
                                        onClick={() => onBuyUpgrade(u.id)}
                                        disabled={!canAfford}
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold border-b-2 active:border-b-0 active:translate-y-0.5 flex items-center gap-1 ${canAfford ? 'bg-green-700 text-white border-green-900 hover:bg-green-600' : 'bg-red-900/50 text-red-300 border-red-900 cursor-not-allowed'}`}
                                      >
                                          {formatNumber(cost)} <Coins size={8} />
                                      </button>
                                  )}
                              </div>
                          </div>
                      </div>
                  );
              })}

              {/* CONSUMABLES (Bait & Bobbers) */}
              {category === 'CONSUMABLES' && (
                  <>
                    <div className="col-span-full text-[10px] text-[#a1887f] font-bold border-b border-[#5d4037] mb-1">魚餌</div>
                    {BAITS.map(b => {
                        const canAfford = state.money >= b.cost;
                        const owned = state.baitInventory[b.id] || 0;
                        return (
                            <div key={b.id} className="bg-[#271c0f] border-2 border-[#5d4037] p-2 rounded flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <div className="w-10 h-10 shrink-0 bg-[#181109] rounded flex items-center justify-center border border-[#3e2723]">
                                        <ItemIcon type="bait" id={b.id} size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h4 className="text-xs font-bold text-[#efebe9]">{b.name}</h4>
                                            <span className="text-[9px] text-[#a1887f]">持有: {owned}</span>
                                        </div>
                                        <p className="text-[9px] text-[#8d6e63] leading-tight">{b.description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {owned > 0 && state.activeBaitId !== b.id && (
                                        <button onClick={() => onEquipBait(b.id)} className="flex-1 bg-blue-700 hover:bg-blue-600 text-white text-[9px] py-1 rounded font-bold border-b-2 border-blue-900 active:border-b-0 active:translate-y-0.5">裝備</button>
                                    )}
                                    {state.activeBaitId === b.id && (
                                        <div className="flex-1 bg-[#181109] text-green-400 text-[9px] py-1 rounded font-bold text-center border border-green-900">使用中</div>
                                    )}
                                    <button onClick={() => onBuyBait(b.id)} disabled={!canAfford} className={`flex-1 flex items-center justify-center gap-1 text-[9px] py-1 rounded font-bold border-b-2 active:border-b-0 active:translate-y-0.5 ${canAfford ? 'bg-amber-700 hover:bg-amber-600 text-white border-amber-900' : 'bg-slate-800 text-slate-500 border-slate-900'}`}>
                                        {formatNumber(b.cost)} <Coins size={8} /> <span className="text-[8px] opacity-70">x{b.charges}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    
                    <div className="col-span-full text-[10px] text-[#a1887f] font-bold border-b border-[#5d4037] mt-2 mb-1">浮標</div>
                    {BOBBERS.map(b => {
                        const isUnlocked = state.unlockedBobbers.includes(b.id);
                        const canAfford = state.money >= b.cost;
                        return (
                            <div key={b.id} className="bg-[#271c0f] border-2 border-[#5d4037] p-2 rounded flex items-center gap-2">
                                <div className="w-10 h-10 shrink-0 bg-[#181109] rounded flex items-center justify-center border border-[#3e2723]">
                                    <ItemIcon type="bobber" id={b.id} size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-[#efebe9]">{b.name}</h4>
                                    <div className="flex gap-1 mt-1">
                                        {isUnlocked ? (
                                            state.activeBobberId === b.id ? (
                                                <div className="text-[9px] text-green-400 font-bold">已裝備</div>
                                            ) : (
                                                <button onClick={() => onEquipBobber(b.id)} className="bg-blue-700 hover:bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded font-bold">裝備</button>
                                            )
                                        ) : (
                                            <button onClick={() => onBuyBobber(b.id)} disabled={!canAfford} className={`text-[9px] px-2 py-0.5 rounded font-bold flex items-center gap-1 ${canAfford ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                                {formatNumber(b.cost)} <Coins size={8} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                  </>
              )}

              {/* TRAVEL (Locations) */}
              {category === 'TRAVEL' && LOCATIONS.filter(l => l.cost > 0).map(l => {
                  const isUnlocked = state.unlockedLocations.includes(l.id);
                  const canAfford = state.money >= l.cost;
                  return (
                      <div key={l.id} className={`bg-[#271c0f] border-2 ${isUnlocked ? 'border-green-800' : 'border-[#5d4037]'} p-2 rounded flex flex-col relative overflow-hidden`}>
                          <div className={`absolute inset-0 bg-gradient-to-r ${l.bgGradient} opacity-20 pointer-events-none`}></div>
                          <div className="relative z-10 flex justify-between items-start mb-2">
                              <div>
                                  <h4 className="text-sm font-bold text-[#efebe9] flex items-center gap-1">
                                      <Map size={12} /> {l.name}
                                  </h4>
                                  <p className="text-[9px] text-[#a1887f] mt-1">{l.description}</p>
                              </div>
                              {isUnlocked && <Check size={16} className="text-green-500" />}
                          </div>
                          {!isUnlocked && (
                              <button 
                                onClick={() => onUnlockLocation(l.id)} 
                                disabled={!canAfford}
                                className={`relative z-10 w-full py-1.5 rounded font-bold text-xs border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-1 ${canAfford ? 'bg-purple-700 hover:bg-purple-600 text-white border-purple-900' : 'bg-slate-800 text-slate-500 border-slate-900'}`}
                              >
                                  解鎖: {formatNumber(l.cost)} <Coins size={10} />
                              </button>
                          )}
                      </div>
                  );
              })}

              {/* LUXURY (Skins) */}
              {category === 'LUXURY' && AQUARIUM_SKINS.map(s => {
                  if (s.costGems === 0) return null; // Skip default
                  const isUnlocked = state.unlockedSkins.includes(s.id);
                  const canAfford = state.gems >= s.costGems;
                  const mapUnlocked = !s.requiredLocation || state.unlockedLocations.includes(s.requiredLocation);
                  const requiredMapName = s.requiredLocation ? LOCATIONS.find(l => l.id === s.requiredLocation)?.name : '';

                  return (
                      <div key={s.id} className="bg-[#271c0f] border-2 border-[#5d4037] p-2 rounded flex gap-2 relative">
                          {!mapUnlocked && (
                              <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center backdrop-blur-[1px] rounded text-[10px] text-red-300 font-bold gap-1">
                                  <Lock size={10} /> 需解鎖: {requiredMapName}
                              </div>
                          )}
                          <div className="w-12 h-12 shrink-0 border-2 border-[#3e2723] rounded" style={{ background: s.bgGradient }}></div>
                          <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-[#efebe9]">{s.name}</h4>
                              <p className="text-[9px] text-[#a1887f] truncate">{s.description}</p>
                              <div className="mt-2">
                                  {isUnlocked ? (
                                      state.activeSkinId === s.id ? (
                                          <div className="text-[9px] text-green-400 font-bold">使用中</div>
                                      ) : (
                                          <button onClick={() => onEquipSkin(s.id)} className="bg-blue-700 text-white text-[9px] px-2 py-0.5 rounded font-bold">套用</button>
                                      )
                                  ) : (
                                      <button 
                                        onClick={() => onBuySkin(s.id)} 
                                        disabled={!canAfford || !mapUnlocked}
                                        className={`text-[9px] px-2 py-0.5 rounded font-bold flex items-center gap-1 ${canAfford && mapUnlocked ? 'bg-cyan-700 text-white' : 'bg-slate-800 text-slate-500'}`}
                                      >
                                          {s.costGems} <Gem size={8} />
                                      </button>
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

export default Shop;
