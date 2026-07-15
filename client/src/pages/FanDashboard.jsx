import React, { useState, useCallback } from 'react';
import { useStadiumState } from '../hooks/useStadiumState';
import { AiService, ApiService } from '../services/api';
import { TRANSIT_PREFERENCES, DIETARY_PREFERENCES } from '../constants/stadiumConstants';
import GlassCard from '../components/GlassCard';
import { 
  Send, Compass, AlertOctagon, Utensils, 
  Clock, Sparkles, Navigation 
} from 'lucide-react';

/**
 * Localized chat message input form to prevent keystrokes from re-rendering the whole FanDashboard.
 */
const ChatForm = React.memo(function ChatForm({ onSendMessage, chatLoading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || chatLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 dark:border-white/10 pt-3">
      <label htmlFor="chat-input" className="sr-only">Ask the AI Match Assistant a question</label>
      <input
        id="chat-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask: 'Where is Gate B?' or 'menus'..."
        aria-label="Message the AI Match Assistant"
        title="Message the AI Match Assistant"
        className="flex-grow bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-fifa-emerald focus:outline-none dark:text-white font-semibold"
      />
      <button
        type="submit"
        aria-label="Send query"
        title="Send query"
        disabled={chatLoading || !input.trim()}
        className="bg-fifa-emerald text-white p-2.5 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold"
      >
        <Send className="w-4 h-4" aria-hidden="true" />
      </button>
    </form>
  );
});

/**
 * Localized transit planner form to isolate location queries.
 */
const TransitPlannerForm = React.memo(function TransitPlannerForm({ onPlanTransit, transitLoading }) {
  const [dest, setDest] = useState('');
  const [pref, setPref] = useState('Metro');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dest.trim() || transitLoading) return;
    onPlanTransit(dest, pref);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div>
        <label htmlFor="transit-dest" className="sr-only">Destination</label>
        <input
          id="transit-dest"
          type="text"
          value={dest}
          onChange={(e) => setDest(e.target.value)}
          placeholder="E.g., Airport, Downtown Monterrey, North Hotel Zone"
          aria-label="Enter transit destination address"
          title="Enter transit destination address"
          required
          className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-fifa-emerald focus:outline-none dark:text-white font-semibold"
        />
      </div>

      <div className="flex gap-2">
        {TRANSIT_PREFERENCES.map(p => (
          <button
            key={p}
            type="button"
            onClick={() => setPref(p)}
            aria-pressed={pref === p}
            aria-label={`Select transit: ${p}`}
            title={`Select transit: ${p}`}
            className={`flex-grow py-1.5 text-xs font-semibold rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold ${
              pref === p
                ? 'bg-fifa-emerald border-fifa-emerald text-white'
                : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={transitLoading || !dest.trim()}
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
    </form>
  );
});

export default function FanDashboard() {
  const { refreshState } = useStadiumState();

  // Chatbot State
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
  const [transitRec, setTransitRec] = useState('');
  const [transitLoading, setTransitLoading] = useState(false);
  const [transitError, setTransitError] = useState(false);
  const [lastTransit, setLastTransit] = useState({ destination: '', preference: 'Metro' });

  // Send message to AI chatbot
  const handleSendMessage = useCallback(async (userMessage) => {
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
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
  }, [chatMessages]);

  const handleRetrySendMessage = useCallback(async () => {
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
  }, [chatMessages]);

  // Get food recommendation
  const handleGetFoodRec = useCallback(async () => {
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
  }, [dietary]);

  // Get transit recommendation
  const handlePlanTransit = useCallback(async (destination, preference) => {
    setLastTransit({ destination, preference });
    setTransitLoading(true);
    setTransitError(false);
    setTransitRec('');
    try {
      const rec = await AiService.getTransitEco(destination, preference, 'Gate A: 90%, Gate B: 35%');
      setTransitRec(rec);
    } catch {
      setTransitError(true);
      setTransitRec('Failed to fetch transit recommendation. Please try again.');
    } finally {
      setTransitLoading(false);
    }
  }, []);

  // Emergency SOS Trigger
  const triggerSOS = useCallback(async () => {
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
  }, [refreshState]);



  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Title block */}
      <div className="lg:col-span-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <Compass className="text-emerald-800 dark:text-fifa-emerald w-7 h-7" aria-hidden="true" /> Interactive Stadium Navigator
          </h1>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Real-time guidance, queue predictions, and interactive Gemini assistants.
          </p>
        </div>

        {/* SOS Button */}
        <div>
          <button
            onClick={triggerSOS}
            disabled={sosStatus}
            className={`w-full md:w-auto font-display font-black text-xs tracking-wider uppercase px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-red-500/20 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold ${
              sosStatus
                ? 'bg-red-950/40 text-red-400 border border-red-500/20 cursor-not-allowed'
                : 'bg-fifa-red text-white hover:bg-red-600 animate-pulse'
            }`}
          >
            <AlertOctagon className="w-4 h-4" aria-hidden="true" /> {sosStatus ? 'SOS Alert Dispatched' : 'SOS Emergency Help'}
          </button>
        </div>
      </div>

      {sosStatus && (
        <div className="lg:col-span-12" role="alert">
          <div className="glass-panel border-red-500/30 bg-red-500/10 p-4 rounded-2xl text-xs text-red-700 dark:text-red-300 flex justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" aria-hidden="true" />
              Emergency SOS Broadcast Activated: Security team has pinpointed Section 104 ADA deck. Clear standard pathways.
            </div>
            <button
              onClick={() => setSosStatus(false)}
              aria-label="Clear SOS status"
              className="bg-red-700 hover:bg-red-800 text-white font-extrabold text-[9px] uppercase px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Clear SOS
            </button>
          </div>
        </div>
      )}

      {/* Left Column (8 cols): Match Status, Interactive Map */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Match / Stadium Telemetry Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="p-4 border-fifa-emerald/20">
            <h2 className="text-[10px] text-slate-600 dark:text-slate-300 font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true"></span> Match Telemetry
            </h2>
            <div className="text-xs font-bold dark:text-white">Mexico vs USA</div>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Monterrey Stadium • 45m to Kickoff</p>
          </GlassCard>

          <GlassCard className="p-4">
            <h2 className="text-[10px] text-slate-600 dark:text-slate-300 font-extrabold uppercase tracking-wider mb-2">
              Gate Queues
            </h2>
            <div className="text-xs font-bold dark:text-white">Gate A: 90% (Critical)</div>
            <p className="text-[10px] text-slate-600 dark:text-fifa-emerald mt-1 font-semibold">Gate B: 35% (Use for entry)</p>
          </GlassCard>

          <GlassCard className="p-4">
            <h2 className="text-[10px] text-slate-600 dark:text-slate-300 font-extrabold uppercase tracking-wider mb-2">
              Weather & Temp
            </h2>
            <div className="text-xs font-bold dark:text-white">72°F • Clear Sky</div>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Humidity 45% • Wind 5mph</p>
          </GlassCard>
        </div>

        {/* Pathfinder Interactive Stadium Map */}
        <GlassCard className="p-5">
          <h2 className="text-sm font-display font-extrabold mb-2 dark:text-white flex items-center gap-2">
            <Navigation className="text-fifa-emerald w-5 h-5" aria-hidden="true" /> Interactive Pathfinder Seating Map
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 font-semibold">
            Select a target destination below. The smart pathfinder compiles step-by-step guidance overlays.
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
                    ? 'bg-fifa-emerald text-white border-fifa-emerald'
                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {target.label}
              </button>
            ))}
          </div>

          <div className="relative aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center">
            <svg viewBox="0 0 400 250" className="w-full h-full p-4 text-slate-800 dark:text-white/20" aria-hidden="true">
              {/* Stadium boundary */}
              <rect x="10" y="10" width="380" height="230" rx="60" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <rect x="50" y="40" width="300" height="170" rx="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" />
              <rect x="110" y="80" width="180" height="90" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              
              {/* Seating Sectors labels */}
              <text x="50" y="125" fill="currentColor" fontSize="10" textAnchor="middle" className="font-bold">Sec 101</text>
              <text x="350" y="125" fill="currentColor" fontSize="10" textAnchor="middle" className="font-bold">Sec 103</text>
              <text x="200" y="35" fill="currentColor" fontSize="10" textAnchor="middle" className="font-bold">Sec 102 (North)</text>
              <text x="200" y="225" fill="currentColor" fontSize="10" textAnchor="middle" className="font-bold">Sec 104 (South)</text>

              {/* Gate dots */}
              <circle cx="200" cy="10" r="5" fill="#ef4444" />
              <text x="200" y="25" fill="#ef4444" fontSize="8" textAnchor="middle" className="font-extrabold">Gate A</text>

              <circle cx="200" cy="240" r="5" fill="#10b981" />
              <text x="200" y="235" fill="#10b981" fontSize="8" textAnchor="middle" className="font-extrabold">Gate B</text>

              {/* Pathfinder overlay route line */}
              {navTarget === 'gate-a' && (
                <path d="M 200,215 Q 120,180 80,120 T 200,15" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="5,5" className="animate-[dash_2s_linear_infinite]" />
              )}
              {navTarget === 'gate-b' && (
                <path d="M 200,125 Q 200,180 200,230" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="5,5" />
              )}
              {navTarget === 'food-court' && (
                <>
                  <circle cx="310" cy="70" r="6" fill="#fbbf24" />
                  <path d="M 200,125 Q 260,90 305,72" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="3,3" />
                </>
              )}
              {navTarget === 'accessibility' && (
                <>
                  <circle cx="30" cy="125" r="6" fill="#2563eb" />
                  <path d="M 200,125 Q 100,125 36,125" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="3,3" />
                </>
              )}
            </svg>

            {/* Path routing textual card indicator overlay */}
            {navTarget && (
              <div className="absolute bottom-4 left-4 bg-slate-900/95 p-3 rounded-xl border border-white/10 max-w-[280px] text-[10px] text-slate-200">
                {navTarget === 'gate-b' && '🟢 Suggested Route: Gate B is clear. Egress time: ~4 mins.'}
                {navTarget === 'gate-a' && '⚠️ Crowd Warning: Gate A is highly congested. Use Gate B.'}
                {navTarget === 'food-court' && '🍔 Concessions: Food Court 3 queue time: ~5 mins.'}
                {navTarget === 'accessibility' && '♿ Step-free access path highlighted in blue.'}
              </div>
            )}
          </div>
        </GlassCard>

      </div>

      {/* Right Column (5 cols): AI Chat Assistant, AI Concession Planner, Transit */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Gemini AI Match Assistant Chat */}
        <GlassCard className="p-4 border-fifa-emerald/20 flex flex-col h-[320px]">
          <h2 className="text-sm font-extrabold mb-1.5 flex items-center gap-1.5 dark:text-white">
            <Sparkles className="text-emerald-800 dark:text-fifa-emerald w-4 h-4" aria-hidden="true" /> Gemini AI Match Assistant
          </h2>
          <p className="text-[10px] text-slate-600 dark:text-slate-350 mb-3 font-semibold">
            Ask about seating access, gate wait times, concession menus, or sustainability.
          </p>

          <div className="flex-grow overflow-y-auto mb-3 space-y-2.5 pr-1 scrollbar-thin text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-2xl max-w-[85%] font-semibold leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-fifa-emerald text-white ml-auto rounded-tr-none'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 mr-auto rounded-tl-none border border-slate-200 dark:border-white/5'
                }`}
              >
                <span className="text-[8px] font-extrabold block uppercase tracking-wider mb-0.5 opacity-60">
                  {msg.role === 'user' ? 'You' : 'Gemini'}
                </span>
                <div className="whitespace-pre-line text-xs font-semibold">
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

          <ChatForm onSendMessage={handleSendMessage} chatLoading={chatLoading} />
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
              className="w-full bg-fifa-blue hover:bg-blue-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold cursor-pointer"
            >
              {foodLoading ? (
                <span>Finding concessions...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-900 dark:text-fifa-gold fill-fifa-gold" aria-hidden="true" /> Plan Dinner
                </>
              )}
            </button>

            {foodRec && (
              <div className="mt-2 bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-slate-200/50 dark:border-white/10">
                <span className="text-[9px] font-extrabold uppercase tracking-wider block mb-1 text-emerald-800 dark:text-fifa-emerald">
                  {foodError ? 'System Warning' : 'Gemini Food Selection'}
                </span>
                <p className={`text-[11px] leading-relaxed dark:text-white font-semibold ${foodError ? 'text-fifa-red font-bold' : ''}`}>
                  {foodRec}
                </p>
                {foodError && (
                  <button
                    onClick={handleGetFoodRec}
                    aria-label="Try Again"
                    title="Retry retrieving dinner plan"
                    className="mt-2 bg-fifa-emerald hover:bg-emerald-600 text-white font-bold px-3 py-1 rounded text-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold"
                  >
                    🔄 Try Again
                  </button>
                )}
              </div>
            )}
          </div>
        </GlassCard>

        {/* AI Green Transit Planner */}
        <GlassCard className="p-5 border-fifa-gold/20">
          <h2 className="text-sm font-extrabold mb-3 flex items-center gap-1.5 dark:text-white">
            <Clock className="text-emerald-800 dark:text-fifa-emerald w-4 h-4" aria-hidden="true" /> AI Green Transit Pathfinder
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 font-semibold">
            Get travel planning with eco-friendly metrics to lower surrounding concourse traffic levels.
          </p>

          <TransitPlannerForm onPlanTransit={handlePlanTransit} transitLoading={transitLoading} />

          {transitRec && (
            <div className="mt-2 bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-slate-200/50 dark:border-white/10">
              <span className="text-[9px] font-extrabold uppercase tracking-wider block mb-1 text-emerald-800 dark:text-fifa-emerald">
                {transitError ? 'System Warning' : 'Gemini Eco-Route'}
              </span>
              <p className={`text-[11px] leading-relaxed dark:text-white font-semibold ${transitError ? 'text-fifa-red font-bold' : ''}`}>
                {transitRec}
              </p>
              {transitError && (
                <button
                  onClick={() => handlePlanTransit(lastTransit.destination, lastTransit.preference)}
                  aria-label="Try Again"
                  title="Retry retrieving transit recommendation"
                  className="mt-2 bg-fifa-emerald hover:bg-emerald-600 text-white font-bold px-3 py-1 rounded text-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold"
                >
                  🔄 Try Again
                </button>
              )}
            </div>
          )}
        </GlassCard>

      </div>
    </div>
  );
}
