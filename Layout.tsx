
import React from 'react';
import { ShoppingBag, Waves, Users, Backpack } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  money: number;
  level: number;
  activeTab: 'INVENTORY' | 'SHOP' | 'AQUARIUM' | 'CREW';
  onTabChange: (tab: 'INVENTORY' | 'SHOP' | 'AQUARIUM' | 'CREW') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, money, level, activeTab, onTabChange }) => {
  return (
    // Outer Wrapper: Fixed to viewport, dark background, centers the "Device"
    <div className="fixed inset-0 w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
      
      {/* Background Pattern (Desktop Only) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none hidden sm:block">
        <div className="w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
      
      {/* Main Game Container - Device Simulation */}
      {/* Mobile: Full width/height. Desktop: Fixed 9:16 aspect ratio scaled to viewport height */}
      <div className="relative w-full h-full sm:w-auto sm:h-[90vh] sm:aspect-[9/16] bg-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col border-0 sm:border-8 border-slate-800 sm:rounded-3xl overflow-hidden ring-0 sm:ring-4 ring-black/50">
        
        {/* CRT Scanline Overlay */}
        <div className="pointer-events-none absolute inset-0 z-50 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        <div className="pointer-events-none absolute inset-0 z-50 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_150%)]"></div>

        {/* Header */}
        <header className="shrink-0 bg-slate-800 p-3 border-b-4 border-black flex justify-between items-center shadow-lg z-20 relative">
          <div>
            <h1 className="text-yellow-400 pixel-font text-xl leading-none tracking-wide drop-shadow-md">
              ZEN FISHER
            </h1>
            <span className="text-[10px] text-slate-500 uppercase">Lv.{level} Angler</span>
          </div>
          <div className="bg-black/40 px-3 py-1 rounded border-2 border-slate-600">
            <span className="text-green-400 font-mono font-bold text-lg">{money.toLocaleString()} G</span>
          </div>
        </header>

        {/* Content Area - Uses flex-1 and min-h-0 to force children to scroll internally */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-950 z-10">
          {children}
        </main>

        {/* Footer Tabs */}
        <nav className="shrink-0 grid grid-cols-4 bg-slate-900 border-t-4 border-black pb-safe z-20 relative">
          <button 
            onClick={() => onTabChange('INVENTORY')}
            className={`p-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${activeTab === 'INVENTORY' ? 'bg-slate-800 text-yellow-400 border-t-4 border-yellow-400 -mt-1' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {/* Changed from Fish to Backpack to avoid confusion */}
            <Backpack size={20} />
            <span className="font-bold tracking-widest text-[9px]">背包</span>
          </button>
          
          <button 
            onClick={() => onTabChange('AQUARIUM')}
            className={`p-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${activeTab === 'AQUARIUM' ? 'bg-slate-800 text-cyan-400 border-t-4 border-cyan-400 -mt-1' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Waves size={20} />
            <span className="font-bold tracking-widest text-[9px]">魚缸</span>
          </button>

          <button 
            onClick={() => onTabChange('CREW')}
            className={`p-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${activeTab === 'CREW' ? 'bg-slate-800 text-orange-400 border-t-4 border-orange-400 -mt-1' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Users size={20} />
            <span className="font-bold tracking-widest text-[9px]">夥伴</span>
          </button>

          <button 
            onClick={() => onTabChange('SHOP')}
            className={`p-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${activeTab === 'SHOP' ? 'bg-slate-800 text-yellow-400 border-t-4 border-yellow-400 -mt-1' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <ShoppingBag size={20} />
            <span className="font-bold tracking-widest text-[9px]">商店</span>
          </button>
        </nav>

      </div>
    </div>
  );
};

export default Layout;
