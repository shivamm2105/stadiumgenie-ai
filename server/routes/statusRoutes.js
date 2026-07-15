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
  updateIncidentValidator,
  updateTaskValidator,
  emergencyValidator,
  validateRequest
} from '../middleware/validation.js';

const router = Router();

router.get('/', getStatus);
router.post('/incident', incidentValidator, validateRequest, reportIncident);
router.put('/incident/:id', updateIncidentValidator, validateRequest, updateIncident);
router.post('/lost-and-found', lostFoundValidator, validateRequest, reportLostFound);
router.post('/maintenance', maintenanceValidator, validateRequest, reportMaintenance);
router.put('/task/:id', updateTaskValidator, validateRequest, updateVolunteerTask);
router.post('/emergency', emergencyValidator, validateRequest, triggerEmergency);

export default router;
