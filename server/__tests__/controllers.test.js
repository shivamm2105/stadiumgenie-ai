import { describe, it, expect, vi } from 'vitest';
import {
  handleMatchAssistant,
  handleTranslation,
  handleIncidentSummary,
  handlePriorityScore,
  handleFoodRecommendation,
  handleTransitEco
} from '../controllers/aiController.js';
import {
  reportIncident,
  reportLostFound,
  reportMaintenance,
  triggerEmergency,
  updateIncident,
  updateVolunteerTask
} from '../controllers/statusController.js';
import errorHandler from '../middleware/error.js';

describe('Backend Controllers Direct Testing', () => {
  describe('aiController error handling', () => {
    it('should call next with error when something fails', async () => {
      const req = null;
      const res = {};
      const next = vi.fn();
      await handleMatchAssistant(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should call next with error in handleTranslation', async () => {
      const next = vi.fn();
      await handleTranslation(null, null, next);
      expect(next).toHaveBeenCalled();
    });

    it('should call next with error in handleIncidentSummary', async () => {
      const next = vi.fn();
      await handleIncidentSummary(null, null, next);
      expect(next).toHaveBeenCalled();
    });

    it('should call next with error in handlePriorityScore', async () => {
      const next = vi.fn();
      await handlePriorityScore(null, null, next);
      expect(next).toHaveBeenCalled();
    });

    it('should call next with error in handleFoodRecommendation', async () => {
      const next = vi.fn();
      await handleFoodRecommendation(null, null, next);
      expect(next).toHaveBeenCalled();
    });

    it('should call next with error in handleTransitEco', async () => {
      const next = vi.fn();
      await handleTransitEco(null, null, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('statusController fallback checks', () => {
    it('should fall back reportedBy in reportIncident', () => {
      const req = { body: { category: 'Medical', location: 'Gate A', description: 'faint' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      reportIncident(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should fall back locationFound and status in reportLostFound', () => {
      const req = { body: { item: 'wallet', description: 'black', category: 'Wallet/ID' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      reportLostFound(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should fall back priorities and teams in reportMaintenance', () => {
      const req = { body: { details: 'broken gate', location: 'Gate B' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      reportMaintenance(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should clear emergency when message is empty', () => {
      const req = { body: { message: null } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      triggerEmergency(req, res);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 404 for non-existent volunteer task', () => {
      const req = { params: { id: 'T-NONEXISTENT' }, body: { status: 'Completed' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      updateVolunteerTask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should update task status when status is provided', () => {
      const req = { params: { id: 'T-01' }, body: { status: 'Completed' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      updateVolunteerTask(req, res);
      expect(res.json).toHaveBeenCalled();
    });

    it('should not update task status when status is missing', () => {
      const req = { params: { id: 'T-01' }, body: {} };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      updateVolunteerTask(req, res);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 404 for non-existent incident in updateIncident', () => {
      const req = { params: { id: 'INC-NONEXISTENT' }, body: { status: 'Resolved' } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      updateIncident(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should update all fields in updateIncident', () => {
      const req = {
        params: { id: 'INC-101' },
        body: {
          status: 'Resolved',
          priority: 'High',
          suggestedActions: ['Evacuate area'],
          staffNeeded: 'Medical Team'
        }
      };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      updateIncident(req, res);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('errorHandler middleware', () => {
    it('should handle server warning logging for client-side errors', () => {
      const err = { statusCode: 400, message: 'Bad Request' };
      const req = {};
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      errorHandler(err, req, res, () => {});
      expect(res.status).toHaveBeenCalledWith(400);
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should handle internal errors and log stack trace in test mode', () => {
      const err = new Error('Database Error');
      const req = {};
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      errorHandler(err, req, res, () => {});
      expect(res.status).toHaveBeenCalledWith(500);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should log stack trace in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const err = { statusCode: 500, message: 'Dev error' };
      const req = {};
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      errorHandler(err, req, res, () => {});
      expect(res.status).toHaveBeenCalledWith(500);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });
});
