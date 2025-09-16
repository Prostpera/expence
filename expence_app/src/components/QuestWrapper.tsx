'use client';

import { ReactNode, createContext, useContext } from 'react';
import { QuestProvider } from '@/contexts/QuestContext';
import { UserContext } from '@/types/quest';

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
  return (
    <UserContextContext.Provider value={mockUserContext}>
      <QuestProvider userContext={mockUserContext}>
        {children}
      </QuestProvider>
    </UserContextContext.Provider>
  );
}