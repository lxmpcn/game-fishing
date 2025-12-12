
import React, { useState } from 'react';
import { User, Lock, LogIn, Gamepad2, UserPlus, Loader2, ArrowRight } from 'lucide-react';
import PixelCard from './PixelCard';
import { authService } from '../services/authService';

interface LoginScreenProps {
  onLogin: (username: string, isDev: boolean) => void;
  onGuestLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGuestLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('請輸入帳號與密碼');
      return;
    }

    setIsLoading(true);

    try {
        if (mode === 'LOGIN') {
            const isValid = await authService.login(username, password);
            if (isValid) {
                const isDev = (username === '11111');
                onLogin(username, isDev);
            } else {
                if (!authService.userExists(username)) {
                    setError('冒險者未註冊');
                } else {
                    setError('通行證錯誤');
                }
            }
        } else {
            const result = await authService.register(username, password);
            if (result.success) {
                onLogin(username, false);
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
                {mode === 'LOGIN' ? '冒險者登入' : '新進人員登記'}
            </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-4 pb-4">
          
          {/* Input Fields */}
          <div className="space-y-4">
            <div className="relative">
                <label className="text-[10px] font-bold text-yellow-500 uppercase mb-1 block">使用者名稱</label>
                <div className="flex items-center bg-black border-2 border-slate-600 focus-within:border-yellow-500 transition-colors p-2 rounded">
                    <User size={16} className="text-slate-500 mr-2" />
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-transparent border-none text-white font-mono text-sm w-full focus:outline-none placeholder:text-slate-700"
                        placeholder="USERNAME"
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="relative">
                <label className="text-[10px] font-bold text-yellow-500 uppercase mb-1 block">通行證密碼</label>
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
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-xs font-bold text-center bg-red-950/50 p-2 border-l-4 border-red-500 animate-shake">
              [!] {error}
            </div>
          )}

          {/* Mode Switcher */}
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

          {/* Main Action Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className={`
                w-full font-bold py-3 rounded border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 group
                ${mode === 'LOGIN' 
                    ? 'bg-yellow-600 hover:bg-yellow-500 text-black border-yellow-800' 
                    : 'bg-green-600 hover:bg-green-500 text-white border-green-800'
                }
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <span className="group-hover:translate-x-1 transition-transform flex items-center gap-2">{mode === 'LOGIN' ? '開始冒險' : '提交申請'} <ArrowRight size={16} /></span>}
          </button>

          <div className="border-t border-slate-800 my-2"></div>

          {/* Guest Button */}
          <button 
            type="button"
            onClick={onGuestLogin}
            disabled={isLoading}
            className="w-full text-slate-500 hover:text-slate-300 font-bold text-xs py-2 hover:bg-slate-800 rounded transition-colors"
          >
              &gt; 以遊客身份試玩 &lt;
          </button>

        </form>
      </PixelCard>
    </div>
  );
};

export default LoginScreen;
