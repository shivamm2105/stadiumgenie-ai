import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../components/__tests__/testUtils.jsx';
import Home from '../Home';
import FanDashboard from '../FanDashboard';
import OrganizerDashboard from '../OrganizerDashboard';
import VolunteerDashboard from '../VolunteerDashboard';
import StaffDashboard from '../StaffDashboard';
import Navbar from '../../components/Navbar';
import { AiService } from '../../services/api';

// Mock global fetch
const mockStatusResponse = {
  gates: [
    { id: 'Gate A', label: 'Gate A', occupancy: 90, status: 'Critical', coordinator: 'Sarah' }
  ],
  parking: [
    { id: 'Parking A', label: 'Parking A', capacity: 1000, occupied: 800, status: '80% Full' }
  ],
  foodCourts: [
    { id: 'FC-1', name: 'Alamo Tacos', queueMinutes: 12, items: ['Tacos'], busyLevel: 'Medium' }
  ],
  incidents: [
    { id: 'INC-101', category: 'Medical', location: 'Gate A', description: 'Fainting', status: 'Active', reportedBy: 'Vol', timestamp: '16:00', priority: 'High' }
  ],
  lostAndFound: [
    { id: 'LF-01', item: 'Wallet', description: 'Black wallet', category: 'Wallet/ID', locationFound: 'Sec 104', status: 'Found', dateAdded: '2026-07-14' }
  ],
  volunteers: [
    { id: 'V-01', name: 'Carlos', languages: ['Spanish'], location: 'Gate A', status: 'Available' }
  ],
  matchInfo: {
    teams: { home: 'Mexico', away: 'USA' },
    venue: 'Estadio Monterrey',
    timeToKickoff: 45,
    weather: '72F Clear',
    attendanceSimulated: 78500,
    emergencyAlert: null
  },
  maintenanceTickets: [
    { id: 'MNT-201', details: 'Turnstile A3 broken', priority: 'Critical', etaMinutes: 10, allocatedTeam: 'IT', justification: 'Blocks entry', location: 'Gate A', status: 'Assigned', timestamp: '16:10' }
  ],
  volunteerTasks: [
    { id: 'T-01', title: 'Assist visual aid', description: 'Guide group', assignedTo: 'V-03', status: 'In Progress' }
  ]
};

global.fetch = vi.fn().mockImplementation((url) => {
  if (url.includes('/api/status/incident')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Incident reported successfully.', incident: { id: 'INC-102', category: 'Medical', location: 'Gate A', status: 'Active' } })
    });
  }
  if (url.includes('/api/status/lost-and-found')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Lost & Found item registered successfully.', item: { id: 'LF-02', item: 'Keys', description: 'Keys found' } })
    });
  }
  if (url.includes('/api/status/maintenance')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Maintenance report logged successfully.', ticket: { id: 'MNT-202', details: 'Leaking pipe' } })
    });
  }
  if (url.includes('/api/status/task')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Task updated successfully.', task: { id: 'T-01', status: 'Completed' } })
    });
  }
  if (url.includes('/api/status/emergency')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Emergency broadcast triggered.', matchInfo: { ...mockStatusResponse.matchInfo, emergencyAlert: 'Alert triggered' } })
    });
  }
  if (url.includes('/api/status')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockStatusResponse)
    });
  }
  return Promise.reject(new Error('Unmocked fetch request'));
});

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe('Home Page and Role Switching', () => {
    it('renders landing page and allows role selector switching', async () => {
      console.log('DEBUG AiService keys:', Object.keys(AiService || {}));
      renderWithProviders(<Home />);
      expect(screen.getByText(/Choose Your Dashboard View/i)).toBeInTheDocument();

      // Trigger hover on Hero section
      const heroSec = screen.getByText(/PromptWars Virtual/i).closest('section');
      if (heroSec) {
        fireEvent.mouseEnter(heroSec);
      }

      // Wait for lazy loaded Fan Dashboard (default role)
      expect(await screen.findByText(/Interactive Stadium Navigator/i)).toBeInTheDocument();

      // Click on Organizer Command Portal Card
      const organizerCard = screen.getByRole('button', { name: /Select Organizer Command dashboard view/i });
      fireEvent.click(organizerCard);

      // Verify Organizer command dashboard elements appear
      expect(await screen.findByText(/Security Operations Command Center/i)).toBeInTheDocument();

      // Click on Volunteer Hub Card
      const volunteerCard = screen.getByRole('button', { name: /Select Volunteer Hub dashboard view/i });
      fireEvent.click(volunteerCard);

      // Verify Volunteer coordination hub elements appear
      expect(await screen.findByText(/Volunteer Coordination Hub/i)).toBeInTheDocument();

      // Click on Staff Portal Card
      const staffCard = screen.getByRole('button', { name: /Select Staff Portal dashboard view/i });
      fireEvent.click(staffCard);

      // Verify Staff maintenance portal elements appear
      expect(await screen.findByText(/Facilities & Maintenance Portal/i)).toBeInTheDocument();
    });
  });

  describe('FanDashboard Page', () => {
    it('allows fan to chat with Gemini Match Assistant', async () => {
      vi.spyOn(AiService, 'askMatchAssistant').mockResolvedValueOnce('Sure, Gate D is accessible.');
      renderWithProviders(<FanDashboard />);
      const chatInput = await screen.findByPlaceholderText(/Where is Gate B/i);
      const submitButton = await screen.findByTitle(/Send query/i);

      fireEvent.change(chatInput, { target: { value: 'Where is wheelchair gate?' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Sure, Gate D is accessible./i)).toBeInTheDocument();
      });
    });

    it('allows fan to request concessions planner recommendations', async () => {
      vi.spyOn(AiService, 'getFoodRecommendation').mockResolvedValueOnce('Try FC-3 for fast service.');
      renderWithProviders(<FanDashboard />);
      
      const veganButton = await screen.findByRole('button', { name: /Select dietary preference: Vegan/i });
      fireEvent.click(veganButton);

      const requestButton = screen.getByRole('button', { name: /Plan Dinner/i });
      fireEvent.click(requestButton);

      await waitFor(() => {
        expect(screen.getByText(/Try FC-3 for fast service./i)).toBeInTheDocument();
      });
    });

    it('allows fan to click seats on the Pathfinder Map', async () => {
      renderWithProviders(<FanDashboard />);
      
      const targetBtn = await screen.findByRole('button', { name: /Gate B \(Clear Entrance\)/i });
      fireEvent.click(targetBtn);
      expect(targetBtn).toHaveAttribute('aria-pressed', 'true');
    });

    it('allows fan to trigger emergency SOS alerts', async () => {
      renderWithProviders(<FanDashboard />);

      const sosButton = await screen.findByRole('button', { name: "SOS Emergency Help" });
      fireEvent.click(sosButton);

      await waitFor(() => {
        expect(screen.getByText(/Emergency SOS Broadcast Activated/i)).toBeInTheDocument();
      });
    });
  });

  describe('OrganizerDashboard Page', () => {
    it('allows organizer to broadcast emergency warnings', async () => {
      renderWithProviders(<OrganizerDashboard />);
      const input = await screen.findByLabelText(/Broadcast alert text/i);
      const submitButton = screen.getByTitle(/Send broadcast alert/i);

      fireEvent.change(input, { target: { value: 'Lightning alert' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('allows organizer to select and resolve security incidents', async () => {
      vi.spyOn(AiService, 'getIncidentSummary').mockResolvedValueOnce({
        summary: 'Severe crowd congestion at northwest exit',
        priority: 'High',
        suggestedActions: ['Dispatch crew'],
        staffNeeded: 'Security'
      });
      renderWithProviders(<OrganizerDashboard />);
      
      // Select an incident
      const incidentItem = await screen.findByRole('button', { name: /Analyze incident: Medical at Gate A/i });
      fireEvent.click(incidentItem);

      // Verify AI decision support loading/response
      await waitFor(() => {
        expect(screen.getByText(/AI Emergency Support Checklists/i)).toBeInTheDocument();
        expect(screen.getByText(/Severe crowd congestion/i)).toBeInTheDocument();
      });

      // Click resolve button
      const resolveButton = screen.getByRole('button', { name: /Resolve incident: INC-101/i });
      fireEvent.click(resolveButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe('VolunteerDashboard Page', () => {
    it('allows translating input messages', async () => {
      vi.spyOn(AiService, 'translateText').mockResolvedValueOnce('¿Dónde está el baño?');
      renderWithProviders(<VolunteerDashboard />);
      const textarea = await screen.findByPlaceholderText(/Type or paste guest query/i);
      const translateBtn = screen.getByTitle(/Translate query text/i);

      fireEvent.change(textarea, { target: { value: 'Where is the exit?' } });
      fireEvent.click(translateBtn);

      await waitFor(() => {
        expect(screen.getByText(/¿Dónde está el baño/i)).toBeInTheDocument();
      });
    });

    it('allows volunteers to log recovered lost & found items', async () => {
      renderWithProviders(<VolunteerDashboard />);
      
      const itemInput = await screen.findByLabelText('Item Name');
      const descInput = screen.getByLabelText('Detailed Description');
      const locInput = screen.getByLabelText('Location Found');
      const submitBtn = screen.getByTitle('Log recovered item');

      fireEvent.change(itemInput, { target: { value: 'Phone' } });
      fireEvent.change(descInput, { target: { value: 'Red case' } });
      fireEvent.change(locInput, { target: { value: 'Gate D' } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe('StaffDashboard Page', () => {
    it('allows logging turnstile malfunction tickets with AI prioritization evaluation', async () => {
      vi.spyOn(AiService, 'getMaintenancePriority').mockResolvedValueOnce({
        priority: 'Critical',
        etaMinutes: 10,
        allocatedTeam: 'IT Support',
        justification: 'Scanner fail'
      });
      renderWithProviders(<StaffDashboard />);
      
      const descInput = await screen.findByLabelText('Malfunction Details');
      const locInput = screen.getByLabelText('Specific Location');
      const triageBtn = screen.getByTitle('Ask Gemini Priority Analysis');

      fireEvent.change(descInput, { target: { value: 'Turnstile jam' } });
      fireEvent.change(locInput, { target: { value: 'Gate A' } });
      fireEvent.click(triageBtn);

      await waitFor(() => {
        expect(screen.getByText(/Critical Priority suggested/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navbar and Dashboard Controls', () => {
    it('toggles dark/light mode in Navbar', async () => {
      renderWithProviders(<Navbar />);
      const themeBtn = screen.getByLabelText(/Switch to/i);
      fireEvent.click(themeBtn);
    });

    it('toggles user roles via select dropdown in Navbar', async () => {
      renderWithProviders(<Navbar />);
      const roleSelect = screen.getByLabelText(/Switch User Role/i);
      fireEvent.change(roleSelect, { target: { value: 'staff' } });
    });
  });

  describe('SOS Reset State', () => {
    it('allows resetting active SOS alert blocks in FanDashboard', async () => {
      renderWithProviders(<FanDashboard />);
      const sosButton = await screen.findByRole('button', { name: "SOS Emergency Help" });
      fireEvent.click(sosButton);

      const clearBtn = await screen.findByRole('button', { name: /Clear SOS/i });
      fireEvent.click(clearBtn);
      expect(screen.queryByText(/Emergency SOS Broadcast Activated/i)).not.toBeInTheDocument();
    });
  });

  describe('Error retry boundaries', () => {
    it('handles AI assistant chat send error and retry', async () => {
      vi.spyOn(AiService, 'askMatchAssistant')
        .mockRejectedValueOnce(new Error('Network Fail'))
        .mockResolvedValueOnce('Retry succeeded!');

      renderWithProviders(<FanDashboard />);
      const chatInput = await screen.findByPlaceholderText(/Where is Gate B/i);
      const submitButton = screen.getByTitle(/Send query/i);

      fireEvent.change(chatInput, { target: { value: 'Test retry' } });
      fireEvent.click(submitButton);

      await screen.findByText(/Sorry, I am having trouble connecting/i);

      const retryBtn = screen.getByRole('button', { name: /Retry Call/i });
      fireEvent.click(retryBtn);

      await screen.findByText(/Retry succeeded!/i);
    });

    it('handles AI assistant chat send error and double failure retry', async () => {
      vi.spyOn(AiService, 'askMatchAssistant')
        .mockRejectedValueOnce(new Error('Network Fail'))
        .mockRejectedValueOnce(new Error('Double Fail'));

      renderWithProviders(<FanDashboard />);
      const chatInput = await screen.findByPlaceholderText(/Where is Gate B/i);
      const submitButton = screen.getByTitle(/Send query/i);

      fireEvent.change(chatInput, { target: { value: 'Test double fail' } });
      fireEvent.click(submitButton);

      await screen.findByText(/Sorry, I am having trouble connecting/i);

      const retryBtn = screen.getByRole('button', { name: /Retry Call/i });
      fireEvent.click(retryBtn);

      await screen.findByText(/Sorry, I am having trouble connecting/i);
    });

    it('handles concession planner error and retry', async () => {
      vi.spyOn(AiService, 'getFoodRecommendation')
        .mockRejectedValueOnce(new Error('Network Fail'))
        .mockResolvedValueOnce('Try FC-1!');

      renderWithProviders(<FanDashboard />);
      const veganButton = await screen.findByRole('button', { name: /Select dietary preference: Vegan/i });
      fireEvent.click(veganButton);

      const requestButton = screen.getByRole('button', { name: /Plan Dinner/i });
      fireEvent.click(requestButton);

      await screen.findByText(/Failed to retrieve recommendation/i);

      const retryBtn = screen.getByRole('button', { name: /Try Again/i });
      fireEvent.click(retryBtn);

      await screen.findByText(/Try FC-1!/i);
    });

    it('handles transit planner error and retry', async () => {
      vi.spyOn(AiService, 'getTransitEco')
        .mockRejectedValueOnce(new Error('Network Fail'))
        .mockResolvedValueOnce('Take Metro Line 1.');

      renderWithProviders(<FanDashboard />);
      const destInput = await screen.findByLabelText(/Enter transit destination/i);
      fireEvent.change(destInput, { target: { value: 'Downtown' } });

      const requestButton = screen.getByRole('button', { name: /Plan Transit/i });
      fireEvent.click(requestButton);

      await screen.findByText(/Failed to fetch transit recommendation/i);

      const retryBtn = screen.getByRole('button', { name: /Try Again/i });
      fireEvent.click(retryBtn);

      await screen.findByText(/Take Metro Line 1./i);
    });
  });
});
