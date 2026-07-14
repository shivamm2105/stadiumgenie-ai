import { genAI, isMockAI } from '../config/geminiConfig.js';

/**
 * AI Match Assistant
 */
export async function getMatchAssistantResponse(query, chatHistory = []) {
  const systemPrompt = `You are StadiumGenie AI Match Assistant for the FIFA World Cup 2026.
You are helping fans in the stadium with real-time queries, seating navigation, rules, matches, and stadium amenities.
Be welcoming, concise, clear, and prioritize stadium safety and accessibility.
Assume the current match is Mexico vs. USA, and the stadium is equipped with gates A, B, C, D (D is wheelchair accessible).
Keep response under 4 sentences.`;

  if (isMockAI) {
    return simulateMatchAssistant(query);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `${systemPrompt}\n\nChat History:\n${JSON.stringify(chatHistory)}\n\nFan Query: ${query}\nAssistant:`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini API Error (Match Assistant):', error);
    return simulateMatchAssistant(query) + ' (Fallback)';
  }
}

/**
 * AI Multilingual Translator
 */
export async function getTranslation(text, targetLanguage) {
  const systemPrompt = `You are a real-time translator at the FIFA World Cup 2026.
Translate the text exactly into ${targetLanguage}. Maintain a polite, helpful tone for stadium visitors. Only output the translated text.`;

  if (isMockAI) {
    return simulateTranslation(text, targetLanguage);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `${systemPrompt}\nText to translate: "${text}"\nTranslation:`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini API Error (Translator):', error);
    return simulateTranslation(text, targetLanguage) + ' (Fallback)';
  }
}

/**
 * AI Incident Summary & Emergency Response
 */
export async function getIncidentSummaryAndResponse(incidentDescription, category) {
    const systemPrompt = `You are a Senior AI Emergency Decision Support Agent in the Stadium Operations Center for the FIFA World Cup 2026.
Analyze the following safety incident details. Output ONLY a valid JSON object matching the schema below. Do not wrap the JSON output in markdown block tick codes (e.g., do not output \`\`\`json).

Required JSON format:
{
  "summary": "Brief 1-sentence technical operational summary of the incident.",
  "priority": "High, Medium, or Low based on safety and crowd flow impact.",
  "suggestedActions": ["Step 1 dispatch check", "Step 2 security/medic task", "Step 3 egress safety directive"],
  "staffNeeded": "Specify exactly which staff/responder roles are required (e.g., Security Squad B, Paramedics, concourse stewards)."
}`;

  if (isMockAI) {
    return simulateIncidentAnalysis(incidentDescription, category);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });
    const prompt = `${systemPrompt}\nIncident details: ${incidentDescription}\nCategory: ${category}\nJSON Output:`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text().trim());
  } catch (error) {
    console.error('Gemini API Error (Incident Solver):', error);
    return simulateIncidentAnalysis(incidentDescription, category);
  }
}

/**
 * AI Maintenance & Cleaning Sorter
 */
export async function getPriorityScore(reportDetails) {
  const systemPrompt = `You are the Lead AI Facilities Coordinator for the stadium during the FIFA World Cup 2026.
Evaluate the reported maintenance/cleaning ticket details. Output ONLY a valid JSON object matching the schema below. Do not wrap the JSON output in markdown block ticks.

Required JSON format:
{
  "priority": "Critical, High, Medium, or Low based on physical hazard, block of ingress/egress, or sanitation risk.",
  "etaMinutes": 15,
  "allocatedTeam": "Name of the target department (e.g., Cleaning Crew, IT Operations, Plumbing, Electrical, General Facilities).",
  "justification": "Brief 1-sentence explanation matching the assigned priority level."
}`;

  if (isMockAI) {
    return simulateMaintenancePriority(reportDetails);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });
    const prompt = `${systemPrompt}\nTicket description: ${reportDetails}\nJSON Output:`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text().trim());
  } catch (error) {
    console.error('Gemini API Error (Maintenance Sorter):', error);
    return simulateMaintenancePriority(reportDetails);
  }
}

/**
 * AI Food & Route Smart Recommendation
 */
export async function getFoodQueueRecommendation(dietaryPreference, crowdDensity, gatesOccupancy) {
  const systemPrompt = `You are the lead StadiumGenie AI Food & Concourse Logistics Planner.
Recommend the optimal dining concessions and route selections based on:
- Dietary preferences specified: ${dietaryPreference}
- Current crowd density: ${crowdDensity}
- Live gate queues: ${gatesOccupancy}

Provide a polite, tailored dining recommendation, suggest concession wait times matching menu targets, and specify an optimal route to bypass high-occupancy gate corridors. Keep the response under 3 sentences.`;

  if (isMockAI) {
    return simulateFoodRecommendation(dietaryPreference, crowdDensity);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(systemPrompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini API Error (Food Rec):', error);
    return simulateFoodRecommendation(dietaryPreference, crowdDensity) + ' (Fallback)';
  }
}

// ==========================================
// SIMULATORS (MOCK AI FALLBACK ENGINE)
// ==========================================

function simulateMatchAssistant(query) {
  const q = query.toLowerCase();
  if (q.includes('seat') || q.includes('find') || q.includes('ticket')) {
    return "To locate your seat, follow the colored signs matching your ticket zone. If you need accessibility access, Gate D offers step-free entry directly to lower-tier seating. Stewards are stationed at each concourse gate to scan and guide you.";
  }
  if (q.includes('exit') || q.includes('gate') || q.includes('egress')) {
    return "Gate A is currently experiencing high load (90% capacity). If exiting, we highly suggest using Gate B (35% load) or Gate C (60% load). For emergency egress, follow the green illuminated directional exit signs.";
  }
  if (q.includes('food') || q.includes('eat') || q.includes('beer') || q.includes('water')) {
    return "Alamo Tacos (FC-1) has a current wait time of 12 minutes, while Strikers Burgers (FC-2) is at 25 minutes. If you want a quick option, Golden Goal Greens (FC-3) has a wait time of under 5 minutes and offers fresh salads and water.";
  }
  if (q.includes('toilet') || q.includes('restroom') || q.includes('washroom')) {
    return "Restrooms are located near every concourse portal. Restrooms near Gate B are currently clear, while Level 2 Block B is undergoing brief maintenance. Please use the block near Section 118 for shorter lines.";
  }
  if (q.includes('emergency') || q.includes('help') || q.includes('police') || q.includes('doctor') || q.includes('sos')) {
    return "If you have an immediate safety emergency, press the SOS button to report your location to the Control Center. Medical Desks are available at Gate A and Gate C, and mobile first-aid responders are patrolling the lower concourse.";
  }
  return "Welcome to the FIFA World Cup 2026! Currently, Mexico and USA are gearing up for kickoff in 45 minutes. I can assist you with queue times, accessible routes, food recommendations, and emergency exits. What can I help you find?";
}

function simulateTranslation(text, targetLanguage) {
  const languageSamples = {
    'Spanish': {
      'where is the nearest restroom?': '¿Dónde está el baño más cercano?',
      'gate a is currently full. please enter through gate b.': 'La puerta A está llena en este momento. Por favor ingrese por la puerta B.',
      'emergency alert: please remain calm and follow staff instructions.': 'Alerta de emergencia: por favor mantenga la calma y siga las instrucciones del personal.',
      'thank you for visiting stadiumgenie!': '¡Gracias por visitar StadiumGenie!'
    },
    'French': {
      'where is the nearest restroom?': 'Où se trouvent les toilettes les plus proches?',
      'gate a is currently full. please enter through gate b.': 'La porte A est actuellement pleine. Veuillez entrer par la porte B.',
      'emergency alert: please remain calm and follow staff instructions.': 'Alerte d\'urgence: veuillez rester calme et suivre les instructions du personnel.',
      'thank you for visiting stadiumgenie!': 'Merci d\'avoir visité StadiumGenie!'
    },
    'German': {
      'where is the nearest restroom?': 'Wo ist die nächste Toilette?',
      'gate a is currently full. please enter through gate b.': 'Tor A ist derzeit voll. Bitte gehen Sie durch Tor B.',
      'emergency alert: please remain calm and follow staff instructions.': 'Notfallalarm: Bitte bleiben Sie ruhig und befolgen Sie die Anweisungen des Personals.',
      'thank you for visiting stadiumgenie!': 'Vielen Dank für Ihren Besuch bei StadiumGenie!'
    },
    'Arabic': {
      'where is the nearest restroom?': 'أين يقع أقرب مرحاض؟',
      'gate a is currently full. please enter through gate b.': 'البوابة أ ممتلئة حاليًا. يرجى الدخول من البوابة ب.',
      'emergency alert: please remain calm and follow staff instructions.': 'تنبيه طوارئ: يرجى الحفاظ على الهدوء واتباع تعليمات الموظفين.',
      'thank you for visiting stadiumgenie!': 'شكراً لزيارتكم ستاديوم جيني!'
    }
  };

  const cleanText = text.toLowerCase().trim();
  const lang = targetLanguage.trim();
  
  if (languageSamples[lang] && languageSamples[lang][cleanText]) {
    return languageSamples[lang][cleanText];
  }
  
  // Generic translator simulator fallback
  switch (lang) {
    case 'Spanish': return `[Spanish] Traducción de: "${text}"`;
    case 'French': return `[French] Traduction de: "${text}"`;
    case 'German': return `[German] Übersetzung für: "${text}"`;
    case 'Arabic': return `[Arabic] ترجمة لـ: "${text}"`;
    case 'Portuguese': return `[Portuguese] Tradução de: "${text}"`;
    case 'Japanese': return `[Japanese] 翻訳: "${text}"`;
    default: return `[Translated to ${lang}]: ${text}`;
  }
}

function simulateIncidentAnalysis(description, category) {
  const d = description.toLowerCase();
  let priority = 'Medium';
  let actions = [
    'Assess incident scope and dispatch supervisors.',
    'Log details in operations ledger.',
    'Monitor area cameras.'
  ];
  let staff = 'Concourse Stewards';
  let summary = `Report regarding ${category} filed at localized zone.`;

  if (d.includes('fight') || d.includes('smoke') || d.includes('fire') || d.includes('blocked exit') || d.includes('panic')) {
    priority = 'High';
    summary = `Critical ${category} emergency involving potential crowd hazard.`;
    actions = [
      'Dispatch rapid-response security squad to location.',
      'Initiate crowd diversion protocols near adjacent exit lines.',
      'Provide loudspeaker guidance for crowd calming.'
    ];
    staff = 'Security Rapid Response + Emergency Medical';
  } else if (d.includes('medical') || d.includes('injured') || d.includes('collapsed') || d.includes('breathing')) {
    priority = 'High';
    summary = `Medical emergency requiring swift ambulance/first-aid arrival.`;
    actions = [
      'Dispatch nearest mobile first-aid volunteer with stretcher.',
      'Clear accessibility path for paramedic vehicle entry.',
      'Inform regional control booth supervisor.'
    ];
    staff = 'Gate A Medical Responders + Volunteer Escort';
  } else if (d.includes('leak') || d.includes('spill') || d.includes('toilet') || d.includes('flood') || d.includes('water')) {
    priority = 'Low';
    summary = `Facility maintenance alert regarding localized fluid leak.`;
    actions = [
      'Alert sanitation team and dispatch plumber.',
      'Place slip-warning cones in the wet areas.',
      'Verify water isolator valve status.'
    ];
    staff = 'Plumbing Maintenance Team';
  }

  return {
    summary,
    priority,
    suggestedActions: actions,
    staffNeeded: staff
  };
}

function simulateMaintenancePriority(details) {
  const d = details.toLowerCase();
  let priority = 'Medium';
  let eta = 30;
  let team = 'Facilities General';
  let justification = 'Standard operational work order assigned for scheduling.';

  if (d.includes('glass') || d.includes('wire') || d.includes('shock') || d.includes('slip') || d.includes('flood')) {
    priority = 'High';
    eta = 15;
    team = 'Safety & Maintenance Crew';
    justification = 'High safety slip/injury hazard in public concourse corridors.';
  } else if (d.includes('turnstile') || d.includes('scanner') || d.includes('gate') || d.includes('lock')) {
    priority = 'Critical';
    eta = 10;
    team = 'IT Operations / Hardware Support';
    justification = 'Restricts entry flow at security checkpoints, causing gate bottlenecks.';
  } else if (d.includes('trash') || d.includes('dirty') || d.includes('smell') || d.includes('spill')) {
    priority = 'Low';
    eta = 20;
    team = 'Cleaning Services';
    justification = 'Esthetic maintenance item, posing minimal hazard to crowd movement.';
  }

  return {
    priority,
    etaMinutes: eta,
    allocatedTeam: team,
    justification
  };
}

function simulateFoodRecommendation(preference, crowdDensity) {
  const p = preference.toLowerCase();
  if (p.includes('vegan') || p.includes('veg') || p.includes('salad')) {
    return 'We highly recommend Golden Goal Greens (FC-3), offering fresh vegan wraps and salads with a fast 5-minute wait time. Access it via the East Concourse ramp to bypass crowds near the gate portals.';
  }
  if (p.includes('taco') || p.includes('mexican') || p.includes('spicy')) {
    return 'Head over to Alamo Tacos (FC-1) for premium street tacos. The queue is currently 12 minutes, but you can avoid congestion by taking the outer corridor rather than the main gate entry.';
  }
  return 'Strikers Burger Joint (FC-2) offers high-quality stadium burgers with a 25-minute wait. For a faster option with shorter lines, Alamo Tacos (FC-1) is nearby with a 12-minute wait and great menu options.';
}

/**
 * AI Transit & Eco Planner
 */
export async function getTransitEcoRecommendation(destination, preference, gateLoad = 'Gate A: 90%, Gate B: 35%') {
  const systemPrompt = `You are StadiumGenie AI Transit & Sustainability Coordinator for the FIFA World Cup 2026.
Recommend the optimal transportation plan to "${destination}" using "${preference}" considering gate load is "${gateLoad}".
Provide:
1. Recommended transit route & estimated travel time.
2. An eco-friendly travel tip to lower carbon footprint.
Keep the total response under 3 sentences. Be precise.`;

  if (isMockAI) {
    return simulateTransitEco(destination, preference);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(systemPrompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini API Error (Transit/Eco):', error);
    return simulateTransitEco(destination, preference) + ' (Fallback)';
  }
}

function simulateTransitEco(destination, preference) {
  const pref = preference.toLowerCase();
  if (pref.includes('metro') || pref.includes('train')) {
    return `Take Metro Line 2 from Gate B station directly to ${destination} (Est. Time: 22 mins). 🌲 Sustainability Tip: Opting for rail transit reduces your personal travel emissions by 85% compared to solo rideshares.`;
  }
  if (pref.includes('shuttle') || pref.includes('bus')) {
    return `Board the zero-emission electric Stadium Shuttle at Concourse Block C to ${destination} (Est. Time: 18 mins). 🌲 Sustainability Tip: Electric bus transit helps eliminate local particulate matter pollution around the tournament facilities.`;
  }
  return `Use the designated rideshare pickup terminal at Gate D to navigate towards ${destination} (Est. Time: 30 mins). 🌲 Sustainability Tip: Consider selecting the 'Pool' or 'Eco' options inside your app to minimize congestions and greenhouse gases.`;
}
