// 通用 UI 卡片組件：提供統一的像素風格邊框與容器樣式。

import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  title?: string;
  action?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const PixelCard: React.FC<PixelCardProps> = ({ 
  children, 
  className = "", 
  borderColor = "border-slate-500",
  title,
  action,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
      bg-slate-800 
      border-4 ${borderColor} 
      rounded-sm
      relative 
      flex flex-col
      ${className}
      shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
    `}>
      {/* Soft Inner Highlight for "embossed" look */}
      <div className="pointer-events-none absolute inset-0 border-t-2 border-l-2 border-white/10 z-20 rounded-sm"></div>
      <div className="pointer-events-none absolute inset-0 border-b-2 border-r-2 border-black/20 z-20 rounded-sm"></div>

      {/* Header */}
      {(title || action) && (
        <div className="shrink-0 flex justify-between items-center mb-0 border-b-2 border-slate-600 pb-2 px-3 pt-2 bg-slate-700/50 z-10">
           {title && (
             <h2 className="text-lg md:text-xl font-bold pixel-font-header text-yellow-300 tracking-wide drop-shadow-sm">
               {title}
             </h2>
           )}
           {action && <div>{action}</div>}
        </div>
      )}
      
      {/* Content Container - Crucial change: flex-1 and min-h-0 allow scrolling inside */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default PixelCard;