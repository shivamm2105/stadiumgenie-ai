import React, { lazy, Suspense } from 'react';
import { useUser } from '../context/UserContext';
import { useAccessibility } from '../context/AccessibilityContext';
import GlassCard from '../components/GlassCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { Compass, ShieldAlert, Languages, Wrench, Sparkles, Award } from 'lucide-react';
import { motion } from 'framer-motion';

// Lazy load portal dashboards (Splits code bundles, lowering initial page load times)
const FanDashboard = lazy(() => import('./FanDashboard'));
const OrganizerDashboard = lazy(() => import('./OrganizerDashboard'));
const VolunteerDashboard = lazy(() => import('./VolunteerDashboard'));
const StaffDashboard = lazy(() => import('./StaffDashboard'));

export default function Home() {
  const { role, setRole } = useUser();
  const { handleSpeakHover } = useAccessibility();

  const portals = [
    {
      id: 'fan',
      title: 'Fan Companion',
      tagline: 'Queue Times & Seating Paths',
      icon: Compass,
      color: 'border-fifa-emerald/20 text-fifa-emerald',
      bgColor: 'bg-fifa-emerald/5',
      desc: 'Use Gemini Match Assistant, find seat paths, request food plans, and trigger emergency SOS alarms.'
    },
    {
      id: 'organizer',
      title: 'Organizer Command',
      tagline: 'Crowd Heatmaps & Triage Desk',
      icon: ShieldAlert,
      color: 'border-fifa-blue/20 text-fifa-blue',
      bgColor: 'bg-fifa-blue/5',
      desc: 'Monitor crowd density, evaluate incidents with AI Support checklists, and send global emergency broadcasts.'
    },
    {
      id: 'volunteer',
      title: 'Volunteer Hub',
      tagline: 'Gemini Translator & Lost & Found',
      icon: Languages,
      color: 'border-fifa-emerald/20 text-fifa-emerald',
      bgColor: 'bg-fifa-emerald/5',
      desc: 'Access real-time translations for visitors, catalog found items, and update supervisor checklists.'
    },
    {
      id: 'staff',
      title: 'Staff Portal',
      tagline: 'Hardware Telemetry & AI Repairs',
      icon: Wrench,
      color: 'border-fifa-gold/20 text-fifa-gold',
      bgColor: 'bg-fifa-gold/5',
      desc: 'Check turnstile wifi statuses, log malfunction tickets, and utilize Gemini to triage priority levels.'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Hero Welcome Panel */}
      <section 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 p-8 md:p-12 text-white border border-white/10 shadow-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8"
        onMouseEnter={(e) => handleSpeakHover(e, "Welcome to StadiumGenie AI. One Intelligent AI Platform for Fan navigation, crowd heatmaps, accessibility, and real-time decision support during the FIFA World Cup 2026.")}
      >
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-fifa-emerald/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-fifa-blue/20 blur-3xl" />

        <div className="space-y-4 max-w-2xl z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/10 text-fifa-gold">
            <Award className="w-3.5 h-3.5 fill-fifa-gold" /> PromptWars Virtual Challenge 4
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
            Stadium Operations <br />
            <span className="bg-gradient-to-r from-fifa-emerald via-fifa-blue to-fifa-gold bg-clip-text text-transparent">
              Elevated with Gemini AI
            </span>
          </h2>
          <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
            One Intelligent AI Platform for Fans, Organizers, Volunteers, and Stadium Staff during the FIFA World Cup 2026.
          </p>
        </div>

        <div className="flex-shrink-0 z-10 w-full md:w-auto">
          <GlassCard className="p-5 border-white/10 bg-white/5 backdrop-blur-lg flex flex-col items-center gap-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-fifa-emerald">System Telemetry</span>
            <div className="flex gap-4 text-center">
              <div>
                <span className="text-xl font-black text-white block">78K+</span>
                <span className="text-[10px] text-slate-400">Guests</span>
              </div>
              <div className="w-px bg-white/10 h-10 self-center"></div>
              <div>
                <span className="text-xl font-black text-white block">02</span>
                <span className="text-[10px] text-slate-400">Emergencies</span>
              </div>
              <div className="w-px bg-white/10 h-10 self-center"></div>
              <div>
                <span className="text-xl font-black text-fifa-emerald block">Active</span>
                <span className="text-[10px] text-slate-400">Gemini</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Role Portal Selectors */}
      <section className="space-y-4">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white flex items-center gap-2 justify-center md:justify-start">
            👋 Choose Your Dashboard View
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Toggle between roles to see how StadiumGenie coordinates data across fans, organizers, volunteers, and staff in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portals.map(p => {
            const Icon = p.icon;
            const isActive = role === p.id;
            return (
              <GlassCard
                key={p.id}
                onClick={() => setRole(p.id)}
                hoverEffect={true}
                className={`flex flex-col justify-between h-[210px] border-2 transition-all p-5 ${
                  isActive 
                    ? 'border-fifa-emerald shadow-fifa-emerald/10 scale-102 bg-white dark:bg-slate-900/60' 
                    : 'border-slate-200/50 dark:border-white/5'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-lg bg-slate-100 dark:bg-white/5 ${p.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isActive && (
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-fifa-emerald bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 fill-fifa-emerald" /> Active
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm dark:text-white text-slate-800">{p.title}</h4>
                    <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">{p.tagline}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-3">
                    {p.desc}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Render Dynamic portal dashboard */}
      <section className="pt-6 border-t border-slate-200 dark:border-white/5">
        <Suspense fallback={<SkeletonLoader count={2} className="h-48" />}>
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {role === 'fan' && <FanDashboard />}
            {role === 'organizer' && <OrganizerDashboard />}
            {role === 'volunteer' && <VolunteerDashboard />}
            {role === 'staff' && <StaffDashboard />}
          </motion.div>
        </Suspense>
      </section>
    </div>
  );
}
