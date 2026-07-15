import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../../context/ThemeContext';
import { AccessibilityProvider } from '../../context/AccessibilityContext';
import { UserProvider } from '../../context/UserContext';
import { StadiumStateProvider } from '../../context/StadiumStateContext';
import { HashRouter } from 'react-router-dom';

export function renderWithProviders(ui) {
  return render(
    <ThemeProvider>
      <AccessibilityProvider>
        <UserProvider>
          <StadiumStateProvider>
            <HashRouter>
              {ui}
            </HashRouter>
          </StadiumStateProvider>
        </UserProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}
