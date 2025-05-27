
const Logo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      
      {/* Outer glow effect */}
      <path 
        d="M18 3L9 15h5l-2 12 9-12h-5l2-12z" 
        fill="none" 
        stroke="#10b981" 
        strokeWidth="3" 
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.6"
        filter="url(#neon-glow)"
      />
      
      {/* Main lightning bolt */}
      <path 
        d="M18 3L9 15h5l-2 12 9-12h-5l2-12z" 
        fill="none" 
        stroke="url(#lightning-gradient)" 
        strokeWidth="2" 
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#neon-glow)"
      />
      
      {/* Inner highlight */}
      <path 
        d="M18 3L9 15h5l-2 12 9-12h-5l2-12z" 
        fill="none" 
        stroke="#22d3ee" 
        strokeWidth="1" 
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
};

export default Logo;
