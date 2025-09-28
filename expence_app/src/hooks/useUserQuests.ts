import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Quest } from '@/types/quest';

export function useUserQuests() {
  const { user } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<any>(null);

  const loadQuests = async () => {
    if (!user) return;
        
    setLoading(true);
    try {
        const [questsResponse, statsResponse] = await Promise.all([
        fetch('/api/quests'),
        fetch('/api/user/stats')
        ]);
        
        if (questsResponse.ok) {
        const questsData = await questsResponse.json();
        console.log('Quests data received:', questsData); // Add this line
        setQuests(questsData.quests);
        } else {
        console.error('Failed to fetch quests:', await questsResponse.text());
        }
        
        if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setUserStats(statsData.userStats);
        }
    } catch (error) {
        console.error('Error loading quests:', error);
    } finally {
        setLoading(false);
    }
    };

  const updateProgress = async (questId: string, progress: number) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/quests/${questId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuests(prev => prev.map(q => 
          q.id === questId ? data.quest : q
        ));
        
        if (data.expGained > 0) {
          const newStats = await fetch('/api/user/stats').then(r => r.json());
          setUserStats(newStats.userStats);
        }
        
        return data;
      }
    } catch (error) {
      console.error('Error updating quest progress:', error);
    }
    return { quest: null, expGained: 0 };
  };

  const completeQuest = async (questId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/quests/${questId}/complete`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        await loadQuests();
        return data;
      }
    } catch (error) {
      console.error('Error completing quest:', error);
    }
    return { success: false, expGained: 0 };
  };

  useEffect(() => {
    if (user) {
      loadQuests();
    }
  }, [user]);

  return {
    quests,
    userStats,
    loading,
    updateProgress,
    completeQuest,
    refreshQuests: loadQuests
  };
}