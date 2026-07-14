// Simulated Live FIFA World Cup 2026 Data

export const mockGates = [
  { id: 'Gate A', label: 'Gate A (North Entrance)', occupancy: 90, status: 'Critical', coordinator: 'Sarah Jenkins' },
  { id: 'Gate B', label: 'Gate B (South Entrance)', occupancy: 35, status: 'Normal', coordinator: 'Marcus Aurelius' },
  { id: 'Gate C', label: 'Gate C (East Entrance)', occupancy: 60, status: 'Moderate', coordinator: 'Elena Rostova' },
  { id: 'Gate D', label: 'Gate D (West VIP/Accessibility)', occupancy: 15, status: 'Normal', coordinator: 'Kenji Sato' }
];

export const mockParking = [
  { id: 'Parking A', label: 'Parking Lot A', capacity: 1500, occupied: 1200, status: '80% Full' },
  { id: 'Parking B', label: 'Parking Lot B', capacity: 2000, occupied: 1900, status: '95% Full' },
  { id: 'Parking C', label: 'Parking Lot C', capacity: 1000, occupied: 1000, status: 'Full' },
  { id: 'Parking D', label: 'Parking Lot D (Accessible)', capacity: 500, occupied: 110, status: '22% Full' }
];

export const mockFoodCourts = [
  { id: 'FC-1', name: 'Alamo Tacos & Grill', queueMinutes: 12, items: ['Tacos', 'Nachos', 'Soda'], busyLevel: 'Medium' },
  { id: 'FC-2', name: 'Strikers Burger Joint', queueMinutes: 25, items: ['Burgers', 'Fries', 'Beer'], busyLevel: 'High' },
  { id: 'FC-3', name: 'Golden Goal Greens', queueMinutes: 5, items: ['Salads', 'Wraps', 'Vegan Bowls'], busyLevel: 'Low' },
  { id: 'FC-4', name: 'Maracanã Coffee & Pastry', queueMinutes: 8, items: ['Coffee', 'Croissants', 'Esfihas'], busyLevel: 'Low' }
];

export const mockIncidents = [
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
];

export const mockLostAndFound = [
  { id: 'LF-01', item: 'Black leather wallet', description: 'Contains Texas driver\'s license and matching bank cards', category: 'Wallet/ID', locationFound: 'Section 104 Row M', status: 'Found', dateAdded: '2026-07-14' },
  { id: 'LF-02', item: 'iPhone 15 Pro Max', description: 'Blue titanium finish, clear MagSafe case, Lock screen shows a dog', category: 'Electronics', locationFound: 'Food Court 2', status: 'Found', dateAdded: '2026-07-14' },
  { id: 'LF-03', item: 'Kids FIFA scarf', description: 'Red and green scarf with World Cup 2026 logo printed on sides', category: 'Apparel', locationFound: 'Seat 12 Row A', status: 'Found', dateAdded: '2026-07-14' }
];

export const mockVolunteers = [
  { id: 'V-01', name: 'Carlos Gomez', languages: ['English', 'Spanish', 'Portuguese'], location: 'Gate A Info Desk', status: 'Available' },
  { id: 'V-02', name: 'Yuki Tanaka', languages: ['Japanese', 'English'], location: 'Section 120 Concourse', status: 'On Break' },
  { id: 'V-03', name: 'Fatima Al-Sayed', languages: ['Arabic', 'French', 'English'], location: 'Gate D (Accessibility Desk)', status: 'Busy' },
  { id: 'V-04', name: 'Pierre Dubois', languages: ['French', 'English', 'German'], location: 'Mobile Roving Team B', status: 'Available' }
];

export const mockMatchInfo = {
  teams: { home: 'Mexico', away: 'USA' },
  venue: 'Azteca Stadium / Estadio Monterrey / MetLife Stadium (FIFA 2026 Host)',
  timeToKickoff: 45, // in minutes
  weather: '72°F Clear, Humidity 45%',
  attendanceSimulated: 78500,
  emergencyAlert: null // Can be set dynamically
};
