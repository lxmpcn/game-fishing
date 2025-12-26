// 登入畫面組件：處理使用者登入、註冊與遊客試玩模式，包含表單驗證與錯誤處理。

import React, { useState } from 'react';
import { User, Lock, LogIn, Gamepad2, UserPlus, Loader2, ArrowRight, Smile } from 'lucide-react';
import PixelCard from './PixelCard';
import { authService } from '../services/authService';

interface LoginScreenProps {
  onLogin: (username: string, isDev: boolean, displayName?: string) => void;
  onGuestLogin: (guestName: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGuestLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'GUEST_INPUT'>('LOGIN');
  
  // Form States
  const [username, setUsername] = useState(''); // UID
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(''); // Visible Name
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        if (mode === 'GUEST_INPUT') {
            if (!displayName.trim()) {
                setError('請輸入你的名字');
                setIsLoading(false);
                return;
            }
            // Guest login with custom name
            onGuestLogin(displayName.trim().substring(0, 12));
            return;
        }

        if (mode === 'LOGIN') {
            if (!username || !password) {
                setError('請輸入帳號與密碼');
                setIsLoading(false);
                return;
            }
            const result = await authService.login(username, password);
            if (result.success) {
                const isDev = (username === '11111');
                onLogin(username, isDev, result.displayName);
            } else {
                if (!authService.userExists(username)) {
                    setError('冒險者未註冊');
                } else {
                    setError('通行證錯誤');
                }
            }
        } else if (mode === 'REGISTER') {
            if (!username || !password || !displayName) {
                setError('請填寫所有欄位');
                setIsLoading(false);
                return;
            }
            if (displayName.length > 12) {
                setError('名字太長囉 (上限12字)');
                setIsLoading(false);
                return;
            }
            const result = await authService.register(username, password, displayName);
            if (result.success) {
                // Auto login after register
                onLogin(username, false, displayName);
            } else {
                setError(result.message || '註冊失敗');
            }
        }
    } catch (err) {
        setError('系統錯誤');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4 z-[100]">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#000,#000_20px,#111_20px,#111_40px)]"></div>
      </div>

      <PixelCard className="w-full max-w-sm bg-slate-900 border-yellow-600 shadow-[0_0_0_4px_rgba(0,0,0,0.5),0_20px_50px_rgba(0,0,0,0.8)] flex flex-col" borderColor="border-yellow-600">
        
        {/* Header Ribbon */}
        <div className="bg-yellow-600 text-black font-bold text-center py-2 -mx-1 -mt-1 mb-6 border-b-4 border-yellow-800">
            <h1 className="pixel-font tracking-widest text-lg flex items-center justify-center gap-2">
                <Gamepad2 size={20} />
                {mode === 'LOGIN' ? '冒險者登入' : mode === 'REGISTER' ? '新進人員登記' : '遊客通行證'}
            </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-4 pb-4">
          
          {/* Guest Name Input */}
          {mode === 'GUEST_INPUT' && (
              <div className="space-y-4 animate-fade-in">
                  <div className="text-center text-slate-300 text-xs mb-4">
                      你好！初次見面，請問該怎麼稱呼你呢？
                  </div>
                  <div className="relative">
                    <label className="text-[10px] font-bold text-yellow-500 uppercase mb-1 block">顯示名稱 (Display Name)</label>
                    <div className="flex items-center bg-black border-2 border-slate-600 focus-within:border-yellow-500 transition-colors p-2 rounded">
                        <Smile size={16} className="text-slate-500 mr-2" />
                        <input 
                            type="text" 
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="bg-transparent border-none text-white font-mono text-sm w-full focus:outline-none placeholder:text-slate-700"
                            placeholder="輸入你的名字"
                            maxLength={12}
                            autoFocus
                            disabled={isLoading}
                        />
                    </div>
                </div>
              </div>
          )}

          {/* Login/Register Inputs */}
          {(mode === 'LOGIN' || mode === 'REGISTER') && (
            <div className="space-y-4 animate-fade-in">
                {/* UID Field */}
                <div className="relative">
                    <label className="text-[10px] font-bold text-yellow-500 uppercase mb-1 block">UID (帳號)</label>
                    <div className="flex items-center bg-black border-2 border-slate-600 focus-within:border-yellow-500 transition-colors p-2 rounded">
                        <User size={16} className="text-slate-500 mr-2" />
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-transparent border-none text-white font-mono text-sm w-full focus:outline-none placeholder:text-slate-700"
                            placeholder="UNIQUE ID"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="relative">
                    <label className="text-[10px] font-bold text-yellow-500 uppercase mb-1 block">密碼 (Password)</label>
                    <div className="flex items-center bg-black border-2 border-slate-600 focus-within:border-yellow-500 transition-colors p-2 rounded">
                        <Lock size={16} className="text-slate-500 mr-2" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent border-none text-white font-mono text-sm w-full focus:outline-none placeholder:text-slate-700"
                            placeholder="PASSWORD"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Display Name Field (Register Only) */}
                {mode === 'REGISTER' && (
                    <div className="relative animate-slide-down">
                        <label className="text-[10px] font-bold text-green-400 uppercase mb-1 block">顯示名稱 (Display Name)</label>
                        <div className="flex items-center bg-black border-2 border-slate-600 focus-within:border-green-500 transition-colors p-2 rounded">
                            <Smile size={16} className="text-slate-500 mr-2" />
                            <input 
                                type="text" 
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="bg-transparent border-none text-white font-mono text-sm w-full focus:outline-none placeholder:text-slate-700"
                                placeholder="怎麼稱呼你?"
                                maxLength={12}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-xs font-bold text-center bg-red-950/50 p-2 border-l-4 border-red-500 animate-shake">
              [!] {error}
            </div>
          )}

          {/* Mode Switcher */}
          {mode !== 'GUEST_INPUT' && (
              <div className="flex justify-center gap-4 text-xs font-bold">
                  <button 
                    type="button"
                    onClick={() => { setMode('LOGIN'); setError(''); }}
                    className={`pb-1 border-b-2 transition-colors ${mode === 'LOGIN' ? 'text-white border-yellow-500' : 'text-slate-600 border-transparent hover:text-slate-400'}`}
                  >
                      登入
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setMode('REGISTER'); setError(''); }}
                    className={`pb-1 border-b-2 transition-colors ${mode === 'REGISTER' ? 'text-white border-yellow-500' : 'text-slate-600 border-transparent hover:text-slate-400'}`}
                  >
                      註冊
                  </button>
              </div>
          )}

          {/* Main Action Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className={`
                w-full font-bold py-3 rounded border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 group
                ${mode === 'LOGIN' 
                    ? 'bg-yellow-600 hover:bg-yellow-500 text-black border-yellow-800' 
                    : mode === 'REGISTER' 
                        ? 'bg-green-600 hover:bg-green-500 text-white border-green-800'
                        : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-800'
                }
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <span className="group-hover:translate-x-1 transition-transform flex items-center gap-2">{mode === 'LOGIN' ? '開始冒險' : mode === 'REGISTER' ? '提交申請' : '開始遊玩'} <ArrowRight size={16} /></span>}
          </button>

          <div className="border-t border-slate-800 my-2"></div>

          {/* Guest Button (Shows input mode) */}
          {mode !== 'GUEST_INPUT' ? (
              <button 
                type="button"
                onClick={() => { setMode('GUEST_INPUT'); setError(''); setDisplayName(''); }}
                disabled={isLoading}
                className="w-full text-slate-500 hover:text-slate-300 font-bold text-xs py-2 hover:bg-slate-800 rounded transition-colors"
              >
                  &gt; 以遊客身份試玩 &lt;
              </button>
          ) : (
              <button 
                type="button"
                onClick={() => { setMode('LOGIN'); setError(''); }}
                className="w-full text-slate-500 hover:text-slate-300 font-bold text-xs py-2 hover:bg-slate-800 rounded transition-colors"
              >
                  返回登入畫面
              </button>
          )}

        </form>
      </PixelCard>
    </div>
  );
};

export default LoginScreen;