
const Logo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <path 
        d="M18 2L8 16h6l-2 14 10-14h-6l2-14z" 
        fill="url(#lightning-gradient)" 
        stroke="white" 
        strokeWidth="1" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
