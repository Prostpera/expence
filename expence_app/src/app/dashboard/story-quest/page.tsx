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
import { useQuests } from '@/contexts/QuestContext';
import QuestCard from '@/components/QuestCard';
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

  const {
    quests,
    loading,
    startQuest,
    completeQuest,
    pauseQuest,
    removeQuest,
    generateInitialQuests
  } = useQuests();

  // ---------- STORY QUEST STATE ----------
  const [searchTerm, setSearchTerm] = useState('');

  // ---------- SELECTION (RIGHT-PANE) ----------
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fitsSearch = (quest: StoryQuest) => {
    if (!searchTerm) return true;
    const hay = (quest.title + ' ' + quest.description + ' ' + quest.storySection + ' ' + (quest.tags ?? []).join(' '))
      .toLowerCase();
    return hay.includes(searchTerm.toLowerCase());
  };
  
  // Get story quests from database and merge with static chapter data
  const storyQuests = STORY_CHAPTERS.map(chapter => {
    // Find matching database quest if it exists
    const dbQuest = quests.find(q => q.tags?.includes('story') && q.tags?.includes(`chapter_${chapter.chapter}`));
    return {
      ...chapter,
      // Override with database quest data if it exists
      ...(dbQuest && {
        id: dbQuest.id,
        progress: dbQuest.progress,
        status: dbQuest.status,
        createdAt: dbQuest.createdAt,
        updatedAt: dbQuest.updatedAt
      })
    };
  }).filter(quest => fitsSearch(quest));

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

  // Initialize story quests in database when user visits page
  const initializeStoryQuests = async () => {
    if (!userContext || loading) return;
    
    try {
      // Check if any story quests exist
      const existingStoryQuests = quests.filter(q => q.tags?.includes('story'));
      
      if (existingStoryQuests.length === 0) {
        // Create the first chapter in database with proper tags
        const firstChapter = STORY_CHAPTERS[0];
        await addQuest({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: firstChapter.title,
          description: firstChapter.description,
          category: firstChapter.category,
          difficulty: firstChapter.difficulty,
          status: firstChapter.status,
          progress: firstChapter.progress,
          goal: firstChapter.goal,
          daysLeft: firstChapter.daysLeft,
          expReward: firstChapter.expReward,
          coinReward: firstChapter.coinReward,
          prerequisites: firstChapter.prerequisites,
          tags: [...(firstChapter.tags || []), `chapter_${firstChapter.chapter}`],
          createdAt: new Date(),
          updatedAt: new Date(),
          isAIGenerated: firstChapter.isAIGenerated
        });
      }
    } catch (error) {
      console.error('Error initializing story quests:', error);
    }
  };

  // Create next chapter when current one is completed
  const createNextChapter = async (completedChapter: number) => {
    const nextChapterData = STORY_CHAPTERS.find(ch => ch.chapter === completedChapter + 1);
    if (!nextChapterData || level < nextChapterData.requiredLevel) return;

    // Check if next chapter already exists
    const exists = quests.some(q => q.tags?.includes(`chapter_${nextChapterData.chapter}`));
    if (exists) return;

    try {
      await addQuest({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: nextChapterData.title,
        description: nextChapterData.description,
        category: nextChapterData.category,
        difficulty: nextChapterData.difficulty,
        status: nextChapterData.status,
        progress: nextChapterData.progress,
        goal: nextChapterData.goal,
        daysLeft: nextChapterData.daysLeft,
        expReward: nextChapterData.expReward,
        coinReward: nextChapterData.coinReward,
        prerequisites: nextChapterData.prerequisites,
        tags: [...(nextChapterData.tags || []), `chapter_${nextChapterData.chapter}`],
        createdAt: new Date(),
        updatedAt: new Date(),
        isAIGenerated: nextChapterData.isAIGenerated
      });
    } catch (error) {
      console.error('Error creating next chapter:', error);
    }
  };

  useEffect(() => {
    initializeStoryQuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userContext, loading]);

  useEffect(() => {
    setSelectedId(prev => {
      if (!prev) return storyQuests[0]?.id ?? null;
      return storyQuests.some(q => q.id === prev) ? prev : storyQuests[0]?.id ?? null;
    });
  }, [storyQuests]);

  // Custom handlers for story quest actions
  const handleStartChapter = async (quest: StoryQuest) => {
    // If this quest exists in database, start it normally
    if (quests.find(q => q.id === quest.id)) {
      await startQuest(quest.id);
    } else {
      // Create quest in database first, then start it
      await addQuest({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: quest.title,
        description: quest.description,
        category: quest.category,
        difficulty: quest.difficulty,
        status: quest.status,
        progress: quest.progress,
        goal: quest.goal,
        daysLeft: quest.daysLeft,
        expReward: quest.expReward,
        coinReward: quest.coinReward,
        prerequisites: quest.prerequisites,
        tags: [...(quest.tags || []), `chapter_${quest.chapter}`],
        createdAt: new Date(),
        updatedAt: new Date(),
        isAIGenerated: quest.isAIGenerated
      });
    }
  };

  const handleCompleteChapter = async (quest: StoryQuest) => {
    // If this quest exists in database, complete it normally
    if (quests.find(q => q.id === quest.id)) {
      await completeQuest(quest.id);
      // Create next chapter after completion
      await createNextChapter(quest.chapter);
    } else {
      // Create quest in database first, then complete it
      const questId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const questData = {
        id: questId,
        title: quest.title,
        description: quest.description,
        category: quest.category,
        difficulty: quest.difficulty,
        status: quest.status,
        progress: quest.progress,
        goal: quest.goal,
        daysLeft: quest.daysLeft,
        expReward: quest.expReward,
        coinReward: quest.coinReward,
        prerequisites: quest.prerequisites,
        tags: [...(quest.tags || []), `chapter_${quest.chapter}`],
        createdAt: new Date(),
        updatedAt: new Date(),
        isAIGenerated: quest.isAIGenerated
      };
      await addQuest(questData);
      // Wait a bit then complete it
      setTimeout(async () => {
        await completeQuest(questId);
        await createNextChapter(quest.chapter);
      }, 500);
    }
  };

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
                  "{q.caseDialogue}"
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

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-slate-300/90">
            <span>Chapter Progress</span>
            <span>{p.current} / {p.target} {p.label}</span>
          </div>
          <div className="mt-2 h-2 w-full rounded bg-slate-700/50">
            <div className="h-full rounded bg-blue-400/80" style={{ width: `${p.pct}%` }} />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => handleStartChapter(q)}
            disabled={locked || loading}
            className={`rounded-md px-4 py-2 text-sm font-semibold
              ${locked ? 'cursor-not-allowed opacity-50 bg-slate-600/50 text-slate-400' : 'bg-cyan-600/80 hover:bg-cyan-500 text-black'}`}
          >
            {locked ? 'Chapter Locked' : 'Begin Chapter'}
          </button>
          {!locked && (
            <button
              onClick={() => handleCompleteChapter(q)}
              className="rounded-md border border-slate-500/60 px-3 py-2 text-sm text-slate-200 hover:border-blue-400/60"
            >
              Complete Chapter
            </button>
          )}
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