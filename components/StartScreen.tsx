// 開始畫面組件：顯示遊戲標題、Logo 與進入遊戲的入口。

import React from 'react';
import { Fish, Waves } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div 
      onClick={onStart}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white overflow-hidden cursor-pointer"
    >
      
      {/* --- Background --- */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {/* Retro Grid */}
        <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.2)_100%),repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(6,182,212,0.1)_40px,rgba(6,182,212,0.1)_41px),repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(6,182,212,0.1)_40px,rgba(6,182,212,0.1)_41px)] perspective-grid"></div>
        {/* Glows */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-indigo-500 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-60 h-60 bg-cyan-600 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in-up w-full max-w-md px-4">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center">
           {/* Icon Badge */}
           <div className="mb-6 relative">
              <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-20 rounded-full animate-pulse"></div>
              <div className="bg-slate-900 border-4 border-cyan-500 p-4 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.5)] transform rotate-3">
                  <Fish size={48} className="text-cyan-400 drop-shadow-md" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-slate-900 border-4 border-yellow-500 p-3 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.5)] transform -rotate-6">
                  <Waves size={32} className="text-yellow-400" />
              </div>
           </div>

           {/* Title Text */}
           <div className="text-center space-y-2">
               <h1 className="text-5xl md:text-6xl font-bold pixel-font tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-cyan-200 to-cyan-600 drop-shadow-[4px_4px_0_#000]">
                 像素釣手
               </h1>
               <h2 className="text-xl md:text-2xl font-bold pixel-font tracking-[0.5em] text-yellow-300 drop-shadow-[2px_2px_0_#000] mt-2 uppercase">
                 Pixel Angler
               </h2>
           </div>
           
           <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-500 font-mono border border-slate-800 px-2 py-1 rounded bg-black/50">
              <span>EST. 2024</span>
              <span>•</span>
              <span>PIXEL STUDIO</span>
           </div>
        </div>

        {/* Start Prompt */}
        <div className="mt-12 flex flex-col items-center gap-4">
            <div className="animate-blink">
                <span className="text-xl font-bold pixel-font tracking-widest text-white drop-shadow-md border-b-4 border-transparent">
                    PRESS START
                </span>
            </div>
            
            <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
            </div>
        </div>

      </div>

      {/* CRT Scanline Overlay */}
      <div className="pointer-events-none absolute inset-0 z-50 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        .animate-blink {
            animation: blink 1s step-end infinite;
        }
        .perspective-grid {
            transform: perspective(500px) rotateX(60deg);
            transform-origin: bottom;
        }
      `}</style>
    </div>
  );
};

export default StartScreen;