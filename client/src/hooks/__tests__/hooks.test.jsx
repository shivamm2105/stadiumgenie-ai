import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { useUser } from '../useUser';
import { useTheme } from '../useTheme';
import { useAccessibility } from '../useAccessibility';
import { useStadiumState } from '../useStadiumState';

// Helper component to trigger useUser hook
function UserConsumer() {
  useUser();
  return null;
}

// Helper component to trigger useTheme hook
function ThemeConsumer() {
  useTheme();
  return null;
}

// Helper component to trigger useAccessibility hook
function AccessibilityConsumer() {
  useAccessibility();
  return null;
}

// Helper component to trigger useStadiumState hook
function StadiumStateConsumer() {
  useStadiumState();
  return null;
}

describe('Custom Hooks Error Boundary Tests', () => {
  it('should throw error when useUser is called outside UserProvider', () => {
    // Suppress react boundary error log in console
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<UserConsumer />)).toThrow('useUser must be used within a UserProvider');
    
    consoleErrorSpy.mockRestore();
  });

  it('should throw error when useTheme is called outside ThemeProvider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<ThemeConsumer />)).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleErrorSpy.mockRestore();
  });

  it('should throw error when useAccessibility is called outside AccessibilityProvider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<AccessibilityConsumer />)).toThrow('useAccessibility must be used within an AccessibilityProvider');
    
    consoleErrorSpy.mockRestore();
  });

  it('should throw error when useStadiumState is called outside StadiumStateProvider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<StadiumStateConsumer />)).toThrow('useStadiumState must be used within a StadiumStateProvider');
    
    consoleErrorSpy.mockRestore();
  });
});
