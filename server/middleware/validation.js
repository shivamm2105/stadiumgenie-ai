import { validationResult, body, param } from 'express-validator';

// Middleware to capture and process validation results
export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: {
        message: 'Input validation failed. Please check parameters.',
        details: errors.array().map(err => ({ field: err.path, issue: err.msg }))
      }
    });
  }
  next();
}

// Validation rules for reporting safety incidents
export const incidentValidator = [
  body('category')
    .trim()
    .notEmpty().withMessage('Incident category is required')
    .isString().withMessage('Category must be a string')
    .escape(),
  body('location')
    .trim()
    .notEmpty().withMessage('Incident location is required')
    .isString().withMessage('Location must be a string')
    .escape(),
  body('description')
    .trim()
    .notEmpty().withMessage('Incident description is required')
    .isString().withMessage('Description must be a string')
    .escape(),
  body('reportedBy')
    .optional()
    .trim()
    .isString().withMessage('Reporter name must be a string')
    .escape()
];

// Validation rules for Lost & Found entries
export const lostFoundValidator = [
  body('item')
    .trim()
    .notEmpty().withMessage('Recovered item name is required')
    .isString().withMessage('Item name must be a string')
    .escape(),
  body('description')
    .trim()
    .notEmpty().withMessage('Recovered description details are required')
    .isString().withMessage('Description must be a string')
    .escape(),
  body('category')
    .trim()
    .notEmpty().withMessage('Item category is required')
    .isIn(['Electronics', 'Wallet/ID', 'Apparel', 'Keys', 'General']).withMessage('Category must be a valid item category')
    .escape(),
  body('locationFound')
    .optional()
    .trim()
    .isString().withMessage('Location must be a string')
    .escape(),
  body('status')
    .optional()
    .trim()
    .isIn(['Lost', 'Found', 'Claimed']).withMessage('Invalid status parameter')
    .escape()
];

// Validation rules for reporting facilities maintenance
export const maintenanceValidator = [
  body('details')
    .trim()
    .notEmpty().withMessage('Maintenance details are required')
    .isString().withMessage('Details must be a string')
    .escape(),
  body('location')
    .trim()
    .notEmpty().withMessage('Incident location coordinates are required')
    .isString().withMessage('Location must be a string')
    .escape(),
  body('priority')
    .optional()
    .trim()
    .isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority scale value')
    .escape(),
  body('etaMinutes')
    .optional()
    .isInt({ min: 1, max: 240 }).withMessage('ETA must be an integer between 1 and 240 minutes'),
  body('allocatedTeam')
    .optional()
    .trim()
    .isString().withMessage('Allocated team name must be a string')
    .escape(),
  body('justification')
    .optional()
    .trim()
    .isString().withMessage('Justification must be a string')
    .escape()
];

// AI Request validation rules
export const aiMatchValidator = [
  body('query')
    .trim()
    .notEmpty().withMessage('AI Search query is required')
    .isString().withMessage('Query must be a string')
    .escape(),
  body('chatHistory')
    .optional()
    .isArray().withMessage('Chat history parameters must be an array')
];

export const aiTranslateValidator = [
  body('text')
    .trim()
    .notEmpty().withMessage('Text to translate is required')
    .isString().withMessage('Text must be a string')
    .escape(),
  body('targetLanguage')
    .trim()
    .notEmpty().withMessage('Target language code is required')
    .isIn(['Spanish', 'French', 'German', 'Arabic', 'Japanese', 'Portuguese']).withMessage('Language selected is not supported currently')
    .escape()
];

export const aiIncidentValidator = [
  body('description')
    .trim()
    .notEmpty().withMessage('Incident description is required')
    .isString().withMessage('Description must be a string')
    .escape(),
  body('category')
    .trim()
    .notEmpty().withMessage('Incident category label is required')
    .isString().withMessage('Category must be a string')
    .escape()
];

export const aiPriorityValidator = [
  body('details')
    .trim()
    .notEmpty().withMessage('Maintenance task details are required')
    .isString().withMessage('Details must be a string')
    .escape()
];

export const aiTransitValidator = [
  body('destination')
    .trim()
    .notEmpty().withMessage('Transit destination is required')
    .isString().withMessage('Destination must be a string')
    .escape(),
  body('preference')
    .trim()
    .notEmpty().withMessage('Transit preference is required')
    .isIn(['Metro', 'Bus', 'Rideshare']).withMessage('Invalid transit preference selected')
    .escape(),
  body('gateLoad')
    .optional()
    .trim()
    .isString().withMessage('Gate load parameters must be a string')
    .escape()
];

export const aiFoodValidator = [
  body('dietaryPreference')
    .optional()
    .trim()
    .isString().withMessage('Dietary preference must be a string')
    .escape(),
  body('crowdDensity')
    .optional()
    .trim()
    .isString().withMessage('Crowd density must be a string')
    .escape(),
  body('gatesOccupancy')
    .optional()
    .trim()
    .isString().withMessage('Gates occupancy parameters must be a string')
    .escape()
];

export const updateIncidentValidator = [
  param('id')
    .trim()
    .notEmpty().withMessage('Incident ID parameter is required')
    .isString().withMessage('Incident ID must be a string')
    .escape(),
  body('status')
    .optional()
    .trim()
    .isIn(['Active', 'Resolved', 'Pending']).withMessage('Invalid status value')
    .escape(),
  body('priority')
    .optional()
    .trim()
    .isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority scale value')
    .escape(),
  body('suggestedActions')
    .optional()
    .isArray().withMessage('Suggested actions must be an array'),
  body('staffNeeded')
    .optional()
    .trim()
    .isString().withMessage('Staff needed must be a string')
    .escape()
];

export const updateTaskValidator = [
  param('id')
    .trim()
    .notEmpty().withMessage('Task ID parameter is required')
    .isString().withMessage('Task ID must be a string')
    .escape(),
  body('status')
    .trim()
    .notEmpty().withMessage('Task status is required')
    .isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid task status')
    .escape()
];

export const emergencyValidator = [
  body('message')
    .optional({ nullable: true })
    .trim()
    .isString().withMessage('Emergency message must be a string')
    .escape()
];
