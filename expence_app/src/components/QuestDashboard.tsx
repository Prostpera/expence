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
  RefreshCw
} from 'lucide-react';

interface QuestDashboardProps {
  userContext: UserContext;
  onCreateCustomQuest?: () => void;
  onGenerateAIQuest?: () => void;
}

const QuestDashboard: React.FC<QuestDashboardProps> = ({
  userContext,
  onCreateCustomQuest,
  onGenerateAIQuest
}) => {
  const { 
    quests, 
    loading, 
    startQuest, 
    completeQuest, 
    pauseQuest, 
    removeQuest,
    generateInitialQuests 
  } = useQuests();
  
  const [filteredQuests, setFilteredQuests] = useState<Quest[]>([]);
  const [activeCategory, setActiveCategory] = useState<QuestCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    filterQuests();
  }, [quests, activeCategory, searchTerm]);

  const generateMoreQuests = () => {
    generateInitialQuests(userContext);
  };

  const filterQuests = () => {
    let filtered = quests;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(quest => quest.category === activeCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(quest =>
        quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quest.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredQuests(filtered);
  };

  const handleStartQuest = (questId: string) => {
    startQuest(questId);
  };

  const handleCompleteQuest = (questId: string) => {
    completeQuest(questId);
  };

  const handlePauseQuest = (questId: string) => {
    pauseQuest(questId);
  };

  const handleDeleteQuest = (questId: string) => {
    if (window.confirm('Are you sure you want to delete this quest?')) {
        removeQuest(questId);
    }
  };

  const getCategoryIcon = (category: QuestCategory) => {
    switch (category) {
      case QuestCategory.MAIN_STORY: return <BookOpen size={18} />;
      case QuestCategory.IMPORTANT: return <AlertTriangle size={18} />;
      case QuestCategory.SIDE_JOBS: return <Briefcase size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  const getCategoryCount = (category: QuestCategory | 'all') => {
    if (category === 'all') return quests.length;
    return quests.filter(quest => quest.category === category).length;
  };

  const getQuestsByCategory = (category: QuestCategory) => {
    return filteredQuests.filter(quest => quest.category === category);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="flex items-center">
          <div className="h-6 w-1 bg-cyan-500 mr-3"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            QUEST_<span className="text-cyan-400">SYSTEM</span>
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
              className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-900 bg-opacity-50 border border-cyan-500 text-cyan-300 hover:bg-opacity-75 transition-all duration-300"
            >
              <Plus size={16} />
              Create Custom
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search quests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All ({getCategoryCount('all')})
          </button>
          
          {Object.values(QuestCategory).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {getCategoryIcon(category)}
              <span className="hidden sm:inline">
                {category.replace('_', ' ').split(' ').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
              ({getCategoryCount(category)})
            </button>
          ))}
        </div>
      </div>

      {/* Quest Categories */}
      {activeCategory === 'all' ? (
        <div className="space-y-8">
          {Object.values(QuestCategory).map((category) => {
            const categoryQuests = getQuestsByCategory(category);
            if (categoryQuests.length === 0) return null;

            return (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  {getCategoryIcon(category)}
                  <h2 className="text-xl font-bold text-white">
                    {category.replace('_', ' ').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </h2>
                  <span className="text-sm text-gray-400">
                    ({categoryQuests.length})
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onStart={handleStartQuest}
                      onComplete={handleCompleteQuest}
                      onPause={handlePauseQuest}
                      onDelete={handleDeleteQuest}
                      onViewDetails={(questId) => console.log('View details:', questId)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onStart={handleStartQuest}
              onComplete={handleCompleteQuest}
              onPause={handlePauseQuest}
              onDelete={handleDeleteQuest}
              onViewDetails={(questId) => console.log('View details:', questId)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredQuests.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No quests found</p>
            <p className="text-sm">Try adjusting your search or generate new quests</p>
          </div>
          <button
            onClick={onGenerateAIQuest}
            className="mt-4 flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-cyan-900 bg-opacity-50 border border-cyan-500 text-cyan-300 hover:bg-opacity-75 transition-all duration-300"
          >
            <Sparkles size={16} />
            Generate AI Quests
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw size={48} className="mx-auto mb-4 text-cyan-400 animate-spin" />
          <p className="text-lg text-gray-300">Loading quests...</p>
          <p className="text-sm text-gray-400">Preparing your financial challenges</p>
        </div>
      )}
    </div>
  );
};

export default QuestDashboard;