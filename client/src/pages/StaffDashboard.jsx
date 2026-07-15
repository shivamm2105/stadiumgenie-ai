import React, { useState } from 'react';
import { useStadiumState } from '../context/StadiumStateContext';
import { AiService, ApiService } from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  Wrench, Clock, Sparkles, PlusCircle, Cpu, Check, Wifi 
} from 'lucide-react';

export default function StaffDashboard() {
  const { maintenanceTickets, refreshState } = useStadiumState();

  // Form states
  const [ticketDetails, setTicketDetails] = useState('');
  const [ticketLocation, setTicketLocation] = useState('');
  const [loading, setLoading] = useState(false);

  // AI priority suggestions
  const [aiPrioritization, setAiPrioritization] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  // Submit description to Gemini for priority grading
  const handleGetAIEvaluation = async (e) => {
    if (e) e.preventDefault();
    if (!ticketDetails.trim() || aiLoading) return;
    setAiLoading(true);
    setAiPrioritization(null);
    setAiError(false);
    try {
      const evaluation = await AiService.getMaintenancePriority(ticketDetails);
      setAiPrioritization(evaluation);
    } catch (err) {
      console.error(err);
      setAiError(true);
      setAiPrioritization({
        priority: 'Medium',
        etaMinutes: 20,
        allocatedTeam: 'General Maintenance',
        justification: 'Evaluation offline. Categorized under general work order logs.'
      });
    } finally {
      setAiLoading(false);
    }
  };

  // Submit and log work order ticket
  const handleLogWorkOrder = async () => {
    if (!ticketDetails || !ticketLocation || !aiPrioritization || loading) return;
    setLoading(true);
    try {
      await ApiService.reportMaintenance({
        details: ticketDetails,
        location: ticketLocation,
        priority: aiPrioritization.priority,
        etaMinutes: aiPrioritization.etaMinutes,
        allocatedTeam: aiPrioritization.allocatedTeam,
        justification: aiPrioritization.justification
      });
      setTicketDetails('');
      setTicketLocation('');
      setAiPrioritization(null);
      refreshState();
      alert('Maintenance work order successfully registered in operations dispatch ledger!');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Equipment telemetry mock statuses
  const equipments = [
    { name: 'Gate A Entry Turnstile 1-5', category: 'Hardware', status: 'Online', signal: 'Good' },
    { name: 'Gate B Entry Turnstile 1-5', category: 'Hardware', status: 'Online', signal: 'Good' },
    { name: 'Gate A Digital Banner Screen', category: 'Signage', status: 'Online', signal: 'Good' },
    { name: 'Gate C Security Metal Scanner', category: 'Security', status: 'Online', signal: 'Good' },
    { name: 'Restroom Block B (Level 2)', category: 'Plumbing', status: 'Maintenance', signal: 'Out of Order' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Title */}
      <div className="lg:col-span-12">
        <h1 className="text-2xl font-display font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
          <Wrench className="text-fifa-emerald w-7 h-7" /> Facilities & Maintenance Portal
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor hardware signals, submit repair tickets, and utilize Gemini to triage maintenance priority instantly.
        </p>
      </div>

      {/* Left Column: Register ticket & AI assessment (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Ticket Submission and AI prioritizer */}
        <GlassCard className="p-5 border-fifa-emerald/20">
          <h2 className="text-base font-bold mb-3 flex items-center gap-1.5 dark:text-white">
            <PlusCircle className="text-fifa-emerald w-5 h-5" /> Log Maintenance & Cleaning Issue
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Type details of the malfunction or cleaning spill, then let Gemini analyze the security threat level.
          </p>

          <form onSubmit={handleGetAIEvaluation} className="space-y-4">
            <div>
              <label htmlFor="issue-details" className="sr-only">Malfunction Details</label>
              <textarea
                id="issue-details"
                rows="3"
                value={ticketDetails}
                onChange={(e) => setTicketDetails(e.target.value)}
                placeholder="Details: 'Turnstile A3 ticketing scanner is frozen. Rejecting tickets.' or 'Water leak Restroom Block B...'"
                required
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs focus:ring-2 focus:ring-fifa-emerald focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="issue-loc" className="sr-only">Specific Location</label>
              <input
                id="issue-loc"
                type="text"
                value={ticketLocation}
                onChange={(e) => setTicketLocation(e.target.value)}
                placeholder="Specific Location (e.g. Gate A Turnstiles, Concourse Section 102)"
                required
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-fifa-emerald focus:outline-none dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={aiLoading || !ticketDetails.trim() || !ticketLocation.trim()}
              className="bg-fifa-blue hover:bg-blue-600 text-white font-bold text-xs py-2 px-5 rounded-xl flex items-center gap-1.5 transition-all shadow cursor-pointer disabled:opacity-50"
            >
              {aiLoading ? (
                <span>AI Categorizing...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-fifa-gold fill-fifa-gold" /> Ask Gemini Priority Analysis
                </>
              )}
            </button>
          </form>

          {/* AI Prioritization Outcome Panel */}
          {aiPrioritization && (
            <div className="mt-4 bg-slate-900/60 border border-fifa-emerald/20 p-4 rounded-xl space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-fifa-emerald font-extrabold uppercase tracking-wider">
                  {aiError ? 'System Warning' : 'Gemini Evaluation Summary'}
                </span>
                <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] uppercase ${
                  aiPrioritization.priority === 'Critical' || aiPrioritization.priority === 'High'
                    ? 'bg-red-500/10 text-fifa-red'
                    : 'bg-yellow-500/10 text-fifa-gold'
                }`}>
                  {aiPrioritization.priority} Priority suggested
                </span>
              </div>

              {aiError && (
                <div className="text-xs">
                  <button
                    type="button"
                    onClick={() => handleGetAIEvaluation(null)}
                    className="bg-fifa-blue hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px]"
                  >
                    🔄 Retry Evaluation
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">Assigned Team</span>
                  <span className="font-bold dark:text-white">{aiPrioritization.allocatedTeam}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">Resolution ETA</span>
                  <span className="font-bold dark:text-white">{aiPrioritization.etaMinutes} mins</span>
                </div>
              </div>

              <div className="text-xs">
                <span className="text-[9px] text-slate-400 block uppercase">AI Justification</span>
                <p className="text-slate-300 leading-relaxed font-semibold">{aiPrioritization.justification}</p>
              </div>

              <div className="flex justify-end pt-2 border-t border-white/5">
                <button
                  onClick={handleLogWorkOrder}
                  disabled={loading}
                  className="bg-fifa-emerald hover:bg-emerald-600 text-white font-bold text-xs py-1.5 px-4 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Approve & Log Work Order
                </button>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Maintenance Queue list */}
        <GlassCard className="p-4">
          <h2 className="text-sm font-extrabold mb-3 flex items-center gap-1.5 dark:text-white">
            🔧 Ongoing Work Orders Queue
          </h2>
          <div className="space-y-3 max-h-56 overflow-y-auto scrollbar-thin">
            {maintenanceTickets.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">No active work orders. Everything runs fine.</div>
            ) : (
              maintenanceTickets.map(ticket => (
                <div key={ticket.id} className="bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 p-3 rounded-xl text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold dark:text-white">{ticket.id} — {ticket.location}</span>
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] uppercase ${
                      ticket.priority === 'Critical' || ticket.priority === 'High'
                        ? 'bg-red-500/10 text-fifa-red'
                        : 'bg-yellow-500/10 text-fifa-gold'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-normal mb-2">{ticket.details}</p>
                  
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium pt-2 border-t border-slate-200/50 dark:border-white/5">
                    <div className="flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-fifa-blue" />
                      <span>Team: {ticket.allocatedTeam}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>ETA: {ticket.etaMinutes} mins</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

      </div>

      {/* Right Column: Hardware Status signals (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Hardware & turnstiles signals */}
        <GlassCard className="p-4">
          <h2 className="text-sm font-extrabold mb-3 flex items-center gap-1.5 dark:text-white">
            <Cpu className="text-fifa-blue w-4 h-4" /> Hardware Signals Telemetry
          </h2>
          
          <div className="space-y-2.5">
            {equipments.map((eq, i) => (
              <div key={i} className="flex justify-between items-center text-xs p-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-xl">
                <div className="flex flex-col">
                  <span className="font-bold dark:text-white">{eq.name}</span>
                  <span className="text-[10px] text-slate-400">Class: {eq.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] uppercase ${
                    eq.status === 'Online' ? 'bg-emerald-500/10 text-fifa-emerald' : 'bg-red-500/10 text-fifa-red'
                  }`}>
                    {eq.status}
                  </span>
                  
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Wifi className={`w-3.5 h-3.5 ${eq.status === 'Online' ? 'text-fifa-emerald' : 'text-fifa-red'}`} />
                    {eq.signal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Cleaning Requests log */}
        <GlassCard className="p-4">
          <h2 className="text-sm font-extrabold mb-3 flex items-center gap-1.5 dark:text-white">
            🧹 Priority Cleaning Triage
          </h2>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-slate-200/50 dark:border-white/10 flex justify-between items-center">
              <div>
                <span className="font-bold dark:text-white text-xs block">Restroom Block B Spill</span>
                <span className="text-[10px]">Level 2 Concourse - Reported 15m ago</span>
              </div>
              <span className="bg-red-500/10 text-fifa-red px-2 py-0.5 rounded text-[9px] font-bold">HIGH RISK</span>
            </div>
            
            <div className="bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-slate-200/50 dark:border-white/10 flex justify-between items-center">
              <div>
                <span className="font-bold dark:text-white text-xs block">Concourse Section 102 Trash bin overflow</span>
                <span className="text-[10px]">Gate C Entrance - Reported 30m ago</span>
              </div>
              <span className="bg-yellow-500/10 text-fifa-gold px-2 py-0.5 rounded text-[9px] font-bold">MED RISK</span>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
