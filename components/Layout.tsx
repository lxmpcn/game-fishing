// 佈局組件：模擬遊戲機外觀，包含頂部狀態列 (金幣/等級) 與底部導航列。

import React from 'react';
import { ShoppingBag, Waves, Backpack, Settings as SettingsIcon, Coins, BookOpen, Gem, User, Crown, Smile } from 'lucide-react';
import { formatNumber } from '../services/gameService';
import FishIcon from './FishIcon';

interface LayoutProps {
  children: React.ReactNode;
  money: number;
  gems?: number;
  level: number;
  activeTab: 'INVENTORY' | 'SHOP' | 'AQUARIUM';
  onTabChange: (tab: 'INVENTORY' | 'SHOP' | 'AQUARIUM') => void;
  onOpenProfile: () => void;
  playerAvatar: string; // ID
  playerName: string; // Display Name
  isShaking?: boolean; // New Prop for Screen Shake
}

const Layout: React.FC<LayoutProps> = ({ children, money, gems = 0, level, activeTab, onTabChange, onOpenProfile, playerAvatar, playerName, isShaking = false }) => {
  
  // Helper to render the mini avatar in header
  const renderHeaderAvatar = () => {
      if (playerAvatar === 'guest') return <User size={16} className="text-blue-300" />;
      
      // Assume fish if not others (simplified check)
      return <FishIcon speciesId={playerAvatar} size={20} />;
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#1a1b26] flex items-center justify-center overflow-hidden">
      
      {/* Console Device Body - Cleaner Look */}
      <div 
        className={`
            relative w-full h-full sm:w-[400px] sm:h-[800px] bg-slate-900 shadow-2xl flex flex-col sm:rounded-[30px] overflow-hidden border-[8px] border-slate-800
            ${isShaking ? 'animate-shake-screen' : ''}
        `}
      >
        
        {/* Screen Container (Bezel) */}
        <div className="flex-1 bg-[#1a1b23] flex flex-col relative overflow-hidden">
            
            {/* Game Header (Status Bar) */}
            <header className="shrink-0 bg-slate-900/90 backdrop-blur-sm p-3 border-b border-slate-700 flex justify-between items-center z-20 relative">
            <div className="flex items-center gap-2">
                <button 
                    onClick={onOpenProfile}
                    className="w-9 h-9 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center hover:border-yellow-500 transition-colors shadow-sm overflow-hidden"
                >
                    {renderHeaderAvatar()}
                </button>
                <div className="flex flex-col">
                    <h1 className="text-yellow-400 font-bold text-xs tracking-wide drop-shadow-sm uppercase max-w-[100px] truncate">
                        {playerName}
                    </h1>
                    <span className="text-[9px] text-slate-500 uppercase font-mono">Lv.{level} 釣手</span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1">
                {/* Money */}
                <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-slate-700/50 min-w-[70px] justify-end shadow-sm">
                    <span className="text-yellow-400 font-bold text-[10px] tracking-widest font-mono">
                    {formatNumber(money)}
                    </span>
                    <Coins size={12} className="text-yellow-500" />
                </div>
                {/* Gems */}
                <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-slate-700/50 min-w-[50px] justify-end shadow-sm">
                    <span className="text-cyan-300 font-bold text-[10px] tracking-widest font-mono">
                    {formatNumber(gems)}
                    </span>
                    <Gem size={10} className="text-cyan-400" />
                </div>
            </div>
            </header>

            {/* Main Viewport */}
            <main className="flex-1 flex flex-col overflow-hidden relative bg-[#1e2029] z-10">
            {children}
            </main>
        </div>

        {/* Navigation */}
        <div className="shrink-0 bg-slate-900 pb-safe sm:pb-2 pt-1 border-t border-slate-800 z-20 relative">
            <nav className="grid grid-cols-3 h-16">
                <button 
                    onClick={() => onTabChange('INVENTORY')}
                    className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${activeTab === 'INVENTORY' ? 'text-yellow-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Backpack size={24} />
                    <span className="font-bold tracking-widest text-[10px]">背包</span>
                </button>
                
                <button 
                    onClick={() => onTabChange('AQUARIUM')}
                    className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${activeTab === 'AQUARIUM' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Waves size={24} />
                    <span className="font-bold tracking-widest text-[10px]">水族箱</span>
                </button>

                <button 
                    onClick={() => onTabChange('SHOP')}
                    className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${activeTab === 'SHOP' ? 'text-green-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <ShoppingBag size={24} />
                    <span className="font-bold tracking-widest text-[10px]">商店</span>
                </button>
            </nav>
        </div>

      </div>
    </div>
  );
};

export default Layout;