
import React from 'react';

interface FishIconProps {
  speciesId: string;
  size?: number;
  className?: string;
}

const FishIcon: React.FC<FishIconProps> = ({ speciesId, size = 32, className = "" }) => {
  const renderPaths = () => {
    switch (speciesId) {
      // === JUNK / SPECIAL ===
      case 'boot':
        return (
          <>
            <path fill="#57534e" d="M5 3 h2 v7 h2 v1 h2 v2 h-6 v1 h-2 v-2 h-1 v-8 h3 z" />
            <path fill="#292524" d="M6 4 h2 v1 h-2 z M6 6 h2 v1 h-2 z M6 8 h2 v1 h-2 z" opacity="0.5" />
            <path fill="#1c1917" d="M3 12 h3 v1 h-3 z" />
          </>
        );
      case 'plastic_bottle':
        return (
          <>
            <path fill="#bae6fd" d="M6 3 h4 v2 h-4 z M5 5 h6 v9 h-6 z" opacity="0.8" />
            <path fill="#38bdf8" d="M6 3 h4 v1 h-4 z" />
            <path fill="#fff" d="M6 6 h1 v6 h-1 z" opacity="0.4" />
            <path fill="#0284c7" d="M5 8 h6 v2 h-6 z" opacity="0.3" /> {/* Label */}
          </>
        );
      case 'ghost_net':
        return (
          <>
             <path fill="#155e75" d="M3 4 h2 v2 h-2 z M7 3 h2 v2 h-2 z M11 4 h2 v2 h-2 z M4 8 h2 v2 h-2 z M9 8 h2 v2 h-2 z M6 12 h4 v2 h-4 z" opacity="0.7" />
             <path fill="#0891b2" d="M5 5 h6 v1 h-6 z M4 9 h8 v1 h-8 z" opacity="0.5" /> {/* Strings */}
          </>
        );
      case 'chest':
        return (
          <>
             <path fill="#92400e" d="M2 5 h12 v9 h-12 z" />
             <path fill="#f59e0b" d="M2 5 h12 v2 h-12 z" />
             <path fill="#b45309" d="M2 7 h1 v7 h-1 z M13 7 h1 v7 h-1 z M2 13 h12 v1 h-12 z" />
             <path fill="#fbbf24" d="M7 8 h2 v3 h-2 z" />
          </>
        );

      // === COMMON ===
      case 'minnow': 
        return (
          <>
            <path fill="#94a3b8" d="M4 7 h6 v3 h-6 z" /> 
            <path fill="#cbd5e1" d="M5 8 h4 v1 h-4 z" />
            <path fill="#475569" d="M12 7 h1 v3 h-1 z M13 6 h1 v1 h-1 z M13 10 h1 v1 h-1 z" />
            <path fill="#000" d="M9 7 h1 v1 h-1 z" />
          </>
        );
      case 'goldfish':
        return (
            <>
            <path fill="#fb923c" d="M4 6 h6 v4 h-6 z" />
            <path fill="#fdba74" d="M10 6 h2 v4 h-2 z" />
            <path fill="#fb923c" d="M12 5 h1 v6 h-1 z" />
            <path fill="#000" d="M8 6 h1 v1 h-1 z" />
            </>
        );
      case 'tiger_prawn':
        return (
            <>
            <path fill="#fdba74" d="M3 8 h3 v-2 h3 v-2 h3 v3 h-2 v2 h-7 z" />
            <path fill="#c2410c" d="M4 8 h1 v-2 h-1 z M7 6 h1 v-2 h-1 z M10 4 h1 v3 h-1 z" opacity="0.5" />
            <path fill="#000" d="M12 5 h1 v1 h-1 z" />
            </>
        );
      case 'sardine':
         return (
            <>
              <path fill="#94a3b8" d="M2 7 h9 v2 h-9 z" />
              <path fill="#e2e8f0" d="M2 8 h8 v1 h-8 z" />
              <path fill="#475569" d="M11 7 h2 v2 h-2 z" />
              <path fill="#334155" d="M13 6 h1 v1 h-1 z M13 10 h1 v1 h-1 z" />
              <path fill="#000" d="M9 7 h1 v1 h-1 z" />
            </>
         );
      case 'perch':
        return (
          <>
            <path fill="#84cc16" d="M3 5 h9 v7 h-9 z" />
            <path fill="#ecfccb" d="M3 10 h8 v2 h-8 z" />
            <path fill="#3f6212" d="M5 5 h1 v5 h-1 z M8 5 h1 v5 h-1 z M11 5 h1 v5 h-1 z" opacity="0.4" />
            <path fill="#365314" d="M4 3 h2 v2 h-2 z M7 4 h2 v1 h-2 z" />
            <path fill="#3f6212" d="M12 7 h2 v3 h-2 z" />
            <path fill="#1a2e05" d="M14 6 h1 v5 h-1 z" />
            <path fill="#000" d="M10 6 h1 v1 h-1 z" />
          </>
        );
      case 'carp':
        return (
          <>
            <path fill="#b91c1c" d="M3 5 h10 v7 h-10 z" />
            <path fill="#ef4444" d="M3 6 h9 v5 h-9 z" />
            <path fill="#fca5a5" d="M3 10 h9 v2 h-9 z" />
            <path fill="#7f1d1d" d="M13 6 h2 v4 h-2 z" />
            <path fill="#000" d="M11 6 h1 v1 h-1 z" />
            <path fill="#ef4444" d="M8 12 h3 v1 h-3 z" />
            <path fill="#ef4444" d="M7 4 h4 v1 h-4 z" />
          </>
        );
      case 'mudskipper':
        return (
          <>
             <path fill="#78350f" d="M3 7 h9 v4 h-9 z" />
             <path fill="#b45309" d="M4 7 h7 v2 h-7 z" />
             <path fill="#78350f" d="M4 5 h2 v2 h-2 z M8 5 h2 v2 h-2 z" />
             <path fill="#000" d="M5 6 h1 v1 h-1 z M9 6 h1 v1 h-1 z" />
             <path fill="#92400e" d="M12 8 h2 v2 h-2 z" />
             <path fill="#b45309" d="M5 11 h3 v1 h-3 z" />
          </>
        );
      case 'flying_fish':
        return (
          <>
             <path fill="#0ea5e9" d="M3 7 h10 v3 h-10 z" />
             <path fill="#e0f2fe" d="M4 4 h6 v3 h-6 z" opacity="0.8" />
             <path fill="#bae6fd" d="M5 8 h5 v3 h-5 z" opacity="0.8" />
             <path fill="#0284c7" d="M13 7 h1 v1 h-1 z M13 9 h1 v1 h-1 z" />
             <path fill="#000" d="M11 7 h1 v1 h-1 z" />
          </>
        );
      case 'crab':
      case 'mitten_crab':
      case 'king_crab':
        const crabColor = speciesId === 'king_crab' ? '#991b1b' : (speciesId === 'mitten_crab' ? '#57534e' : '#f87171');
        return (
            <>
            <path fill={crabColor} d="M4 6 h8 v5 h-8 z" />
            <path fill={crabColor} d="M2 5 h2 v3 h-2 z M12 5 h2 v3 h-2 z" />
            <path fill={crabColor} d="M3 11 h1 v1 h-1 z M12 11 h1 v1 h-1 z" />
            <path fill="#000" d="M6 6 h1 v1 h-1 z M9 6 h1 v1 h-1 z" />
            </>
        );
      case 'lantern_fish':
        return (
            <>
            <path fill="#0e7490" d="M4 6 h8 v6 h-8 z" />
            <path fill="#22d3ee" d="M10 6 h1 v1 h-1 z M9 5 h1 v1 h-1 z M8 4 h1 v1 h-1 z" /> {/* Stalk */}
            <path fill="#facc15" d="M7 3 h2 v2 h-2 z" /> {/* Light */}
            <path fill="#000" d="M10 8 h1 v1 h-1 z" />
            <path fill="#155e75" d="M12 7 h2 v4 h-2 z" />
            </>
        );

      // === RARE ===
      case 'trout':
        return (
          <>
            <path fill="#86efac" d="M2 6 h12 v5 h-12 z" />
            <path fill="#f472b6" d="M2 8 h12 v1 h-12 z" />
            <path fill="#166534" d="M14 6 h1 v5 h-1 z" />
            <path fill="#000" d="M11 6 h1 v1 h-1 z" />
            <path fill="#dcfce7" d="M3 10 h10 v1 h-10 z" />
          </>
        );
      case 'salmon':
        return (
          <>
            <path fill="#f43f5e" d="M2 5 h11 v7 h-11 z" />
            <path fill="#e2e8f0" d="M2 5 h11 v2 h-11 z" />
            <path fill="#fda4af" d="M2 10 h11 v2 h-11 z" />
            <path fill="#881337" d="M13 6 h2 v5 h-2 z" />
            <path fill="#000" d="M11 6 h1 v1 h-1 z" />
            <path fill="#9f1239" d="M12 11 h1 v1 h-1 z" />
          </>
        );
      case 'lobster':
        return (
            <>
            <path fill="#dc2626" d="M5 6 h6 v7 h-6 z" />
            <path fill="#991b1b" d="M5 6 h6 v2 h-6 z" />
            <path fill="#ef4444" d="M2 3 h3 v4 h-3 z M11 3 h3 v4 h-3 z" /> {/* Claws */}
            <path fill="#7f1d1d" d="M6 13 h4 v2 h-4 z" /> {/* Tail */}
            <path fill="#000" d="M6 5 h1 v1 h-1 z M9 5 h1 v1 h-1 z" />
            </>
        );
      case 'blobfish':
        return (
            <>
            <path fill="#fda4af" d="M4 6 h8 v6 h-8 z" />
            <path fill="#f43f5e" d="M7 8 h2 v2 h-2 z" /> {/* Nose */}
            <path fill="#be123c" d="M5 10 h6 v1 h-6 z" /> {/* Mouth */}
            <path fill="#000" d="M5 7 h1 v1 h-1 z M10 7 h1 v1 h-1 z" />
            </>
        );
      case 'moonfish':
        return (
            <>
            <path fill="#c7d2fe" d="M4 4 h8 v8 h-8 z" />
            <path fill="#818cf8" d="M2 6 h2 v4 h-2 z M12 6 h2 v4 h-2 z" />
            <path fill="#000" d="M9 6 h1 v1 h-1 z" />
            </>
        );
      case 'catfish':
        return (
          <>
            <path fill="#475569" d="M2 6 h11 v6 h-11 z" />
            <path fill="#1e293b" d="M2 6 h11 v3 h-11 z" />
            <path fill="#94a3b8" d="M2 11 h11 v1 h-11 z" />
            <path fill="#334155" d="M13 7 h2 v4 h-2 z" />
            <path fill="#000" d="M11 7 h1 v1 h-1 z" />
            <path fill="#0f172a" d="M13 8 h2 v1 h-2 z M13 9 h1 v1 h-1 z" />
            <path fill="#0f172a" d="M13 5 h1 v1 h-1 z M14 4 h1 v1 h-1 z" />
          </>
        );
      case 'neon_tetra':
        return (
          <>
             <path fill="#1e293b" d="M3 6 h10 v4 h-10 z" />
             <path fill="#22d3ee" d="M3 7 h10 v1 h-10 z" />
             <path fill="#f43f5e" d="M3 8 h10 v1 h-10 z" />
             <path fill="#000" d="M11 6 h1 v1 h-1 z" />
             <path fill="#94a3b8" d="M13 7 h1 v2 h-1 z" opacity="0.5" />
          </>
        );
      case 'cloud_ray':
        return (
          <>
            <path fill="#e0f2fe" d="M4 6 h8 v4 h-8 z" />
            <path fill="#bae6fd" d="M2 6 h2 v4 h-2 z M12 6 h2 v4 h-2 z" />
            <path fill="#7dd3fc" d="M7 3 h2 v3 h-2 z" />
            <path fill="#0284c7" d="M7 10 h2 v5 h-2 z" />
            <path fill="#000" d="M6 5 h1 v1 h-1 z M9 5 h1 v1 h-1 z" />
          </>
        );

      // === EPIC ===
      case 'eel':
        return (
          <>
            <path fill="#eab308" d="M1 8 h3 v2 h-3 z M3 7 h2 v2 h-2 z M5 6 h2 v2 h-2 z M7 7 h2 v2 h-2 z M9 8 h2 v2 h-2 z M11 7 h2 v2 h-2 z" />
            <path fill="#a16207" d="M13 6 h2 v3 h-2 z" />
            <path fill="#fef08a" d="M2 9 h2 v1 h-2 z M4 8 h2 v1 h-2 z M6 7 h2 v1 h-2 z" opacity="0.5" />
            <path fill="#000" d="M14 7 h1 v1 h-1 z" />
            <path fill="#fff" d="M4 6 h1 v1 h-1 z M8 10 h1 v1 h-1 z M12 5 h1 v1 h-1 z" />
          </>
        );
      case 'tuna':
          return (
            <>
              <path fill="#1e3a8a" d="M2 5 h12 v6 h-12 z" />
              <path fill="#60a5fa" d="M2 8 h12 v3 h-12 z" />
              <path fill="#172554" d="M14 6 h2 v4 h-2 z" />
              <path fill="#000" d="M12 7 h1 v1 h-1 z" />
              <path fill="#facc15" d="M5 4 h1 v1 h-1 z M8 4 h1 v1 h-1 z M11 4 h1 v1 h-1 z" />
              <path fill="#facc15" d="M5 11 h1 v1 h-1 z M8 11 h1 v1 h-1 z M11 11 h1 v1 h-1 z" />
            </>
          );
      case 'humphead':
        return (
            <>
            <path fill="#06b6d4" d="M3 5 h10 v8 h-10 z" />
            <path fill="#0891b2" d="M3 3 h4 v2 h-4 z" /> {/* Hump */}
            <path fill="#155e75" d="M13 6 h2 v5 h-2 z" />
            <path fill="#000" d="M10 7 h1 v1 h-1 z" />
            <path fill="#a5f3fc" d="M11 9 h2 v2 h-2 z" /> {/* Lips */}
            </>
        );
      case 'viperfish':
        return (
            <>
            <path fill="#581c87" d="M3 6 h10 v4 h-10 z" />
            <path fill="#a855f7" d="M3 6 h10 v1 h-10 z" />
            <path fill="#000" d="M10 6 h1 v1 h-1 z" />
            <path fill="#fff" d="M11 10 h1 v2 h-1 z M9 10 h1 v2 h-1 z M7 10 h1 v2 h-1 z" /> {/* Teeth */}
            <path fill="#2e1065" d="M13 7 h2 v2 h-2 z" />
            </>
        );
      case 'skeleton_fish':
        return (
            <>
            <path fill="#e5e5e5" d="M4 7 h8 v1 h-8 z" /> {/* Spine */}
            <path fill="#e5e5e5" d="M5 5 h1 v5 h-1 z M7 5 h1 v5 h-1 z M9 5 h1 v5 h-1 z" /> {/* Ribs */}
            <path fill="#e5e5e5" d="M11 6 h3 v3 h-3 z" /> {/* Head */}
            <path fill="#000" d="M12 7 h1 v1 h-1 z" />
            </>
        );
      case 'piranha':
        return (
          <>
            <path fill="#94a3b8" d="M4 4 h7 v8 h-7 z" />
            <path fill="#ef4444" d="M4 8 h7 v4 h-7 z" />
            <path fill="#1e293b" d="M3 6 h1 v4 h-1 z M11 6 h1 v4 h-1 z" />
            <path fill="#000" d="M9 6 h1 v1 h-1 z" />
            <path fill="#fff" d="M9 9 h1 v1 h-1 z M7 9 h1 v1 h-1 z M5 9 h1 v1 h-1 z" />
            <path fill="#7f1d1d" d="M12 7 h1 v3 h-1 z" />
          </>
        );
      case 'angel_fish':
        return (
          <>
            <path fill="#facc15" d="M5 3 h5 v10 h-5 z" />
            <path fill="#ca8a04" d="M6 3 h1 v10 h-1 z M8 3 h1 v10 h-1 z" opacity="0.5" />
            <path fill="#000" d="M9 5 h1 v1 h-1 z" />
            <path fill="#feebc8" d="M4 5 h1 v2 h-1 z" />
            <path fill="#facc15" d="M6 1 h2 v2 h-2 z M6 13 h2 v2 h-2 z" />
            <path fill="#eab308" d="M3 6 h2 v4 h-2 z" />
          </>
        );

      // === LEGENDARY ===
      case 'koi':
        return (
          <>
            <path fill="#f8fafc" d="M2 5 h12 v6 h-12 z" />
            <path fill="#f59e0b" d="M4 5 h2 v3 h-2 z M8 8 h3 v3 h-3 z M11 5 h2 v2 h-2 z" />
            <path fill="#fbbf24" d="M14 6 h2 v4 h-2 z" />
            <path fill="#000" d="M12 6 h1 v1 h-1 z" />
            <path fill="#ef4444" d="M2 6 h1 v1 h-1 z" />
            <path fill="#cbd5e1" d="M6 11 h3 v1 h-3 z M6 4 h3 v1 h-3 z" opacity="0.5" />
          </>
        );
      case 'arowana':
        return (
          <>
            <path fill="#b91c1c" d="M2 5 h12 v6 h-12 z" />
            <path fill="#fca5a5" d="M2 8 h12 v2 h-12 z" />
            <path fill="#991b1b" d="M14 5 h1 v6 h-1 z" />
            <path fill="#ef4444" d="M3 7 h1 v1 h-1 z M6 7 h1 v1 h-1 z M9 7 h1 v1 h-1 z M12 7 h1 v1 h-1 z" opacity="0.6" />
            <path fill="#000" d="M12 6 h1 v1 h-1 z" />
            <path fill="#7f1d1d" d="M15 8 h1 v3 h-1 z" />
            <path fill="#b91c1c" d="M10 11 h4 v1 h-4 z" />
          </>
        );
      case 'shark':
          return (
            <>
              <path fill="#64748b" d="M2 6 h11 v5 h-11 z" />
              <path fill="#94a3b8" d="M2 6 h11 v2 h-11 z" />
              <path fill="#cbd5e1" d="M2 9 h10 v2 h-10 z" />
              <path fill="#475569" d="M13 6 h2 v5 h-2 z" />
              <path fill="#475569" d="M7 3 h3 v3 h-3 z" />
              <path fill="#000" d="M11 7 h1 v1 h-1 z" />
              <path fill="#94a3b8" d="M8 11 h3 v1 h-3 z" />
            </>
          );
      case 'oarfish':
        return (
            <>
            <path fill="#e2e8f0" d="M2 6 h12 v4 h-12 z" />
            <path fill="#ef4444" d="M3 4 h1 v2 h-1 z M5 3 h1 v3 h-1 z M7 4 h1 v2 h-1 z M9 3 h1 v3 h-1 z" /> {/* Red fins */}
            <path fill="#000" d="M3 7 h1 v1 h-1 z" />
            <path fill="#94a3b8" d="M5 8 h1 v1 h-1 z M9 8 h1 v1 h-1 z" opacity="0.5" />
            </>
        );
      case 'goblin_shark':
        return (
            <>
            <path fill="#f43f5e" d="M4 6 h10 v5 h-10 z" />
            <path fill="#f43f5e" d="M1 7 h3 v1 h-3 z" /> {/* Long nose */}
            <path fill="#fff" d="M5 9 h3 v1 h-3 z" /> {/* Jaw */}
            <path fill="#881337" d="M14 6 h2 v5 h-2 z" />
            <path fill="#000" d="M5 6 h1 v1 h-1 z" />
            </>
        );
      case 'wisp_jelly':
        return (
            <>
            <path fill="#34d399" d="M5 4 h6 v5 h-6 z" />
            <path fill="#10b981" d="M6 9 h1 v4 h-1 z M9 9 h1 v4 h-1 z" opacity="0.7" />
            <path fill="#a7f3d0" d="M6 5 h1 v1 h-1 z M9 5 h1 v1 h-1 z" opacity="0.5" />
            </>
        );
      case 'solar_discus':
        return (
            <>
            <path fill="#f97316" d="M4 3 h8 v10 h-8 z" />
            <path fill="#fcd34d" d="M6 5 h4 v6 h-4 z" />
            <path fill="#000" d="M10 7 h1 v1 h-1 z" />
            </>
        );

      // === MYTHIC ===
      case 'leviathan':
        return (
          <>
            <path fill="#4c1d95" d="M1 5 h11 v7 h-11 z" />
            <path fill="#7c3aed" d="M2 5 h10 v3 h-10 z" />
            <path fill="#2e1065" d="M12 6 h3 v5 h-3 z" />
            <path fill="#a78bfa" d="M11 4 h1 v2 h-1 z M11 10 h1 v2 h-1 z" />
            <path fill="#facc15" d="M10 7 h1 v1 h-1 z" />
            <path fill="#a78bfa" d="M3 3 h2 v2 h-2 z M3 11 h2 v2 h-2 z" opacity="0.5" />
          </>
        );
      case 'hydra':
        return (
          <>
            <path fill="#047857" d="M5 8 h6 v4 h-6 z" />
            <path fill="#10b981" d="M2 4 h2 v4 h-2 z M7 3 h2 v5 h-2 z M12 4 h2 v4 h-2 z" />
            <path fill="#000" d="M3 5 h1 v1 h-1 z M8 4 h1 v1 h-1 z M13 5 h1 v1 h-1 z" />
            <path fill="#065f46" d="M6 12 h4 v2 h-4 z" />
            <path fill="#34d399" d="M3 6 h1 v1 h-1 z M8 5 h1 v1 h-1 z M13 6 h1 v1 h-1 z" opacity="0.5" />
          </>
        );
      case 'star_whale':
        return (
           <>
             <path fill="#312e81" d="M1 4 h13 v8 h-13 z" />
             <path fill="#4338ca" d="M2 5 h12 v3 h-12 z" />
             <path fill="#6366f1" d="M2 9 h10 v2 h-10 z" />
             <path fill="#fff" d="M3 6 h1 v1 h-1 z M7 5 h1 v1 h-1 z M11 6 h1 v1 h-1 z" opacity="0.9" />
             <path fill="#fff" d="M5 8 h1 v1 h-1 z M9 9 h1 v1 h-1 z" opacity="0.6" />
             <path fill="#000" d="M12 7 h1 v1 h-1 z" />
             <path fill="#1e1b4b" d="M6 12 h4 v1 h-4 z" />
           </>
        );
      case 'giant_squid':
        return (
            <>
            <path fill="#b91c1c" d="M10 4 h4 v8 h-4 z" /> {/* Head */}
            <path fill="#ef4444" d="M10 4 h2 v8 h-2 z" />
            <path fill="#000" d="M11 6 h1 v2 h-1 z" />
            <path fill="#991b1b" d="M2 5 h8 v1 h-8 z M2 7 h8 v1 h-8 z M2 9 h8 v1 h-8 z" /> {/* Tentacles */}
            </>
        );
      case 'coelacanth':
        return (
            <>
            <path fill="#1e3a8a" d="M2 5 h12 v7 h-12 z" />
            <path fill="#172554" d="M4 6 h1 v1 h-1 z M7 6 h1 v1 h-1 z M10 6 h1 v1 h-1 z" opacity="0.5" />
            <path fill="#60a5fa" d="M14 6 h2 v5 h-2 z" /> {/* Tail */}
            <path fill="#60a5fa" d="M6 12 h2 v2 h-2 z M10 12 h2 v2 h-2 z" /> {/* Bottom Fins */}
            <path fill="#60a5fa" d="M8 3 h2 v2 h-2 z" /> {/* Top Fin */}
            <path fill="#000" d="M3 6 h1 v1 h-1 z" />
            </>
        );
      case 'void_eater':
        return (
            <>
            <path fill="#4c1d95" d="M3 4 h10 v8 h-10 z" />
            <path fill="#000" d="M4 6 h2 v4 h-2 z" /> {/* Maw */}
            <path fill="#8b5cf6" d="M13 7 h3 v2 h-3 z" />
            <path fill="#a78bfa" d="M2 4 h1 v2 h-1 z M2 10 h1 v2 h-1 z" />
            </>
        );

      default:
        // Generic Fish fallback
        return (
          <>
            <path fill="#94a3b8" d="M4 6 h8 v4 h-8 z" />
            <path fill="#64748b" d="M12 7 h2 v2 h-2 z" />
            <path fill="#000" d="M10 7 h1 v1 h-1 z" />
          </>
        );
    }
  };

  return (
    <svg 
      viewBox="0 0 16 16" 
      width={size} 
      height={size} 
      className={className} 
      style={{ shapeRendering: 'crispEdges' }} 
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderPaths()}
    </svg>
  );
};

export default FishIcon;
