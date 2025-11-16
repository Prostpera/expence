'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Image from 'next/image';
import { 
  Quest, 
  QuestCategory, 
  QuestStatus, 
  UserContext 
} from '@/types/quest';
// Removed unused quest context imports since story quests are static
import {
  Search,
  BookOpen,
  RefreshCw,
  ArrowLeft,
  Lock,
  ArrowRight,
  Star,
  Zap,
  Eye,
  Terminal
} from 'lucide-react';
import { useUserContext } from '@/components/QuestWrapper';
import { useAuth } from '@/components/auth/AuthProvider';
import { STORY_CHAPTERS, StoryQuest, getUnlockedChapters, getNextLockedChapter } from '@/data/storyQuests';

interface QuestProgress {
  current: number;
  target: number;
  label: string;
  pct: number;
}

const StoryQuestPage: React.FC = () => {
  const userContext = useUserContext();
  const level = userContext?.currentLevel ?? 1;
  const { signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fitsSearch = (quest: StoryQuest) => {
    if (!searchTerm) return true;
    const hay = (quest.title + ' ' + quest.description + ' ' + quest.storySection + ' ' + (quest.tags ?? []).join(' '))
      .toLowerCase();
    return hay.includes(searchTerm.toLowerCase());
  };
  
  // Get story quests - just static data filtered by search
  const storyQuests = STORY_CHAPTERS.filter(quest => fitsSearch(quest));

  const selected = storyQuests.find(q => q.id === selectedId) ?? storyQuests[0] ?? null;

  const normalizeProgress = (q: Quest): QuestProgress => {
    const current = q.progress ?? 0;
    const target = q.goal ?? 1;

    const pct = Math.max(
      0,
      Math.min(
        100,
        Math.round((current / Math.max(1, target)) * 100)
      )
    );

    return { 
      current, 
      target, 
      label: 'steps',
      pct 
    };
  };

  const isLocked = (quest: StoryQuest) => !quest.isUnlocked(level);

  // Simple handler to move to next unlocked chapter
  const handleNext = () => {
    if (!selected) return;
    const currentIndex = storyQuests.findIndex(q => q.id === selected.id);
    
    // Find the next unlocked chapter
    for (let i = currentIndex + 1; i < storyQuests.length; i++) {
      const nextQuest = storyQuests[i];
      if (!isLocked(nextQuest)) {
        setSelectedId(nextQuest.id);
        return;
      }
    }
  };

  // Check if there's a next available chapter
  const hasNextChapter = () => {
    if (!selected) return false;
    const currentIndex = storyQuests.findIndex(q => q.id === selected.id);
    
    // Check if any subsequent chapter is unlocked
    for (let i = currentIndex + 1; i < storyQuests.length; i++) {
      if (!isLocked(storyQuests[i])) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    setSelectedId(prev => {
      if (!prev) return storyQuests[0]?.id ?? null;
      return storyQuests.some(q => q.id === prev) ? prev : storyQuests[0]?.id ?? null;
    });
  }, [storyQuests]);

  // ---------- LIST ITEM ----------
  const ListItem: React.FC<{ q: StoryQuest; active: boolean; onClick: () => void }> = ({ q, active, onClick }) => {
    const locked = isLocked(q);
    return (
      <button
        onClick={onClick}
        className={`group relative flex w-full items-start gap-3 rounded-md border px-3 py-3 text-left transition
          ${active
            ? 'border-blue-500/60 bg-blue-500/10 shadow-[inset_0_0_40px_-20px_rgba(59,130,246,.8)]'
            : 'border-blue-900/30 bg-[#0c1117] hover:border-blue-700/50 hover:bg-[#111821]'}
          ${locked ? 'opacity-70' : ''}`}
      >
        <div className="mt-0.5 flex flex-col items-center">
          <div className="text-[10px] text-blue-400 font-bold mb-1">CH.{q.chapter}</div>
          {locked ? <Lock className="h-4 w-4 text-blue-300" /> : <Terminal className="h-4 w-4 text-blue-400" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold tracking-wide text-slate-100">
            {q.title}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[10px] tracking-widest text-blue-300">
            {q.storySection.toUpperCase()}
            {locked && (
              <span className="ml-1 rounded-sm border border-blue-600/50 px-1.5 py-0.5 text-[10px] text-blue-300">
                LVL {q.requiredLevel} REQ
              </span>
            )}
          </div>
        </div>

        {/* accent strip */}
        {active && <div className="absolute inset-y-0 right-0 w-1 rounded-r-md bg-gradient-to-b from-blue-500 to-cyan-400" />}
      </button>
    );
  };

  // ---------- RIGHT PANEL ----------
  const RightPanel: React.FC<{ q: StoryQuest | null }> = ({ q }) => {
    if (!q) {
      return (
        <section className="relative overflow-hidden rounded-xl border border-blue-700/50 bg-[#0f141a]/80 p-6 text-slate-300/90 shadow-[0_0_60px_-18px_rgba(59,130,246,.75)]">
          <div className="opacity-70">Select a story chapter from the left to see details.</div>
        </section>
      );
    }

    const p = normalizeProgress(q);
    const locked = isLocked(q);

    return (
      <section className="relative overflow-hidden rounded-xl border border-blue-700/50 bg-[#0f141a]/80 p-6 shadow-[0_0_60px_-18px_rgba(59,130,246,.75)] max-h-[80vh] overflow-y-auto">
        {/* Chapter Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex flex-col items-center">
            <div className="text-xs text-blue-400 font-bold mb-1">CHAPTER {q.chapter}</div>
            <Terminal className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-blue-300">{q.title}</h1>
            <div className="text-sm text-blue-500">{q.storySection}</div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-md border border-blue-700/50 bg-blue-500/10 px-2 py-1 text-[11px] tracking-widest text-blue-200 mb-4">
          {locked ? (
            <>
              <Lock className="h-3.5 w-3.5" />
              <span>LOCKED — REQUIRES LEVEL {q.requiredLevel} (YOU: {level})</span>
            </>
          ) : (
            <>
              <Zap className="h-3.5 w-3.5" />
              <span>STORY CHAPTER AVAILABLE</span>
            </>
          )}
        </div>

        {/* Story Narrative */}
        {!locked && (
          <div className="space-y-6">
            <div className="bg-slate-800/40 border border-blue-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-300">NARRATIVE</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300/90 whitespace-pre-line">
                {q.narrative}
              </p>
            </div>

            {/* Case Dialogue */}
            {q.caseDialogue && (
              <div className="bg-cyan-900/20 border border-cyan-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-8 h-8 rounded border border-cyan-500 overflow-hidden flex items-center justify-center bg-cyan-900/30">
                    <Image
                      src="/briefcase.png"
                      alt="Case"
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-cyan-300">CASE</div>
                    <div className="text-xs text-cyan-400">ExpenseBot Assistant</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-cyan-100/90 italic">
                  &quot;{q.caseDialogue}&quot;
                </p>
              </div>
            )}
          </div>
        )}

        {locked && (
          <div className="bg-slate-800/40 border border-blue-800/50 rounded-lg p-4">
            <p className="text-sm leading-relaxed text-slate-300/70">
              {q.description}
            </p>
            <div className="mt-3 text-xs text-blue-400">
              Complete previous chapters and reach Level {q.requiredLevel} to unlock this story content.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Chapter {q.chapter} of {STORY_CHAPTERS.length}
          </div>
          <button
            onClick={handleNext}
            disabled={!hasNextChapter()}
            className={`rounded-md px-4 py-2 text-sm font-semibold flex items-center gap-2
              ${!hasNextChapter()
                ? 'cursor-not-allowed opacity-50 bg-slate-600/50 text-slate-400' 
                : 'bg-blue-600/80 hover:bg-blue-500 text-white'}`}
          >
            {!hasNextChapter() ? 'No More Chapters' : 'Next Chapter'}
            {hasNextChapter() && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-blue-950 relative overflow-hidden flex flex-col">
      {/* Blue themed background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e2851_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0px,transparent_1px,#3c4c7c_1px,transparent_2px,transparent_4px)] bg-[size:100%_4px] opacity-5 z-0"></div>
      
      {/* Header */}
      <Header onSignOut={signOut} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Back Button Row */}
          <div>
            <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-blue-400 transition-colors group text-sm">
              <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-0.5 transition-transform" />
              <span className="tracking-wide">BACK</span>
            </Link>
          </div>
          {/* Title Row */}
          <div className="flex items-center">
            <div className="h-6 w-1 bg-blue-500 mr-3"></div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              STORY_<span className="text-blue-400">QUEST</span>
            </h1>
            <div className="ml-4 text-sm text-gray-400">
              {storyQuests.length} chapter{storyQuests.length !== 1 ? 's' : ''} • Level {level}
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search story quests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-blue-900/30 border border-blue-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* TWO-PANE JOURNAL LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-[360px,1fr] gap-6">
          {/* LEFT LIST */}
          <aside className="rounded-xl border border-blue-700/50 bg-[#11161c]/70 p-2 shadow-[0_0_60px_-18px_rgba(59,130,246,.75)]">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[11px] font-semibold tracking-[0.3em] text-blue-300">
                STORY QUESTS
              </h2>
              <div className="h-px flex-1 bg-blue-800/40" />
            </div>

            <div className="space-y-1 overflow-hidden rounded-md">
              {storyQuests.map((q) => (
                <ListItem
                  key={q.id}
                  q={q}
                  active={selected?.id === q.id}
                  onClick={() => setSelectedId(q.id)}
                />
              ))}

              {storyQuests.length === 0 && (
                <div className="p-4 text-sm text-slate-400">No story chapters found.</div>
              )}
            </div>
          </aside>

          {/* RIGHT DETAIL */}
          <RightPanel q={selected} />
        </div>

      </main>
    </div>
  );
};

export default StoryQuestPage;