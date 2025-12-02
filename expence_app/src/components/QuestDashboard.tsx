'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Quest, 
  QuestCategory, 
  QuestStatus, 
  UserContext 
} from '../types/quest';
import { useQuests } from '../contexts/QuestContext';
import QuestCard from './QuestCard';
import QuestCalendar from './QuestCalendar';
import DeleteQuestModal from './DeleteQuestModal';
import { 
  Plus, 
  Filter, 
  Search, 
  BookOpen, 
  AlertTriangle, 
  Briefcase,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  Calendar,
  List
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
  const { 
    quests, 
    loading, 
    startQuest, 
    completeQuest, 
    pauseQuest, 
    removeQuest,
    updateQuest,
    generateInitialQuests 
  } = useQuests();
  
  const [filteredQuests, setFilteredQuests] = useState<Quest[]>([]);
  const [activeCategory, setActiveCategory] = useState<QuestCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'completed'>('active');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questToDelete, setQuestToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Calendar view state - adapted from Class Advisor's view switching
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    console.log('QuestDashboard - quests updated:', quests);
    console.log('QuestDashboard - quests length:', quests.length);
    filterQuests();
  }, [quests, activeCategory, searchTerm, statusFilter]); 

  const generateMoreQuests = () => {
    generateInitialQuests(userContext);
  };

  const filterQuests = () => {
    let filtered = quests;

    // Filter by status (active = new + in_progress, completed = completed)
    if (statusFilter === 'active') {
      filtered = filtered.filter(quest => 
        quest.status === QuestStatus.NEW || quest.status === QuestStatus.IN_PROGRESS
      );
    } else if (statusFilter === 'completed') {
      filtered = filtered.filter(quest => quest.status === QuestStatus.COMPLETED);
    }

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
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      setQuestToDelete({ id: questId, title: quest.title });
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (questToDelete) {
      setIsDeleting(true);
      try {
        await removeQuest(questToDelete.id);
        setDeleteModalOpen(false);
        setQuestToDelete(null);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getCategoryIcon = (category: QuestCategory) => {
    switch (category) {
      case QuestCategory.MAIN_QUESTS: return <BookOpen size={18} />;
      case QuestCategory.IMPORTANT: return <AlertTriangle size={18} />;
      case QuestCategory.SIDE_JOBS: return <Briefcase size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  const getCategoryDisplayName = (category: QuestCategory): string => {
    switch (category) {
      case QuestCategory.MAIN_QUESTS: return 'Main Quests';
      case QuestCategory.IMPORTANT: return 'Important';
      case QuestCategory.SIDE_JOBS: return 'Side Jobs';
      default: return 'Unknown';
    }
  };

  const getCategoryCount = (category: QuestCategory | 'all') => {
    let relevantQuests = quests;
    
    // Filter by status first
    if (statusFilter === 'active') {
      relevantQuests = relevantQuests.filter(quest => 
        quest.status === QuestStatus.NEW || quest.status === QuestStatus.IN_PROGRESS
      );
    } else if (statusFilter === 'completed') {
      relevantQuests = relevantQuests.filter(quest => quest.status === QuestStatus.COMPLETED);
    }
    
    if (category === 'all') return relevantQuests.length;
    return relevantQuests.filter(quest => quest.category === category).length;
  };

  const getStatusCount = (status: 'active' | 'completed') => {
    if (status === 'active') {
      return quests.filter(quest => 
        quest.status === QuestStatus.NEW || quest.status === QuestStatus.IN_PROGRESS
      ).length;
    } else {
      return quests.filter(quest => quest.status === QuestStatus.COMPLETED).length;
    }
  };

  const getQuestsByCategory = (category: QuestCategory) => {
    return filteredQuests.filter(quest => quest.category === category);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Back Button Row */}
        <div>
          <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors group text-sm">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-0.5 transition-transform" />
            <span className="tracking-wide">BACK</span>
          </Link>
        </div>
        {/* Title & Actions Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
          {/* View Mode Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-1 text-sm rounded transition-all ${
                viewMode === 'list' 
                  ? 'bg-cyan-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <List size={14} />
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-3 py-1 text-sm rounded transition-all ${
                viewMode === 'calendar' 
                  ? 'bg-cyan-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Calendar size={14} />
              Calendar
            </button>
          </div>
          
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
      </div>

      {/* Status Filter */}
      {viewMode === 'list' && (
        <div className="flex gap-2 mb-6">
        <button
          onClick={() => setStatusFilter('active')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            statusFilter === 'active'
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Active ({getStatusCount('active')})
        </button>
        
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            statusFilter === 'completed'
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Completed ({getStatusCount('completed')})
        </button>
        </div>
      )}

      {/* Search and Filter */}
      {viewMode === 'list' && (
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
                {getCategoryDisplayName(category)}
              </span>
              ({getCategoryCount(category)})
            </button>
          ))}
        </div>
        </div>
      )}

      {/* Quest View */}
      {viewMode === 'calendar' ? (
        <QuestCalendar 
          quests={filteredQuests} 
          onQuestClick={(quest) => console.log('Calendar quest clicked:', quest.id)}
          onQuestComplete={handleCompleteQuest}
          onQuestUpdate={async (updatedQuest) => {
            // Use the updateQuest function from QuestContext to update database
            await updateQuest(updatedQuest.id, updatedQuest);
          }}
        />
      ) : (
        <>
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
                        {getCategoryDisplayName(category)}
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
        </>
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

      {/* Delete Quest Modal */}
      {questToDelete && (
        <DeleteQuestModal
          questTitle={questToDelete.title}
          isOpen={deleteModalOpen}
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setDeleteModalOpen(false);
            setQuestToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default QuestDashboard;
