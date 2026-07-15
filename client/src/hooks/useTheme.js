import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Custom hook to access Theme Context settings and togglers.
 * @returns {object} Theme state context containing:
 * - theme: string ('dark', 'light')
 * - toggleTheme: function
 * - isDark: boolean
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
