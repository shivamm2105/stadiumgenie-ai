import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './testUtils.jsx';
import GlassCard from '../GlassCard';
import SkeletonLoader from '../SkeletonLoader';
import Navbar from '../Navbar';
import AccessibilityToolbar from '../AccessibilityToolbar';

const mockStatus = {
  gates: [],
  parking: [],
  foodCourts: [],
  incidents: [],
  lostAndFound: [],
  volunteers: [],
  matchInfo: {
    teams: { home: 'Mexico', away: 'USA' },
    venue: 'Estadio Monterrey',
    timeToKickoff: 45,
    weather: '72F Clear',
    attendanceSimulated: 78500,
    emergencyAlert: null
  },
  maintenanceTickets: [],
  volunteerTasks: []
};

global.fetch = vi.fn().mockImplementation(() => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockStatus)
  });
});

describe('React Component Unit Tests', () => {
  describe('GlassCard Component', () => {
    it('renders text content correctly', () => {
      renderWithProviders(<GlassCard>Hello World</GlassCard>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('assigns role="region" by default if not clickable', () => {
      renderWithProviders(<GlassCard data-testid="card">Hello</GlassCard>);
      expect(screen.getByTestId('card')).toHaveAttribute('role', 'region');
    });

    it('assigns role="button" and renders as a button when onClick is provided', () => {
      const handleClick = vi.fn();
      renderWithProviders(
        <GlassCard onClick={handleClick} data-testid="card">
          Clickable
        </GlassCard>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('role', 'button');
      expect(card.tagName).toBe('BUTTON');
      expect(card).toHaveAttribute('type', 'button');
      
      // Simulate mouse click
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('SkeletonLoader Component', () => {
    it('renders correct number of skeleton cards', () => {
      const { container } = renderWithProviders(<SkeletonLoader count={3} />);
      const pulseDivs = container.querySelectorAll('.animate-pulse');
      expect(pulseDivs.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Navbar Component', () => {
    it('renders logo and navigation sections', async () => {
      mockStatus.matchInfo.emergencyAlert = 'Severe weather warning!';
      renderWithProviders(<Navbar />);
      const logo = screen.getByText(/StadiumGenie/i);
      expect(logo).toBeInTheDocument();
      expect(await screen.findByText(/Severe weather warning!/i)).toBeInTheDocument();

      // Trigger hover over Navbar elements
      const header = logo.closest('header');
      if (header) {
        fireEvent.mouseEnter(header);
      }
      const roleSelect = screen.getByLabelText(/Switch User Role/i);
      fireEvent.mouseEnter(roleSelect);

      const themeBtn = screen.getByLabelText(/Switch to/i);
      fireEvent.mouseEnter(themeBtn);
    });

    it('toggles accessibility suite visibility when toolbar trigger is clicked', () => {
      mockStatus.matchInfo.emergencyAlert = null;
      renderWithProviders(
        <div>
          <Navbar />
          <AccessibilityToolbar />
        </div>
      );
      const toolbarButton = screen.getByTitle(/Open Accessibility Toolbar/i);
      // Accessibility toolbar should start in hidden state
      expect(screen.queryByText(/Accessibility Suite/i)).not.toBeInTheDocument();
      
      fireEvent.click(toolbarButton);
      expect(screen.getByText(/Accessibility Suite/i)).toBeInTheDocument();
    });
  });

  describe('AccessibilityToolbar Component', () => {
    it('allows toggling dyslexia readable spacing options', () => {
      renderWithProviders(<AccessibilityToolbar />);
      
      // Open the menu
      const toggleBtn = screen.getByTitle(/Open Accessibility Toolbar/i);
      fireEvent.mouseEnter(toggleBtn);
      fireEvent.click(toggleBtn);

      const dyslexiaSwitch = screen.getByLabelText(/Readable Font/i);
      expect(dyslexiaSwitch).toBeInTheDocument();
      expect(dyslexiaSwitch).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(dyslexiaSwitch);
      expect(dyslexiaSwitch).toHaveAttribute('aria-checked', 'true');
      
      // Test close button
      const closeBtn = screen.getByTitle(/Close accessibility menu/i);
      fireEvent.click(closeBtn);
      expect(screen.queryByText(/Accessibility Suite/i)).not.toBeInTheDocument();
    });

    it('allows toggling high contrast themes', () => {
      renderWithProviders(<AccessibilityToolbar />);

      // Open the menu
      const toggleBtn = screen.getByTitle(/Open Accessibility Toolbar/i);
      fireEvent.click(toggleBtn);

      const contrastSwitch = screen.getByLabelText(/High Contrast/i);
      expect(contrastSwitch).toBeInTheDocument();
      expect(contrastSwitch).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(contrastSwitch);
      expect(contrastSwitch).toHaveAttribute('aria-checked', 'true');
    });

    it('allows toggling large text magnification', () => {
      renderWithProviders(<AccessibilityToolbar />);

      // Open the menu
      const toggleBtn = screen.getByTitle(/Open Accessibility Toolbar/i);
      fireEvent.click(toggleBtn);

      const textSwitch = screen.getByLabelText(/Large Text \(120%\)/i);
      expect(textSwitch).toBeInTheDocument();
      expect(textSwitch).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(textSwitch);
      expect(textSwitch).toHaveAttribute('aria-checked', 'true');
    });

    it('allows toggling speech guide narration mode', () => {
      renderWithProviders(<AccessibilityToolbar />);

      // Open the menu
      const toggleBtn = screen.getByTitle(/Open Accessibility Toolbar/i);
      fireEvent.click(toggleBtn);

      const speechSwitch = screen.getByLabelText(/Voice Reader/i);
      expect(speechSwitch).toBeInTheDocument();
      expect(speechSwitch).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(speechSwitch);
      expect(speechSwitch).toHaveAttribute('aria-checked', 'true');
    });
  });
});
