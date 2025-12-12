
import React from 'react';

interface ItemIconProps {
  type: 'bait' | 'bobber';
  id: string;
  size?: number;
  className?: string;
}

const ItemIcon: React.FC<ItemIconProps> = ({ type, id, size = 32, className = "" }) => {
  const renderPath = () => {
    if (type === 'bait') {
      switch(id) {
        case 'worm': 
            return (
                <>
                    <path fill="#fca5a5" d="M3 12 h2 v-2 h2 v2 h2 v-2 h2 v2 h2 v-2 h-1 v-1 h-2 v2 h-2 v-2 h-2 v2 h-2 v-2 h-2 v2 h-1 z" />
                    <path fill="#f87171" d="M4 11 h1 v1 h-1 z M8 11 h1 v1 h-1 z M12 11 h1 v1 h-1 z" opacity="0.5" />
                </>
            );
        case 'cricket': 
            return (
                <>
                    <path fill="#65a30d" d="M5 8 h8 v3 h-8 z" /> {/* Body */}
                    <path fill="#365314" d="M11 6 h1 v2 h-1 z M13 7 h2 v3 h-2 z" /> {/* Legs Back */}
                    <path fill="#365314" d="M5 11 h1 v2 h-1 z M8 11 h1 v2 h-1 z" /> {/* Legs Front */}
                    <path fill="#000" d="M4 8 h2 v2 h-2 z" opacity="0.3" /> {/* Head shade */}
                </>
            );
        case 'shrimp': 
            return (
                <>
                    <path fill="#fdba74" d="M3 9 h3 v-2 h3 v-2 h3 v2 h2 v2 h-2 v2 h-9 z" />
                    <path fill="#c2410c" d="M4 9 h1 v-1 h-1 z M7 7 h1 v-1 h-1 z M10 5 h1 v2 h-1 z" opacity="0.5" />
                </>
            );
        case 'squid_meat': 
            return (
                <>
                    <path fill="#fcd34d" d="M4 4 h8 v8 h-8 z" /> {/* Meat */}
                    <path fill="#fbbf24" d="M4 4 h8 v2 h-8 z" /> {/* Skin */}
                    <path fill="#fff" d="M5 7 h6 v4 h-6 z" opacity="0.6" /> {/* Inner */}
                </>
            );
        case 'star_dust': 
            return (
                <>
                    <path fill="#c084fc" d="M8 2 h1 v4 h4 v1 h-4 v4 h-1 v-4 h-4 v-1 h4 z" /> {/* Main Star */}
                    <path fill="#e879f9" d="M3 10 h1 v2 h-1 z M13 4 h1 v2 h-1 z" /> {/* Small specks */}
                </>
            );
        default: 
            return <circle cx="8" cy="8" r="4" fill="#ccc" />;
      }
    }
    if (type === 'bobber') {
       switch(id) {
         case 'classic': 
            return (
                <>
                    <path fill="#ef4444" d="M6 6 h4 v4 h-4 z" /> 
                    <path fill="#fff" d="M6 6 h4 v2 h-4 z" />
                    <path fill="#991b1b" d="M7 5 h2 v1 h-2 z" /> {/* Top stick */}
                </>
            );
         case 'duck': 
            return (
                <>
                    <path fill="#facc15" d="M4 9 h8 v4 h-8 z" /> {/* Body */}
                    <path fill="#facc15" d="M9 5 h4 v4 h-4 z" /> {/* Head */}
                    <path fill="#f97316" d="M13 7 h2 v1 h-2 z" /> {/* Beak */}
                    <path fill="#000" d="M11 6 h1 v1 h-1 z" /> {/* Eye */}
                </>
            );
         case 'burger': 
            return (
                <>
                    <path fill="#d97706" d="M4 5 h8 v2 h-8 z" /> {/* Top Bun */}
                    <path fill="#16a34a" d="M3 7 h10 v1 h-10 z" /> {/* Lettuce */}
                    <path fill="#7f1d1d" d="M4 8 h8 v2 h-8 z" /> {/* Meat */}
                    <path fill="#d97706" d="M4 10 h8 v2 h-8 z" /> {/* Bot Bun */}
                </>
            );
         case 'skull': 
            return (
                <>
                    <path fill="#e2e8f0" d="M4 4 h8 v8 h-8 z" /> 
                    <path fill="#000" d="M6 6 h1 v2 h-1 z M9 6 h1 v2 h-1 z" /> {/* Eyes */}
                    <path fill="#000" d="M7 10 h2 v1 h-2 z" /> {/* Nose */}
                </>
            );
         case 'bulb': 
            return (
                <>
                    <path fill="#22d3ee" d="M6 4 h4 v6 h-4 z" /> {/* Glass */}
                    <path fill="#0e7490" d="M7 10 h2 v2 h-2 z" /> {/* Base */}
                    <path fill="#fff" d="M7 5 h1 v2 h-1 z" opacity="0.8" /> {/* Filament */}
                </>
            );
         default: 
            return <circle cx="8" cy="8" r="4" fill="#ccc" />;
       }
    }
    return null;
  };

  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} style={{ shapeRendering: 'crispEdges' }} xmlns="http://www.w3.org/2000/svg">
      {renderPath()}
    </svg>
  );
}
export default ItemIcon;
