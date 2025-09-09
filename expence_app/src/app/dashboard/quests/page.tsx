'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ChatbotModal from '@/components/ChatbotModal';
import QuestDashboard from '@/components/QuestDashboard';
import QuestGenerationModal from '@/components/QuestGenerationModal';
import { QuestProvider, useQuests } from '@/contexts/QuestContext';
import { Quest, UserContext, QuestDifficulty } from '@/types/quest';
import { Plus, Sparkles, Brain, TrendingUp } from 'lucide-react';
import Image from 'next/image';

// Mock user context. Later it should come from auth/user service in prod
const mockUserContext: UserContext = {
  financialGoals: ['emergency_fund', 'debt_payoff', 'investing'],
  currentLevel: 5,
  completedQuests: ['main_001', 'side_001'],
  preferences: {
    riskTolerance: 'medium',
    learningStyle: 'practical',
    timeCommitment: 'moderate'
  },
  demographics: {
    age: 22,
    income: 45000,
    educationLevel: 'college'
  }
};

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
    console.log('Quest added to context:', quest.title);
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
      category: 'side_jobs' as any, // Default to side jobs for custom quests
      difficulty: 'medium' as any,
      status: 'new' as any,
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
      userContext: mockUserContext
    };

    addQuest(customQuest);
    setIsCustomModalOpen(false);
    setCustomQuestData({ title: '', description: '', goal: '', days: '' });
    console.log('Custom quest created:', customQuest.title);
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e30_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0px,transparent_1px,#3c3c5c_1px,transparent_2px,transparent_4px)] bg-[size:100%_4px] opacity-5 z-0"></div>

      <Header />

      <main className="flex-1 w-full max-w-7xl p-4 md:p-6 mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 border-b border-purple-800 pb-6">
          <div className="flex items-center">
            <div className="h-6 w-1 bg-cyan-500 mr-3"></div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              QUEST_<span className="text-cyan-400">SYSTEM</span>
            </h1>
            <div className="ml-4 flex items-center gap-2">
              <span className="px-2 py-1 text-xs bg-pink-900/50 text-pink-300 rounded border border-pink-700">
                AI POWERED
              </span>
              <span className="px-2 py-1 text-xs bg-green-900/50 text-green-300 rounded border border-green-700">
                LEVEL {mockUserContext.currentLevel}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* AI Quest Generation Button */}
            <button
              onClick={handleGenerateAIQuest}
              className="relative group bg-gradient-to-r from-pink-900 to-purple-900 bg-opacity-50 h-12 flex items-center justify-center px-6 text-center border border-pink-500 hover:bg-opacity-75 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-2">
                <Sparkles size={18} className="text-pink-400" />
                <Brain size={18} className="text-purple-400" />
                <span className="text-white font-medium text-sm">Generate AI Quests</span>
              </div>
            </button>

            {/* Custom Quest Button */}
            <button
              onClick={handleCreateCustomQuest}
              className="relative bg-cyan-900 bg-opacity-30 h-12 flex items-center justify-center px-6 text-center border border-cyan-500 hover:bg-opacity-75 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-cyan-400" />
                <span className="text-white font-medium text-sm">Create Custom</span>
              </div>
            </button>
          </div>
        </div>

        {/* AI Features Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 p-4 border border-pink-500/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="text-pink-400" size={20} />
              <h3 className="text-white font-semibold">Smart Personalization</h3>
            </div>
            <p className="text-gray-300 text-sm">
              AI analyzes your goals, level, and preferences to create perfectly tailored financial challenges.
            </p>
          </div>

          <div className="bg-gray-900/50 p-4 border border-cyan-500/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-cyan-400" size={20} />
              <h3 className="text-white font-semibold">Adaptive Difficulty</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Quest difficulty scales with your progress, ensuring optimal challenge and learning.
            </p>
          </div>

          <div className="bg-gray-900/50 p-4 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-yellow-400" size={20} />
              <h3 className="text-white font-semibold">Dynamic Content</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Fresh quests generated daily based on current trends and your evolving financial journey.
            </p>
          </div>
        </div>

        {/* Quest Dashboard */}
        <QuestDashboard
          userContext={mockUserContext}
          onCreateCustomQuest={handleCreateCustomQuest}
          onGenerateAIQuest={handleGenerateAIQuest}
        />

        {/* AI Quest Generation Modal */}
        <QuestGenerationModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          onQuestGenerated={handleQuestGenerated}
          userContext={mockUserContext}
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
  return (
    <QuestProvider userContext={mockUserContext}>
      <QuestPageContent />
    </QuestProvider>
  );
}