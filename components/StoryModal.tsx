
import React, { useState, useEffect } from 'react';
import PixelCard from './PixelCard';
import CatIcon from './CatIcon';
import { User, ChevronDown } from 'lucide-react';
import { StoryEvent } from '../types';

interface StoryModalProps {
  event: StoryEvent;
  onClose: () => void;
}

const StoryModal: React.FC<StoryModalProps> = ({ event, onClose }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter Effect
  useEffect(() => {
    let index = 0;
    const fullText = event.content;
    const speed = 30; // ms per char

    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(prev => prev + fullText.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [event.content]);

  const handleInteraction = () => {
    if (isTyping) {
      // Skip typing
      setDisplayedText(event.content);
      setIsTyping(false);
    } else {
      // Close
      onClose();
    }
  };

  return (
    // Backdrop ensures clicks are captured
    <div 
      className="fixed inset-0 z-[100] flex items-end justify-center pb-20 sm:pb-24 px-4"
      onClick={handleInteraction}
    >
      {/* Dark overlay for focus, but allows seeing the game behind */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"></div>

      <PixelCard 
        className="w-full max-w-lg bg-slate-800 border-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-slide-up relative z-10"
        borderColor={event.speaker === 'SHOPKEEPER' ? 'border-yellow-500' : 'border-blue-400'}
      >
        <div className="flex gap-4 p-4 items-start min-h-[160px]">
            
            {/* Avatar Box */}
            <div className={`shrink-0 w-20 h-20 border-4 ${event.speaker === 'SHOPKEEPER' ? 'border-yellow-500 bg-yellow-900/30' : 'border-blue-400 bg-blue-900/30'} rounded-lg shadow-inner flex items-center justify-center relative -mt-10 bg-slate-800`}>
                {event.speaker === 'SHOPKEEPER' ? (
                    <CatIcon color="#fb923c" size={56} />
                ) : (
                    <User size={48} className="text-blue-200" />
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col pt-1">
                {/* Name Tag */}
                <div className={`
                    self-start px-3 py-1 mb-2 text-xs font-bold tracking-widest rounded-full bg-black/20 border-b-2
                    ${event.speaker === 'SHOPKEEPER' ? 'text-yellow-300 border-yellow-500' : 'text-blue-200 border-blue-400'}
                `}>
                    {event.speaker === 'SHOPKEEPER' ? '橘子店長' : '我'}
                </div>

                {/* Text */}
                <div className="text-base text-slate-100 font-medium leading-relaxed whitespace-pre-wrap drop-shadow-sm tracking-wide">
                    {displayedText}
                    {isTyping && <span className="animate-pulse ml-1">_</span>}
                </div>
            </div>

            {/* Continue Indicator */}
            {!isTyping && (
                <div className="absolute bottom-3 right-3 animate-bounce text-slate-400 bg-black/20 p-1 rounded-full">
                    <ChevronDown size={20} />
                </div>
            )}
        </div>
      </PixelCard>
      
      <style>{`
        @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
            animation: slide-up 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StoryModal;
