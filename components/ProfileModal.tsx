// 玩家資訊模態框：管理個人資料、系統設定 (音量/存檔) 與教學重置。

import React, { useState } from 'react';
import PixelCard from './PixelCard';
import { X, User, Settings as SettingsIcon, BookOpen, Crown, Smile, Edit2, Check, Music, Volume2, VolumeX, LogOut, RefreshCw, Gift, HelpCircle, CheckCircle } from 'lucide-react';
import { GameState, FishRecord } from '../types';
import { FISH_TYPES } from '../constants';
import FishIcon from './FishIcon';
import { soundManager } from '../services/soundService';

interface ProfileModalProps {
  onClose: () => void;
  gameState: GameState;
  onOpenAlmanac: () => void;
  onSelectAvatar: (id: string) => void;
  onChangeName: (name: string) => void;
  // Merged Settings Props
  onResetSave: () => void;
  onLogout: () => void;
  onOpenTutorial: () => void;
}

const VolumeBar: React.FC<{ value: number, onChange: (val: number) => void, colorClass: string }> = ({ value, onChange, colorClass }) => {
    const bars = 8;
    const filled = Math.round(value * bars);
    return (
        <div className="flex items-center gap-1 h-4 select-none cursor-pointer" onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = clickX / rect.width;
            onChange(Math.max(0, Math.min(1, Math.round(pct * 10) / 10)));
        }}>
            {Array.from({ length: bars }).map((_, i) => (
                <div key={i} className={`w-2 h-full rounded-[1px] transition-all ${i < filled ? colorClass : 'bg-slate-700'}`}></div>
            ))}
        </div>
    );
};

const ProfileModal: React.FC<ProfileModalProps> = ({ 
    onClose, gameState, onOpenAlmanac, onSelectAvatar, onChangeName,
    onResetSave, onLogout, onOpenTutorial
}) => {
  const { playerAvatar, fishRecords, playerName } = gameState;
  
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'SYSTEM'>('PROFILE');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName || '');
  
  // Settings States
  const [volumes, setVolumes] = useState(soundManager.volumes);
  const [audioMode, setAudioMode] = useState(soundManager.getAudioMode());
  const [confirmReset, setConfirmReset] = useState(false);

  // Determine available avatars
  const availableAvatars: { id: string; type: 'USER' | 'FISH'; name: string }[] = [
      { id: 'guest', type: 'USER', name: '冒險者' },
  ];
  
  Object.entries(fishRecords).forEach(([fishId, record]) => {
      if ((record as FishRecord).discovered) {
          const fish = FISH_TYPES.find(f => f.id === fishId);
          if (fish) availableAvatars.push({ id: fishId, type: 'FISH', name: fish.name });
      }
  });

  const renderAvatar = (id: string, type: string, size: number = 32) => {
      if (type === 'USER') return <User size={size} className="text-blue-300" />;
      if (type === 'FISH') return <FishIcon speciesId={id} size={size} />;
      return <Smile size={size} />;
  };

  const handleNameSave = () => {
      const trimmed = tempName.trim();
      if (trimmed.length > 0) onChangeName(trimmed.substring(0, 12));
      else setTempName(playerName);
      setIsEditingName(false);
  };

  const handleVolumeChange = (type: 'master' | 'sfx' | 'bgm', val: number) => {
    soundManager.setVolume(type, val);
    setVolumes(prev => ({ ...prev, [type]: val }));
  };

  const handleModeChange = (mode: 'NONE' | 'AMBIENCE' | 'MUSIC') => {
      soundManager.setAudioMode(mode);
      setAudioMode(mode);
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <PixelCard className="w-full max-w-sm h-[80vh] bg-slate-900 border-indigo-500 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-4 border-slate-700 pb-2 mb-2 px-2 pt-2 shrink-0 bg-slate-900 z-10">
            <h2 className="text-lg text-indigo-300 font-bold pixel-font flex items-center gap-2">
                <User size={20} /> 檔案管理
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-transform hover:scale-110 bg-slate-800 p-1 rounded"><X /></button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 mb-2 shrink-0">
            <button 
                onClick={() => setActiveTab('PROFILE')}
                className={`flex-1 py-1 text-xs font-bold rounded-t border-b-2 transition-colors ${activeTab === 'PROFILE' ? 'text-white border-indigo-500 bg-slate-800' : 'text-slate-500 border-transparent hover:bg-slate-800/50'}`}
            >
                個人資訊
            </button>
            <button 
                onClick={() => setActiveTab('SYSTEM')}
                className={`flex-1 py-1 text-xs font-bold rounded-t border-b-2 transition-colors ${activeTab === 'SYSTEM' ? 'text-white border-yellow-500 bg-slate-800' : 'text-slate-500 border-transparent hover:bg-slate-800/50'}`}
            >
                系統設定
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            
            {activeTab === 'PROFILE' && (
                <div className="space-y-6">
                    {/* Top Section: Avatar & Name */}
                    <div className="bg-slate-800 p-4 rounded-lg border-2 border-slate-700 space-y-4">
                        <div className="flex gap-4 items-center">
                            <div className="w-20 h-20 bg-slate-900 rounded-full border-4 border-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] shrink-0">
                                {renderAvatar(playerAvatar, availableAvatars.find(a => a.id === playerAvatar)?.type || 'USER', 48)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                {isEditingName ? (
                                    <div className="flex items-center gap-2">
                                        <input 
                                            autoFocus type="text" value={tempName} onChange={(e) => setTempName(e.target.value)}
                                            className="bg-black text-white font-bold text-lg w-full border-2 border-indigo-500 rounded px-2 py-1 focus:outline-none"
                                            maxLength={12} onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                                        />
                                        <button onClick={handleNameSave} className="bg-green-600 hover:bg-green-500 text-white p-1.5 rounded"><Check size={16} /></button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 group">
                                        <h3 className="text-xl font-bold text-white pixel-font truncate">{playerName}</h3>
                                        <button onClick={() => { setTempName(playerName); setIsEditingName(true); }} className="text-slate-500 hover:text-white p-1 rounded hover:bg-slate-700 transition-colors"><Edit2 size={14} /></button>
                                    </div>
                                )}
                                <div className="text-xs text-slate-400 mt-1 font-mono">ID: {availableAvatars.find(a=>a.id===playerAvatar)?.name || 'Unknown'}</div>
                            </div>
                        </div>

                        <button 
                            onClick={onOpenAlmanac}
                            className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-600 text-white py-2 rounded text-xs font-bold border-b-2 border-amber-900 active:border-b-0 active:translate-y-0.5"
                        >
                            <BookOpen size={14} /> 檢視魚類圖鑑
                        </button>
                    </div>

                    {/* Avatar Selection Grid */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest border-b border-slate-700 pb-1">更換頭像</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {availableAvatars.map(avatar => (
                                <button
                                    key={avatar.id}
                                    onClick={() => onSelectAvatar(avatar.id)}
                                    className={`
                                        aspect-square rounded border-2 flex flex-col items-center justify-center p-1 transition-all relative overflow-hidden
                                        ${playerAvatar === avatar.id ? 'bg-indigo-900 border-indigo-400 shadow-[inset_0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-500'}
                                    `}
                                    title={avatar.name}
                                >
                                    {renderAvatar(avatar.id, avatar.type, 24)}
                                    {playerAvatar === avatar.id && <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-bl"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'SYSTEM' && (
                <div className="space-y-6">
                    {/* Audio Mode */}
                    <div className="bg-slate-800 p-3 rounded border border-slate-700">
                        <h3 className="text-[10px] text-slate-400 font-bold mb-2 uppercase">音效模式</h3>
                        <div className="flex gap-2">
                            {[
                                { id: 'NONE', icon: VolumeX, label: '靜音', color: 'text-red-400' },
                                { id: 'AMBIENCE', icon: Volume2, label: '白噪音', color: 'text-cyan-400' },
                                { id: 'MUSIC', icon: Music, label: '音樂', color: 'text-yellow-400' },
                            ].map((m) => (
                                <button key={m.id} onClick={() => handleModeChange(m.id as any)} className={`flex-1 py-2 rounded flex flex-col items-center gap-1 border border-transparent ${audioMode === m.id ? 'bg-slate-700 shadow-inner border-slate-600' : 'hover:bg-slate-700/50'}`}>
                                    <m.icon size={16} className={audioMode === m.id ? m.color : 'text-slate-500'} />
                                    <span className={`text-[9px] font-bold ${audioMode === m.id ? 'text-white' : 'text-slate-500'}`}>{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Volume Sliders */}
                    <div className="space-y-3 px-1">
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-400 font-bold"><span>主音量</span><span>{Math.round(volumes.master * 100)}%</span></div>
                            <VolumeBar value={volumes.master} onChange={(v) => handleVolumeChange('master', v)} colorClass="bg-yellow-500" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-400 font-bold"><span>背景音</span><span>{Math.round(volumes.bgm * 100)}%</span></div>
                            <VolumeBar value={volumes.bgm} onChange={(v) => handleVolumeChange('bgm', v)} colorClass="bg-cyan-500" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-400 font-bold"><span>音效</span><span>{Math.round(volumes.sfx * 100)}%</span></div>
                            <VolumeBar value={volumes.sfx} onChange={(v) => handleVolumeChange('sfx', v)} colorClass="bg-green-500" />
                        </div>
                    </div>

                    <div className="border-t border-slate-700"></div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={onOpenTutorial} className="flex items-center justify-center gap-2 p-2 bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-500/50 rounded text-xs font-bold text-indigo-200">
                            <HelpCircle size={14} /> 教學
                        </button>
                        <button onClick={onLogout} className="flex items-center justify-center gap-2 p-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-xs font-bold text-slate-300">
                            <LogOut size={14} /> 登出
                        </button>
                    </div>

                    {/* Reset */}
                    <div className="pt-2">
                        {!confirmReset ? (
                            <button onClick={() => setConfirmReset(true)} className="w-full text-[10px] font-bold text-slate-600 hover:text-red-400 flex items-center justify-center gap-1 hover:bg-red-950/20 py-2 rounded">
                                <RefreshCw size={10} /> 清除存檔
                            </button>
                        ) : (
                            <div className="bg-red-900/20 border border-red-600/50 p-2 rounded text-center">
                                <p className="text-[10px] text-red-200 mb-2">確定重置?</p>
                                <div className="flex gap-2 justify-center">
                                    <button onClick={onResetSave} className="bg-red-600 text-white px-3 py-1 rounded text-[10px] font-bold">是</button>
                                    <button onClick={() => setConfirmReset(false)} className="bg-slate-700 text-white px-3 py-1 rounded text-[10px] font-bold">否</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
      </PixelCard>
    </div>
  );
};

export default ProfileModal;