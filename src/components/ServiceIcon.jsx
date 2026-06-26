import React from 'react';

const accentIconStyles = {
  blue: {
    wrap: 'from-blue-500/25 to-blue-600/5 border-blue-400/30 group-hover:border-blue-400/50',
    icon: 'text-blue-300',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
  },
  orange: {
    wrap: 'from-orange-500/25 to-orange-600/5 border-orange-400/30 group-hover:border-orange-400/50',
    icon: 'text-orange-300',
    glow: 'shadow-[0_0_20px_rgba(251,146,60,0.2)]',
  },
  green: {
    wrap: 'from-green-500/25 to-green-600/5 border-green-400/30 group-hover:border-green-400/50',
    icon: 'text-green-300',
    glow: 'shadow-[0_0_20px_rgba(74,222,128,0.2)]',
  },
  purple: {
    wrap: 'from-purple-500/25 to-purple-600/5 border-purple-400/30 group-hover:border-purple-400/50',
    icon: 'text-purple-300',
    glow: 'shadow-[0_0_20px_rgba(192,132,252,0.2)]',
  },
  cyan: {
    wrap: 'from-cyan-500/25 to-cyan-600/5 border-cyan-400/30 group-hover:border-cyan-400/50',
    icon: 'text-cyan-300',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.2)]',
  },
  amber: {
    wrap: 'from-amber-500/25 to-amber-600/5 border-amber-400/30 group-hover:border-amber-400/50',
    icon: 'text-amber-300',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.2)]',
  },
};

const icons = {
  frp: (
    <>
      {/* Smartphone */}
      <rect x="7" y="2" width="10" height="18" rx="2" strokeWidth="1.5" />
      <circle cx="12" cy="17.5" r="0.75" fill="currentColor" stroke="none" />
      {/* Candado abierto */}
      <path d="M10 8V6.5a2 2 0 114 0V8" strokeWidth="1.5" />
      <rect x="9" y="8" width="6" height="5" rx="1" strokeWidth="1.5" />
      <path d="M11 10.5h2" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  'cuenta-mi': (
    <>
      {/* Nube cuenta */}
      <path
        d="M6 14a3 3 0 013-2.83A3.5 3.5 0 0116.5 12 2.5 2.5 0 0119 14.5H6z"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Smartphone debajo */}
      <rect x="8" y="15" width="8" height="6" rx="1" strokeWidth="1.5" />
      <circle cx="12" cy="19.5" r="0.5" fill="currentColor" stroke="none" />
      {/* Candado en nube */}
      <rect x="11" y="10.5" width="2" height="2.5" rx="0.5" strokeWidth="1.2" />
      <path d="M11.5 10.5V9.8a.5.5 0 011 0v.7" strokeWidth="1.2" />
    </>
  ),
  flasheo: (
    <>
      {/* Chip / ROM */}
      <rect x="6" y="6" width="12" height="12" rx="1.5" strokeWidth="1.5" />
      <path d="M9 6V4M12 6V4M15 6V4M9 18V20M12 18V20M15 18V20M6 9H4M6 12H4M6 15H4M18 9H20M18 12H20M18 15H20" strokeWidth="1.5" strokeLinecap="round" />
      {/* Flecha circular — recuperación */}
      <path
        d="M12 9.5v3l2 1.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 10a3 3 0 104.2 2.8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  root: (
    <>
      {/* Terminal */}
      <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.5" />
      <path d="M3 8h18" strokeWidth="1.5" />
      <circle cx="5.5" cy="6" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="6" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="6" r="0.6" fill="currentColor" stroke="none" />
      {/* Prompt + código */}
      <path d="M6 11.5L8 13.5L6 15.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 15.5h5" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 12h3" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </>
  ),
  migracion: (
    <>
      {/* Teléfono origen */}
      <rect x="3" y="5" width="7" height="12" rx="1.5" strokeWidth="1.5" opacity="0.6" />
      <circle cx="6.5" cy="14.5" r="0.5" fill="currentColor" stroke="none" opacity="0.6" />
      {/* Teléfono destino */}
      <rect x="14" y="5" width="7" height="12" rx="1.5" strokeWidth="1.5" />
      <circle cx="17.5" cy="14.5" r="0.5" fill="currentColor" stroke="none" />
      {/* Flecha transferencia */}
      <path
        d="M10.5 11h3M12.5 9.5l1.5 1.5-1.5 1.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Datos (puntos) */}
      <circle cx="6.5" cy="9" r="0.75" fill="currentColor" stroke="none" opacity="0.5" />
      <circle cx="6.5" cy="11" r="0.75" fill="currentColor" stroke="none" opacity="0.5" />
    </>
  ),
  instalacion: (
    <>
      {/* Smartphone */}
      <rect x="8" y="4" width="8" height="14" rx="1.5" strokeWidth="1.5" />
      <circle cx="12" cy="15.5" r="0.5" fill="currentColor" stroke="none" />
      {/* Pieza / módulo */}
      <rect x="9.5" y="7" width="5" height="4" rx="0.5" strokeWidth="1.5" strokeDasharray="2 1" />
      {/* Destornillador / herramienta */}
      <path d="M3 19l2.5-2.5" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5.5 16.5L8 14" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M3 19l-1 2 2-1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="6" r="2" strokeWidth="1.5" />
      <path d="M18 8v3" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
};

const ServiceIcon = ({ name, accent = 'blue', size = 'md' }) => {
  const styles = accentIconStyles[accent] ?? accentIconStyles.blue;
  const sizeClass =
    size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
  const svgSize = size === 'lg' ? 'w-7 h-7' : size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';

  return (
    <div
      className={`flex items-center justify-center ${sizeClass} rounded-2xl bg-gradient-to-br border transition-all duration-300 group-hover:scale-105 ${styles.wrap} ${styles.glow}`}
    >
      <svg
        className={`${svgSize} ${styles.icon}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {icons[name]}
      </svg>
    </div>
  );
};

export default ServiceIcon;
