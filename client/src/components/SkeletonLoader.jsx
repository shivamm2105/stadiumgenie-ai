import React from 'react';

export default function SkeletonLoader({ count = 1, className = "h-32" }) {
  return (
    <div className="space-y-4 w-full" role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx}
          className={`
            animate-pulse 
            glass-panel-dark 
            dark:bg-slate-950/20 
            bg-slate-200/30 
            border 
            border-slate-200/50 
            dark:border-white/5 
            rounded-2xl 
            w-full 
            ${className}
          `}
        />
      ))}
    </div>
  );
}
