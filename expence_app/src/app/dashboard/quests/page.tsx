
//quests page.tsx
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ChatbotModal from '@/components/ChatbotModal';
import QuestDashboard from '@/components/QuestDashboard';
import QuestGenerationModal from '@/components/QuestGenerationModal';
import { Quest, UserContext, QuestDifficulty, QuestStatus, QuestCategory } from '@/types/quest';
import { Plus, Sparkles, Brain, TrendingUp } from 'lucide-react';
import { useQuests } from '@/contexts/QuestContext';
import Image from 'next/image';

import { useAuth } from '@/components/auth/AuthProvider';

// Inner component that uses the quest context
function QuestPageContent() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customQuestData, setCustomQuestData] = useState({
    title: '',
    description: '',
    goal: '',
    days: ''
  });

  const { addQuest } = useQuests();

  const handleBriefcaseClick = () => {
    setIsChatbotOpen(true);
  };

  const handleQuestGenerated = (quest: Quest) => {
    addQuest(quest);
  };

  const handleCreateCustomQuest = () => {
    setIsCustomModalOpen(true);
  };

  const handleGenerateAIQuest = () => {
    setIsAIModalOpen(true);
  };

  const handleCustomQuestSubmit = () => {
    if (!customQuestData.title || !customQuestData.description) {
      alert('Please fill in at least title and description');
      return;
    }

    // Create a custom quest
    const customQuest: Quest = {
      id: `custom_quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: customQuestData.title,
      description: customQuestData.description,
      category: QuestCategory.SIDE_JOBS, // Default to side jobs for custom quests
      difficulty: QuestDifficulty.MEDIUM,
      status: QuestStatus.NEW,
      progress: 0,
      goal: parseInt(customQuestData.goal) || 1,
      daysLeft: parseInt(customQuestData.days) || 7,
      expReward: 100,
      coinReward: 50,
      prerequisites: [],
      tags: ['custom', 'user_created'],
      createdAt: new Date(),
      updatedAt: new Date(),
      isAIGenerated: false,
    };

    addQuest(customQuest);
    setIsCustomModalOpen(false);
    setCustomQuestData({ title: '', description: '', goal: '', days: '' });
  };
  
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e30_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0px,transparent_1px,#3c3c5c_1px,transparent_2px,transparent_4px)] bg-[size:100%_4px] opacity-5 z-0"></div>

      <Header onSignOut={signOut} />

      <main className="flex-1 w-full max-w-7xl p-4 md:p-6 mx-auto relative z-10">        
        {/* Quest Header and Dashboard */}
        <QuestDashboard
          onCreateCustomQuest={handleCreateCustomQuest}
          onGenerateAIQuest={handleGenerateAIQuest}
        />

        {/* AI Quest Generation Modal */}
        <QuestGenerationModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          onQuestGenerated={handleQuestGenerated}
        />

        {/* Custom Quest Modal */}
        {isCustomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-gray-900 border border-purple-500 p-6 rounded-md w-[90%] max-w-md text-white">
              <h2 className="text-xl font-bold mb-4">Create Custom Quest</h2>

              <input
                className="w-full mb-2 p-2 bg-gray-800 border border-gray-700 rounded"
                placeholder="Quest Title"
                value={customQuestData.title}
                onChange={(e) => setCustomQuestData(prev => ({ ...prev, title: e.target.value }))}
              />
              <textarea
                className="w-full mb-2 p-2 bg-gray-800 border border-gray-700 rounded"
                placeholder="Quest Description"
                rows={3}
                value={customQuestData.description}
                onChange={(e) => setCustomQuestData(prev => ({ ...prev, description: e.target.value }))}
              />
              <input
                className="w-full mb-2 p-2 bg-gray-800 border border-gray-700 rounded"
                placeholder="Goal (number)"
                type="number"
                value={customQuestData.goal}
                onChange={(e) => setCustomQuestData(prev => ({ ...prev, goal: e.target.value }))}
              />
              <input
                className="w-full mb-4 p-2 bg-gray-800 border border-gray-700 rounded"
                placeholder="Days to complete"
                type="number"
                value={customQuestData.days}
                onChange={(e) => setCustomQuestData(prev => ({ ...prev, days: e.target.value }))}
              />

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  onClick={() => setIsCustomModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
                  onClick={handleCustomQuestSubmit}
                >
                  Create Quest
                </button>
              </div>
            </div>
          </div>
        )}

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

// Main component that provides the quest context
export default function QuestsPage() {
  return <QuestPageContent />;
}