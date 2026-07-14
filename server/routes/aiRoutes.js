import { Router } from 'express';
import {
  handleMatchAssistant,
  handleTranslation,
  handleIncidentSummary,
  handlePriorityScore,
  handleFoodRecommendation,
  handleTransitEco
} from '../controllers/aiController.js';
import {
  aiMatchValidator,
  aiTranslateValidator,
  aiIncidentValidator,
  aiPriorityValidator,
  aiTransitValidator,
  validateRequest
} from '../middleware/validation.js';

const router = Router();

router.post('/match-assistant', aiMatchValidator, validateRequest, handleMatchAssistant);
router.post('/translate', aiTranslateValidator, validateRequest, handleTranslation);
router.post('/incident-summary', aiIncidentValidator, validateRequest, handleIncidentSummary);
router.post('/priority', aiPriorityValidator, validateRequest, handlePriorityScore);
router.post('/food-recommendation', handleFoodRecommendation);
router.post('/transit-eco', aiTransitValidator, validateRequest, handleTransitEco);

export default router;
