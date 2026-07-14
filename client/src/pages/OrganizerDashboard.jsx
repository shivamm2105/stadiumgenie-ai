import React, { useState } from 'react';
import { useStadiumState } from '../context/StadiumStateContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { AiService, ApiService } from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  Activity, ShieldAlert, Sparkles, RefreshCw, Check 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function OrganizerDashboard() {
  const { 
    gates, parking, foodCourts, incidents, matchInfo, maintenanceTickets, refreshState 
  } = useStadiumState();
  
  const { handleSpeakHover } = useAccessibility();

  // AI analysis state for selected incident
  const [selectedIncId, setSelectedIncId] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Broadcast emergency states
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  // Filter out active vs resolved incidents
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');

  // Trigger Gemini analysis of incident details
  const handleAnalyzeIncident = async (incident) => {
    setSelectedIncId(incident.id);
    setAnalysisLoading(true);
    setAnalysisResult(null);
    try {
      const summary = await AiService.getIncidentSummary(incident.description, incident.category);
      setAnalysisResult(summary);
    } catch (err) {
      console.error(err);
      setAnalysisResult({
        summary: 'Incident telemetry failed. Critical resource allocation suggested.',
        priority: 'High',
        suggestedActions: [
          'Dispatch immediate regional stewards.',
          'Open emergency backup routing.',
          'Verify feed surveillance.'
        ],
        staffNeeded: 'Security Stewards'
      });
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Resolve incident
  const handleResolveIncident = async (id) => {
    try {
      await ApiService.updateIncident(id, { status: 'Resolved' });
      if (selectedIncId === id) {
        setSelectedIncId(null);
        setAnalysisResult(null);
      }
      refreshState();
    } catch (err) {
      console.error(err);
    }
  };

  // Send global emergency broadcast
  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (broadcastLoading) return;
    setBroadcastLoading(true);
    try {
      await ApiService.broadcastEmergency(broadcastText || null);
      refreshState();
    } catch (err) {
      console.error(err);
    } finally {
      setBroadcastLoading(false);
    }
  };

  // Chart data: hourly entry rates
  const entryTelemetryData = [
    { time: '14:00', entries: 12000 },
    { time: '14:30', entries: 25000 },
    { time: '15:00', entries: 42000 },
    { time: '15:30', entries: 61000 },
    { time: '16:00', entries: 72000 },
    { time: '16:30', entries: 78500 }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <Activity className="text-fifa-blue w-7 h-7" /> Security Operations Command Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time telemetry feeds, incident analytics, and AI Emergency Decision Support.
          </p>
        </div>
        <button
          onClick={refreshState}
          aria-label="Refresh telemetry feeds"
          className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/15 dark:text-white px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors font-bold"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Telemetry
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-fifa-blue/10 flex items-center justify-center text-fifa-blue font-bold text-lg">
            👥
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Attendance</span>
            <span className="text-lg font-black dark:text-white">78,500</span>
            <span className="text-[10px] text-fifa-emerald block">98% Capacity</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-fifa-red/10 flex items-center justify-center text-fifa-red font-bold text-lg">
            ⚠️
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Open Incidents</span>
            <span className={`text-lg font-black ${activeIncidents.length > 0 ? 'text-fifa-red animate-pulse' : 'dark:text-white'}`}>
              {activeIncidents.length}
            </span>
            <span className="text-[10px] text-slate-400 block">Pending triage</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-fifa-gold/10 flex items-center justify-center text-fifa-gold font-bold text-lg">
            🚗
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Parking Load</span>
            <span className="text-lg font-black dark:text-white">93% Avg</span>
            <span className="text-[10px] text-fifa-red block">Lot C is full</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-fifa-emerald/10 flex items-center justify-center text-fifa-emerald font-bold text-lg">
            ⌚
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Avg Queue wait</span>
            <span className="text-lg font-black dark:text-white">12.5 Min</span>
            <span className="text-[10px] text-fifa-emerald block">Gates flowing green</span>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Live telemetry charts and Heatmaps (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Attendance entry trend chart */}
          <GlassCard className="p-5">
            <h2 className="text-sm font-extrabold mb-4 flex items-center gap-2 dark:text-white">
              📈 Entry Telemetry Trend (Match Day Accumulation)
            </h2>
            <div className="w-full h-48 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={entryTelemetryData}>
                  <defs>
                    <linearGradient id="colorEntries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                  <Area type="monotone" dataKey="entries" stroke="#2563eb" fillOpacity={1} fill="url(#colorEntries)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Interactive Telemetry Map / Heatmap visualizer */}
          <GlassCard className="relative overflow-hidden">
            <h2 className="text-sm font-extrabold mb-3 flex items-center gap-2 dark:text-white">
              🗺️ Stadium Occupancy Heat Telemetry Map
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Real-time monitoring points. Pulsing red dots indicate sectors with heavy crowd bottleneck risks.
            </p>

            <div className="relative w-full aspect-video bg-slate-950/80 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
              <svg viewBox="0 0 400 220" className="w-full h-full p-4 text-slate-700 dark:text-white/20">
                {/* Stadium Shape */}
                <rect x="20" y="20" width="360" height="180" rx="40" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="70" y="50" width="260" height="120" rx="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                
                {/* Spectator seating rings color grids */}
                {/* Sector 1 (Left - Gate A / Critical Zone) */}
                <path d="M 20,90 Q 20,40 70,25 Q 90,20 120,40 L 100,70 Q 80,60 50,85 Z" fill="#ef4444" fillOpacity="0.3" stroke="#ef4444" strokeWidth="1" />
                {/* Sector 2 (Top - Food Court Zone) */}
                <path d="M 120,20 Q 200,10 280,20 L 260,50 Q 200,40 140,50 Z" fill="#fbbf24" fillOpacity="0.2" stroke="#fbbf24" strokeWidth="1" />
                {/* Sector 3 (Right - Gate B / Calm Zone) */}
                <path d="M 280,20 Q 380,40 380,90 L 350,90 Q 350,60 300,50 Z" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1" />
                {/* Sector 4 (Bottom - General Seating) */}
                <path d="M 20,130 Q 20,180 70,195 Q 120,210 200,210 Q 280,210 330,195 Q 380,180 380,130 L 350,130 Q 350,160 300,170 Q 200,180 100,170 Q 50,160 50,130 Z" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="1" />
              </svg>

              {/* Pulsing red hot-spot at Gate A / North West */}
              <div className="absolute top-[28%] left-[16%] w-4 h-4 rounded-full bg-fifa-red heatmap-pulse" />
              <div className="absolute top-[22%] left-[14%] bg-slate-900/90 text-[10px] text-white border border-red-500/30 rounded px-1.5 py-0.5">
                Surge: Northwest Concourse (90% capacity)
              </div>

              {/* Status checklist overlaid */}
              <div className="absolute bottom-3 right-3 bg-slate-950/80 p-2.5 rounded border border-white/10 text-[9px] text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Sector 112: Heavy congestion</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Sector 118: Clear flow</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Food Concourse: 12 min queues</div>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Right Col: Active Security Incident Queue & AI Support (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Emergency Ticker Broadcast */}
          <GlassCard className="p-4 border-fifa-red/20 bg-red-500/5">
            <h2 className="text-sm font-extrabold mb-2.5 flex items-center gap-1.5 dark:text-white">
              <ShieldAlert className="text-fifa-red w-4 h-4" /> Global Emergency Broadcaster
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              Broadcast high-priority instructions to all visitor and volunteer devices instantly.
            </p>

            <form onSubmit={handleBroadcast} className="flex gap-2">
              <input
                type="text"
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                placeholder={matchInfo.emergencyAlert ? 'Clear alert by broadcasting blank...' : 'E.g., Severe lightning storm. Seek shelter.'}
                className="flex-grow bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none dark:text-white"
              />
              <button
                type="submit"
                disabled={broadcastLoading}
                className={`text-white text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  matchInfo.emergencyAlert 
                    ? 'bg-slate-700 hover:bg-slate-600' 
                    : 'bg-fifa-red hover:bg-red-700'
                }`}
              >
                {matchInfo.emergencyAlert ? 'Clear' : 'Broadcast'}
              </button>
            </form>
          </GlassCard>

          {/* Active Incident List */}
          <GlassCard className="p-4">
            <h2 className="text-sm font-extrabold mb-3 flex items-center gap-1.5 dark:text-white">
              ⚠️ Incident Response Dispatch Desk
            </h2>
            <div className="space-y-3 max-h-56 overflow-y-auto scrollbar-thin">
              {activeIncidents.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  <Check className="w-8 h-8 text-fifa-emerald mx-auto mb-1 opacity-50" />
                  All reports triaged. Secure stadium.
                </div>
              ) : (
                activeIncidents.map(inc => (
                  <div 
                    key={inc.id}
                    onClick={() => handleAnalyzeIncident(inc)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedIncId === inc.id
                        ? 'bg-fifa-blue/10 border-fifa-blue'
                        : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] uppercase ${
                        inc.priority === 'High' 
                          ? 'bg-red-500/10 text-fifa-red' 
                          : 'bg-yellow-500/10 text-fifa-gold'
                      }`}>
                        {inc.priority} Priority
                      </span>
                      <span className="text-[10px] text-slate-400">{inc.timestamp}</span>
                    </div>
                    <div className="font-bold dark:text-white mb-1">{inc.category} — {inc.location}</div>
                    <p className="text-slate-400 leading-normal line-clamp-2">{inc.description}</p>
                    
                    <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolveIncident(inc.id);
                        }}
                        className="flex items-center gap-1 text-[10px] bg-fifa-emerald text-white px-2.5 py-1 rounded hover:bg-emerald-600 font-bold"
                      >
                        <Check className="w-3 h-3" /> Resolve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          {/* AI Decision Support Panel */}
          {selectedIncId && (
            <GlassCard className="p-4 border-fifa-blue/30 bg-slate-900/50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-fifa-gold fill-fifa-gold" /> AI Emergency Support Checklists
                </span>
                <span className="text-[9px] text-slate-400">Incident: {selectedIncId}</span>
              </div>

              {analysisLoading ? (
                <div className="text-xs text-slate-400 py-4 flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-fifa-blue border-t-transparent rounded-full animate-spin"></div>
                  Gemini formulating dispatch checklist...
                </div>
              ) : (
                analysisResult && (
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-fifa-emerald uppercase block tracking-wider">AI Summary</span>
                      <p className="dark:text-slate-200 text-slate-700 leading-relaxed font-semibold">{analysisResult.summary}</p>
                    </div>

                    <div>
                      <span className="text-[9px] font-bold text-fifa-gold uppercase block tracking-wider">Suggested Actions</span>
                      <ul className="list-disc pl-4 mt-1.5 space-y-1 text-slate-300">
                        {analysisResult.suggestedActions?.map((act, i) => (
                          <li key={i} className="dark:text-slate-300 text-slate-600 leading-relaxed">{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-white/5">
                      <div>
                        <span className="text-[9px] font-bold text-fifa-blue uppercase block">Staff Requested</span>
                        <span className="font-bold text-slate-800 dark:text-white text-[11px]">{analysisResult.staffNeeded}</span>
                      </div>
                      
                      <button
                        onClick={async () => {
                          // Apply allocation suggestion
                          try {
                            await ApiService.updateIncident(selectedIncId, {
                              priority: analysisResult.priority,
                              suggestedActions: analysisResult.suggestedActions,
                              staffNeeded: analysisResult.staffNeeded
                            });
                            alert(`Incident ${selectedIncId} prioritized to ${analysisResult.priority}. Actions pushed to Volunteer checklist.`);
                            refreshState();
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className="bg-fifa-blue text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                      >
                        Push to Crew
                      </button>
                    </div>
                  </div>
                )
              )}
            </GlassCard>
          )}

        </div>

      </div>
    </div>
  );
}
