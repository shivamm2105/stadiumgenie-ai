import React, { useState, useMemo, useCallback } from 'react';
import { useStadiumState } from '../hooks/useStadiumState';
import { AiService, ApiService } from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  Wrench, Clock, Sparkles, PlusCircle, Cpu, Wifi 
} from 'lucide-react';

/**
 * Localized maintenance ticket logging form.
 * Prevents full page re-renders on keystroke events.
 */
const MaintenanceForm = React.memo(function MaintenanceForm({ onLogWorkOrder, loading }) {
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState('');
  const [aiPrioritization, setAiPrioritization] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  const handleGetAIEvaluation = async (e) => {
    if (e) e.preventDefault();
    if (!details.trim() || aiLoading) return;
    setAiLoading(true);
    setAiPrioritization(null);
    setAiError(false);
    try {
      const evaluation = await AiService.getMaintenancePriority(details);
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

  const handleLogWorkOrder = () => {
    if (!details.trim() || !location.trim() || !aiPrioritization || loading) return;
    onLogWorkOrder({
      details,
      location,
      priority: aiPrioritization.priority,
      etaMinutes: aiPrioritization.etaMinutes,
      allocatedTeam: aiPrioritization.allocatedTeam,
      justification: aiPrioritization.justification
    });
    setDetails('');
    setLocation('');
    setAiPrioritization(null);
  };

  return (
    <div>
      <form onSubmit={handleGetAIEvaluation} className="space-y-4">
        <div>
          <label htmlFor="issue-details" className="sr-only">Malfunction Details</label>
          <textarea
            id="issue-details"
            rows="3"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Details: 'Turnstile A3 ticketing scanner is frozen. Rejecting tickets.' or 'Broken glass near stand 3...'"
            aria-label="Malfunction Details"
            title="Malfunction Details"
            required
            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs focus:ring-2 focus:ring-fifa-gold focus:outline-none dark:text-white font-semibold"
          />
        </div>

        <div>
          <label htmlFor="issue-loc" className="sr-only">Specific Location</label>
          <input
            id="issue-loc"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Specific Location (e.g. Gate A Entrance, Concourse Section 102)"
            aria-label="Specific Location"
            title="Specific Location"
            required
            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-fifa-gold focus:outline-none dark:text-white font-semibold"
          />
        </div>

        <button
          type="submit"
          disabled={aiLoading || !details.trim() || !location.trim()}
          aria-label="Ask Gemini Priority Analysis"
          title="Ask Gemini Priority Analysis"
          className="bg-fifa-blue hover:bg-blue-600 text-white font-bold text-xs py-2 px-5 rounded-xl flex items-center gap-1.5 transition-all shadow cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold"
        >
          {aiLoading ? (
            <span>AI Categorizing...</span>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-900 dark:text-fifa-gold fill-fifa-gold" aria-hidden="true" /> Ask Gemini Priority Analysis
            </>
          )}
        </button>
      </form>

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
                aria-label="Retry AI prioritization"
                title="Retry AI prioritization"
                className="bg-fifa-blue hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold"
              >
                🔄 Retry Evaluation
              </button>
            </div>
          )}

          <div className="text-xs text-slate-300 space-y-2">
            <div>
              <span className="text-[9px] text-slate-400 block font-bold uppercase">Work Assignment</span>
              <span className="font-extrabold text-white text-[11px]">{aiPrioritization.allocatedTeam}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block font-bold uppercase">Estimated Dispatch Time</span>
              <span className="font-extrabold text-white text-[11px]">{aiPrioritization.etaMinutes} Minutes</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block font-bold uppercase">Priority Justification</span>
              <p className="leading-relaxed text-slate-200 mt-0.5 font-semibold">{aiPrioritization.justification}</p>
            </div>
          </div>

          <div className="pt-2.5 border-t border-white/5 flex justify-end">
            <button
              onClick={handleLogWorkOrder}
              disabled={loading}
              aria-label="Log work order to dispatch ledger"
              title="Log work order to dispatch ledger"
              className="bg-fifa-emerald text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold cursor-pointer"
            >
              {loading ? 'Logging order...' : 'Confirm & Log Work Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default function StaffDashboard() {
  const { maintenanceTickets, refreshState } = useStadiumState();
  const [loading, setLoading] = useState(false);

  // Submit and log work order ticket
  const handleLogWorkOrder = useCallback(async (ticketData) => {
    setLoading(true);
    try {
      await ApiService.reportMaintenance({
        details: ticketData.details,
        location: ticketData.location,
        priority: ticketData.priority,
        etaMinutes: ticketData.etaMinutes,
        allocatedTeam: ticketData.allocatedTeam,
        justification: ticketData.justification
      });
      refreshState();
      alert('Maintenance work order successfully registered in operations dispatch ledger!');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [refreshState]);

  // Telemetry list memoization
  const activeTickets = useMemo(() => maintenanceTickets, [maintenanceTickets]);

  // Equipment telemetry mock statuses
  const equipments = useMemo(() => [
    { name: 'Gate A Entry Turnstile 1-5', category: 'Hardware', status: 'Online', signal: 'Good' },
    { name: 'Gate B Entry Turnstile 1-5', category: 'Hardware', status: 'Online', signal: 'Good' },
    { name: 'Gate A Digital Banner Screen', category: 'Signage', status: 'Online', signal: 'Good' },
    { name: 'Gate C Security Metal Scanner', category: 'Security', status: 'Online', signal: 'Good' },
    { name: 'Restroom Block B (Level 2)', category: 'Plumbing', status: 'Maintenance', signal: 'Out of Order' }
  ], []);

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
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 font-semibold">
            Type details of the malfunction or cleaning spill, then let Gemini analyze the security threat level.
          </p>

          <MaintenanceForm onLogWorkOrder={handleLogWorkOrder} loading={loading} />
        </GlassCard>

        {/* Live Active Maintenance Ledger */}
        <GlassCard className="p-5">
          <h2 className="text-base font-bold mb-3 flex items-center gap-1.5 dark:text-white">
            <Clock className="text-fifa-blue dark:text-blue-400 w-5 h-5" /> Active Repair Tickets Ledger
          </h2>
          <p className="text-xs text-slate-450 mb-4">
            Operations backlog of logged work orders, assigned response crews, and estimated time to clear.
          </p>

          <div className="space-y-3.5 max-h-72 overflow-y-auto scrollbar-thin">
            {activeTickets.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-600 dark:text-slate-400 font-semibold">No active maintenance work orders.</div>
            ) : (
              activeTickets.map(ticket => (
                <div key={ticket.id} className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-800 dark:text-white">{ticket.id} — {ticket.location}</span>
                    <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${
                      ticket.priority === 'Critical'
                        ? 'bg-red-500/10 text-fifa-red animate-pulse'
                        : ticket.priority === 'High'
                        ? 'bg-orange-500/10 text-orange-600'
                        : 'bg-yellow-500/10 text-fifa-gold'
                    }`}>
                      {ticket.priority} Priority
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">{ticket.details}</p>
                  
                  <div className="pt-2 border-t border-slate-200/50 dark:border-white/5 grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-slate-500 font-semibold">
                    <div>
                      <span className="block text-[8px] text-slate-400">Assigned Team</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-300">{ticket.allocatedTeam}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-400">Resolution ETA</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-300">{ticket.etaMinutes} mins</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-400">Logged Time</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-300">{ticket.timestamp}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-400">Ticket Status</span>
                      <span className="font-extrabold text-fifa-emerald">{ticket.status}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

      </div>

      {/* Right Column: Hardware Health Telemetry Signals (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        <GlassCard className="p-5">
          <h2 className="text-sm font-extrabold mb-3 flex items-center gap-1.5 dark:text-white">
            <Cpu className="text-fifa-blue dark:text-blue-400 w-4 h-4" aria-hidden="true" /> Hardware Telemetry Signals
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 font-semibold">
            Real-time ping telemetry from turnstiles, accessibility gates, and signboards.
          </p>

          <div className="space-y-3">
            {equipments.map((eq, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                <div className="space-y-0.5">
                  <div className="font-extrabold dark:text-white flex items-center gap-1">
                    {eq.status === 'Online' ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true"></span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true"></span>
                    )}
                    {eq.name}
                  </div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase">{eq.category}</span>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${
                    eq.status === 'Online' ? 'bg-emerald-500/10 text-fifa-emerald' : 'bg-red-500/10 text-fifa-red'
                  }`}>
                    {eq.status}
                  </span>
                  <div className="text-[9px] text-slate-500 mt-1 font-semibold flex items-center gap-0.5 justify-end">
                    <Wifi className="w-3 h-3" /> {eq.signal}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
