// 商店組件：提供升級、購買魚餌、浮標、外觀與解鎖新地圖的介面。

import React, { useState } from 'react';
import { GameState } from '../types';
import { UPGRADES, LOCATIONS, BAITS, BOBBERS, AQUARIUM_SKINS } from '../constants';
import { getUpgradeCost, formatNumber } from '../services/gameService';
import { Zap, Star, Cog, Map, ArrowUpCircle, Check, Coins, Gem, Lock, ShoppingCart, Anchor, Store } from 'lucide-react';
import PixelCard from './PixelCard';
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

  return (
    <div className="h-full flex flex-col bg-slate-950 relative overflow-hidden">
      
      {/* --- Shop Header --- */}
      <div className="shrink-0 bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between shadow-md">
         <div className="flex items-center gap-3">
             <div className="bg-slate-800 p-2 rounded-full border border-slate-600">
                 <Store size={24} className="text-yellow-500" />
             </div>
             <div>
                 <h2 className="text-slate-200 font-bold">漁具店</h2>
                 <p className="text-[10px] text-slate-500">歡迎光臨，挑選您需要的裝備吧。</p>
             </div>
         </div>
      </div>

      {/* --- Category Tabs --- */}
      <div className="flex bg-slate-900 p-1 gap-1 shrink-0 overflow-x-auto custom-scrollbar border-b border-slate-800">
          {[
              { id: 'ESSENTIALS', label: '裝備', icon: Anchor },
              { id: 'CONSUMABLES', label: '耗材', icon: ShoppingCart },
              { id: 'TRAVEL', label: '地圖', icon: Map },
              { id: 'LUXURY', label: '外觀', icon: Gem },
          ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id as ShopCategory)}
                className={`
                    flex-1 min-w-[70px] py-2 flex flex-col items-center gap-1 rounded transition-all border-b-2 active:border-b-0 active:translate-y-1
                    ${category === tab.id 
                        ? 'bg-slate-800 border-yellow-600 text-yellow-400' 
                        : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:bg-slate-800'}
                `}
              >
                  <tab.icon size={16} />
                  <span className="text-[10px] font-bold">{tab.label}</span>
              </button>
          ))}
      </div>

      {/* --- Items Grid --- */}
      <div className="flex-1 overflow-y-auto p-2 bg-slate-950">
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
                      <div key={u.id} className="bg-slate-900 border border-slate-700 p-2 rounded flex gap-2 relative group hover:border-slate-500 transition-colors">
                          <div className={`w-12 h-12 shrink-0 bg-slate-800 rounded flex items-center justify-center border border-slate-700 ${isMaxed ? 'opacity-50' : ''}`}>
                              <Icon size={24} className={isMaxed ? 'text-slate-500' : 'text-yellow-500'} />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                  <h4 className="text-xs font-bold text-slate-200 truncate">{u.name}</h4>
                                  <p className="text-[9px] text-slate-500 leading-tight truncate">{u.description}</p>
                              </div>
                              <div className="flex justify-between items-end mt-1">
                                  <span className="text-[9px] text-slate-600 font-mono">Lv.{level}</span>
                                  {isMaxed ? (
                                      <span className="text-[10px] text-green-500 font-bold">已滿級</span>
                                  ) : (
                                      <button 
                                        onClick={() => onBuyUpgrade(u.id)}
                                        disabled={!canAfford}
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold border-b-2 active:border-b-0 active:translate-y-0.5 flex items-center gap-1 ${canAfford ? 'bg-green-700 text-white border-green-900 hover:bg-green-600' : 'bg-red-900/20 text-red-400 border-red-900/50 cursor-not-allowed'}`}
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
                    <div className="col-span-full text-[10px] text-slate-500 font-bold border-b border-slate-800 mb-1">魚餌</div>
                    {BAITS.map(b => {
                        const canAfford = state.money >= b.cost;
                        const owned = state.baitInventory[b.id] || 0;
                        return (
                            <div key={b.id} className="bg-slate-900 border border-slate-700 p-2 rounded flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <div className="w-10 h-10 shrink-0 bg-slate-800 rounded flex items-center justify-center border border-slate-700">
                                        <ItemIcon type="bait" id={b.id} size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h4 className="text-xs font-bold text-slate-200">{b.name}</h4>
                                            <span className="text-[9px] text-slate-500">庫存: {owned}</span>
                                        </div>
                                        <p className="text-[9px] text-slate-600 leading-tight">{b.description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {owned > 0 && state.activeBaitId !== b.id && (
                                        <button onClick={() => onEquipBait(b.id)} className="flex-1 bg-blue-700 hover:bg-blue-600 text-white text-[9px] py-1 rounded font-bold border-b-2 border-blue-900 active:border-b-0 active:translate-y-0.5">裝備</button>
                                    )}
                                    {state.activeBaitId === b.id && (
                                        <div className="flex-1 bg-slate-800 text-green-400 text-[9px] py-1 rounded font-bold text-center border border-green-900/50">使用中</div>
                                    )}
                                    <button onClick={() => onBuyBait(b.id)} disabled={!canAfford} className={`flex-1 flex items-center justify-center gap-1 text-[9px] py-1 rounded font-bold border-b-2 active:border-b-0 active:translate-y-0.5 ${canAfford ? 'bg-amber-700 hover:bg-amber-600 text-white border-amber-900' : 'bg-slate-800 text-slate-500 border-slate-900'}`}>
                                        {formatNumber(b.cost)} <Coins size={8} /> <span className="text-[8px] opacity-70">x{b.charges}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    
                    <div className="col-span-full text-[10px] text-slate-500 font-bold border-b border-slate-800 mt-2 mb-1">浮標</div>
                    {BOBBERS.map(b => {
                        const isUnlocked = state.unlockedBobbers.includes(b.id);
                        const canAfford = state.money >= b.cost;
                        return (
                            <div key={b.id} className="bg-slate-900 border border-slate-700 p-2 rounded flex items-center gap-2">
                                <div className="w-10 h-10 shrink-0 bg-slate-800 rounded flex items-center justify-center border border-slate-700">
                                    <ItemIcon type="bobber" id={b.id} size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-slate-200">{b.name}</h4>
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
                  const isGemCost = l.currency === 'GEMS';
                  const canAfford = isGemCost ? state.gems >= l.cost : state.money >= l.cost;
                  
                  return (
                      <div key={l.id} className={`bg-slate-900 border ${isUnlocked ? 'border-green-800' : 'border-slate-700'} p-2 rounded flex flex-col relative overflow-hidden`}>
                          <div className={`absolute inset-0 bg-gradient-to-r ${l.bgGradient} opacity-20 pointer-events-none`}></div>
                          <div className="relative z-10 flex justify-between items-start mb-2">
                              <div>
                                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1">
                                      <Map size={12} /> {l.name}
                                  </h4>
                                  <p className="text-[9px] text-slate-500 mt-1">{l.description}</p>
                              </div>
                              {isUnlocked && <Check size={16} className="text-green-500" />}
                          </div>
                          {!isUnlocked && (
                              <button 
                                onClick={() => onUnlockLocation(l.id)} 
                                disabled={!canAfford}
                                className={`relative z-10 w-full py-1.5 rounded font-bold text-xs border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-1 ${canAfford ? 'bg-purple-700 hover:bg-purple-600 text-white border-purple-900' : 'bg-slate-800 text-slate-500 border-slate-900'}`}
                              >
                                  解鎖: {formatNumber(l.cost)} {isGemCost ? <Gem size={10} /> : <Coins size={10} />}
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
                      <div key={s.id} className="bg-slate-900 border border-slate-700 p-2 rounded flex gap-2 relative">
                          {!mapUnlocked && (
                              <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center backdrop-blur-[1px] rounded text-[10px] text-red-300 font-bold gap-1">
                                  <Lock size={10} /> 需解鎖: {requiredMapName}
                              </div>
                          )}
                          <div className="w-12 h-12 shrink-0 border border-slate-600 rounded" style={{ background: s.bgGradient }}></div>
                          <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-200">{s.name}</h4>
                              <p className="text-[9px] text-slate-500 truncate">{s.description}</p>
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