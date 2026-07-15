import React, { useState } from 'react';
import { useStadiumState } from '../context/StadiumStateContext';
import { AiService, ApiService } from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  Languages, Archive, CheckSquare, Sparkles, 
  MapPin, Clock, Search, PlusCircle 
} from 'lucide-react';

export default function VolunteerDashboard() {
  const { lostAndFound, volunteerTasks, refreshState } = useStadiumState();

  // Translation States
  const [transInput, setTransInput] = useState('');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [transOutput, setTransOutput] = useState('');
  const [transLoading, setTransLoading] = useState(false);
  const [transError, setTransError] = useState(false);

  // Lost and Found States
  const [lfItem, setLfItem] = useState('');
  const [lfDesc, setLfDesc] = useState('');
  const [lfCategory, setLfCategory] = useState('Electronics');
  const [lfLocation, setLfLocation] = useState('');
  const [lfSearch, setLfSearch] = useState('');
  const [lfLoading, setLfLoading] = useState(false);

  // Quick preset statements for emergency translation
  const presets = [
    'Where is the nearest restroom?',
    'Gate A is currently full. Please enter through Gate B.',
    'Emergency Alert: Please remain calm and follow staff instructions.'
  ];

  // Run translation
  const handleTranslate = async (textToTranslate) => {
    const text = textToTranslate || transInput;
    if (!text.trim() || transLoading) return;
    setTransLoading(true);
    setTransError(false);
    setTransOutput('');
    try {
      const translated = await AiService.translateText(text, targetLang);
      setTransOutput(translated);
    } catch {
      setTransError(true);
      setTransOutput('Error performing translation. Please check connection.');
    } finally {
      setTransLoading(false);
    }
  };

  // Submit Found Item
  const handleFoundSubmit = async (e) => {
    e.preventDefault();
    if (!lfItem || !lfDesc || lfLoading) return;
    setLfLoading(true);
    try {
      await ApiService.reportLostFound({
        item: lfItem,
        description: lfDesc,
        category: lfCategory,
        locationFound: lfLocation,
        status: 'Found'
      });
      setLfItem('');
      setLfDesc('');
      setLfLocation('');
      refreshState();
    } catch (err) {
      console.error(err);
    } finally {
      setLfLoading(false);
    }
  };

  // Update Task Status
  const handleToggleTask = async (id, currentStatus) => {
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
  };

  // Filter lost & found list based on query
  const filteredLF = lostAndFound.filter(item => {
    const q = lfSearch.toLowerCase();
    return (
      item.item.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

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

          <div className="space-y-4">
            {/* Input field */}
            <div>
              <label htmlFor="translate-input" className="sr-only">Text to translate</label>
              <textarea
                id="translate-input"
                rows="3"
                value={transInput}
                onChange={(e) => setTransInput(e.target.value)}
                placeholder="Type or paste guest query..."
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs focus:ring-2 focus:ring-fifa-emerald focus:outline-none dark:text-white"
              />
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTransInput(preset);
                    handleTranslate(preset);
                  }}
                  className="bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[10px] font-semibold text-slate-600 dark:text-slate-300 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-white/5 transition-all text-left"
                >
                  ⚡ "{preset}"
                </button>
              ))}
            </div>

            {/* Language Selector & CTA */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-white/10">
                <label htmlFor="target-lang-select" className="text-xs text-slate-700 dark:text-slate-300 font-bold">Target Language:</label>
                <select
                  id="target-lang-select"
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="bg-transparent text-xs font-bold dark:text-slate-200 text-slate-850 border-none p-0 focus:ring-2 focus:ring-fifa-gold focus:outline-none cursor-pointer"
                >
                  {['Spanish', 'French', 'German', 'Arabic', 'Japanese', 'Portuguese'].map(lang => (
                    <option key={lang} value={lang} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold">
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => handleTranslate()}
                disabled={transLoading || !transInput.trim()}
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

            {/* Translation Output */}
            {transOutput && (
              <div className="mt-3 bg-fifa-emerald/5 border border-fifa-emerald/25 p-4 rounded-xl">
                <span className="text-[10px] text-emerald-800 dark:text-fifa-emerald font-extrabold uppercase tracking-wider block mb-1">
                  {transError ? 'System Warning' : `Translation (${targetLang})`}
                </span>
                <p className={`text-sm dark:text-slate-200 text-slate-800 font-bold leading-relaxed ${transError ? 'text-red-700 dark:text-fifa-red font-bold' : ''}`}>{transOutput}</p>
                {transError && (
                  <button
                    type="button"
                    onClick={() => handleTranslate()}
                    aria-label="Try translation again"
                    title="Try translation again"
                    className="mt-2 bg-fifa-blue hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold"
                  >
                    🔄 Try Again
                  </button>
                )}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Task Board */}
        <GlassCard className="p-5">
          <h2 className="text-base font-bold mb-3 flex items-center gap-1.5 dark:text-white">
            <CheckSquare className="text-fifa-blue w-5 h-5" /> Assigned Task Board
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Tasks assigned from operations supervisors. Click a task card to cycle statuses.
          </p>

          <div className="space-y-3">
            {volunteerTasks.map(task => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id, task.status)}
                role="button"
                tabIndex={0}
                aria-label={`Task: ${task.title}. Status: ${task.status}. Click to change status.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggleTask(task.id, task.status);
                  }
                }}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex justify-between items-start gap-4 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-gold ${
                  task.status === 'Completed'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-850 dark:text-emerald-300'
                    : task.status === 'In Progress'
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-800 dark:text-blue-300'
                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-extrabold flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">Task {task.id}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span className="dark:text-white text-slate-800">{task.title}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-normal font-semibold">{task.description}</p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase ${
                    task.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-700'
                      : task.status === 'In Progress'
                      ? 'bg-blue-500/20 text-blue-600'
                      : 'bg-slate-200 dark:bg-white/10 text-slate-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
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
          
          <form onSubmit={handleFoundSubmit} className="space-y-3">
            <div>
              <label htmlFor="found-item" className="sr-only">Item Name</label>
              <input
                id="found-item"
                type="text"
                value={lfItem}
                onChange={(e) => setLfItem(e.target.value)}
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
                value={lfDesc}
                onChange={(e) => setLfDesc(e.target.value)}
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
                  value={lfCategory}
                  onChange={(e) => setLfCategory(e.target.value)}
                  aria-label="Item Category"
                  title="Item Category"
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-fifa-gold focus:outline-none dark:text-white cursor-pointer font-semibold"
                >
                  <option value="Electronics" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold">Electronics</option>
                  <option value="Wallet/ID" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold">Wallet/ID</option>
                  <option value="Apparel" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold">Apparel</option>
                  <option value="Keys" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold">Keys</option>
                </select>
              </div>

              <div>
                <label htmlFor="found-loc" className="sr-only">Location Found</label>
                <input
                  id="found-loc"
                  type="text"
                  value={lfLocation}
                  onChange={(e) => setLfLocation(e.target.value)}
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
        </GlassCard>

        {/* Recovered Items registry list */}
        <GlassCard className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-extrabold flex items-center gap-1.5 dark:text-white">
              📂 Recovered Item Registry
            </h2>
            <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">{lostAndFound.length} logged</span>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" aria-hidden="true" />
            <label htmlFor="search-registry" className="sr-only">Search recovered items</label>
            <input
              id="search-registry"
              type="text"
              value={lfSearch}
              onChange={(e) => setLfSearch(e.target.value)}
              placeholder="Search items, tags..."
              aria-label="Search recovered items"
              title="Search recovered items"
              className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-2 text-[10px] focus:outline-none focus:ring-2 focus:ring-fifa-gold dark:text-white font-semibold"
            />
          </div>

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
