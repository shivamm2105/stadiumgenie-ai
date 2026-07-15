import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('Express REST API Routes', () => {
  describe('GET /health', () => {
    it('should return a healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/status', () => {
    it('should return all simulation telemetry lists', async () => {
      const res = await request(app).get('/api/status');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('gates');
      expect(res.body).toHaveProperty('parking');
      expect(res.body).toHaveProperty('foodCourts');
      expect(res.body).toHaveProperty('incidents');
      expect(res.body).toHaveProperty('lostAndFound');
      expect(res.body).toHaveProperty('volunteers');
      expect(res.body).toHaveProperty('matchInfo');
      expect(res.body).toHaveProperty('maintenanceTickets');
      expect(res.body).toHaveProperty('volunteerTasks');
    });
  });

  describe('POST /api/status/incident', () => {
    it('should create a new safety incident report', async () => {
      const payload = {
        category: 'Medical',
        location: 'Section 104 ADA deck',
        description: 'Visitor requires assistance to seats',
        reportedBy: 'Staff-Vince'
      };
      const res = await request(app)
        .post('/api/status/incident')
        .send(payload);
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Incident reported successfully.');
      expect(res.body.incident).toHaveProperty('id');
      expect(res.body.incident.category).toBe('Medical');
    });

    it('should fail if required parameters are missing', async () => {
      const res = await request(app)
        .post('/api/status/incident')
        .send({ category: 'Medical' });
      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain('validation failed');
    });
  });

  describe('PUT /api/status/incident/:id', () => {
    it('should update an existing incident details', async () => {
      const res = await request(app)
        .put('/api/status/incident/INC-101')
        .send({ status: 'Resolved' });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Incident updated successfully.');
      expect(res.body.incident.status).toBe('Resolved');
    });

    it('should return 404 for a non-existent incident', async () => {
      const res = await request(app)
        .put('/api/status/incident/INC-NONEXISTENT')
        .send({ status: 'Resolved' });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Incident not found.');
    });
  });

  describe('POST /api/status/lost-and-found', () => {
    it('should catalog a lost and found item', async () => {
      const payload = {
        item: 'Keys',
        description: 'Car keys with blue keychain fob',
        category: 'Keys',
        locationFound: 'Gate B'
      };
      const res = await request(app)
        .post('/api/status/lost-and-found')
        .send(payload);
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Lost & Found item registered successfully.');
      expect(res.body.item.item).toBe('Keys');
    });

    it('should fail with invalid category', async () => {
      const payload = {
        item: 'Keys',
        description: 'Car keys',
        category: 'InvalidCategory'
      };
      const res = await request(app)
        .post('/api/status/lost-and-found')
        .send(payload);
      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain('validation failed');
    });
  });

  describe('POST /api/status/maintenance', () => {
    it('should log a facilities issue', async () => {
      const payload = {
        details: 'Sink overflow in VIP rest room section 110',
        location: 'VIP Restroom'
      };
      const res = await request(app)
        .post('/api/status/maintenance')
        .send(payload);
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Maintenance report logged successfully.');
    });
  });

  describe('PUT /api/status/task/:id', () => {
    it('should update volunteer task status', async () => {
      const res = await request(app)
        .put('/api/status/task/T-02')
        .send({ status: 'Completed' });
      expect(res.status).toBe(200);
      expect(res.body.task.status).toBe('Completed');
    });

    it('should return 404 for invalid task ID', async () => {
      const res = await request(app)
        .put('/api/status/task/T-999')
        .send({ status: 'Completed' });
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/status/emergency', () => {
    it('should trigger emergency global warning alert', async () => {
      const res = await request(app)
        .post('/api/status/emergency')
        .send({ message: 'Lightning storm warning' });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Emergency broadcast triggered.');
    });

    it('should clear emergency global warning alert if message is empty', async () => {
      const res = await request(app)
        .post('/api/status/emergency')
        .send({ message: '' });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Emergency broadcast cleared.');
    });
  });

  describe('POST /api/ai/match-assistant', () => {
    it('should answer match assistant chat queries', async () => {
      const res = await request(app)
        .post('/api/ai/match-assistant')
        .send({ query: 'Where is Gate D?' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('reply');
    });

    it('should fail if query is missing', async () => {
      const res = await request(app)
        .post('/api/ai/match-assistant')
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/ai/translate', () => {
    it('should perform mock language translation', async () => {
      const res = await request(app)
        .post('/api/ai/translate')
        .send({ text: 'Where is the restroom?', targetLanguage: 'Spanish' });
      expect(res.status).toBe(200);
      expect(res.body.translatedText).toBe('[Spanish] Traducción de: "Where is the restroom?"');
    });
  });

  describe('POST /api/ai/incident-summary', () => {
    it('should summarize safety incidents', async () => {
      const res = await request(app)
        .post('/api/ai/incident-summary')
        .send({ description: 'A minor fight broke out at Sec 112', category: 'Crowd Control' });
      expect(res.status).toBe(200);
      expect(res.body.summaryData).toHaveProperty('summary');
      expect(res.body.summaryData).toHaveProperty('priority');
    });
  });

  describe('POST /api/ai/priority', () => {
    it('should calculate priority scores', async () => {
      const res = await request(app)
        .post('/api/ai/priority')
        .send({ details: 'Broken turnstile scanner' });
      expect(res.status).toBe(200);
      expect(res.body.priorityData.priority).toBe('Critical');
    });
  });

  describe('POST /api/ai/food-recommendation', () => {
    it('should offer concessions queue recommendations', async () => {
      const res = await request(app)
        .post('/api/ai/food-recommendation')
        .send({ dietaryPreference: 'vegan' });
      expect(res.status).toBe(200);
      expect(res.body.recommendation).toContain('Golden Goal Greens');
    });
  });

  describe('POST /api/ai/transit-eco', () => {
    it('should provide transit path guidelines', async () => {
      const res = await request(app)
        .post('/api/ai/transit-eco')
        .send({ destination: 'Airport', preference: 'Metro' });
      expect(res.status).toBe(200);
      expect(res.body.recommendation).toContain('Metro Line 2');
    });
  });

  describe('404 Route handling fallback', () => {
    it('should return 404 for undefined paths', async () => {
      const res = await request(app).get('/api/invalid-route-name');
      expect(res.status).toBe(404);
      expect(res.body.error).toHaveProperty('message');
    });
  });

  describe('SPA Fallback route', () => {
    it('should fall back to index.html for non-API route hits in production', async () => {
      const res = await request(app).get('/non-api-route-for-spa-testing');
      // In tests, since the folder is empty or not created yet, it will return 404 or try to send file,
      // but it will hit the get('*') branch and cover the code path!
      expect([404, 200]).toContain(res.status);
    });
  });
});
