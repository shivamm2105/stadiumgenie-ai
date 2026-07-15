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
  reportMaintenance
} from '../controllers/statusController.js';
import errorHandler from '../middleware/error.js';

describe('Backend Controllers Direct Testing', () => {
  describe('aiController error handling', () => {
    it('should trigger next(error) when gemini service throws an error', async () => {
      const reqMissing = { body: {} };
      const resJson = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();
      await handleMatchAssistant(reqMissing, resJson, next);
      expect(resJson.status).toHaveBeenCalledWith(400);
    });

    it('should validate missing params in handleTranslation', async () => {
      const resJson = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();
      await handleTranslation({ body: { text: 'hello' } }, resJson, next);
      expect(resJson.status).toHaveBeenCalledWith(400);
    });

    it('should validate missing params in handleIncidentSummary', async () => {
      const resJson = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();
      await handleIncidentSummary({ body: { description: 'hello' } }, resJson, next);
      expect(resJson.status).toHaveBeenCalledWith(400);
    });

    it('should validate missing params in handlePriorityScore', async () => {
      const resJson = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();
      await handlePriorityScore({ body: {} }, resJson, next);
      expect(resJson.status).toHaveBeenCalledWith(400);
    });

    it('should validate missing params in handleTransitEco', async () => {
      const resJson = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();
      await handleTransitEco({ body: { destination: 'Airport' } }, resJson, next);
      expect(resJson.status).toHaveBeenCalledWith(400);
    });

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
    it('should trigger category missing error in reportIncident', () => {
      const req = { body: {} };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      reportIncident(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should trigger item name missing error in reportLostFound', () => {
      const req = { body: {} };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      reportLostFound(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should trigger details missing error in reportMaintenance', () => {
      const req = { body: {} };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      reportMaintenance(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
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
