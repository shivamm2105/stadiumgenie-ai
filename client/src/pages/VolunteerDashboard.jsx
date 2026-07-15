import React, { useState, useMemo, useCallback } from 'react';
import { useStadiumState } from '../hooks/useStadiumState';
import { AiService, ApiService } from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  Languages, Archive, CheckSquare, Sparkles, 
  MapPin, Clock, Search, PlusCircle 
} from 'lucide-react';
import { TRANSLATION_LANGUAGES, CATEGORIES_LIST } from '../constants/stadiumConstants';

/**
 * Localized translation submission component.
 */
const TranslationForm = React.memo(function TranslationForm({ onTranslate, transLoading }) {
  const [input, setInput] = useState('');
  const [lang, setLang] = useState('Spanish');

  const presets = [
    'Where is the nearest restroom?',
    'Gate A is currently full. Please enter through Gate B.',
    'Emergency Alert: Please remain calm and follow staff instructions.'
  ];

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || transLoading) return;
    onTranslate(input, lang);
  };

  const handlePresetClick = (preset) => {
    setInput(preset);
    onTranslate(preset, lang);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="translate-input" className="sr-only">Text to translate</label>
        <textarea
          id="translate-input"
          rows="3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste guest query..."
          className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs focus:ring-2 focus:ring-fifa-emerald focus:outline-none dark:text-white"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handlePresetClick(preset)}
            className="bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[10px] font-semibold text-slate-600 dark:text-slate-300 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-white/5 transition-all text-left"
          >
            ⚡ "{preset}"
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-white/10">
          <label htmlFor="target-lang-select" className="text-xs text-slate-700 dark:text-slate-300 font-bold">Target Language:</label>
          <select
            id="target-lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-xs font-bold dark:text-slate-200 text-slate-850 border-none p-0 focus:ring-2 focus:ring-fifa-gold focus:outline-none cursor-pointer"
          >
            {TRANSLATION_LANGUAGES.map(l => (
              <option key={l} value={l} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold">
                {l}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={transLoading || !input.trim()}
          aria-label="Translate query text"
          title="Translate query text"
          className="bg-fifa-emerald hover:bg-emerald-600 text-white font-bold text-xs py-2 px-5 rounded-xl flex items-center gap-1.5 transition-all shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold"
        >
          {transLoading ? (
            <span>Translating...</span>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-900 dark:text-fifa-gold" aria-hidden="true" /> Translate
            </>
          )}
        </button>
      </div>
    </div>
  );
});

/**
 * Localized input component for recovered item registration.
 */
const LostFoundForm = React.memo(function LostFoundForm({ onReport, lfLoading }) {
  const [item, setItem] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [locationFound, setLocationFound] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item.trim() || !desc.trim() || lfLoading) return;
    onReport({ item, description: desc, category, locationFound });
    setItem('');
    setDesc('');
    setLocationFound('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="found-item" className="sr-only">Item Name</label>
        <input
          id="found-item"
          type="text"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="Item Name (e.g. Wallet, Scarf)"
          aria-label="Item Name"
          title="Item Name"
          required
          className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-fifa-gold focus:outline-none dark:text-white font-semibold"
        />
      </div>

      <div>
        <label htmlFor="found-desc" className="sr-only">Detailed Description</label>
        <textarea
          id="found-desc"
          rows="2"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description (color, markings, details)"
          aria-label="Detailed Description"
          title="Detailed Description"
          required
          className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-fifa-gold focus:outline-none dark:text-white font-semibold"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="found-cat" className="sr-only">Category</label>
          <select
            id="found-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Item Category"
            title="Item Category"
            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-fifa-gold focus:outline-none dark:text-white cursor-pointer font-semibold"
          >
            {CATEGORIES_LIST.map(cat => (
              <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="found-loc" className="sr-only">Location Found</label>
          <input
            id="found-loc"
            type="text"
            value={locationFound}
            onChange={(e) => setLocationFound(e.target.value)}
            placeholder="Location Found"
            aria-label="Location Found"
            title="Location Found"
            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-fifa-gold focus:outline-none dark:text-white font-semibold"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={lfLoading}
        aria-label="Log recovered item"
        title="Log recovered item"
        className="w-full bg-fifa-emerald hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold cursor-pointer"
      >
        <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" /> Log Item
      </button>
    </form>
  );
});

/**
 * Localized search component for lost & found items.
 */
const LostFoundSearch = React.memo(function LostFoundSearch({ onSearchChange }) {
  const [val, setVal] = useState('');

  const handleChange = (e) => {
    const newVal = e.target.value;
    setVal(newVal);
    onSearchChange(newVal);
  };

  return (
    <div className="relative mb-3">
      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" aria-hidden="true" />
      <label htmlFor="search-registry" className="sr-only">Search recovered items</label>
      <input
        id="search-registry"
        type="text"
        value={val}
        onChange={handleChange}
        placeholder="Search items, tags..."
        aria-label="Search recovered items"
        title="Search recovered items"
        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-2 text-[10px] focus:outline-none focus:ring-2 focus:ring-fifa-gold dark:text-white font-semibold"
      />
    </div>
  );
});

export default function VolunteerDashboard() {
  const { lostAndFound, volunteerTasks, refreshState } = useStadiumState();

  // Translation States
  const [transOutput, setTransOutput] = useState('');
  const [transLoading, setTransLoading] = useState(false);
  const [transError, setTransError] = useState(false);
  const [transTargetLang, setTransTargetLang] = useState('Spanish');

  // Lost & Found States
  const [lfLoading, setLfLoading] = useState(false);
  const [lfSearchQuery, setLfSearchQuery] = useState('');

  // Run translation
  const handleTranslate = useCallback(async (text, targetLang) => {
    setTransLoading(true);
    setTransError(false);
    setTransOutput('');
    setTransTargetLang(targetLang);
    try {
      const translated = await AiService.translateText(text, targetLang);
      setTransOutput(translated);
    } catch {
      setTransError(true);
      setTransOutput('Error performing translation. Please check connection.');
    } finally {
      setTransLoading(false);
    }
  }, []);

  // Submit Found Item
  const handleFoundSubmit = useCallback(async (data) => {
    setLfLoading(true);
    try {
      await ApiService.reportLostFound({
        ...data,
        status: 'Found'
      });
      refreshState();
    } catch (err) {
      console.error(err);
    } finally {
      setLfLoading(false);
    }
  }, [refreshState]);

  // Update Task Status
  const handleToggleTask = useCallback(async (id, currentStatus) => {
    let nextStatus = 'Pending';
    if (currentStatus === 'Pending') nextStatus = 'In Progress';
    if (currentStatus === 'In Progress') nextStatus = 'Completed';
    if (currentStatus === 'Completed') nextStatus = 'Pending';

    try {
      await ApiService.updateVolunteerTask(id, nextStatus);
      refreshState();
    } catch (err) {
      console.error(err);
    }
  }, [refreshState]);

  const handleSearchChange = useCallback((query) => {
    setLfSearchQuery(query);
  }, []);

  // Memoize lost & found filtering to prevent redundant runs
  const filteredLF = useMemo(() => {
    const q = lfSearchQuery.toLowerCase().trim();
    if (!q) return lostAndFound;
    return lostAndFound.filter(item => 
      item.item.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [lostAndFound, lfSearchQuery]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Title */}
      <div className="lg:col-span-12">
        <h1 className="text-2xl font-display font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
          <Languages className="text-fifa-emerald w-7 h-7" /> Volunteer Coordination Hub
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Assist fans with real-time AI translations, log recovered items, and track your operational checklist.
        </p>
      </div>

      {/* Left Column: Translator & Checklist (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* AI Translator */}
        <GlassCard className="p-5 border-fifa-emerald/20">
          <h2 className="text-base font-bold mb-3 flex items-center gap-1.5 dark:text-white">
            <Languages className="text-fifa-emerald w-5 h-5" /> AI Multilingual Translator
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Convert instructions instantly into multiple languages to help international visitors.
          </p>

          <TranslationForm onTranslate={handleTranslate} transLoading={transLoading} />

          {/* Translation Output */}
          {transOutput && (
            <div className="mt-3 bg-fifa-emerald/5 border border-fifa-emerald/25 p-4 rounded-xl">
              <span className="text-[10px] text-emerald-800 dark:text-fifa-emerald font-extrabold uppercase tracking-wider block mb-1">
                {transError ? 'System Warning' : `Translation (${transTargetLang})`}
              </span>
              <p className={`text-xs leading-relaxed dark:text-slate-200 font-semibold ${transError ? 'text-fifa-red font-bold' : ''}`}>
                {transOutput}
              </p>
            </div>
          )}
        </GlassCard>

        {/* Volunteer Duty Checklist */}
        <GlassCard className="p-5">
          <h2 className="text-base font-bold mb-3 flex items-center gap-1.5 dark:text-white">
            <CheckSquare className="text-fifa-blue dark:text-blue-400 w-5 h-5" /> Active Volunteer Assignments
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Tasks assigned to your translation & logistics team. Tap check icon to cycle status (Pending ➡️ In Progress ➡️ Completed).
          </p>

          <div className="space-y-3.5 max-h-72 overflow-y-auto scrollbar-thin">
            {volunteerTasks.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-600 dark:text-slate-400 font-semibold">No operational assignments dispatched.</div>
            ) : (
              volunteerTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`p-4 rounded-2xl border text-xs flex justify-between items-start gap-4 transition-colors ${
                    task.status === 'Completed'
                      ? 'bg-fifa-emerald/5 border-fifa-emerald/30'
                      : task.status === 'In Progress'
                      ? 'bg-fifa-gold/5 border-fifa-gold/30'
                      : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-extrabold dark:text-white">{task.title}</div>
                    <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">{task.description}</p>
                    <div className="flex gap-2 items-center text-[10px] text-slate-500 font-semibold">
                      <span>Task: {task.id}</span>
                      <span aria-hidden="true">•</span>
                      <span>Assignee: {task.assignedTo}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleToggleTask(task.id, task.status)}
                    aria-label={`Cycle assignment status. Current: ${task.status}`}
                    title={`Cycle assignment status. Current: ${task.status}`}
                    className={`p-2 rounded-xl border font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold cursor-pointer ${
                      task.status === 'Completed'
                        ? 'bg-fifa-emerald text-white border-fifa-emerald hover:bg-emerald-600'
                        : task.status === 'In Progress'
                        ? 'bg-fifa-gold text-amber-950 border-fifa-gold hover:bg-amber-400'
                        : 'bg-transparent border-slate-300 dark:border-white/15 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {task.status === 'Completed' ? '✅ Done' : task.status === 'In Progress' ? '⚡ Active' : '⏳ Wait'}
                  </button>
                </div>
              ))
            )}
          </div>
        </GlassCard>

      </div>

      {/* Right Column: Lost & Found (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Log recovered item form */}
        <GlassCard className="p-5">
          <h2 className="text-sm font-extrabold mb-3 flex items-center gap-1.5 dark:text-white">
            <Archive className="text-amber-900 dark:text-fifa-gold w-4 h-4" aria-hidden="true" /> Register Recovered Item
          </h2>
          
          <LostFoundForm onReport={handleFoundSubmit} lfLoading={lfLoading} />
        </GlassCard>

        {/* Recovered Items registry list */}
        <GlassCard className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-extrabold flex items-center gap-1.5 dark:text-white">
              📂 Recovered Item Registry
            </h2>
            <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">{lostAndFound.length} logged</span>
          </div>

          <LostFoundSearch onSearchChange={handleSearchChange} />

          {/* Table list */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto scrollbar-thin">
            {filteredLF.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-600 dark:text-slate-300 font-semibold">No items match search filter.</div>
            ) : (
              filteredLF.map(item => (
                <div key={item.id} className="bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 p-2.5 rounded-xl text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-slate-800 dark:text-white">{item.item}</span>
                    <span className="px-1.5 py-0.5 rounded bg-fifa-gold/10 text-amber-950 dark:text-fifa-gold text-[9px] font-bold uppercase">{item.category}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-normal mb-1 font-semibold">{item.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-700 dark:text-slate-300 font-semibold">
                    <MapPin className="w-3 h-3 text-fifa-blue dark:text-blue-400" aria-hidden="true" /> {item.locationFound}
                    <span className="text-slate-400" aria-hidden="true">•</span>
                    <Clock className="w-3 h-3" aria-hidden="true" /> {item.dateAdded}
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
