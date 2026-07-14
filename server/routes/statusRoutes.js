import { Router } from 'express';
import {
  getStatus,
  reportIncident,
  updateIncident,
  reportLostFound,
  reportMaintenance,
  updateVolunteerTask,
  triggerEmergency
} from '../controllers/statusController.js';
import {
  incidentValidator,
  lostFoundValidator,
  maintenanceValidator,
  validateRequest
} from '../middleware/validation.js';

const router = Router();

router.get('/', getStatus);
router.post('/incident', incidentValidator, validateRequest, reportIncident);
router.put('/incident/:id', updateIncident);
router.post('/lost-and-found', lostFoundValidator, validateRequest, reportLostFound);
router.post('/maintenance', maintenanceValidator, validateRequest, reportMaintenance);
router.put('/task/:id', updateVolunteerTask);
router.post('/emergency', triggerEmergency);

export default router;
