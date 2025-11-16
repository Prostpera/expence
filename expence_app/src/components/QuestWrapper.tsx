'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { QuestProvider } from '@/contexts/QuestContext';
import { UserContext } from '@/types/quest';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

const defaultUserContext: UserContext = {
  financialGoals: ['emergency_fund', 'debt_payoff', 'investing'],
  currentLevel: 1,
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

// Create a context for userContext
const UserContextContext = createContext<UserContext | null>(null);

// Custom hook to use userContext
export const useUserContext = () => {
  const context = useContext(UserContextContext);
  if (!context) {
    throw new Error('useUserContext must be used within QuestWrapper');
  }
  return context;
};

interface QuestWrapperProps {
  children: ReactNode;
}

export function QuestWrapper({ children }: QuestWrapperProps) {
  const { user } = useAuth();
  const [userContext, setUserContext] = useState<UserContext>(defaultUserContext);

  useEffect(() => {
    const fetchUserLevel = async () => {
      if (!user?.id) {
        setUserContext(defaultUserContext);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('level')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user level:', error);
          setUserContext(defaultUserContext);
          return;
        }

        setUserContext({
          ...defaultUserContext,
          currentLevel: data?.level || 1
        });
      } catch (error) {
        console.error('Error fetching user level:', error);
        setUserContext(defaultUserContext);
      }
    };

    fetchUserLevel();
  }, [user?.id]);

  return (
    <UserContextContext.Provider value={userContext}>
      <QuestProvider userContext={userContext}>
        {children}
      </QuestProvider>
    </UserContextContext.Provider>
  );
}