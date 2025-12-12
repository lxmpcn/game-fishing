
import React, { useState } from 'react';
import PixelCard from './PixelCard';
import { X, Map as MapIcon, Fish } from 'lucide-react';
import { FISH_TYPES, LOCATIONS, RARITY_INFO } from '../constants';
import { FishRecord, LocationId } from '../types';
import FishIcon from './FishIcon';

interface AlmanacModalProps {
  onClose: () => void;
  records: Record<string, FishRecord>;
  unlockedLocations: LocationId[];
}

const AlmanacModal: React.FC<AlmanacModalProps> = ({ onClose, records, unlockedLocations }) => {
  const [activeLoc, setActiveLoc] = useState<LocationId>('pond');

  // Filter fish by active location AND Exclude Junk/Treasure
  const locationFish = FISH_TYPES.filter(f => 
    f.locations.includes(activeLoc) && 
    f.rarity !== 'Junk' && 
    f.rarity !== 'Treasure'
  );
  
  // Calculate completion for this map
  const discoveredCount = locationFish.filter(f => records[f.id]?.discovered).length;
  const totalCount = locationFish.length;

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
      {/* Reduced size: max-w-sm and h-[70vh] */}
      <PixelCard className="w-full max-w-sm h-[70vh] bg-slate-900 border-amber-600 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-4 border-slate-700 pb-2 mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-amber-900/50 p-2 rounded">
                <Fish className="text-amber-400" size={16} />
            </div>
            <div>
                <h2 className="text-base text-amber-400 font-bold pixel-font">魚類圖鑑</h2>
                <div className="text-[10px] text-slate-400">蒐集進度: {discoveredCount} / {totalCount}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
        </div>

        {/* Map Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-2 custom-scrollbar shrink-0">
            {LOCATIONS.map(loc => {
                const isUnlocked = unlockedLocations.includes(loc.id);
                return (
                    <button
                        key={loc.id}
                        disabled={!isUnlocked}
                        onClick={() => setActiveLoc(loc.id)}
                        className={`
                            px-3 py-2 rounded text-[10px] font-bold whitespace-nowrap border-b-2 transition-all flex items-center gap-1
                            ${activeLoc === loc.id 
                                ? 'bg-slate-800 text-amber-400 border-amber-500' 
                                : isUnlocked 
                                    ? 'bg-slate-900 text-slate-500 border-slate-700 hover:text-slate-300' 
                                    : 'bg-slate-950 text-slate-700 border-slate-900 cursor-not-allowed'}
                        `}
                    >
                        <MapIcon size={10} />
                        {isUnlocked ? loc.name : '???'}
                    </button>
                );
            })}
        </div>

        {/* Fish Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
            <div className="space-y-2">
                {locationFish.map(fish => {
                    const record = records[fish.id];
                    const discovered = record?.discovered;
                    const rarity = RARITY_INFO[fish.rarity];

                    return (
                        <div key={fish.id} className={`flex gap-3 p-2 rounded border-2 ${discovered ? 'bg-slate-800 border-slate-700' : 'bg-slate-950 border-slate-800'}`}>
                            
                            {/* Icon Box */}
                            <div className={`w-12 h-12 shrink-0 rounded flex items-center justify-center border-2 bg-slate-900 overflow-hidden relative ${discovered ? rarity.color.replace('text-', 'border-') : 'border-slate-800'}`}>
                                <div className={`transform transition-all duration-500 ${discovered ? 'scale-100' : 'scale-90 brightness-0 invert opacity-20'}`}>
                                    <FishIcon speciesId={fish.id} size={32} />
                                </div>
                                {!discovered && (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-bold text-xl">?</div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-bold text-xs ${discovered ? rarity.color : 'text-slate-600'}`}>
                                        {discovered ? fish.name : '未發現物種'}
                                    </h3>
                                    {discovered && (
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded bg-black/40 ${rarity.color}`}>
                                            {rarity.label}
                                        </span>
                                    )}
                                </div>

                                {discovered ? (
                                    <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] text-slate-400 font-mono">
                                        <div>最大: <span className="text-slate-200">{record.maxSize}cm</span></div>
                                        <div>最小: <span className="text-slate-200">{record.minSize}cm</span></div>
                                        <div>捕獲: <span className="text-slate-200">{record.caughtCount}</span></div>
                                        <div>價值: <span className="text-yellow-600">~{fish.basePrice}G</span></div>
                                    </div>
                                ) : (
                                    <div className="mt-1 text-[9px] text-slate-600 leading-tight">
                                        繼續在 <span className="text-slate-500">{LOCATIONS.find(l=>l.id===activeLoc)?.name}</span> 探索來解鎖。
                                    </div>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>
            
            <div className="h-6"></div> {/* Bottom padding */}
        </div>

      </PixelCard>
    </div>
  );
};

export default AlmanacModal;
