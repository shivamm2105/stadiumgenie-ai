import {
  mockGates,
  mockParking,
  mockFoodCourts,
  mockIncidents,
  mockLostAndFound,
  mockVolunteers,
  mockMatchInfo
} from '../utils/mockData.js';

// In-Memory Database State
let gates = [...mockGates];
let parking = [...mockParking];
let foodCourts = [...mockFoodCourts];
let incidents = [...mockIncidents];
let lostAndFound = [...mockLostAndFound];
let volunteers = [...mockVolunteers];
let matchInfo = { ...mockMatchInfo };

// Maintenance tickets list (separate from incidents)
let maintenanceTickets = [
  {
    id: 'MNT-201',
    details: 'Turnstile A3 ticketing scanner is frozen. Rejecting tickets.',
    priority: 'Critical',
    etaMinutes: 10,
    allocatedTeam: 'IT Operations',
    justification: 'Blocks fan entry at Gate A, causing high crowding levels.',
    location: 'Gate A Entrance',
    status: 'Assigned',
    timestamp: '16:10'
  },
  {
    id: 'MNT-202',
    details: 'Broken glass in front of concession Stand 3.',
    priority: 'High',
    etaMinutes: 15,
    allocatedTeam: 'Cleaning Crew',
    justification: 'High hazard of cuts or slips in high-density walking aisle.',
    location: 'Concourse Section 102',
    status: 'In Progress',
    timestamp: '16:18'
  }
];

// Volunteer assignments/tasks list
let volunteerTasks = [
  { id: 'T-01', title: 'Assist visual/audio aids at Gate D', description: 'Guide group of wheelchair users to Section 108 ADA deck.', assignedTo: 'V-03', status: 'Completed' },
  { id: 'T-02', title: 'Language assistance at Gate A ticketing booth', description: 'Help French fan resolve ticketing code issues.', assignedTo: 'V-04', status: 'In Progress' },
  { id: 'T-03', title: 'Lost passport report collection', description: 'Collect description of lost passport near Gate C.', assignedTo: 'V-01', status: 'Pending' }
];

/**
 * Retrieves all in-memory database status collections.
 * @param {object} req - Express request.
 * @param {object} res - Express response returning gates, parking, concessions, incidents, Lost & Found, and volunteer details.
 */
export function getStatus(req, res) {
  res.json({
    gates,
    parking,
    foodCourts,
    incidents,
    lostAndFound,
    volunteers,
    matchInfo,
    maintenanceTickets,
    volunteerTasks
  });
}

/**
 * Registers a new crowd security or medical incident reported from the field.
 * @param {object} req - Express request containing category, location, description, and reporter.
 * @param {object} res - Express response returning registered incident telemetry.
 */
export function reportIncident(req, res) {
  const { category, location, description, reportedBy } = req.body;

  const newIncident = {
    id: `INC-${100 + incidents.length + 1}`,
    category,
    location,
    description,
    status: 'Active',
    reportedBy: reportedBy || 'Fan-Anonymous',
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    priority: 'Medium'
  };

  incidents.unshift(newIncident);
  res.status(201).json({ message: 'Incident reported successfully.', incident: newIncident });
}

/**
 * Updates status or details of a security incident.
 * @param {object} req - Express request with incident ID parameter and body updates.
 * @param {object} res - Express response.
 */
export function updateIncident(req, res) {
  const { id } = req.params;
  const { status, priority, suggestedActions, staffNeeded } = req.body;

  const incident = incidents.find(inc => inc.id === id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found.' });
  }

  if (status) incident.status = status;
  if (priority) incident.priority = priority;
  if (suggestedActions) incident.suggestedActions = suggestedActions;
  if (staffNeeded) incident.staffNeeded = staffNeeded;

  res.json({ message: 'Incident updated successfully.', incident });
}

/**
 * Registers a recovered lost-and-found item.
 * @param {object} req - Express request containing item category, description, and location found.
 * @param {object} res - Express response.
 */
export function reportLostFound(req, res) {
  const { item, description, category, locationFound, status } = req.body;

  const newItem = {
    id: `LF-${String(lostAndFound.length + 1).padStart(2, '0')}`,
    item,
    description,
    category,
    locationFound: locationFound || 'Unknown',
    status: status || 'Found',
    dateAdded: new Date().toISOString().split('T')[0]
  };

  lostAndFound.unshift(newItem);
  res.status(201).json({ message: 'Lost & Found item registered successfully.', item: newItem });
}

/**
 * Submits a new hardware or sanitization maintenance ticket.
 * @param {object} req - Express request with maintenance issue details and specific location.
 * @param {object} res - Express response.
 */
export function reportMaintenance(req, res) {
  const { details, location, priority, etaMinutes, allocatedTeam, justification } = req.body;

  const newTicket = {
    id: `MNT-${200 + maintenanceTickets.length + 1}`,
    details,
    location,
    priority: priority || 'Medium',
    etaMinutes: etaMinutes || 25,
    allocatedTeam: allocatedTeam || 'Facilities Roving',
    justification: justification || 'Registered in maintenance queue.',
    status: 'Assigned',
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  };

  maintenanceTickets.unshift(newTicket);
  res.status(201).json({ message: 'Maintenance report logged successfully.', ticket: newTicket });
}

/**
 * Updates execution status of a volunteer checklist task.
 * @param {object} req - Express request with task ID and new status.
 * @param {object} res - Express response.
 */
export function updateVolunteerTask(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const task = volunteerTasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Volunteer task not found.' });
  }

  if (status) {
    task.status = status;
  }

  res.json({ message: 'Task updated successfully.', task });
}

/**
 * Triggers or clears global simulated emergency broadcasts across fan views.
 * @param {object} req - Express request containing text message (or null to clear).
 * @param {object} res - Express response.
 */
export function triggerEmergency(req, res) {
  const { message } = req.body;
  
  if (message) {
    matchInfo.emergencyAlert = message;
    res.json({ message: 'Emergency broadcast triggered.', matchInfo });
  } else {
    matchInfo.emergencyAlert = null;
    res.json({ message: 'Emergency broadcast cleared.', matchInfo });
  }
}
