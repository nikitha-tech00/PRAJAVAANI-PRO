import React from 'react';

interface GovEmblemProps {
  size?: number;
  variant?: 'ashoka' | 'kumbham' | 'combined';
  className?: string;
  showText?: boolean;
}

export const GovEmblem: React.FC<GovEmblemProps> = ({
  size = 46,
  variant = 'ashoka',
  className = '',
  showText = false,
}) => {
  if (variant === 'kumbham') {
    return (
      <div
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="పూర్ణకుంభం • PRAJAVAANI PRO • సత్యమేవ జయతే"
      >
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          style={{ filter: 'drop-shadow(0 2px 6px rgba(10,37,64,0.25))' }}
        >
          <defs>
            <linearGradient id="goldKumbhamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="navyKumbhamBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c1f4a" />
              <stop offset="100%" stopColor="#0f2b5c" />
            </linearGradient>
            <linearGradient id="coconutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          {/* Outer Sovereign Seal Circle */}
          <circle cx="50" cy="50" r="48" fill="url(#navyKumbhamBg)" stroke="#f59e0b" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.8" />

          {/* Radiating Golden Aura Rays */}
          <g stroke="#fbbf24" strokeWidth="1" opacity="0.6">
            <line x1="50" y1="8" x2="50" y2="16" />
            <line x1="28" y1="14" x2="33" y2="20" />
            <line x1="72" y1="14" x2="67" y2="20" />
            <line x1="14" y1="28" x2="20" y2="33" />
            <line x1="86" y1="28" x2="80" y2="33" />
          </g>

          {/* Spreading Mango Leaves (Aamra Pallava) */}
          <path d="M50 32 C42 20 30 25 32 36 C34 38 45 38 50 38 Z" fill="#15803d" stroke="#166534" strokeWidth="0.8" />
          <path d="M50 32 C58 20 70 25 68 36 C66 38 55 38 50 38 Z" fill="#15803d" stroke="#166534" strokeWidth="0.8" />
          <path d="M50 30 C47 16 53 16 50 24 Z" fill="#16a34a" stroke="#15803d" strokeWidth="0.8" />
          <path d="M50 34 C38 28 36 38 42 42 Z" fill="#22c55e" opacity="0.9" />
          <path d="M50 34 C62 28 64 38 58 42 Z" fill="#22c55e" opacity="0.9" />

          {/* Sacred Coconut with Tuft */}
          <ellipse cx="50" cy="30" rx="9" ry="11" fill="url(#coconutGrad)" stroke="#451a03" strokeWidth="1" />
          <path d="M47 19 Q50 14 53 19 Q50 21 47 19 Z" fill="#78350f" />

          {/* Golden Kalasha / Purna Kumbham Body */}
          <ellipse cx="50" cy="45" rx="14" ry="4" fill="url(#goldKumbhamGrad)" stroke="#b45309" strokeWidth="1" />
          <path
            d="M36 45 C32 54 30 68 40 76 C44 79 56 79 60 76 C70 68 68 54 64 45 Z"
            fill="url(#goldKumbhamGrad)"
            stroke="#78350f"
            strokeWidth="1.2"
          />
          {/* Kalasha Waist & Base */}
          <ellipse cx="50" cy="58" rx="17" ry="5" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
          <rect x="42" y="76" width="16" height="5" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="1" />
          <ellipse cx="50" cy="81" rx="12" ry="3" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />

          {/* Auspicious Swastika / Om motif or Ashoka Chakra on Kalasha belly */}
          <circle cx="50" cy="62" r="5" fill="#0c1f4a" stroke="#ffffff" strokeWidth="0.8" />
          <line x1="50" y1="58" x2="50" y2="66" stroke="#ffffff" strokeWidth="0.8" />
          <line x1="46" y1="62" x2="54" y2="62" stroke="#ffffff" strokeWidth="0.8" />
        </svg>
      </div>
    );
  }

  // Default: Sovereign Lion Capital of Ashoka Government Seal
  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      title="భారత ప్రభుత్వం • GOVERNMENT OF INDIA • సత్యమేవ జయతే"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ filter: 'drop-shadow(0 2px 8px rgba(12, 31, 74, 0.35))' }}
      >
        <defs>
          <linearGradient id="sealBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0c1f4a" />
            <stop offset="60%" stopColor="#0f2b5c" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="lionBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
        </defs>

        {/* Outer Circular Sovereign Border */}
        <circle cx="50" cy="50" r="48" fill="url(#sealBg)" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="44.5" fill="none" stroke="#fcd34d" strokeWidth="0.8" strokeDasharray="1.5 1.5" />

        {/* Circular Seal Inscription Ring */}
        <path
          id="sealTextTop"
          d="M 18,50 A 32,32 0 0,1 82,50"
          fill="none"
        />
        <text fontSize="5.2" fontWeight="700" fill="#fde68a" letterSpacing="0.6">
          <textPath href="#sealTextTop" startOffset="50%" textAnchor="middle">
            GOVT OF INDIA • PRAJAVAANI
          </textPath>
        </text>

        {/* --- LION CAPITAL MOTIF (Center) --- */}
        {/* Central Forward Lion */}
        {/* Head & Mane */}
        <path
          d="M 44 23 C 44 19 46 17 50 17 C 54 17 56 19 56 23 C 58 24 59 27 58 31 C 57 34 54 36 50 36 C 46 36 43 34 42 31 C 41 27 42 24 44 23 Z"
          fill="url(#goldGradient)"
          stroke="#92400e"
          strokeWidth="0.6"
        />
        {/* Snout & Eyes */}
        <ellipse cx="50" cy="27" rx="3.5" ry="3" fill="#ffffff" opacity="0.9" />
        <ellipse cx="50" cy="28.5" rx="1.8" ry="1.2" fill="#78350f" />
        <circle cx="47.5" cy="24" r="0.8" fill="#451a03" />
        <circle cx="52.5" cy="24" r="0.8" fill="#451a03" />
        {/* Crown & Mane furrows */}
        <path d="M 46 19 Q 50 22 54 19" stroke="#92400e" strokeWidth="0.7" fill="none" />
        <path d="M 43 27 Q 46 29 45 33" stroke="#92400e" strokeWidth="0.7" fill="none" />
        <path d="M 57 27 Q 54 29 55 33" stroke="#92400e" strokeWidth="0.7" fill="none" />

        {/* Left Facing Lion */}
        <path
          d="M 42 24 C 37 23 34 26 34 30 C 34 33 37 36 43 36 C 43 32 42 27 42 24 Z"
          fill="url(#goldGradient)"
          stroke="#92400e"
          strokeWidth="0.6"
        />
        <circle cx="37" cy="27" r="0.7" fill="#451a03" />
        <path d="M 33 30 Q 36 31 38 30" stroke="#78350f" strokeWidth="0.6" fill="none" />

        {/* Right Facing Lion */}
        <path
          d="M 58 24 C 63 23 66 26 66 30 C 66 33 63 36 57 36 C 57 32 58 27 58 24 Z"
          fill="url(#goldGradient)"
          stroke="#92400e"
          strokeWidth="0.6"
        />
        <circle cx="63" cy="27" r="0.7" fill="#451a03" />
        <path d="M 67 30 Q 64 31 62 30" stroke="#78350f" strokeWidth="0.6" fill="none" />

        {/* Lion Chest & Paws connecting to abacus */}
        <path
          d="M 43 36 C 43 43 45 47 47 49 L 53 49 C 55 47 57 43 57 36 Z"
          fill="url(#goldGradient)"
          stroke="#92400e"
          strokeWidth="0.6"
        />
        <path d="M 36 36 C 36 42 39 46 43 49 L 45 49 C 41 45 40 40 40 36 Z" fill="url(#goldGradient)" opacity="0.85" />
        <path d="M 64 36 C 64 42 61 46 57 49 L 55 49 C 59 45 60 40 60 36 Z" fill="url(#goldGradient)" opacity="0.85" />

        {/* --- ABACUS / FRIEZE WITH ASHOKA CHAKRA --- */}
        <rect x="26" y="49" width="48" height="11" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="0.9" />

        {/* Center Ashoka Chakra on Abacus (Navy & White, 24 spokes) */}
        <circle cx="50" cy="54.5" r="4.5" fill="#ffffff" stroke="#003366" strokeWidth="0.8" />
        <circle cx="50" cy="54.5" r="0.9" fill="#003366" />
        {/* 24 spokes motif */}
        <g stroke="#003366" strokeWidth="0.4">
          <line x1="50" y1="50.2" x2="50" y2="58.8" />
          <line x1="45.7" y1="54.5" x2="54.3" y2="54.5" />
          <line x1="46.9" y1="51.4" x2="53.1" y2="57.6" />
          <line x1="46.9" y1="57.6" x2="53.1" y2="51.4" />
          <line x1="48.4" y1="50.5" x2="51.6" y2="58.5" />
          <line x1="48.4" y1="58.5" x2="51.6" y2="50.5" />
          <line x1="46" y1="52.9" x2="54" y2="56.1" />
          <line x1="46" y1="56.1" x2="54" y2="52.9" />
        </g>

        {/* Galloping Horse (Left of Chakra) */}
        <path
          d="M 33 55 C 31 53 32 52 35 52 C 37 52 39 54 41 55 C 39 56 36 57 33 57 C 32 56 31 56 33 55 Z"
          fill="#ffffff"
          stroke="#78350f"
          strokeWidth="0.4"
        />

        {/* Sturdy Bull (Right of Chakra) */}
        <path
          d="M 67 55 C 69 53 68 52 65 52 C 63 52 61 54 59 55 C 61 56 64 57 67 57 C 68 56 69 56 67 55 Z"
          fill="#ffffff"
          stroke="#78350f"
          strokeWidth="0.4"
        />

        {/* --- INVERTED BELL LOTUS PEDESTAL --- */}
        <path
          d="M 32 60 C 36 67 44 70 50 70 C 56 70 64 67 68 60 Z"
          fill="url(#goldGradient)"
          stroke="#92400e"
          strokeWidth="0.8"
        />
        {/* Lotus Petal Lines */}
        <path d="M 50 60 L 50 69" stroke="#78350f" strokeWidth="0.6" />
        <path d="M 43 60 Q 45 66 48 69" stroke="#78350f" strokeWidth="0.6" fill="none" />
        <path d="M 57 60 Q 55 66 52 69" stroke="#78350f" strokeWidth="0.6" fill="none" />
        <path d="M 37 60 Q 40 65 44 68" stroke="#78350f" strokeWidth="0.5" fill="none" />
        <path d="M 63 60 Q 60 65 56 68" stroke="#78350f" strokeWidth="0.5" fill="none" />

        {/* --- SATYAMEVA JAYATE (सत्यमेव जयते) Inscription --- */}
        <rect x="22" y="73" width="56" height="8" rx="2" fill="#0a192f" stroke="#f59e0b" strokeWidth="0.8" />
        <text
          x="50"
          y="79"
          textAnchor="middle"
          fontSize="5.4"
          fontWeight="800"
          fill="#fef08a"
          letterSpacing="0.8"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          सत्यमेव जयते
        </text>

        {/* Telugu script state motto at base */}
        <path
          id="sealTextBottom"
          d="M 82,60 A 34,34 0 0,1 18,60"
          fill="none"
        />
        <text fontSize="4.6" fontWeight="700" fill="#93c5fd" letterSpacing="0.4">
          <textPath href="#sealTextBottom" startOffset="50%" textAnchor="middle">
            ప్రజావాణి ప్రో • సత్యమేవ జయతే
          </textPath>
        </text>
      </svg>

      {showText && (
        <div style={{ marginLeft: '10px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--gov-primary)', lineHeight: 1.1 }}>
            భారత ప్రభుత్వం
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gov-secondary)', letterSpacing: '0.5px' }}>
            GOVERNMENT OF INDIA
          </div>
        </div>
      )}
    </div>
  );
};
