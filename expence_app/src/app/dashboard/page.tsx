//dashboard page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ChatbotModal from '@/components/ChatbotModal';
import { 
  Compass, 
  BarChart3,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  PlusCircle
} from 'lucide-react';
import Image from 'next/image';
import { useQuests } from '@/contexts/QuestContext';
import { QuestStatus } from '@/types/quest';
import { useAuth } from '@/components/auth/AuthProvider';
import { useUserContext } from '@/components/QuestWrapper';
import { STORY_CHAPTERS } from '@/data/storyQuests';

export default function DashboardContent() {
  const { quests } = useQuests();
  const userContext = useUserContext();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  // Calculate quest counts dynamically
  const activeQuests = quests.filter(q => q.status === 'new' || q.status === 'in_progress');
  
  // Calculate unlocked story chapters
  const userLevel = userContext?.currentLevel ?? 1;
  const unlockedStoryChapters = STORY_CHAPTERS.filter(chapter => chapter.isUnlocked(userLevel));
  const totalStoryChapters = STORY_CHAPTERS.length;

  // Recently completed quests (limit 5)
  const completedQuests = quests
    .filter(q => q.status === QuestStatus.COMPLETED)
    .sort((a, b) => {
      const aDate = new Date(a.completedAt || a.updatedAt).getTime();
      const bDate = new Date(b.completedAt || b.updatedAt).getTime();
      return bDate - aDate;
    })
    .slice(0, 5);

  // Recently created quests (limit 5) (exclude those already completed to avoid duplication)
  const recentlyCreatedQuests = quests
    .filter(q => q.status !== QuestStatus.COMPLETED)
    .sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();
      return bDate - aDate;
    })
    .slice(0, 5);

  const categoryBadgeStyles: Record<string, string> = {
    main_story: 'bg-cyan-900 text-cyan-300 border border-cyan-600',
    important: 'bg-purple-900 text-purple-300 border border-purple-600',
    side_jobs: 'bg-green-900 text-green-300 border border-green-600'
  };
  
  const handleBriefcaseClick = () => {
    setIsChatbotOpen(true);
  };

  const { signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden flex flex-col">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e30_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0px,transparent_1px,#3c3c5c_1px,transparent_2px,transparent_4px)] bg-[size:100%_4px] opacity-5 z-0"></div>
      
      {/* Header Bar */}
      <Header onSignOut={signOut} />
      
      <main className="flex-1 w-full max-w-7xl p-4 md:p-6 mx-auto relative z-10">
        <div className="flex items-center mb-6">
          <div className="h-6 w-1 bg-cyan-500 mr-3"></div>
          <h1 className="text-xl md:text-2xl font-bold text-white">DASHBOARD_<span className="text-cyan-400">MAIN</span></h1>
        </div>

        {/* Navigation Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/dashboard" className="group col-span-1 md:col-span-2">
            <div className="relative bg-purple-900 bg-opacity-50 h-16 flex flex-col items-center justify-center clip-pentagon-button text-center p-2 border border-purple-500 hover:bg-opacity-75">
              <div className="text-purple-400 mb-1">
                <BarChart3 size={20} className="mx-auto" />
              </div>
              <div className="text-white font-medium text-sm">DASH</div>
            </div>
          </Link>
          
          <Link href="/dashboard/quests" className="group col-span-1 md:col-span-2">
            <div className="relative bg-cyan-900 bg-opacity-30 h-16 flex flex-col items-center justify-center clip-pentagon-button text-center p-2 border border-cyan-500 hover:bg-opacity-75">
              <div className="relative">
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {activeQuests.length}  {/* <-- Use the dynamic count */}
                </div>
                <Compass size={20} className="text-cyan-400 mx-auto" />
              </div>
              <div className="text-white font-medium text-sm mt-1">QUESTS</div>
            </div>
          </Link>
        </div>

        <div className="mb-10"></div>

        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* MAIN_STORY card */}
          <Link href="/dashboard/story-quest" className="block">
            <div className="bg-gray-900 bg-opacity-80 shadow-lg relative overflow-hidden group border border-cyan-500 hover:bg-opacity-90 transition-all duration-300">
              {/* Rotated corner */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-900 clip-corner-rotated"></div>
              <div className="absolute bottom-0 left-0 w-5 h-1 bg-cyan-500 group-hover:w-full transition-all duration-300"></div>
                        
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-400 flex items-center relative">
                  <Compass size={18} className="mr-2 text-cyan-400" />
                  <span>MAIN QUESTS</span>
                </h2>
                <p className="mt-2 text-3xl font-bold text-cyan-400">
                  {unlockedStoryChapters.length}/{totalStoryChapters}
                </p>
                <div className="mt-4 text-xs text-gray-500 flex items-center">
                  <AlertTriangle size={10} className="mr-1 text-cyan-500" />
                  <span>MAIN QUESTLINE</span>
                </div>
              </div>
            </div>
          </Link>
          
          {/* LEARNING_QUEST card */}
          <Link href="/dashboard/learning-quest" className="block">
            <div className="bg-gray-900 bg-opacity-80 shadow-lg relative overflow-hidden group border border-yellow-500 hover:bg-opacity-90 transition-all duration-300">
              {/* Rotated corner */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-900 clip-corner-rotated"></div>
              <div className="absolute bottom-0 left-0 w-5 h-1 bg-yellow-500 group-hover:w-full transition-all duration-300"></div>

              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-400 flex items-center relative">
                  <Briefcase size={18} className="mr-2 text-yellow-400" />
                  <span>CASE_LEARNING</span>
                </h2>
                <p className="mt-2 text-3xl font-bold text-yellow-400">
                  3
                </p>
                <div className="mt-4 text-xs text-gray-500 flex items-center">
                  <AlertTriangle size={10} className="mr-1 text-yellow-500" />
                  <span>SKILL BUILDING</span>
                </div>
              </div>
            </div>
          </Link>
          
          
          {/* ACTIVE_QUESTS card */}
          <Link href="/dashboard/quests" className="block">
            <div className="bg-gray-900 bg-opacity-80 shadow-lg relative overflow-hidden group border border-green-500 hover:bg-opacity-90 transition-all duration-300">
              <div className="absolute top-0 right-0 w-8 h-8 bg-green-900 clip-corner-rotated"></div>
              <div className="absolute bottom-0 left-0 w-5 h-1 bg-green-500 group-hover:w-full transition-all duration-300"></div>
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-400 flex items-center relative">
                  <BarChart3 size={18} className="mr-2 text-green-400" />
                  <span>ACTIVE_QUESTS</span>
                </h2>
                <p className="mt-2 text-3xl font-bold text-green-400">
                  {activeQuests.length}
                </p>
                <div className="mt-4 text-xs text-gray-500 flex items-center">
                  <AlertTriangle size={10} className="mr-1 text-green-500" />
                  <span>IN PROGRESS</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Recent Quest Activity */}
        <div className="mb-8 bg-gray-900 bg-opacity-80 shadow-lg relative border border-purple-500">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600"></div>
          <div className="p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <div className="h-5 w-1 bg-purple-500 mr-2"></div>
              <h2 className="text-lg sm:text-xl font-medium text-white tracking-wide">RECENT_QUEST_ACTIVITY</h2>
              <Link href="/dashboard/quests" className="ml-auto text-xs text-purple-300 border border-purple-700 px-2 py-1 cursor-pointer hover:bg-gray-800">VIEW_ALL</Link>
            </div>
            <div className="space-y-8">
              {/* Recently Created */}
              <div className="w-full">
                <h3 className="text-sm font-semibold text-cyan-300 flex items-center mb-3 tracking-wide">
                  <PlusCircle size={14} className="mr-2 text-cyan-400" /> NEWLY_CREATED
                </h3>
                {recentlyCreatedQuests.length === 0 ? (
                  <div className="text-xs text-gray-400 bg-gray-800 bg-opacity-60 p-3 border-l-2 border-cyan-600">No recent quests created.</div>
                ) : (
                  <div className="space-y-2">
                    {recentlyCreatedQuests.map(q => {
                      const badgeClass = categoryBadgeStyles[q.category] || 'bg-gray-800 text-gray-300 border border-gray-600';
                      const createdDate = new Date(q.createdAt);
                      const dateLabel = createdDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                      return (
                        <div key={q.id} className="bg-gray-800 bg-opacity-60 p-3 border-l-2 border-cyan-500 relative overflow-hidden group hover:bg-gray-750/60 transition-colors">
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-900 clip-corner-rotated-inverse"></div>
                          <p className="font-medium text-white text-xs flex items-center mb-1">
                            {q.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className={`text-[9px] px-2 py-0.5 rounded ${badgeClass}`}>{q.category.toUpperCase()}</span>
                            <span className="text-[9px] text-gray-400">{dateLabel}</span>
                            <span className="text-[9px] text-cyan-300">GOAL: {q.goal}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {/* Recently Completed */}
              <div className="w-full">
                <h3 className="text-sm font-semibold text-purple-300 flex items-center mb-3 tracking-wide">
                  <CheckCircle2 size={14} className="mr-2 text-purple-400" /> RECENTLY_COMPLETED
                </h3>
                {completedQuests.length === 0 ? (
                  <div className="text-xs text-gray-400 bg-gray-800 bg-opacity-60 p-3 border-l-2 border-purple-600">No quests completed yet.</div>
                ) : (
                  <div className="space-y-2">
                    {completedQuests.map(q => {
                      const badgeClass = categoryBadgeStyles[q.category] || 'bg-gray-800 text-gray-300 border border-gray-600';
                      const completedDate = q.completedAt ? new Date(q.completedAt) : new Date(q.updatedAt);
                      const dateLabel = completedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                      return (
                        <div key={q.id} className="bg-gray-800 bg-opacity-60 p-3 border-l-2 border-purple-500 relative overflow-hidden group hover:bg-gray-750/60 transition-colors">
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-900 clip-corner-rotated-inverse"></div>
                          <p className="font-medium text-white text-xs flex items-center mb-1">
                            {q.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className={`text-[9px] px-2 py-0.5 rounded ${badgeClass}`}>{q.category.toUpperCase()}</span>
                            <span className="text-[9px] text-gray-400">{dateLabel}</span>
                            <span className="text-[9px] text-purple-300">+{q.expReward} EXP</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chatbot Modal */}
        <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

        {/* Floating Briefcase Icon */}
        {!isChatbotOpen && (
          <div 
            className="fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-50 pointer-events-auto"
            onClick={handleBriefcaseClick}
          >
            <div className="relative">
              <Image
                src="/briefcase.png"
                alt="Briefcase"
                width={240}
                height={160}
                priority={true}
                className="w-[180px] h-[120px] sm:w-[210px] sm:h-[140px] md:w-[240px] md:h-[160px] hover:scale-105 transition-transform cursor-pointer"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}