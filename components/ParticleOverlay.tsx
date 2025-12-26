// 粒子特效組件：負責渲染畫面上的飄浮文字 (如 +金幣) 與視覺特效 (如閃光)。

import React from 'react';

export interface Particle {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  text?: string;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  life: number; // 0 to 1
  type: 'TEXT' | 'SPARKLE';
}

interface ParticleOverlayProps {
  particles: Particle[];
}

const ParticleOverlay: React.FC<ParticleOverlayProps> = ({ particles }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute font-bold pixel-font"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            color: p.color,
            fontSize: p.type === 'TEXT' ? `${p.size}px` : undefined,
            width: p.type === 'SPARKLE' ? `${p.size}px` : undefined,
            height: p.type === 'SPARKLE' ? `${p.size}px` : undefined,
            backgroundColor: p.type === 'SPARKLE' ? p.color : undefined,
            opacity: p.life,
            transform: `translate(-50%, -50%) scale(${p.type === 'SPARKLE' ? 1 + (1 - p.life) : 1})`,
            textShadow: p.type === 'TEXT' ? '2px 2px 0px rgba(0,0,0,0.8)' : undefined,
            transition: 'opacity 0.1s linear',
          }}
        >
          {p.type === 'TEXT' ? p.text : ''}
        </div>
      ))}
    </div>
  );
};

export default ParticleOverlay;