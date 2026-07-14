import React from 'react';
import Navbar from '../components/Navbar';
import AccessibilityToolbar from '../components/AccessibilityToolbar';
import { useAccessibility } from '../context/AccessibilityContext';

export default function MainLayout({ children }) {
  const { voiceAssistance } = useAccessibility();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />
      
      {/* Main Viewport */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col">
        {children}
      </main>

      {/* Screen Reader Aria Landmark footer */}
      <footer className="w-full bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-white/5 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-slate-700 dark:text-slate-300">
              StadiumGenie <span className="text-fifa-emerald text-[10px]">AI</span>
            </span>
            <span className="text-[10px] text-slate-400">| FIFA World Cup 2026 Operations</span>
          </div>
          
          <div className="flex gap-4">
            <a href="#accessibility" className="hover:underline focus:ring-2 focus:ring-fifa-gold px-1 rounded">Accessibility Statement</a>
            <span className="text-slate-400">•</span>
            <a href="#privacy" className="hover:underline focus:ring-2 focus:ring-fifa-gold px-1 rounded">Security Protocol</a>
            <span className="text-slate-400">•</span>
            <a href="#help" className="hover:underline focus:ring-2 focus:ring-fifa-gold px-1 rounded">Fan Helpdesk</a>
          </div>

          <div className="text-[10px] text-slate-400">
            {voiceAssistance && <span className="text-fifa-emerald font-bold animate-pulse">🔊 Voice Guide Active</span>} © 2026 StadiumGenie AI.
          </div>
        </div>
      </footer>

      {/* Floating Accessibility Settings Panel */}
      <AccessibilityToolbar />
    </div>
  );
}
