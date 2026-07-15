import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Accessibility, Eye, Type, Volume2, X } from 'lucide-react';
import GlassCard from './GlassCard';

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    highContrast,
    setHighContrast,
    largeText,
    setLargeText,
    dyslexicFont,
    setDyslexicFont,
    voiceAssistance,
    setVoiceAssistance,
    handleSpeakHover
  } = useAccessibility();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating accessibility toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Accessibility Toolbar"
        title="Open Accessibility Toolbar"
        aria-expanded={isOpen}
        onMouseEnter={(e) => handleSpeakHover(e, "Accessibility Settings Toolbar")}
        className="flex items-center justify-center w-12 h-12 bg-fifa-emerald text-white rounded-full shadow-2xl hover:bg-emerald-600 transition-colors focus:ring-4 focus:ring-amber-400"
      >
        {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Accessibility className="w-6 h-6" aria-hidden="true" />}
      </button>

      {isOpen && (
        <GlassCard className="absolute bottom-16 right-0 w-72 border border-slate-300 dark:border-white/20 shadow-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold flex items-center gap-2 dark:text-white">
              <Accessibility className="w-5 h-5 text-emerald-800 dark:text-fifa-emerald" aria-hidden="true" /> Accessibility Suite
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close accessibility menu"
              title="Close accessibility menu"
              className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors focus:ring-2 focus:ring-fifa-gold p-1 rounded"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-3">
            {/* High Contrast Toggle */}
            <div className="flex justify-between items-center">
              <label htmlFor="toggle-contrast" className="text-sm font-medium flex items-center gap-2 dark:text-slate-200">
                <Eye className="w-4 h-4 text-fifa-blue" aria-hidden="true" /> High Contrast
              </label>
              <input
                id="toggle-contrast"
                type="checkbox"
                role="switch"
                aria-checked={highContrast}
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-9 h-5 bg-gray-200 dark:bg-white/10 rounded-full appearance-none checked:bg-fifa-emerald relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-[2px] before:left-[2px] checked:before:translate-x-4 before:transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold"
              />
            </div>

            {/* Large Text Toggle */}
            <div className="flex justify-between items-center">
              <label htmlFor="toggle-text" className="text-sm font-medium flex items-center gap-2 dark:text-slate-200">
                <Type className="w-4 h-4 text-fifa-blue" aria-hidden="true" /> Large Text (120%)
              </label>
              <input
                id="toggle-text"
                type="checkbox"
                role="switch"
                aria-checked={largeText}
                checked={largeText}
                onChange={(e) => setLargeText(e.target.checked)}
                className="w-9 h-5 bg-gray-200 dark:bg-white/10 rounded-full appearance-none checked:bg-fifa-emerald relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-[2px] before:left-[2px] checked:before:translate-x-4 before:transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold"
              />
            </div>

            {/* Dyslexic-Friendly Font Toggle */}
            <div className="flex justify-between items-center">
              <label htmlFor="toggle-dyslexic" className="text-sm font-medium flex items-center gap-2 dark:text-slate-200">
                <Type className="w-4 h-4 text-amber-900 dark:text-fifa-gold" aria-hidden="true" /> Readable Font
              </label>
              <input
                id="toggle-dyslexic"
                type="checkbox"
                role="switch"
                aria-checked={dyslexicFont}
                checked={dyslexicFont}
                onChange={(e) => setDyslexicFont(e.target.checked)}
                className="w-9 h-5 bg-gray-200 dark:bg-white/10 rounded-full appearance-none checked:bg-fifa-emerald relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-[2px] before:left-[2px] checked:before:translate-x-4 before:transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold"
              />
            </div>

            {/* Voice Assistance Screen Reader Helper */}
            <div className="flex justify-between items-center">
              <label htmlFor="toggle-voice" className="text-sm font-medium flex items-center gap-2 dark:text-slate-200">
                <Volume2 className="w-4 h-4 text-emerald-800 dark:text-fifa-emerald" aria-hidden="true" /> Voice Reader
              </label>
              <input
                id="toggle-voice"
                type="checkbox"
                role="switch"
                aria-checked={voiceAssistance}
                checked={voiceAssistance}
                onChange={(e) => setVoiceAssistance(e.target.checked)}
                className="w-9 h-5 bg-gray-200 dark:bg-white/10 rounded-full appearance-none checked:bg-fifa-emerald relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-[2px] before:left-[2px] checked:before:translate-x-4 before:transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold"
              />
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-white/10 text-[10px] text-slate-600 dark:text-slate-300 text-center leading-relaxed font-semibold">
            Dyslexic readable font updates spacing. Voice Reader speaks hovered elements aloud.
          </div>
        </GlassCard>
      )}
    </div>
  );
}
