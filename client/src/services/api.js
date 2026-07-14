// API service for StadiumGenie AI
// Gracefully falls back to local storage client-side storage if the backend server is unreachable

const STATUS_API_BASE = 'http://localhost:5000/api/status';
const AI_API_BASE = 'http://localhost:5000/api/ai';

// Initial local fallback data structure
let localState = {
  gates: [
    { id: 'Gate A', label: 'Gate A (North Entrance)', occupancy: 90, status: 'Critical', coordinator: 'Sarah Jenkins' },
    { id: 'Gate B', label: 'Gate B (South Entrance)', occupancy: 35, status: 'Normal', coordinator: 'Marcus Aurelius' },
    { id: 'Gate C', label: 'Gate C (East Entrance)', occupancy: 60, status: 'Moderate', coordinator: 'Elena Rostova' },
    { id: 'Gate D', label: 'Gate D (West VIP/Accessibility)', occupancy: 15, status: 'Normal', coordinator: 'Kenji Sato' }
  ],
  parking: [
    { id: 'Parking A', label: 'Parking Lot A', capacity: 1500, occupied: 1200, status: '80% Full' },
    { id: 'Parking B', label: 'Parking Lot B', capacity: 2000, occupied: 1900, status: '95% Full' },
    { id: 'Parking C', label: 'Parking Lot C', capacity: 1000, occupied: 1000, status: 'Full' },
    { id: 'Parking D', label: 'Parking Lot D (Accessible)', capacity: 500, occupied: 110, status: '22% Full' }
  ],
  foodCourts: [
    { id: 'FC-1', name: 'Alamo Tacos & Grill', queueMinutes: 12, items: ['Tacos', 'Nachos', 'Soda'], busyLevel: 'Medium' },
    { id: 'FC-2', name: 'Strikers Burger Joint', queueMinutes: 25, items: ['Burgers', 'Fries', 'Beer'], busyLevel: 'High' },
    { id: 'FC-3', name: 'Golden Goal Greens', queueMinutes: 5, items: ['Salads', 'Wraps', 'Vegan Bowls'], busyLevel: 'Low' },
    { id: 'FC-4', name: 'Maracanã Coffee & Pastry', queueMinutes: 8, items: ['Coffee', 'Croissants', 'Esfihas'], busyLevel: 'Low' }
  ],
  incidents: [
    {
      id: 'INC-101',
      category: 'Crowd Control',
      location: 'Concourse Section 112',
      description: 'Minor bottleneck forming at Section 112 exit due to blocked signage. Fans are clustering and causing delays.',
      status: 'Active',
      reportedBy: 'Staff-Jane',
      timestamp: '16:15',
      priority: 'Medium'
    },
    {
      id: 'INC-102',
      category: 'Medical',
      location: 'Gate A ticketing gates',
      description: 'Elderly fan feeling lightheaded near ticketing checkpoint A. Needs wheelchair transport and medical evaluation.',
      status: 'Active',
      reportedBy: 'Vol-Ahmed',
      timestamp: '16:22',
      priority: 'High'
    },
    {
      id: 'INC-103',
      category: 'Facilities',
      location: 'Restroom Block B (Level 2)',
      description: 'Leaking water valve causing minor flooding in the men\'s restroom. Risk of slips.',
      status: 'Pending',
      reportedBy: 'Staff-Chen',
      timestamp: '16:05',
      priority: 'Low'
    }
  ],
  lostAndFound: [
    { id: 'LF-01', item: 'Black leather wallet', description: 'Contains Texas driver\'s license and matching bank cards', category: 'Wallet/ID', locationFound: 'Section 104 Row M', status: 'Found', dateAdded: '2026-07-14' },
    { id: 'LF-02', item: 'iPhone 15 Pro Max', description: 'Blue titanium finish, clear MagSafe case, Lock screen shows a dog', category: 'Electronics', locationFound: 'Food Court 2', status: 'Found', dateAdded: '2026-07-14' },
    { id: 'LF-03', item: 'Kids FIFA scarf', description: 'Red and green scarf with World Cup 2026 logo printed on sides', category: 'Apparel', locationFound: 'Seat 12 Row A', status: 'Found', dateAdded: '2026-07-14' }
  ],
  volunteers: [
    { id: 'V-01', name: 'Carlos Gomez', languages: ['English', 'Spanish', 'Portuguese'], location: 'Gate A Info Desk', status: 'Available' },
    { id: 'V-02', name: 'Yuki Tanaka', languages: ['Japanese', 'English'], location: 'Section 120 Concourse', status: 'On Break' },
    { id: 'V-03', name: 'Fatima Al-Sayed', languages: ['Arabic', 'French', 'English'], location: 'Gate D (Accessibility Desk)', status: 'Busy' },
    { id: 'V-04', name: 'Pierre Dubois', languages: ['French', 'English', 'German'], location: 'Mobile Roving Team B', status: 'Available' }
  ],
  matchInfo: {
    teams: { home: 'Mexico', away: 'USA' },
    venue: 'Azteca Stadium / Estadio Monterrey / MetLife Stadium (FIFA 2026 Host)',
    timeToKickoff: 45,
    weather: '72°F Clear, Humidity 45%',
    attendanceSimulated: 78500,
    emergencyAlert: null
  },
  maintenanceTickets: [
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
  ],
  volunteerTasks: [
    { id: 'T-01', title: 'Assist visual/audio aids at Gate D', description: 'Guide group of wheelchair users to Section 108 ADA deck.', assignedTo: 'V-03', status: 'Completed' },
    { id: 'T-02', title: 'Language assistance at Gate A ticketing booth', description: 'Help French fan resolve ticketing code issues.', assignedTo: 'V-04', status: 'In Progress' },
    { id: 'T-03', title: 'Lost passport report collection', description: 'Collect description of lost passport near Gate C.', assignedTo: 'V-01', status: 'Pending' }
  ]
};

// Sync helper for browser storage
const loadLocalState = () => {
  const data = localStorage.getItem('sg_stadium_state');
  if (data) {
    localState = JSON.parse(data);
  } else {
    localStorage.setItem('sg_stadium_state', JSON.stringify(localState));
  }
  return localState;
};

const saveLocalState = () => {
  localStorage.setItem('sg_stadium_state', JSON.stringify(localState));
};

// Safe request wrapper
async function request(endpoint, options = {}) {
  try {
    const url = `${STATUS_API_BASE}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`⚠️ Backend unavailable. Falling back to local storage simulation. (${error.message})`);
    return handleClientFallback(endpoint, options);
  }
}

// Client-side simulated controllers (Matches backend behavior)
function handleClientFallback(endpoint, options) {
  loadLocalState();
  const body = options.body ? JSON.parse(options.body) : null;
  const method = options.method || 'GET';

  if (endpoint === '/' && method === 'GET') {
    return localState;
  }

  if (endpoint === '/incident' && method === 'POST') {
    const newInc = {
      id: `INC-${100 + localState.incidents.length + 1}`,
      category: body.category,
      location: body.location,
      description: body.description,
      status: 'Active',
      reportedBy: body.reportedBy || 'Fan-Anonymous',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      priority: 'Medium'
    };
    localState.incidents.unshift(newInc);
    saveLocalState();
    return { message: 'Incident reported.', incident: newInc };
  }

  if (endpoint.startsWith('/incident/') && method === 'PUT') {
    const id = endpoint.split('/').pop();
    const inc = localState.incidents.find(i => i.id === id);
    if (inc) {
      if (body.status) inc.status = body.status;
      if (body.priority) inc.priority = body.priority;
      if (body.suggestedActions) inc.suggestedActions = body.suggestedActions;
      if (body.staffNeeded) inc.staffNeeded = body.staffNeeded;
      saveLocalState();
      return { message: 'Incident updated.', incident: inc };
    }
  }

  if (endpoint === '/lost-and-found' && method === 'POST') {
    const newLF = {
      id: `LF-${String(localState.lostAndFound.length + 1).padStart(2, '0')}`,
      item: body.item,
      description: body.description,
      category: body.category,
      locationFound: body.locationFound || 'Info Desk',
      status: body.status || 'Found',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    localState.lostAndFound.unshift(newLF);
    saveLocalState();
    return { message: 'Lost item added.', item: newLF };
  }

  if (endpoint === '/maintenance' && method === 'POST') {
    const newMaint = {
      id: `MNT-${200 + localState.maintenanceTickets.length + 1}`,
      details: body.details,
      location: body.location,
      priority: body.priority || 'Medium',
      etaMinutes: body.etaMinutes || 20,
      allocatedTeam: body.allocatedTeam || 'Cleaning Squad',
      justification: body.justification || 'Logged in queue.',
      status: 'Assigned',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
    localState.maintenanceTickets.unshift(newMaint);
    saveLocalState();
    return { message: 'Maintenance report registered.', ticket: newMaint };
  }

  if (endpoint.startsWith('/task/') && method === 'PUT') {
    const id = endpoint.split('/').pop();
    const task = localState.volunteerTasks.find(t => t.id === id);
    if (task) {
      task.status = body.status;
      saveLocalState();
      return { message: 'Task status updated.', task };
    }
  }

  if (endpoint === '/emergency' && method === 'POST') {
    localState.matchInfo.emergencyAlert = body.message || null;
    saveLocalState();
    return { message: 'Emergency broadcast state set.', matchInfo: localState.matchInfo };
  }

  throw new Error(`Endpoint fallback not found: ${method} ${endpoint}`);
}

// Exportable API services
export const ApiService = {
  getStatus: () => request('/'),
  reportIncident: (data) => request('/incident', { method: 'POST', body: JSON.stringify(data) }),
  updateIncident: (id, data) => request(`/incident/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  reportLostFound: (data) => request('/lost-and-found', { method: 'POST', body: JSON.stringify(data) }),
  reportMaintenance: (data) => request('/maintenance', { method: 'POST', body: JSON.stringify(data) }),
  updateVolunteerTask: (id, status) => request(`/task/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  broadcastEmergency: (message) => request('/emergency', { method: 'POST', body: JSON.stringify({ message }) })
};

// AI assistant APIs - if backend is down, calls local logic mimicking responses
export const AiService = {
  askMatchAssistant: async (query, chatHistory = []) => {
    try {
      const response = await fetch(`${AI_API_BASE}/match-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, chatHistory })
      });
      return (await response.json()).reply;
    } catch {
      // Simulate client-side Match Assistant
      return simulateClientAIResponse('match-assistant', { query });
    }
  },
  
  translateText: async (text, targetLanguage) => {
    try {
      const response = await fetch(`${AI_API_BASE}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage })
      });
      return (await response.json()).translatedText;
    } catch {
      return simulateClientAIResponse('translate', { text, targetLanguage });
    }
  },

  getIncidentSummary: async (description, category) => {
    try {
      const response = await fetch(`${AI_API_BASE}/incident-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, category })
      });
      return (await response.json()).summaryData;
    } catch {
      return simulateClientAIResponse('incident-summary', { description, category });
    }
  },

  getMaintenancePriority: async (details) => {
    try {
      const response = await fetch(`${AI_API_BASE}/priority`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details })
      });
      return (await response.json()).priorityData;
    } catch {
      return simulateClientAIResponse('priority', { details });
    }
  },

  getFoodRecommendation: async (dietaryPreference, crowdDensity = 'Medium', gatesOccupancy = '') => {
    try {
      const response = await fetch(`${AI_API_BASE}/food-recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dietaryPreference, crowdDensity, gatesOccupancy })
      });
      return (await response.json()).recommendation;
    } catch {
      return simulateClientAIResponse('food-recommendation', { dietaryPreference, crowdDensity });
    }
  },

  getTransitEco: async (destination, preference, gateLoad = '') => {
    try {
      const response = await fetch(`${AI_API_BASE}/transit-eco`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, preference, gateLoad })
      });
      return (await response.json()).recommendation;
    } catch {
      return simulateClientAIResponse('transit-eco', { destination, preference });
    }
  }
};

// Client-side AI heuristic responders for pure offline / static hosts
function simulateClientAIResponse(type, params) {
  if (type === 'match-assistant') {
    const q = params.query.toLowerCase();
    if (q.includes('seat') || q.includes('find') || q.includes('ticket')) {
      return "To locate your seat, follow the color indicators on your digital ticket. For step-free access, Gate D is nearby. Stewards are available at all concourse portals.";
    }
    if (q.includes('exit') || q.includes('gate') || q.includes('egress')) {
      return "Gate A is currently very busy (90% capacity). If you are leaving, we suggest using Gate B (35% capacity) or Gate C (60% capacity).";
    }
    if (q.includes('food') || q.includes('eat') || q.includes('water')) {
      return "Alamo Tacos (FC-1) is 12 mins. Golden Goal Greens (FC-3) is only 5 mins and offers vegan selections.";
    }
    if (q.includes('emergency') || q.includes('help') || q.includes('sos')) {
      return "If there is an emergency, press the RED emergency SOS button at the bottom of the page to alert stadium security immediately.";
    }
    return "I am the StadiumGenie Match Assistant. Ask me about queue times, concession options, seat mapping, or emergency assistance.";
  }

  if (type === 'translate') {
    const lang = params.targetLanguage;
    const text = params.text;
    const translations = {
      'Spanish': {
        'where is the nearest restroom?': '¿Dónde está el baño más cercano?',
        'gate a is currently full. please enter through gate b.': 'La puerta A está llena en este momento. Por favor ingrese por la puerta B.',
        'emergency alert: please remain calm and follow staff instructions.': 'Alerta de emergency: por favor mantenga la calma y siga las instrucciones.',
        'thank you for visiting stadiumgenie!': '¡Gracias por visitar StadiumGenie!'
      },
      'French': {
        'where is the nearest restroom?': 'Où se trouvent les toilettes les plus proches?',
        'gate a is currently full. please enter through gate b.': 'La porte A est actuellement pleine. Veuillez entrer par la porte B.',
        'emergency alert: please remain calm and follow staff instructions.': 'Alerte d\'urgence: veuillez rester calme et suivre les instructions.',
        'thank you for visiting stadiumgenie!': 'Merci d\'avoir visité StadiumGenie!'
      }
    };
    const cleanText = text.toLowerCase().trim();
    if (translations[lang] && translations[lang][cleanText]) {
      return translations[lang][cleanText];
    }
    return `[${lang}]: ${text} (AI offline translation)`;
  }

  if (type === 'incident-summary') {
    const d = params.description.toLowerCase();
    let priority = 'Medium';
    let actions = ['Verify location cameras', 'Log incident details', 'Deploy concourse stewards'];
    let staff = 'Concourse Stewards';
    let summary = `Reported ${params.category} incident under observation.`;

    if (d.includes('fight') || d.includes('smoke') || d.includes('fire')) {
      priority = 'High';
      actions = ['Deploy tactical security team', 'Clear exit portal pathing', 'Broadcasting safety instructions'];
      staff = 'Security Incident Team';
      summary = `Critical hazard reported in concourse zone.`;
    }
    return { summary, priority, suggestedActions: actions, staffNeeded: staff };
  }

  if (type === 'priority') {
    const d = params.details.toLowerCase();
    let priority = 'Medium';
    let eta = 20;
    let team = 'Facilities Squad';
    let justification = 'Reported ticket logged for priority attention.';

    if (d.includes('scanner') || d.includes('turnstile') || d.includes('gate')) {
      priority = 'Critical';
      eta = 10;
      team = 'IT Access Control';
      justification = 'Scanner failure causes queue bottlenecks and crowd pileups.';
    } else if (d.includes('spill') || d.includes('glass') || d.includes('leak')) {
      priority = 'High';
      eta = 15;
      team = 'Cleaning Rapid Response';
      justification = 'Slip or puncture hazard present in common guest corridors.';
    }
    return { priority, etaMinutes: eta, allocatedTeam: team, justification };
  }

  if (type === 'food-recommendation') {
    const pref = params.dietaryPreference.toLowerCase();
    if (pref.includes('vegan') || pref.includes('salad')) {
      return 'Golden Goal Greens (FC-3) is highly recommended. Fast 5-minute wait time, salad bowl options, located near Gate C corridor.';
    }
    return 'Strikers Burgers (FC-2) has a 25-minute wait. Alamo Tacos (FC-1) is closer and is only a 12-minute wait.';
  }

  if (type === 'transit-eco') {
    const pref = params.preference.toLowerCase();
    if (pref.includes('metro')) {
      return `Take Metro Line 2 from Gate B station to ${params.destination} (Est: 22 mins). 🌲 Eco Tip: Choosing public transit reduces greenhouse gases by 85% compared to taxis.`;
    }
    if (pref.includes('shuttle') || pref.includes('bus')) {
      return `Board the electric shuttle from Gate C terminal to ${params.destination} (Est: 18 mins). 🌲 Eco Tip: Shuttle pooling helps stadium clean air initiatives.`;
    }
    return `Use Rideshare Gate D pickup terminal for transport to ${params.destination} (Est: 30 mins). 🌲 Eco Tip: Selecting rideshare pool reduces surrounding concourse traffic.`;
  }
}
