import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { UserProvider } from './context/UserContext';
import { StadiumStateProvider } from './context/StadiumStateContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

// Clean App.css override or bypass (all styles compile in index.css via Tailwind v4)

export default function App() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <UserProvider>
          <StadiumStateProvider>
            <HashRouter>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  {/* Fallback route */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </MainLayout>
            </HashRouter>
          </StadiumStateProvider>
        </UserProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}
