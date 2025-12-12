
import React, { useState } from 'react';
import PixelCard from './PixelCard';
import { Volume2, HelpCircle, RefreshCw, X, LogOut, Music, Waves, VolumeX } from 'lucide-react';
import { soundManager } from '../services/soundService';

interface SettingsModalProps {
  onClose: () => void;
  onResetSave: () => void;
  onOpenTutorial: () => void;
  onLogout: () => void;
}

const VolumeBar: React.FC<{ value: number, onChange: (val: number) => void, colorClass: string }> = ({ value, onChange, colorClass }) => {
    const bars = 10;
    const filled = Math.round(value * bars);
    
    return (
        <div className="flex items-center gap-1 h-6 select-none cursor-pointer" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = clickX / rect.width;
            onChange(Math.max(0, Math.min(1, Math.round(pct * 10) / 10)));
        }}>
            {Array.from({ length: bars }).map((_, i) => (
                <div 
                    key={i} 
                    className={`w-3 h-full rounded-sm transition-all ${i < filled ? colorClass : 'bg-slate-800'}`}
                ></div>
            ))}
        </div>
    );
};

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onResetSave, onOpenTutorial, onLogout }) => {
  const [volumes, setVolumes] = useState(soundManager.volumes);
  const [audioMode, setAudioMode] = useState(soundManager.getAudioMode());
  const [confirmReset, setConfirmReset] = useState(false);

  const handleVolumeChange = (type: 'master' | 'sfx' | 'bgm', val: number) => {
    soundManager.setVolume(type, val);
    setVolumes(prev => ({ ...prev, [type]: val }));
  };

  const handleModeChange = (mode: 'NONE' | 'AMBIENCE' | 'MUSIC') => {
      soundManager.setAudioMode(mode);
      setAudioMode(mode);
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <PixelCard className="w-full max-w-sm bg-slate-900 border-slate-500 shadow-[0_0_0_100vmax_rgba(0,0,0,0.5)]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-4 border-slate-700 pb-2 mb-4">
          <h2 className="text-lg text-slate-200 font-bold pixel-font flex items-center gap-2">
             <div className="w-2 h-2 bg-yellow-400 animate-pulse"></div>
             SYSTEM CONFIG
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-transform hover:scale-110"><X /></button>
        </div>

        <div className="space-y-6">
          
          {/* Audio Source Selector */}
          <div className="space-y-2">
              <h3 className="text-xs text-slate-500 font-bold tracking-widest uppercase">背景音效模式</h3>
              <div className="flex gap-2 p-1 bg-slate-950 rounded-lg border-2 border-slate-800">
                  <button 
                    onClick={() => handleModeChange('NONE')}
                    className={`flex-1 py-2 rounded flex flex-col items-center gap-1 transition-all ${audioMode === 'NONE' ? 'bg-slate-700 text-red-400 shadow-inner' : 'text-slate-500 hover:bg-slate-900'}`}
                  >
                      <VolumeX size={16} />
                      <span className="text-[9px] font-bold">靜音</span>
                  </button>
                  <button 
                    onClick={() => handleModeChange('AMBIENCE')}
                    className={`flex-1 py-2 rounded flex flex-col items-center gap-1 transition-all ${audioMode === 'AMBIENCE' ? 'bg-slate-700 text-cyan-400 shadow-inner' : 'text-slate-500 hover:bg-slate-900'}`}
                  >
                      <Waves size={16} />
                      <span className="text-[9px] font-bold">白噪音</span>
                  </button>
                  <button 
                    onClick={() => handleModeChange('MUSIC')}
                    className={`flex-1 py-2 rounded flex flex-col items-center gap-1 transition-all ${audioMode === 'MUSIC' ? 'bg-slate-700 text-yellow-400 shadow-inner' : 'text-slate-500 hover:bg-slate-900'}`}
                  >
                      <Music size={16} />
                      <span className="text-[9px] font-bold">放鬆音樂</span>
                  </button>
              </div>
          </div>

          {/* Volume Controls */}
          <div className="space-y-4">
             {/* Master */}
             <div className="space-y-1">
               <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                 <span>MASTER VOL</span>
                 <span>{Math.round(volumes.master * 100)}%</span>
               </div>
               <VolumeBar value={volumes.master} onChange={(v) => handleVolumeChange('master', v)} colorClass="bg-yellow-500" />
             </div>

             {/* BGM (Ambience/Music) */}
             <div className="space-y-1">
               <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                 <span>BGM VOL</span>
                 <span>{Math.round(volumes.bgm * 100)}%</span>
               </div>
               <VolumeBar value={volumes.bgm} onChange={(v) => handleVolumeChange('bgm', v)} colorClass="bg-cyan-500" />
             </div>

             {/* SFX */}
             <div className="space-y-1">
               <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                 <span>SFX VOL</span>
                 <span>{Math.round(volumes.sfx * 100)}%</span>
               </div>
               <VolumeBar value={volumes.sfx} onChange={(v) => handleVolumeChange('sfx', v)} colorClass="bg-green-500" />
             </div>
          </div>

          <div className="border-t border-slate-700 my-2"></div>

          {/* Menu Actions */}
          <div className="grid grid-cols-2 gap-3">
             <button 
               onClick={onOpenTutorial}
               className="flex items-center justify-center gap-2 p-3 bg-indigo-900/30 hover:bg-indigo-900/50 border-2 border-indigo-500/50 rounded hover:border-indigo-400 active:scale-95 transition-all group"
             >
               <HelpCircle className="text-indigo-400 group-hover:text-white" size={16} />
               <span className="text-xs font-bold text-indigo-200 group-hover:text-white">操作說明</span>
             </button>

             <button 
               onClick={onLogout}
               className="flex items-center justify-center gap-2 p-3 bg-amber-900/30 hover:bg-amber-900/50 border-2 border-amber-500/50 rounded hover:border-amber-400 active:scale-95 transition-all group"
             >
               <LogOut className="text-amber-400 group-hover:text-white" size={16} />
               <span className="text-xs font-bold text-amber-200 group-hover:text-white">登出遊戲</span>
             </button>
          </div>

          {/* Danger Zone */}
          <div className="pt-2">
            {!confirmReset ? (
                <button 
                    onClick={() => setConfirmReset(true)}
                    className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
                >
                    <RefreshCw size={10} />
                    清除存檔數據
                </button>
            ) : (
                <div className="bg-red-900/20 border-2 border-red-600/50 p-3 rounded text-center animate-pulse">
                    <p className="text-[10px] text-red-200 font-bold mb-2">警告：此操作不可逆！</p>
                    <div className="flex gap-2 justify-center">
                        <button onClick={onResetSave} className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded text-xs font-bold shadow-lg">確認刪除</button>
                        <button onClick={() => setConfirmReset(false)} className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-1 rounded text-xs font-bold">取消</button>
                    </div>
                </div>
            )}
          </div>

        </div>
      </PixelCard>
    </div>
  );
};

export default SettingsModal;
