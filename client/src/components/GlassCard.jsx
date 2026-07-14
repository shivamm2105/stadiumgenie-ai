import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ 
  children, 
  className = '', 
  hoverEffect = true,
  onClick = null,
  role = 'region',
  ariaLabel = ''
}) {
  const CardComponent = onClick ? motion.button : motion.div;
  
  const motionProps = onClick && hoverEffect ? {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 300, damping: 15 }
  } : {};

  return (
    <CardComponent
      role={role}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`
        glass-panel-dark 
        dark:bg-slate-950/40 
        bg-white/70 
        text-slate-800 
        dark:text-slate-200 
        rounded-2xl 
        p-6 
        shadow-xl 
        border 
        border-slate-200/50 
        dark:border-white/10 
        transition-colors 
        duration-300
        ${onClick ? 'cursor-pointer focus:outline-none text-left w-full' : ''}
        ${className}
      `}
      {...motionProps}
    >
      {children}
    </CardComponent>
  );
}
