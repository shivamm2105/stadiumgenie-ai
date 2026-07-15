import { useContext } from 'react';
import { AccessibilityContext } from '../context/AccessibilityContext';

/**
 * Custom hook to access Accessibility Context (voice readers, readable fonts, magnification, contrast).
 * @returns {object} Accessibility state settings and callbacks.
 */
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
