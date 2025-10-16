'use client';

import React, { useState, useEffect } from 'react';
import {
  Quest,
  QuestCategory,
  QuestStatus,
  UserContext
} from '../types/quest';
import { useQuests } from '../contexts/QuestContext';
import QuestCard from './QuestCard';
import {
  Plus,
  Filter,
  Search,
  BookOpen,
  AlertTriangle,
  Briefcase,
  Sparkles,
  RefreshCw,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useUserContext } from './QuestWrapper';

interface QuestDashboardProps {
  onCreateCustomQuest?: () => void;
  onGenerateAIQuest?: () => void;
}

const QuestDashboard: React.FC<QuestDashboardProps> = ({
  onCreateCustomQuest,
  onGenerateAIQuest
}) => {
  const userContext = useUserContext();
  const level = userContext?.level ?? 1;

  const {
    quests,
    loading,
    startQuest,
    completeQuest,
    pauseQuest,
    removeQuest,
    generateInitialQuests
  } = useQuests();

  // ---------- FILTER STATE ----------
  const [filteredQuests, setFilteredQuests] = useState<Quest[]>([]);
  const [activeCategory, setActiveCategory] = useState<QuestCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ---------- SELECTION (RIGHT-PANE) ----------
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = filteredQuests.find(q => q.id === selectedId) ?? filteredQuests[0] ?? null;

  // ---------- HELPERS ----------
  const getCategoryIcon = (category: QuestCategory) => {
    switch (category) {
      case QuestCategory.MAIN_STORY: return <BookOpen size={16} />;
      case QuestCategory.IMPORTANT:  return <AlertTriangle size={16} />;
      case QuestCategory.SIDE_JOBS:  return <Briefcase size={16} />;
      default:                       return <BookOpen size={16} />;
    }
  };

  const getCategoryCount = (category: QuestCategory | 'all') => {
    if (category === 'all') return quests.length;
    return quests.filter(quest => quest.category === category).length;
  };

  const normalizeProgress = (q: Quest) => {
    // Accept multiple shapes safely
    const p = q.progress ?? {
      current: (q as any).progressCurrent ?? (q as any).current ?? 0,
      target:  (q as any).progressTarget  ?? (q as any).target  ?? 1,
      label:   (q as any).progressLabel   ?? 'steps',
    };

    const pct = Math.max(
      0,
      Math.min(
        100,
        Math.round((p.current / Math.max(1, p.target)) * 100)
      )
    );

    return { ...p, pct };
  };

  const requiredLevel = (q: Quest) => q.requiredLevel ?? 1;
  const isLocked = (q: Quest) => level < requiredLevel(q);

  const generateMoreQuests = () => generateInitialQuests(userContext);

  const fitsCategory = (q: Quest) =>
    activeCategory === 'all' ? true : q.category === activeCategory;

  const fitsSearch = (q: Quest) => {
    if (!searchTerm) return true;
    const hay = (q.title + ' ' + (q.description ?? '') + ' ' + (q.tags ?? []).join(' '))
      .toLowerCase();
    return hay.includes(searchTerm.toLowerCase());
  };

  const filterAll = () => {
    const filtered = quests.filter(q => fitsCategory(q) && fitsSearch(q));
    setFilteredQuests(filtered);
  };

  useEffect(() => {
    filterAll();
    setSelectedId(prev => {
      if (!prev) return filteredQuests[0]?.id ?? null;
      return filteredQuests.some(q => q.id === prev) ? prev : filteredQuests[0]?.id ?? null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quests, activeCategory, searchTerm]);

  // ---------- LIST ITEM ----------
  const ListItem: React.FC<{ q: Quest; active: boolean; onClick: () => void }> = ({ q, active, onClick }) => {
    const locked = isLocked(q);
    return (
      <button
        onClick={onClick}
        className={`group relative flex w-full items-start gap-3 rounded-md border px-3 py-3 text-left transition
          ${active
            ? 'border-rose-500/60 bg-rose-500/10 shadow-[inset_0_0_40px_-20px_rgba(244,63,94,.8)]'
            : 'border-rose-900/30 bg-[#0c1117] hover:border-rose-700/50 hover:bg-[#111821]'}
          ${locked ? 'opacity-70' : ''}`}
      >
        <div className="mt-0.5">{locked ? <Lock className="h-4 w-4 text-rose-300" /> : getCategoryIcon(q.category)}</div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold tracking-wide text-slate-100">
            {q.title}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[10px] tracking-widest text-rose-300">
            {q.category === QuestCategory.MAIN_STORY ? 'MAIN STORY' : q.category === QuestCategory.SIDE_JOBS ? 'SIDE JOB' : 'IMPORTANT'}
            {locked && (
              <span className="ml-1 rounded-sm border border-rose-600/50 px-1.5 py-0.5 text-[10px] text-rose-300">
                LOCKED
              </span>
            )}
          </div>
        </div>

        {/* accent strip */}
        {active && <div className="absolute inset-y-0 right-0 w-1 rounded-r-md bg-gradient-to-b from-rose-500 to-pink-400" />}
      </button>
    );
  };

  // ---------- RIGHT PANEL ----------
  const RightPanel: React.FC<{ q: Quest | null }> = ({ q }) => {
    if (!q) {
      return (
        <section className="relative overflow-hidden rounded-xl border border-rose-700/50 bg-[#0f141a]/80 p-6 text-slate-300/90 shadow-[0_0_60px_-18px_rgba(244,63,94,.75)]">
          <div className="opacity-70">Select a quest from the left to see details.</div>
        </section>
      );
    }

    const p = normalizeProgress(q);
    const locked = isLocked(q);

    return (
      <section className="relative overflow-hidden rounded-xl border border-rose-700/50 bg-[#0f141a]/80 p-6 shadow-[0_0_60px_-18px_rgba(244,63,94,.75)]">
        <h1 className="mb-1 text-xl font-bold tracking-wide text-rose-300">{q.title}</h1>

        <div className="inline-flex items-center gap-2 rounded-md border border-rose-700/50 bg-rose-500/10 px-2 py-1 text-[11px] tracking-widest text-rose-200">
          {locked ? (
            <>
              <Lock className="h-3.5 w-3.5" />
              <span>LOCKED — REQUIRES LEVEL {requiredLevel(q)} (YOU: {level})</span>
            </>
          ) : (
            <>
              <ArrowRight className="h-3.5 w-3.5" />
              <span>{(q.objective ?? 'Objective available').toUpperCase()}</span>
            </>
          )}
        </div>

        <p className="mt-4 max-w-3xl leading-relaxed text-slate-300/90">
          {q.description ?? q.summary ?? 'No description provided.'}
        </p>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-slate-300/90">
            <span>Progress</span>
            <span>{p.current} / {p.target} {p.label}</span>
          </div>
          <div className="mt-2 h-2 w-full rounded bg-slate-700/50">
            <div className="h-full rounded bg-rose-400/80" style={{ width: `${p.pct}%` }} />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => startQuest(q.id)}
            disabled={locked || loading}
            className={`rounded-md px-4 py-2 text-sm font-semibold
              ${locked ? 'cursor-not-allowed opacity-50 bg-amber-600/50 text-black' : 'bg-amber-600/80 hover:bg-amber-500 text-black'}`}
          >
            Start Quest
          </button>
          <button
            onClick={() => completeQuest(q.id)}
            className="rounded-md border border-slate-500/60 px-3 py-2 text-sm text-slate-200 hover:border-rose-400/60"
          >
            Mark Complete
          </button>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
      </section>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <div className="h-6 w-1 bg-rose-500 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Job<span className="text-rose-400"> List</span>
          </h1>
          <div className="ml-4 text-sm text-gray-400">
            {quests.length} active quest{quests.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onGenerateAIQuest}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-pink-900 bg-opacity-50 border border-pink-500 text-pink-300 hover:bg-opacity-75 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Generate AI Quests
          </button>

          {onCreateCustomQuest && (
            <button
              onClick={onCreateCustomQuest}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-900 bg-opacity-50 border border-rose-500 text-rose-300 hover:bg-opacity-75 transition-all duration-300"
            >
              <Plus size={16} />
              Create Custom
            </button>
          )}
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search quests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex gap-2">
          <FilterChip
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            label={`All (${getCategoryCount('all')})`}
          />
          <FilterChip
            active={activeCategory === QuestCategory.MAIN_STORY}
            onClick={() => setActiveCategory(QuestCategory.MAIN_STORY)}
            icon={<BookOpen size={16} />}
            label={`Main Story (${getCategoryCount(QuestCategory.MAIN_STORY)})`}
          />
          <FilterChip
            active={activeCategory === QuestCategory.IMPORTANT}
            onClick={() => setActiveCategory(QuestCategory.IMPORTANT)}
            icon={<AlertTriangle size={16} />}
            label={`Important (${getCategoryCount(QuestCategory.IMPORTANT)})`}
          />
          <FilterChip
            active={activeCategory === QuestCategory.SIDE_JOBS}
            onClick={() => setActiveCategory(QuestCategory.SIDE_JOBS)}
            icon={<Briefcase size={16} />}
            label={`Side Jobs (${getCategoryCount(QuestCategory.SIDE_JOBS)})`}
          />
        </div>
      </div>

      {/* TWO-PANE JOURNAL LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-[360px,1fr] gap-6">
        {/* LEFT LIST */}
        <aside className="rounded-xl border border-rose-700/50 bg-[#11161c]/70 p-2 shadow-[0_0_60px_-18px_rgba(244,63,94,.75)]">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[11px] font-semibold tracking-[0.3em] text-rose-300">
              {activeCategory === 'all' ? 'ALL QUESTS' : String(activeCategory).replace('_', ' ').toUpperCase()}
            </h2>
            <div className="h-px flex-1 bg-rose-800/40" />
          </div>

          <div className="space-y-1 overflow-hidden rounded-md">
            {filteredQuests.map((q) => (
              <ListItem
                key={q.id}
                q={q}
                active={selected?.id === q.id}
                onClick={() => setSelectedId(q.id)}
              />
            ))}

            {!loading && filteredQuests.length === 0 && (
              <div className="p-4 text-sm text-slate-400">No quests found.</div>
            )}
          </div>
        </aside>

        {/* RIGHT DETAIL */}
        <RightPanel q={selected} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw size={48} className="mx-auto mb-4 text-rose-400 animate-spin" />
          <p className="text-lg text-gray-300">Loading quests...</p>
          <p className="text-sm text-gray-400">Preparing your financial challenges</p>
        </div>
      )}
    </div>
  );
};

// ------- Small UI helpers -------
function FilterChip({
  active,
  onClick,
  label,
  icon
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
        active ? 'bg-rose-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {icon} <span>{label}</span>
    </button>
  );
}

export default QuestDashboard;
