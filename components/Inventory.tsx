// 背包組件：顯示已捕獲的魚類，提供出售與放入水族箱的功能。

import React, { useState, useMemo } from 'react';
import { CaughtFish, Rarity } from '../types';
import { FISH_TYPES, RARITY_INFO } from '../constants';
import { Coins, ArrowDownUp, Waves, Trash2, Ruler, Trophy, Sparkles, Hand, Recycle } from 'lucide-react';
import PixelCard from './PixelCard';
import FishIcon from './FishIcon';
import { formatNumber } from '../services/gameService';

interface InventoryProps {
  items: CaughtFish[];
  tankFull: boolean;
  onSell: (id: string) => void;
  onSellAll: () => void;
  onKeep: (id: string) => void;
}

type SortOption = 'DATE_NEW' | 'DATE_OLD' | 'PRICE_HIGH' | 'PRICE_LOW' | 'RARITY_HIGH' | 'RARITY_LOW';

const RARITY_WEIGHT: Record<Rarity, number> = {
  'Mythic': 6,
  'Treasure': 5,
  'Legendary': 4,
  'Epic': 3,
  'Rare': 2,
  'Common': 1,
  'Junk': 0,
};

const Inventory: React.FC<InventoryProps> = ({ items, tankFull, onSell, onSellAll, onKeep }) => {
  const [sortBy, setSortBy] = useState<SortOption>('DATE_NEW');

  const sortedItems = useMemo(() => {
    const sorted = [...items];
    
    sorted.sort((a, b) => {
      const typeA = FISH_TYPES.find(t => t.id === a.typeId);
      const typeB = FISH_TYPES.find(t => t.id === b.typeId);
      
      const priceA = a.price;
      const priceB = b.price;
      const rankA = typeA ? RARITY_WEIGHT[typeA.rarity] : 0;
      const rankB = typeB ? RARITY_WEIGHT[typeB.rarity] : 0;
      const dateA = a.caughtAt;
      const dateB = b.caughtAt;

      switch (sortBy) {
        case 'DATE_NEW': 
          return dateB - dateA;
        case 'DATE_OLD': 
          return dateA - dateB;
        
        case 'PRICE_HIGH': 
          if (priceB !== priceA) return priceB - priceA;
          if (rankB !== rankA) return rankB - rankA; 
          return dateB - dateA; 
        case 'PRICE_LOW':
           if (priceA !== priceB) return priceA - priceB;
           if (rankA !== rankB) return rankA - rankB;
           return dateB - dateA;
        
        case 'RARITY_HIGH': 
          if (rankA !== rankB) return rankB - rankA;
          if (priceB !== priceA) return priceB - priceA; 
          return dateB - dateA;
        case 'RARITY_LOW': 
          if (rankA !== rankB) return rankA - rankB;
          if (priceA !== priceB) return priceA - priceB;
          return dateB - dateA;

        default: return 0;
      }
    });
    return sorted;
  }, [items, sortBy]);

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Header & Controls */}
      <div className="flex flex-col gap-2 px-1">
        <div className="flex justify-between items-center">
          <h3 className="text-slate-400 text-xs uppercase tracking-widest font-bold">魚獲背包 ({items.length})</h3>
          
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative group">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <ArrowDownUp size={12} />
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-slate-800 text-[10px] font-bold text-slate-200 border-2 border-slate-600 rounded pl-7 pr-2 py-1.5 focus:outline-none focus:border-yellow-500 appearance-none cursor-pointer hover:border-slate-500 transition-colors shadow-sm w-28"
              >
                <option value="DATE_NEW">最新</option>
                <option value="DATE_OLD">最舊</option>
                <option value="PRICE_HIGH">價格 (高)</option>
                <option value="PRICE_LOW">價格 (低)</option>
                <option value="RARITY_HIGH">稀有 (高)</option>
                <option value="RARITY_LOW">稀有 (低)</option>
              </select>
            </div>

            {/* Sell All Button */}
            {items.length > 0 && (
              <button 
                onClick={onSellAll}
                className="flex items-center gap-1 text-[10px] bg-red-950/50 hover:bg-red-600 text-red-200 hover:text-white px-2 py-1.5 rounded border border-red-800 hover:border-red-500 transition-colors whitespace-nowrap active:scale-95"
              >
                <Trash2 size={12} /> <span className="font-bold">全售</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <PixelCard className="flex-1 min-h-0 bg-slate-900/60 border-slate-700">
        <div className="h-full overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {sortedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
              <span className="text-4xl opacity-30">🐟</span>
              <p className="text-xs font-bold">空空如也...</p>
              <p className="text-[10px]">快去釣點魚吧！</p>
            </div>
          ) : (
            sortedItems.map(fish => {
              const type = FISH_TYPES.find(t => t.id === fish.typeId);
              if (!type) return null;
              const rarity = RARITY_INFO[type.rarity];
              
              const isItem = type.rarity === 'Junk' || type.rarity === 'Treasure';
              const isJunk = type.rarity === 'Junk';

              return (
                <div key={fish.uid} className="relative flex items-center justify-between bg-slate-800 p-2 rounded border-2 border-slate-700 shadow-sm hover:border-slate-500 transition-all group overflow-hidden">
                  
                  {/* New Record Badge Background Highlight (Only for Living Fish) */}
                  {!isItem && fish.isNewRecord && !fish.isNewSpecies && (
                      <div className="absolute top-0 right-0 w-8 h-8 bg-red-600 rotate-45 transform translate-x-4 -translate-y-4 z-0"></div>
                  )}
                  {fish.isNewSpecies && (
                      <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-500 rotate-45 transform translate-x-4 -translate-y-4 z-0"></div>
                  )}

                  <div className="flex items-center gap-3 z-10">
                    {/* Fish Icon Container */}
                    <div className="w-10 h-10 shrink-0 rounded bg-slate-900 flex items-center justify-center border-2 border-slate-700 relative overflow-hidden group-hover:border-slate-500 transition-colors">
                      <div className="absolute inset-0 opacity-20" style={{ backgroundColor: type.color }}></div>
                      <FishIcon speciesId={fish.typeId} size={28} />
                    </div>
                    
                    {/* Fish Info */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                          <div className={`font-bold text-sm ${rarity.color} leading-none mb-1 drop-shadow-sm`}>{type.name}</div>
                          {fish.isNewSpecies && (
                              <span className="text-[9px] bg-yellow-600 text-white px-1 rounded animate-pulse font-bold flex items-center gap-0.5 shadow-sm">
                                  <Sparkles size={8} /> NEW DISCOVERY
                              </span>
                          )}
                          {!isItem && !fish.isNewSpecies && fish.isNewRecord && (
                              <span className="text-[9px] bg-red-600 text-white px-1 rounded animate-pulse font-bold flex items-center gap-0.5 shadow-sm">
                                  <Trophy size={8} /> RECORD
                              </span>
                          )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5 font-mono">
                           <span className={`${rarity.color} bg-black/30 px-1 rounded`}>{rarity.label}</span>
                        </div>
                        {/* Only show size if it's a living creature (has size data) */}
                        {!isItem && fish.size && (
                             <div className={`text-[10px] flex items-center gap-0.5 font-mono ${fish.isNewRecord ? 'text-red-300 font-bold' : 'text-slate-400'}`}>
                                <Ruler size={10} /> 
                                <span>{fish.size}cm</span>
                             </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 z-10">
                     {/* Keep Button - Disabled for Junk/Treasure */}
                     {!isItem && (
                        <button
                        onClick={() => onKeep(fish.uid)}
                        disabled={tankFull}
                        className={`flex items-center gap-1 px-2 py-1.5 rounded border-2 transition-all text-xs font-mono font-bold active:scale-95 active:translate-y-0.5
                            ${tankFull 
                            ? 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed opacity-50' 
                            : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border-cyan-800 hover:border-cyan-500 shadow-sm'}
                        `}
                        title={tankFull ? "水族箱已滿" : "放入水族箱 (產生收益)"}
                        >
                        <Waves size={12} />
                        </button>
                     )}
                     
                     {/* Sell Button (Junk becomes Recycle) */}
                     {isJunk ? (
                        <button 
                            onClick={() => onSell(fish.uid)}
                            className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-blue-300 px-2 py-1.5 rounded border-2 border-slate-500 hover:border-blue-400 transition-all text-xs font-mono font-bold active:scale-95 active:translate-y-0.5 shadow-sm"
                            title="回收 (獲得環保補助)"
                        >
                            <Recycle size={12} /> <span className="hidden sm:inline">回收</span>
                            <span className="text-yellow-400 ml-1">+{formatNumber(fish.price)}</span>
                        </button>
                     ) : (
                        <button 
                            onClick={() => onSell(fish.uid)}
                            className="flex items-center gap-1 bg-yellow-950/30 hover:bg-yellow-900 text-yellow-400 px-2 py-1.5 rounded border-2 border-yellow-800/50 hover:border-yellow-500 transition-all text-xs font-mono font-bold active:scale-95 active:translate-y-0.5 shadow-sm"
                        >
                            +{formatNumber(fish.price)} <Coins size={12} />
                        </button>
                     )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PixelCard>
    </div>
  );
};

export default Inventory;