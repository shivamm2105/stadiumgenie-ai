import React, { createContext, useState, useContext, useEffect } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('sg_acc_highcontrast') === 'true';
  });
  
  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem('sg_acc_largetext') === 'true';
  });

  const [dyslexicFont, setDyslexicFont] = useState(() => {
    return localStorage.getItem('sg_acc_dyslexic') === 'true';
  });

  const [voiceAssistance, setVoiceAssistance] = useState(() => {
    return localStorage.getItem('sg_acc_voice') === 'true';
  });

  useEffect(() => {
    const body = document.body;
    
    // High contrast
    if (highContrast) {
      body.classList.add('accessibility-high-contrast');
    } else {
      body.classList.remove('accessibility-high-contrast');
    }
    localStorage.setItem('sg_acc_highcontrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    const root = document.documentElement;
    
    // Large text
    if (largeText) {
      root.style.fontSize = '120%';
    } else {
      root.style.fontSize = '100%';
    }
    localStorage.setItem('sg_acc_largetext', largeText);
  }, [largeText]);

  useEffect(() => {
    const body = document.body;
    
    // Dyslexic font styling
    if (dyslexicFont) {
      body.style.fontFamily = '"Comic Sans MS", "Arial", sans-serif';
      body.style.letterSpacing = '0.08em';
      body.style.wordSpacing = '0.12em';
    } else {
      body.style.fontFamily = '';
      body.style.letterSpacing = '';
      body.style.wordSpacing = '';
    }
    localStorage.setItem('sg_acc_dyslexic', dyslexicFont);
  }, [dyslexicFont]);

  useEffect(() => {
    localStorage.setItem('sg_acc_voice', voiceAssistance);
    
    if (!voiceAssistance) {
      window.speechSynthesis?.cancel();
    }
  }, [voiceAssistance]);

  // Screen reader voice assistant function
  const speakText = (text) => {
    if (!voiceAssistance || !window.speechSynthesis) return;
    
    // Cancel current speaking to prevent build up
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakHover = (e, customText = '') => {
    if (!voiceAssistance) return;
    e.stopPropagation();
    
    const label = customText || e.currentTarget.getAttribute('aria-label') || e.currentTarget.innerText;
    if (label) {
      speakText(label);
    }
  };

  return (
    <AccessibilityContext.Provider value={{
      highContrast,
      setHighContrast,
      largeText,
      setLargeText,
      dyslexicFont,
      setDyslexicFont,
      voiceAssistance,
      setVoiceAssistance,
      speakText,
      handleSpeakHover
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
