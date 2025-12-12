
import React from 'react';

interface CatIconProps {
  color: string;
  size?: number;
  pose?: 'sitting' | 'sleeping' | 'merchant';
}

const CatIcon: React.FC<CatIconProps> = ({ color, size = 32, pose = 'sitting' }) => {
  if (pose === 'sleeping') {
    return (
      <svg 
        viewBox="0 0 16 16" 
        width={size} 
        height={size} 
        style={{ shapeRendering: 'crispEdges' }} 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body Lying Down */}
        <path fill={color} d="M3 10 h10 v3 h-10 z" />
        <path fill={color} d="M2 11 h1 v2 h-1 z M13 11 h1 v2 h-1 z" />
        
        {/* Head Resting */}
        <path fill={color} d="M10 8 h5 v3 h-5 z" />
        {/* Ears Flat */}
        <path fill={color} d="M10 7 h2 v1 h-2 z M13 7 h2 v1 h-2 z" />
        
        {/* Sleeping Eyes */}
        <path fill="#000" d="M11 9 h2 v1 h-2 z M13 9 h2 v1 h-2 z" opacity="0.5" />
        
        {/* Tail curled */}
        <path fill={color} d="M1 9 h2 v2 h-2 z M1 8 h1 v1 h-1 z" />
      </svg>
    );
  }

  if (pose === 'merchant') {
    return (
      <svg 
        viewBox="0 0 16 16" 
        width={size} 
        height={size} 
        style={{ shapeRendering: 'crispEdges' }} 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ears */}
        <path fill={color} d="M3 4 h2 v2 h-2 z M11 4 h2 v2 h-2 z" />
        {/* Head */}
        <path fill={color} d="M4 6 h8 v6 h-8 z" />
        <path fill={color} d="M3 7 h10 v4 h-10 z" />
        {/* Eyes */}
        <path fill="#000" d="M5 8 h2 v2 h-2 z M9 8 h2 v2 h-2 z" />
        <path fill="#fff" d="M6 8 h1 v1 h-1 z M10 8 h1 v1 h-1 z" />
        
        {/* Merchant Accessories */}
        {/* Top Hat */}
        <path fill="#1e293b" d="M4 3 h8 v2 h-8 z" /> {/* Brim */}
        <path fill="#0f172a" d="M5 0 h6 v3 h-6 z" /> {/* Top */}
        <path fill="#ef4444" d="M5 3 h6 v1 h-6 z" /> {/* Red Band */}
        
        {/* Monocle */}
        <path fill="#facc15" d="M9 8 h2 v2 h-2 z" opacity="0.3" /> 
        <path fill="#eab308" d="M11 8 h1 v3 h-1 z M9 10 h2 v1 h-2 z" /> {/* Chain/Rim */}
        
        {/* Bow tie */}
        <path fill="#ef4444" d="M6 12 h1 v1 h-1 z M9 12 h1 v1 h-1 z M7 13 h2 v1 h-2 z" />

        {/* Whiskers */}
        <path fill="#000" d="M2 9 h2 v1 h-2 z M12 9 h2 v1 h-2 z" opacity="0.3" />
      </svg>
    );
  }

  // Default Sitting
  return (
    <svg 
      viewBox="0 0 16 16" 
      width={size} 
      height={size} 
      style={{ shapeRendering: 'crispEdges' }} 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ears */}
      <path fill={color} d="M3 4 h2 v2 h-2 z M11 4 h2 v2 h-2 z" />
      {/* Head */}
      <path fill={color} d="M4 6 h8 v6 h-8 z" />
      <path fill={color} d="M3 7 h10 v4 h-10 z" />
      {/* Eyes */}
      <path fill="#000" d="M5 8 h2 v2 h-2 z M9 8 h2 v2 h-2 z" />
      <path fill="#fff" d="M6 8 h1 v1 h-1 z M10 8 h1 v1 h-1 z" />
      {/* Nose */}
      <path fill="#pink" d="M7 11 h2 v1 h-2 z" opacity="0.6" />
      {/* Whiskers */}
      <path fill="#000" d="M2 9 h2 v1 h-2 z M12 9 h2 v1 h-2 z" opacity="0.3" />
    </svg>
  );
};

export default CatIcon;
