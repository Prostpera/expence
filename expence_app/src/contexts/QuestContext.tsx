'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Quest, QuestStatus, UserContext } from '../types/quest';
import { questService } from '../services/questService';

interface QuestContextType {
  quests: Quest[];
  loading: boolean;
  addQuest: (quest: Quest) => void;
  updateQuest: (questId: string, updates: Partial<Quest>) => void;
  removeQuest: (questId: string) => void;
  startQuest: (questId: string) => void;
  completeQuest: (questId: string) => void;
  pauseQuest: (questId: string) => void;
  generateInitialQuests: (userContext: UserContext) => void;
  refreshQuests: () => void;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

interface QuestProviderProps {
  children: ReactNode;
  userContext: UserContext;
}

export const QuestProvider: React.FC<QuestProviderProps> = ({ children, userContext }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize with sample quests on mount
  useEffect(() => {
    generateInitialQuests(userContext);
  }, []);

  const generateInitialQuests = (userContext: UserContext) => {
    setLoading(true);
    try {
      // Generate some initial quests from templates
      const initialQuests = questService.getPersonalizedQuests(userContext, 6);
      
      // Add them to the service
      initialQuests.forEach(quest => {
        questService.addQuest(quest);
      });
      
      setQuests(initialQuests);
    } catch (error) {
      console.error('Failed to generate initial quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const addQuest = (quest: Quest) => {
    // Add to service
    questService.addQuest(quest);
    
    // Update local state
    setQuests(prevQuests => [...prevQuests, quest]);
  };

  const updateQuest = (questId: string, updates: Partial<Quest>) => {
    setQuests(prevQuests =>
      prevQuests.map(quest =>
        quest.id === questId
          ? { ...quest, ...updates, updatedAt: new Date() }
          : quest
      )
    );
  };

  const removeQuest = (questId: string) => {
    // Remove from service
    questService.removeQuest(questId);
    
    // Update local state
    setQuests(prevQuests => prevQuests.filter(quest => quest.id !== questId));
  };

  const startQuest = (questId: string) => {
    const updatedQuest = questService.updateQuestProgress(questId, 0);
    if (updatedQuest) {
      updatedQuest.status = QuestStatus.IN_PROGRESS;
      updateQuest(questId, { status: QuestStatus.IN_PROGRESS });
    }
  };

  const completeQuest = (questId: string) => {
    const completedQuest = questService.completeQuest(questId);
    if (completedQuest) {
      updateQuest(questId, {
        status: QuestStatus.COMPLETED,
        progress: completedQuest.goal,
        completedAt: new Date()
      });
    }
  };

  const pauseQuest = (questId: string) => {
    updateQuest(questId, { status: QuestStatus.NEW });
  };

  const refreshQuests = () => {
    // Force a refresh of the quest list
    setQuests([...quests]);
  };

  const value: QuestContextType = {
    quests,
    loading,
    addQuest,
    updateQuest,
    removeQuest,
    startQuest,
    completeQuest,
    pauseQuest,
    generateInitialQuests,
    refreshQuests
  };

  return (
    <QuestContext.Provider value={value}>
      {children}
    </QuestContext.Provider>
  );
};

// Custom hook to use the quest context
export const useQuests = (): QuestContextType => {
  const context = useContext(QuestContext);
  if (context === undefined) {
    throw new Error('useQuests must be used within a QuestProvider');
  }
  return context;
};

export default QuestContext;