
import React from 'react';
import { ShoppingBag, Waves, Users, Backpack, Settings as SettingsIcon, Coins, BookOpen, Gem, Disc } from 'lucide-react';
import { formatNumber } from '../services/gameService';

interface LayoutProps {
  children: React.ReactNode;
  money: number;
  gems?: number; // Added Gems
  level: number;
  activeTab: 'INVENTORY' | 'SHOP' | 'AQUARIUM' | 'CREW';
  onTabChange: (tab: 'INVENTORY' | 'SHOP' | 'AQUARIUM' | 'CREW') => void;
  onOpenSettings: () => void;
  onOpenAlmanac: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, money, gems = 0, level, activeTab, onTabChange, onOpenSettings, onOpenAlmanac }) => {
  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#20222a] flex items-center justify-center overflow-hidden">
      
      {/* Retro Wallpaper - Softer opacity */}
      <div className="absolute inset-0 opacity-5 pointer-events-none hidden sm:block">
        <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#000,#000_10px,#111_10px,#111_20px)]"></div>
      </div>
      
      {/* Console Device Body - Softer Slate */}
      <div className="relative w-full h-full sm:w-[400px] sm:h-[800px] bg-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col sm:rounded-[40px] overflow-hidden border-[12px] border-slate-700 ring-1 ring-white/10">
        
        {/* Screen Container (Bezel) */}
        <div className="flex-1 bg-[#1a1b23] p-2 sm:p-4 flex flex-col relative overflow-hidden rounded-none sm:rounded-[20px] sm:m-4 sm:mb-2 border-4 border-slate-600/50 shadow-inner">
            
            {/* CRT Effects - Reduced Opacity for Comfort */}
            <div className="pointer-events-none absolute inset-0 z-50 opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]"></div>
            <div className="pointer-events-none absolute inset-0 z-50 bg-[radial-gradient(circle,transparent_70%,rgba(0,0,0,0.4)_150%)]"></div>

            {/* Game Header (Status Bar) */}
            <header className="shrink-0 bg-slate-900/80 backdrop-blur-sm p-2 border-b border-slate-700/50 flex justify-between items-center z-20 relative rounded-t-lg">
            <div className="flex items-center gap-1.5">
                <button 
                onClick={onOpenSettings}
                className="bg-slate-800 p-1.5 rounded hover:bg-slate-700 active:translate-y-0.5 border border-slate-600 transition-colors"
                >
                <SettingsIcon size={14} className="text-slate-400" />
                </button>
                <button 
                onClick={onOpenAlmanac}
                className="bg-slate-800 p-1.5 rounded hover:bg-slate-700 active:translate-y-0.5 border border-slate-600 transition-colors"
                title="圖鑑"
                >
                <BookOpen size={14} className="text-amber-400" />
                </button>
                <div className="flex flex-col ml-1">
                    <h1 className="text-yellow-400 pixel-font text-[10px] leading-none tracking-wide drop-shadow-sm">
                        PIXEL CAT
                    </h1>
                    <span className="text-[8px] text-slate-500 uppercase font-mono">Lv.{level}</span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1">
                {/* Money */}
                <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-slate-700/50 min-w-[70px] justify-end shadow-sm">
                    <span className="text-yellow-400 font-bold text-[9px] tracking-widest font-mono">
                    {formatNumber(money)}
                    </span>
                    <Coins size={10} className="text-yellow-500" />
                </div>
                {/* Gems */}
                <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-slate-700/50 min-w-[50px] justify-end shadow-sm">
                    <span className="text-cyan-300 font-bold text-[9px] tracking-widest font-mono">
                    {formatNumber(gems)}
                    </span>
                    <Gem size={10} className="text-cyan-400" />
                </div>
            </div>
            </header>

            {/* Main Viewport */}
            <main className="flex-1 flex flex-col overflow-hidden relative bg-[#1e2029] z-10 rounded-b-lg">
            {children}
            </main>
        </div>

        {/* Physical Controls Area (Nav) */}
        <div className="shrink-0 bg-slate-800 pt-1 pb-safe sm:pb-4 px-4 z-20 relative">
            
            {/* Decoration Line */}
            <div className="flex justify-center gap-4 mb-2 opacity-20">
                <div className="w-16 h-1 bg-black rounded-full"></div>
                <div className="w-16 h-1 bg-black rounded-full"></div>
            </div>

            <nav className="grid grid-cols-4 gap-2">
                <button 
                    onClick={() => onTabChange('INVENTORY')}
                    className={`h-14 flex flex-col items-center justify-center gap-1 transition-all rounded-lg border-b-4 active:border-b-0 active:translate-y-1 ${activeTab === 'INVENTORY' ? 'bg-slate-700 text-yellow-400 border-slate-900 shadow-inner' : 'bg-slate-600 text-slate-400 border-slate-900 hover:bg-slate-500'}`}
                >
                    <Backpack size={20} />
                    <span className="font-bold tracking-widest text-[9px]">背包</span>
                </button>
                
                <button 
                    onClick={() => onTabChange('AQUARIUM')}
                    className={`h-14 flex flex-col items-center justify-center gap-1 transition-all rounded-lg border-b-4 active:border-b-0 active:translate-y-1 ${activeTab === 'AQUARIUM' ? 'bg-slate-700 text-cyan-400 border-slate-900 shadow-inner' : 'bg-slate-600 text-slate-400 border-slate-900 hover:bg-slate-500'}`}
                >
                    <Waves size={20} />
                    <span className="font-bold tracking-widest text-[9px]">魚缸</span>
                </button>

                <button 
                    onClick={() => onTabChange('CREW')}
                    className={`h-14 flex flex-col items-center justify-center gap-1 transition-all rounded-lg border-b-4 active:border-b-0 active:translate-y-1 ${activeTab === 'CREW' ? 'bg-slate-700 text-orange-400 border-slate-900 shadow-inner' : 'bg-slate-600 text-slate-400 border-slate-900 hover:bg-slate-500'}`}
                >
                    <Users size={20} />
                    <span className="font-bold tracking-widest text-[9px]">夥伴</span>
                </button>

                <button 
                    onClick={() => onTabChange('SHOP')}
                    className={`h-14 flex flex-col items-center justify-center gap-1 transition-all rounded-lg border-b-4 active:border-b-0 active:translate-y-1 ${activeTab === 'SHOP' ? 'bg-slate-700 text-yellow-400 border-slate-900 shadow-inner' : 'bg-slate-600 text-slate-400 border-slate-900 hover:bg-slate-500'}`}
                >
                    <ShoppingBag size={20} />
                    <span className="font-bold tracking-widest text-[9px]">商店</span>
                </button>
            </nav>
        </div>

      </div>
    </div>
  );
};

export default Layout;
