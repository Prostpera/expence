'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Quest, QuestStatus, UserContext } from '../types/quest';
import { questService } from '../services/questService';
import { useAuth } from '@/components/auth/AuthProvider';

interface QuestContextType {
  quests: Quest[];
  loading: boolean;
  userStats: any;
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
  const { user } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);

  // Load quests from database on mount
  useEffect(() => {
    if (user) {
      loadQuestsFromDatabase();
      loadUserStats();
    }
  }, [user]);

  const loadQuestsFromDatabase = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/quests');
      if (response.ok) {
        const data = await response.json();
        setQuests(data.quests || []);
      } else {
        console.error('Failed to load quests from database');
      }
    } catch (error) {
      console.error('Error loading quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/user/stats');
      if (response.ok) {
        const data = await response.json();
        setUserStats(data.userStats);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const generateInitialQuests = async (userContext: UserContext) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Generate quests from templates
      const templateQuests = questService.getPersonalizedQuests(userContext, 6);
      
      // Save them to database via API
      for (const quest of templateQuests) {
        await fetch('/api/quests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quest)
        });
      }
      
      // Refresh to get saved quests
      await loadQuestsFromDatabase();
    } catch (error) {
      console.error('Failed to generate initial quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const addQuest = async (quest: Quest) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quest)
      });
      
      if (response.ok) {
        await loadQuestsFromDatabase(); // Reload all quests
        await loadUserStats(); // Update stats
      } else {
        console.error('Failed to add quest to database');
      }
    } catch (error) {
      console.error('Error adding quest:', error);
    }
  };

  const updateQuest = async (questId: string, updates: Partial<Quest>) => {
    if (!user) return;
    try {
      // Use PUT to update all fields
      const response = await fetch(`/api/quests/${questId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        await loadQuestsFromDatabase();
        await loadUserStats();
      } else {
        console.error('Failed to update quest fields');
      }
    } catch (error) {
      console.error('Error updating quest:', error);
    }
  };

  const removeQuest = async (questId: string) => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/quests/${questId}`, { 
        method: 'DELETE' 
      });
      
      if (response.ok) {
        await loadQuestsFromDatabase();
        await loadUserStats();
      }
    } catch (error) {
      console.error('Error removing quest:', error);
    }
  };

  const startQuest = async (questId: string) => {
    await updateQuest(questId, { progress: 0 });
  };

  const completeQuest = async (questId: string) => {
    if (!user) return;
    
    try {
      // Find the quest to get its goal value
      const quest = quests.find(q => q.id === questId);
      if (!quest) {
        console.error('Quest not found for completion');
        return;
      }

      // Use PATCH to set progress to goal (which triggers completion)
      const response = await fetch(`/api/quests/${questId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: quest.goal })
      });
      
      if (response.ok) {
        await loadQuestsFromDatabase();
        await loadUserStats();
        // Emit event to notify Header and other components about stats update
        window.dispatchEvent(new Event('statsUpdated'));
      }
    } catch (error) {
      console.error('Error completing quest:', error);
    }
  };

  const pauseQuest = async (questId: string) => {
    // Could implement a status update endpoint if needed
    console.log('Pause quest:', questId);
  };

  const refreshQuests = async () => {
    await loadQuestsFromDatabase();
    await loadUserStats();
  };

  const value: QuestContextType = {
    quests,
    loading,
    userStats,
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

export const useQuests = (): QuestContextType => {
  const context = useContext(QuestContext);
  if (context === undefined) {
    throw new Error('useQuests must be used within a QuestProvider');
  }
  return context;
};

export default QuestContext;