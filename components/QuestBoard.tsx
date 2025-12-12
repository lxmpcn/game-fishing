
import React, { useState } from 'react';
import { Quest } from '../types';
import { formatNumber } from '../services/gameService';
import { CheckCircle2, Coins, Scroll, Star, ChevronDown, ChevronUp, User } from 'lucide-react';

interface QuestBoardProps {
  quests: Quest[];
  onClaim: (questId: string) => void;
}

const QuestBoard: React.FC<QuestBoardProps> = ({ quests, onClaim }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const activeQuests = quests.filter(q => !q.isClaimed);

  return (
    <div className="bg-amber-100/95 border-4 border-amber-800 rounded-sm p-2 w-64 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] transition-all relative">
      
      {/* Wood Texture CSS */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[repeating-linear-gradient(45deg,#b45309,#b45309_10px,#92400e_10px,#92400e_20px)]"></div>

      {/* Header (Click to toggle) */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between cursor-pointer group pb-1 relative z-10 border-b-2 border-amber-800/50 mb-1"
      >
        <div className="flex items-center gap-2">
            <div className="bg-amber-800 p-1 rounded-sm text-white">
                <Scroll size={14} />
            </div>
            <div>
                <h3 className="text-sm font-bold text-amber-900 pixel-font leading-none">委託佈告欄</h3>
            </div>
        </div>
        <div className="text-amber-800 group-hover:scale-110 transition-transform">
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
      </div>
      
      {!isCollapsed && (
          <div className="relative z-10 space-y-3 mt-2">
                {activeQuests.length === 0 ? (
                    <div className="text-center py-6 opacity-60">
                        <Star className="w-8 h-8 mx-auto text-amber-700 mb-2" />
                        <p className="text-xs text-amber-900 font-bold">目前沒有新委託</p>
                        <p className="text-[10px] text-amber-800">請稍後再來...</p>
                    </div>
                ) : (
                    activeQuests.map(q => {
                    const progress = Math.min(1, q.currentValue / q.targetValue);
                    const percent = Math.floor(progress * 100);

                    return (
                        <div key={q.id} className="relative bg-white/60 p-2 rounded-sm border-2 border-amber-200 shadow-sm">
                            {/* Quest Giver & Title */}
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <h4 className="text-xs font-bold text-amber-900">{q.title}</h4>
                                    <div className="flex items-center gap-1 text-[9px] text-amber-700 font-bold">
                                        <User size={8} /> {q.giver}
                                    </div>
                                </div>
                                {q.isCompleted && (
                                    <div className="animate-bounce bg-green-500 text-white rounded-full p-0.5">
                                        <CheckCircle2 size={12} />
                                    </div>
                                )}
                            </div>

                            {/* Flavor Text */}
                            <p className="text-[10px] text-slate-600 italic leading-tight mb-2 border-l-2 border-amber-400 pl-1">
                                "{q.description}"
                            </p>
                            
                            {/* Requirement Bar */}
                            <div className="mb-1">
                                <div className="flex justify-between text-[9px] font-bold text-slate-700 mb-0.5">
                                    <span>{q.requirementText}</span>
                                    <span>{formatNumber(q.currentValue)}/{formatNumber(q.targetValue)}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-300 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-500 ${q.isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Reward Action */}
                            <div className="flex justify-end mt-1">
                                {q.isCompleted ? (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onClaim(q.id); }}
                                        className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white text-[10px] px-3 py-1 rounded shadow-md border-b-2 border-green-800 active:border-b-0 active:translate-y-[2px] transition-all font-bold animate-pulse"
                                    >
                                        <Coins size={10} /> 領取 {formatNumber(q.reward)}
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-100 px-2 py-0.5 rounded">
                                        <Coins size={10} /> 報酬: {formatNumber(q.reward)}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                    })
                )}
          </div>
      )}
    </div>
  );
};

export default QuestBoard;
