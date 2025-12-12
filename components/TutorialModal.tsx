
import React from 'react';
import PixelCard from './PixelCard';
import { X, MousePointer, Fish, ShoppingBag, Waves } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
      <PixelCard className="w-full max-w-sm h-[80vh] bg-slate-900 border-blue-500 shadow-2xl flex flex-col">
        <div className="flex justify-between items-center border-b-4 border-slate-700 pb-2 mb-2 shrink-0">
          <h2 className="text-lg text-blue-300 font-bold pixel-font">新手指南</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 p-2 custom-scrollbar">
          
          {/* Step 1 */}
          <div className="flex gap-4">
             <div className="shrink-0 w-12 h-12 bg-slate-800 border-2 border-slate-600 flex items-center justify-center rounded-full">
               <MousePointer className="text-yellow-400" />
             </div>
             <div>
               <h3 className="font-bold text-yellow-400 mb-1">1. 點擊釣魚</h3>
               <p className="text-xs text-slate-300 leading-relaxed">
                 點擊畫面中央的水域進行拋竿。當浮標晃動並顯示 <span className="text-red-400">咬鉤了!</span> 時，再次點擊來收竿。
               </p>
             </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
             <div className="shrink-0 w-12 h-12 bg-slate-800 border-2 border-slate-600 flex items-center justify-center rounded-full">
               <Fish className="text-green-400" />
             </div>
             <div>
               <h3 className="font-bold text-green-400 mb-1">2. 管理魚獲</h3>
               <p className="text-xs text-slate-300 leading-relaxed">
                 釣到的魚會進入<span className="text-white font-bold">魚獲</span>背包。你可以直接出售換取金幣，或者放入魚缸。
               </p>
             </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
             <div className="shrink-0 w-12 h-12 bg-slate-800 border-2 border-slate-600 flex items-center justify-center rounded-full">
               <Waves className="text-cyan-400" />
             </div>
             <div>
               <h3 className="font-bold text-cyan-400 mb-1">3. 魚缸收益</h3>
               <p className="text-xs text-slate-300 leading-relaxed">
                 放入<span className="text-white font-bold">魚缸</span>的魚會持續產生被動收入，即使你離線也會累積金幣！
               </p>
             </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
             <div className="shrink-0 w-12 h-12 bg-slate-800 border-2 border-slate-600 flex items-center justify-center rounded-full">
               <ShoppingBag className="text-purple-400" />
             </div>
             <div>
               <h3 className="font-bold text-purple-400 mb-1">4. 升級與探索</h3>
               <p className="text-xs text-slate-300 leading-relaxed">
                 使用金幣在商店購買更強的釣竿、魚餌，並解鎖新的地圖來捕捉傳說級魚類！
               </p>
             </div>
          </div>

        </div>

        <div className="shrink-0 pt-4 border-t border-slate-800">
           <button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all">
             我知道了，開始釣魚！
           </button>
        </div>

      </PixelCard>
    </div>
  );
};

export default TutorialModal;
