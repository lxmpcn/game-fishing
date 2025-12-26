// 教學覆蓋層組件：引導新手玩家進行拋竿、等待與收竿的互動式教學。

import React from 'react';
import { Hand, ChevronDown } from 'lucide-react';

interface TutorialOverlayProps {
  step: number;
  onNext: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ step, onNext }) => {
  if (step === 0) return null;

  // Step 1: Welcome (Modal style)
  if (step === 1) {
    return (
      <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onNext}>
        <div className="bg-slate-800 border-4 border-yellow-500 p-6 rounded-lg max-w-xs text-center shadow-2xl animate-bounce-small cursor-pointer">
          <h2 className="text-xl font-bold text-yellow-400 mb-2 pixel-font">歡迎來到釣魚大亨!</h2>
          <p className="text-sm text-slate-300 mb-4">準備好開始你的釣魚生涯了嗎？<br/>跟著指引操作吧！</p>
          <div className="text-xs text-slate-500 animate-pulse flex items-center justify-center gap-1">
             點擊任意處開始 <ChevronDown size={12} />
          </div>
        </div>
      </div>
    );
  }

  // Common Overlay Wrapper for Steps 2-5
  return (
    <div className="absolute inset-0 z-[90] pointer-events-none overflow-hidden">
      {/* Step 2: Cast (Point to center water) */}
      {step === 2 && (
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
           <Hand className="text-white fill-white rotate-180 drop-shadow-lg mb-2" size={48} />
           <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-blue-400">
              點擊水面拋竿
           </div>
        </div>
      )}

      {/* Step 3: Wait (Point to bobber/center, different text) */}
      {step === 3 && (
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 flex flex-col items-center">
           <div className="bg-slate-800/80 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-yellow-500 animate-pulse">
              等待浮標晃動...
           </div>
        </div>
      )}

      {/* Step 4: Reel (Urgent pointer) */}
      {step === 4 && (
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center animate-ping-slow">
           <Hand className="text-red-500 fill-red-500 rotate-180 drop-shadow-lg mb-2 scale-125" size={48} />
           <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white">
              現在！點擊收竿！
           </div>
        </div>
      )}

      {/* Step 5: Inventory (Point to bottom area) */}
      {step === 5 && (
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
           <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-green-400 mb-2">
              出售或放入魚缸
           </div>
           <Hand className="text-white fill-white drop-shadow-lg" size={48} />
        </div>
      )}
    </div>
  );
};

export default TutorialOverlay;