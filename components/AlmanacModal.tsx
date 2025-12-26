// 圖鑑模態框：展示玩家已發現的魚種紀錄與解鎖進度。

import React, { useState } from 'react';
import PixelCard from './PixelCard';
import { X, Map as MapIcon, Fish, HelpCircle } from 'lucide-react';
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

  // Filter fish by active location AND Exclude Junk/Treasure for the main almanac view
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
      <PixelCard className="w-full max-w-md h-[80vh] bg-slate-900 border-amber-600 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-4 border-slate-700 pb-3 mb-2 shrink-0 px-2 pt-2 bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-amber-900/50 p-2 rounded-lg border border-amber-700/50">
                <Fish className="text-amber-400" size={20} />
            </div>
            <div>
                <h2 className="text-lg text-amber-400 font-bold pixel-font tracking-wide">生物圖鑑</h2>
                <div className="flex items-center gap-2 mt-0.5">
                    <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div 
                            className="h-full bg-amber-500 transition-all duration-500"
                            style={{ width: `${totalCount > 0 ? (discoveredCount / totalCount) * 100 : 0}%` }}
                        ></div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{discoveredCount}/{totalCount}</span>
                </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded hover:bg-slate-700 transition-colors"><X size={20} /></button>
        </div>

        {/* Map Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 px-2 custom-scrollbar shrink-0 bg-slate-900">
            {LOCATIONS.map(loc => {
                const isUnlocked = unlockedLocations.includes(loc.id);
                const isActive = activeLoc === loc.id;
                return (
                    <button
                        key={loc.id}
                        disabled={!isUnlocked}
                        onClick={() => setActiveLoc(loc.id)}
                        className={`
                            px-3 py-2 rounded-md text-[10px] font-bold whitespace-nowrap border-b-4 transition-all flex items-center gap-1.5
                            ${isActive 
                                ? 'bg-amber-900/40 text-amber-300 border-amber-500 shadow-inner' 
                                : isUnlocked 
                                    ? 'bg-slate-800 text-slate-400 border-slate-900 hover:bg-slate-700 hover:text-slate-200' 
                                    : 'bg-slate-900/50 text-slate-700 border-slate-800 cursor-not-allowed'}
                        `}
                    >
                        <MapIcon size={12} className={isActive ? 'text-amber-400' : ''} />
                        {isUnlocked ? loc.name : '???'}
                    </button>
                );
            })}
        </div>

        {/* Fish Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-2">
            <div className="grid grid-cols-1 gap-3">
                {locationFish.map(fish => {
                    const record = records[fish.id];
                    const discovered = record?.discovered;
                    const rarity = RARITY_INFO[fish.rarity];

                    return (
                        <div key={fish.id} className={`
                            relative flex gap-3 p-3 rounded-lg border-2 transition-all group min-h-[100px]
                            ${discovered 
                                ? 'bg-slate-800 border-slate-700 hover:border-slate-600' 
                                : 'bg-slate-950 border-dashed border-slate-800 opacity-80'}
                        `}>
                            
                            {/* Icon Box */}
                            <div className={`
                                w-16 h-16 shrink-0 rounded-lg flex items-center justify-center border-2 bg-slate-900 overflow-hidden relative shadow-inner self-center
                                ${discovered ? rarity.color.replace('text-', 'border-') : 'border-slate-800'}
                            `}>
                                <div className={`transform transition-all duration-500 ${discovered ? 'scale-100' : 'scale-75 brightness-0 invert opacity-10 blur-[1px]'}`}>
                                    <FishIcon speciesId={fish.id} size={48} />
                                </div>
                                {!discovered && (
                                    <HelpCircle className="absolute text-slate-800/50" size={32} />
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div>
                                    <h4 className={`text-sm font-bold ${discovered ? 'text-white' : 'text-slate-600'}`}>
                                        {discovered ? fish.name : '???'}
                                    </h4>
                                    <div className="flex gap-2 mt-1">
                                        <span className={`text-[10px] px-1.5 rounded font-mono ${discovered ? rarity.color + ' bg-black/30' : 'text-slate-700 bg-slate-900'}`}>
                                            {discovered ? rarity.label : 'Unknown'}
                                        </span>
                                    </div>
                                </div>

                                {discovered && (
                                    <div className="flex justify-between items-end mt-2 text-[10px] text-slate-400 font-mono border-t border-slate-700/50 pt-2">
                                        <div className="flex gap-3">
                                            <span className="flex items-center gap-1" title="最大尺寸">
                                                <span className="text-slate-500">MAX:</span>
                                                <span className="text-slate-300">{record.maxSize}cm</span>
                                            </span>
                                            <span className="flex items-center gap-1" title="捕獲次數">
                                                <span className="text-slate-500">COUNT:</span>
                                                <span className="text-slate-300">{record.caughtCount}</span>
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </PixelCard>
    </div>
  );
};

export default AlmanacModal;