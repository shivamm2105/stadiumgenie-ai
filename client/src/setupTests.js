import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock ResizeObserver which is not present in jsdom but used by Recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock SpeechSynthesis APIs
global.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn(() => []),
  pause: vi.fn(),
  resume: vi.fn(),
};

global.SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
  constructor(text) {
    this.text = text;
    this.lang = '';
    this.volume = 1;
    this.rate = 1;
    this.pitch = 1;
  }
};

// Mock framer-motion to simplify rendering and avoid animation timing issues in tests using raw React.createElement to prevent JSX parse errors in .js file
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => (
      React.createElement('div', { ref, ...props }, children)
    )),
    button: React.forwardRef(({ children, ...props }, ref) => (
      React.createElement('button', { ref, ...props }, children)
    )),
    section: React.forwardRef(({ children, ...props }, ref) => (
      React.createElement('section', { ref, ...props }, children)
    )),
    h2: React.forwardRef(({ children, ...props }, ref) => (
      React.createElement('h2', { ref, ...props }, children)
    )),
  },
  AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
}));
