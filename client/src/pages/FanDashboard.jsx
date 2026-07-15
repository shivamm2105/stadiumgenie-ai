import React, { useState } from 'react';
import { useStadiumState } from '../hooks/useStadiumState';
import { useAccessibility } from '../hooks/useAccessibility';
import { AiService, ApiService } from '../services/api';
import { TRANSIT_PREFERENCES, DIETARY_PREFERENCES } from '../constants/stadiumConstants';
import GlassCard from '../components/GlassCard';
import { 
  Send, Compass, AlertOctagon, Utensils, 
  Clock, ShieldAlert, Sparkles, Navigation 
} from 'lucide-react';


export default function FanDashboard() {
  const { gates, foodCourts, refreshState } = useStadiumState();
  const { handleSpeakHover } = useAccessibility();

  // Chatbot State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your AI Match Assistant. Ask me anything about tickets, seating, gate queues, or dining menus!' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Food recommendation state
  const [dietary, setDietary] = useState('None');
  const [foodRec, setFoodRec] = useState('');
  const [foodLoading, setFoodLoading] = useState(false);
  const [foodError, setFoodError] = useState(false);

  // Navigation Pathfinder State
  const [navTarget, setNavTarget] = useState(null); // 'gate-a', 'gate-b', 'restroom', 'food-court', 'accessibility'
  const [sosStatus, setSosStatus] = useState(false);

  // Transit & Sustainability state
  const [transitDest, setTransitDest] = useState('');
  const [transitPref, setTransitPref] = useState('Metro');
  const [transitRec, setTransitRec] = useState('');
  const [transitLoading, setTransitLoading] = useState(false);
  const [transitError, setTransitError] = useState(false);

  // Send message to AI chatbot
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const history = chatMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
      const reply = await AiService.askMatchAssistant(userMessage, history);
      setChatMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I am having trouble connecting to the network right now.', error: true }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleRetrySendMessage = async () => {
    const userMsgs = chatMessages.filter(m => m.role === 'user');
    if (userMsgs.length === 0) return;
    const lastUserMsg = userMsgs[userMsgs.length - 1].text;
    
    setChatMessages(prev => prev.filter((_, idx) => idx !== prev.length - 1));
    setChatLoading(true);

    try {
      const history = chatMessages.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
      const reply = await AiService.askMatchAssistant(lastUserMsg, history);
      setChatMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I am having trouble connecting to the network right now.', error: true }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Get food recommendation
  const handleGetFoodRec = async () => {
    setFoodLoading(true);
    setFoodError(false);
    setFoodRec('');
    try {
      const rec = await AiService.getFoodRecommendation(dietary, 'High', 'Gate A: 90%, Gate B: 35%');
      setFoodRec(rec);
    } catch {
      setFoodError(true);
      setFoodRec('Failed to retrieve recommendation. Please check your connection.');
    } finally {
      setFoodLoading(false);
    }
  };

  // Get transit recommendation
  const handleGetTransitEco = async (e) => {
    if (e) e.preventDefault();
    if (!transitDest.trim() || transitLoading) return;
    setTransitLoading(true);
    setTransitError(false);
    setTransitRec('');
    try {
      const rec = await AiService.getTransitEco(transitDest, transitPref, 'Gate A: 90%, Gate B: 35%');
      setTransitRec(rec);
    } catch {
      setTransitError(true);
      setTransitRec('Failed to fetch transit recommendation. Please try again.');
    } finally {
      setTransitLoading(false);
    }
  };

  // Emergency SOS Trigger
  const triggerSOS = async () => {
    setSosStatus(true);
    try {
      await ApiService.reportIncident({
        category: 'Medical',
        location: 'Fan Seating Section 104 (SOS Trigger)',
        description: 'CRITICAL EMERGENCY: Fan pressed SOS button from mobile dashboard. Direct path clearance suggested.',
        reportedBy: 'Fan-SOS'
      });
      refreshState();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Title block */}
      <div className="lg:col-span-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <Compass className="text-emerald-800 dark:text-fifa-emerald w-7 h-7" aria-hidden="true" /> Fan Companion Portal
          </h1>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Real-time guidance, queue predictions, and interactive Gemini assistants.
          </p>
        </div>

        {/* SOS Button */}
        <button
          onClick={triggerSOS}
          onMouseEnter={(e) => handleSpeakHover(e, "Trigger medical emergency SOS report")}
          disabled={sosStatus}
          aria-label={sosStatus ? 'Emergency Staff Notified' : 'SOS Emergency Help'}
          title={sosStatus ? 'Emergency Staff Notified' : 'SOS Emergency Help'}
          className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all focus:ring-4 focus:ring-red-400 ${
            sosStatus 
              ? 'bg-emerald-600 text-white cursor-default' 
              : 'bg-fifa-red hover:bg-red-700 text-white cursor-pointer hover:scale-105 active:scale-95'
          }`}
        >
          <ShieldAlert className="w-5 h-5 animate-pulse" aria-hidden="true" />
          {sosStatus ? 'Emergency Staff Notified' : 'SOS Emergency Help'}
        </button>
      </div>

      {/* SOS Alert Egress visualizer if triggered */}
      {sosStatus && (
        <div className="lg:col-span-12">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertOctagon className="w-10 h-10 text-fifa-red animate-bounce" />
              <div>
                <h3 className="font-extrabold text-fifa-red text-base">Emergency SOS Broadcast Activated!</h3>
                <p className="text-sm dark:text-slate-300 text-slate-700 leading-relaxed">
                  Medical and security personnel are routing to Seating Section 104. Please remain calm. 
                  <strong> Recommended Egress Path:</strong> Follow green arrows towards Gate B.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSosStatus(false)}
              aria-label="Clear SOS status"
              title="Clear SOS status"
              className="text-xs font-bold text-slate-200 hover:text-white bg-slate-800/80 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-fifa-gold"
            >
              Clear SOS
            </button>
          </div>
        </div>
      )}

      {/* Left Column: Pathfinder Map & Queues (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Interactive Pathfinder Visualizer */}
        <GlassCard className="overflow-hidden">
          <h2 className="text-base font-bold mb-4 flex items-center gap-2 dark:text-white">
            <Navigation className="text-fifa-blue dark:text-blue-400 w-5 h-5" aria-hidden="true" /> Interactive Stadium Navigator
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
            Select a target below to highlight the safest, most accessible paths from your seat:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {[
              { id: 'gate-b', label: 'Gate B (Clear Entrance)' },
              { id: 'gate-a', label: 'Gate A (High Occupancy)' },
              { id: 'food-court', label: 'Food Concourse' },
              { id: 'accessibility', label: 'Wheelchair Ramp D' }
            ].map(target => (
              <button
                key={target.id}
                onClick={() => setNavTarget(navTarget === target.id ? null : target.id)}
                aria-pressed={navTarget === target.id}
                aria-label={`Highlight path to ${target.label}`}
                title={`Highlight path to ${target.label}`}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold ${
                  navTarget === target.id
                    ? 'bg-fifa-blue text-white border-fifa-blue'
                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 dark:text-slate-200 text-slate-700'
                }`}
              >
                {target.label}
              </button>
            ))}
          </div>

          {/* SVG Map Layout */}
          <div className="relative w-full aspect-video bg-slate-900/60 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
            <svg 
              viewBox="0 0 400 240" 
              className="w-full h-full max-h-[250px] p-4 text-white"
              role="img"
              aria-label="Interactive visual stadium navigation map showing seating banks, gates, and highlighted paths."
            >
              <title>Interactive Stadium Map Pathfinder</title>
              <desc>Map representing the relative placement of Gate A, Gate B, Gate D wheelchair pathing, food court stands, and seat indicators.</desc>
              {/* Outer boundary */}
              <rect x="10" y="10" width="380" height="220" rx="30" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.15" />
              
              {/* Soccer Field (Center) */}
              <rect x="110" y="70" width="180" height="100" rx="10" fill="green" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
              <line x1="200" y1="70" x2="200" y2="170" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
              <circle cx="200" cy="120" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
              
              {/* Seating Stands */}
              <path d="M 90,50 L 310,50 L 330,20 L 70,20 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
              <path d="M 90,190 L 310,190 L 330,220 L 70,220 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
              
              {/* Gate A (Top Left) */}
              <g className={navTarget === 'gate-a' ? 'text-fifa-red animate-pulse' : 'text-slate-400'}>
                <circle cx="40" cy="40" r="12" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
                <text x="40" y="44" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">A</text>
              </g>
              
              {/* Gate B (Bottom Right) */}
              <g className={navTarget === 'gate-b' ? 'text-fifa-emerald font-bold' : 'text-slate-400'}>
                <circle cx="360" cy="200" r="12" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
                <text x="360" y="204" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">B</text>
              </g>

              {/* Gate D Accessibility (Bottom Left) */}
              <g className={navTarget === 'accessibility' ? 'text-fifa-blue font-bold' : 'text-slate-400'}>
                <circle cx="40" cy="200" r="12" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
                <text x="40" y="204" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">♿</text>
              </g>

              {/* Food Concourse (Top Right) */}
              <g className={navTarget === 'food-court' ? 'text-fifa-gold font-bold' : 'text-slate-400'}>
                <rect x="330" y="30" width="30" height="20" rx="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
                <text x="345" y="44" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">FC</text>
              </g>

              {/* Interactive highlighted routing lines */}
              {navTarget === 'gate-b' && (
                <path d="M 120,120 L 250,120 L 320,160 L 360,200" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="6,4" className="animate-[dash_2s_linear_infinite]" />
              )}
              {navTarget === 'gate-a' && (
                <path d="M 120,120 L 70,100 L 40,40" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeDasharray="6,4" />
              )}
              {navTarget === 'food-court' && (
                <path d="M 120,120 L 250,100 L 300,60 L 330,40" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" strokeDasharray="6,4" />
              )}
              {navTarget === 'accessibility' && (
                <path d="M 120,120 L 80,140 L 40,200" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeDasharray="6,4" />
              )}

              {/* Fan Seat indicator */}
              <circle cx="120" cy="120" r="6" fill="#fbbf24" />
              <text x="120" y="110" textAnchor="middle" fontSize="8" fill="white" fontWeight="semibold">Your Seat (Sec 104)</text>
            </svg>

            {/* Navigation Overlay */}
            <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2.5 py-1 rounded border border-white/10 text-[10px] text-slate-300">
              {navTarget === 'gate-b' && '🟢 Suggested Route: Gate B is clear. Egress time: ~4 mins.'}
              {navTarget === 'gate-a' && '🔴 High Occupancy: Gate A queue is currently ~20 mins. Suggest avoiding.'}
              {navTarget === 'food-court' && '🟡 Route: Alamo Tacos is 12 min queue, Golden Goal Greens is 5 min queue.'}
              {navTarget === 'accessibility' && '🔵 Accessible Route: Flat ramp path directly to accessible Gate D entrance.'}
              {!navTarget && '💡 Click a target above to load visual path directions.'}
            </div>
          </div>
        </GlassCard>

        {/* Live Queue Prediction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Entrance Queue Loads</span>
              <Clock className="w-4 h-4 text-emerald-800 dark:text-fifa-emerald" aria-hidden="true" />
            </div>
            <div className="space-y-2 mt-2">
              {gates.map(gate => (
                <div key={gate.id} className="flex items-center justify-between text-xs">
                  <span className="font-semibold dark:text-slate-300 text-slate-700">{gate.id}</span>
                  <div className="w-24 bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden mx-2">
                    <div 
                      className={`h-full ${gate.occupancy > 80 ? 'bg-fifa-red' : gate.occupancy > 50 ? 'bg-fifa-gold' : 'bg-fifa-emerald'}`} 
                      style={{ width: `${gate.occupancy}%` }} 
                    />
                  </div>
                  <span className={`font-bold ${gate.occupancy > 80 ? 'text-red-700 dark:text-fifa-red' : 'text-slate-800 dark:text-white'}`}>{gate.occupancy}%</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Food Wait Estimates</span>
              <Utensils className="w-4 h-4 text-amber-900 dark:text-fifa-gold" aria-hidden="true" />
            </div>
            <div className="space-y-2 mt-2">
              {foodCourts.slice(0, 3).map(court => (
                <div key={court.id} className="flex justify-between items-center text-xs">
                  <span className="font-semibold dark:text-slate-300 text-slate-700 truncate max-w-[120px]">{court.name}</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    court.queueMinutes > 20 
                      ? 'bg-red-500/10 text-red-700 dark:text-fifa-red' 
                      : court.queueMinutes > 10 
                      ? 'bg-yellow-500/10 text-amber-900 dark:text-fifa-gold' 
                      : 'bg-emerald-500/10 text-emerald-800 dark:text-fifa-emerald'
                  }`}>
                    {court.queueMinutes} mins wait
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Right Column: AI Assistant & Concession Planner (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Chatbot Companion */}
        <GlassCard className="h-[380px] flex flex-col p-4 justify-between border-fifa-emerald/20">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-fifa-emerald animate-ping" aria-hidden="true" />
              <span className="font-bold text-sm dark:text-white flex items-center gap-1.5">
                AI Match Assistant <Sparkles className="w-4 h-4 text-amber-900 dark:text-fifa-gold fill-fifa-gold" aria-hidden="true" />
              </span>
            </div>
            <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">Powered by Gemini</span>
          </div>

          {/* Messages Viewport */}
          <div className="flex-grow overflow-y-auto space-y-2 px-1 text-xs py-2 scrollbar-thin">
            {chatMessages.map((msg, index) => (
              <div key={index} className="flex flex-col">
                <div 
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    msg.role === 'assistant' 
                      ? 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 mr-auto rounded-tl-none font-semibold' 
                      : 'bg-fifa-blue text-white ml-auto rounded-tr-none font-semibold'
                  }`}
                >
                  {msg.text}
                  {msg.error && (
                    <button
                      type="button"
                      onClick={handleRetrySendMessage}
                      className="mt-2 block bg-fifa-red hover:bg-red-700 text-white font-bold px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider transition-colors"
                    >
                      🔄 Retry Call
                    </button>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="bg-slate-100 dark:bg-white/5 text-slate-500 p-3 rounded-2xl rounded-tl-none mr-auto max-w-[85%] flex items-center gap-2">
                <div className="flex gap-1" aria-hidden="true">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="font-semibold">Gemini is reading...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-200 dark:border-white/10 pt-3">
            <label htmlFor="chat-input" className="sr-only">Ask the AI Match Assistant a question</label>
            <input
              id="chat-input"
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask: 'Where is Gate B?' or 'menus'..."
              aria-label="Message the AI Match Assistant"
              title="Message the AI Match Assistant"
              className="flex-grow bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-fifa-emerald focus:outline-none dark:text-white font-semibold"
            />
            <button
              type="submit"
              aria-label="Send query"
              title="Send query"
              disabled={chatLoading || !chatInput.trim()}
              className="bg-fifa-emerald text-white p-2.5 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </GlassCard>

        {/* AI Food Recommendations */}
        <GlassCard className="p-5 border-fifa-blue/20">
          <h2 className="text-sm font-extrabold mb-3 flex items-center gap-1.5 dark:text-white">
            <Utensils className="text-amber-900 dark:text-fifa-gold w-4 h-4" aria-hidden="true" /> AI Concession Planner
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 font-semibold">
            Select your preferences, and Gemini will find a dining match with short queue estimates.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              {DIETARY_PREFERENCES.map(pref => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setDietary(pref)}
                  aria-pressed={dietary === pref}
                  aria-label={`Select dietary preference: ${pref}`}
                  title={`Select dietary preference: ${pref}`}
                  className={`flex-grow py-1.5 text-xs font-semibold rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold ${
                    dietary === pref
                      ? 'bg-fifa-emerald border-fifa-emerald text-white'
                      : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>

            <button
              onClick={handleGetFoodRec}
              disabled={foodLoading}
              className="w-full bg-fifa-blue hover:bg-blue-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold"
            >
              {foodLoading ? (
                <span>Generating suggestion...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-900 dark:text-fifa-gold" aria-hidden="true" /> Plan Dinner
                </>
              )}
            </button>

            {foodRec && (
              <div className="mt-2 bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-slate-200/50 dark:border-white/10">
                <span className="text-[10px] text-emerald-800 dark:text-fifa-emerald font-bold uppercase tracking-wider block mb-1">
                  {foodError ? 'System Warning' : 'AI Recommendation'}
                </span>
                <p className={`text-xs leading-relaxed font-semibold ${foodError ? 'text-red-700 dark:text-fifa-red font-bold' : 'text-slate-800 dark:text-slate-200'}`}>{foodRec}</p>
                {foodError && (
                  <button
                    type="button"
                    onClick={handleGetFoodRec}
                    className="mt-2 bg-fifa-blue hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] tracking-wide"
                  >
                    🔄 Try Again
                  </button>
                )}
              </div>
            )}
          </div>
        </GlassCard>

        {/* AI Transit & Eco-Advisor */}
        <GlassCard className="p-5 border-fifa-emerald/20">
          <h2 className="text-sm font-extrabold mb-3 flex items-center gap-1.5 dark:text-white">
            <Sparkles className="text-amber-900 dark:text-fifa-gold w-4 h-4 animate-pulse" aria-hidden="true" /> AI Transit & Eco-Advisor
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 font-semibold">
            Get travel planning with eco-friendly metrics to lower surrounding concourse traffic levels.
          </p>

          <form onSubmit={handleGetTransitEco} className="space-y-3.5">
            <div>
              <label htmlFor="transit-dest" className="sr-only">Destination</label>
              <input
                id="transit-dest"
                type="text"
                value={transitDest}
                onChange={(e) => setTransitDest(e.target.value)}
                placeholder="E.g., Airport, Downtown Monterrey, North Hotel Zone"
                aria-label="Enter transit destination address"
                title="Enter transit destination address"
                required
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-fifa-emerald focus:outline-none dark:text-white font-semibold"
              />
            </div>

            <div className="flex gap-2">
              {TRANSIT_PREFERENCES.map(pref => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setTransitPref(pref)}
                  aria-pressed={transitPref === pref}
                  aria-label={`Select transit: ${pref}`}
                  title={`Select transit: ${pref}`}
                  className={`flex-grow py-1.5 text-xs font-semibold rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold ${
                    transitPref === pref
                      ? 'bg-fifa-emerald border-fifa-emerald text-white'
                      : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={transitLoading || !transitDest.trim()}
              className="w-full bg-fifa-blue hover:bg-blue-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold"
            >
              {transitLoading ? (
                <span>Planning route...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-900 dark:text-fifa-gold fill-fifa-gold" aria-hidden="true" /> Plan Transit
                </>
              )}
            </button>

            {transitRec && (
              <div className="mt-2 bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-slate-200/50 dark:border-white/10">
                <span className="text-[10px] text-emerald-800 dark:text-fifa-emerald font-bold uppercase tracking-wider block mb-1">
                  {transitError ? 'System Warning' : 'AI Recommendation & Eco-Tip'}
                </span>
                <p className={`text-xs leading-relaxed font-semibold ${transitError ? 'text-red-700 dark:text-fifa-red font-bold' : 'text-slate-800 dark:text-slate-200'}`}>{transitRec}</p>
                {transitError && (
                  <button
                    type="button"
                    onClick={() => handleGetTransitEco(null)}
                    className="mt-2 bg-fifa-blue hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] tracking-wide"
                  >
                    🔄 Try Again
                  </button>
                )}
              </div>
            )}
          </form>
        </GlassCard>

      </div>
    </div>
  );
}
