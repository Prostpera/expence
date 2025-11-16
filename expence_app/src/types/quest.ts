export interface SubQuest {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  progress: number;
  goal: number;
}
export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  status: QuestStatus;
  progress: number;
  goal: number;
  daysLeft: number;
  expReward: number;
  coinReward: number;
  prerequisites?: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  isAIGenerated: boolean;
  userContext?: UserContext;
  subquests?: SubQuest[];
}

export enum QuestCategory {
  MAIN_QUESTS = 'main_story',
  IMPORTANT = 'important',
  SIDE_JOBS = 'side_jobs'
}

export enum QuestDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum QuestStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired'
}

export interface UserContext {
  financialGoals: string[];
  currentLevel: number;
  completedQuests: string[];
  preferences: {
    riskTolerance: 'low' | 'medium' | 'high';
    learningStyle: 'visual' | 'practical' | 'theoretical';
    timeCommitment: 'minimal' | 'moderate' | 'intensive';
  };
  demographics: {
    age: number;
    income?: number;
    educationLevel: string;
  };
}

export interface QuestTemplate {
  id: string;
  category: QuestCategory;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  baseExpReward: number;
  baseCoinReward: number;
  estimatedDays: number;
  tags: string[];
  prerequisites?: string[];
  variables?: {
    [key: string]: string | number;
  };
}

// Hardcoded quest templates for testing
export const QUEST_TEMPLATES: QuestTemplate[] = [
  // Main Quests
  {
    id: 'main_001',
    category: QuestCategory.MAIN_QUESTS,
    title: 'Create Your Emergency Fund Foundation',
    description: 'Start building financial security by saving $${amount} for unexpected expenses.',
    difficulty: QuestDifficulty.EASY,
    baseExpReward: 100,
    baseCoinReward: 50,
    estimatedDays: 7,
    tags: ['savings', 'emergency_fund', 'beginner'],
    variables: { amount: 100 }
  },
  {
    id: 'main_002',
    category: QuestCategory.MAIN_QUESTS,
    title: 'Master the Art of Budgeting',
    description: 'Track every expense for ${days} days to understand your spending patterns.',
    difficulty: QuestDifficulty.MEDIUM,
    baseExpReward: 150,
    baseCoinReward: 75,
    estimatedDays: 14,
    tags: ['budgeting', 'tracking', 'awareness'],
    prerequisites: ['main_001'],
    variables: { days: 14 }
  },
  {
    id: 'main_003',
    category: QuestCategory.MAIN_QUESTS,
    title: 'Debt Destroyer Challenge',
    description: 'Pay off $${amount} in debt using the snowball or avalanche method.',
    difficulty: QuestDifficulty.HARD,
    baseExpReward: 300,
    baseCoinReward: 150,
    estimatedDays: 30,
    tags: ['debt', 'payoff', 'strategy'],
    prerequisites: ['main_001', 'main_002'],
    variables: { amount: 500 }
  },

  // Important Quests
  {
    id: 'imp_001',
    category: QuestCategory.IMPORTANT,
    title: 'Investment Explorer',
    description: 'Research and make your first investment of $${amount} in an index fund.',
    difficulty: QuestDifficulty.MEDIUM,
    baseExpReward: 200,
    baseCoinReward: 100,
    estimatedDays: 10,
    tags: ['investing', 'index_funds', 'research'],
    variables: { amount: 50 }
  },
  {
    id: 'imp_002',
    category: QuestCategory.IMPORTANT,
    title: 'Credit Score Guardian',
    description: 'Check your credit score and improve it by ${points} points through strategic actions.',
    difficulty: QuestDifficulty.MEDIUM,
    baseExpReward: 180,
    baseCoinReward: 90,
    estimatedDays: 21,
    tags: ['credit', 'score', 'improvement'],
    variables: { points: 25 }
  },
  {
    id: 'imp_003',
    category: QuestCategory.IMPORTANT,
    title: 'Subscription Audit Mission',
    description: 'Cancel ${count} unused subscriptions to save $${savings} per month.',
    difficulty: QuestDifficulty.EASY,
    baseExpReward: 120,
    baseCoinReward: 60,
    estimatedDays: 3,
    tags: ['subscriptions', 'savings', 'audit'],
    variables: { count: 3, savings: 45 }
  },

  // Side Jobs
  {
    id: 'side_001',
    category: QuestCategory.SIDE_JOBS,
    title: 'Coffee Challenge',
    description: 'Skip buying coffee for ${days} days and brew at home instead.',
    difficulty: QuestDifficulty.EASY,
    baseExpReward: 50,
    baseCoinReward: 25,
    estimatedDays: 7,
    tags: ['savings', 'habits', 'daily'],
    variables: { days: 7 }
  },
  {
    id: 'side_002',
    category: QuestCategory.SIDE_JOBS,
    title: 'Meal Prep Master',
    description: 'Prepare ${meals} meals at home this week instead of ordering takeout.',
    difficulty: QuestDifficulty.EASY,
    baseExpReward: 60,
    baseCoinReward: 30,
    estimatedDays: 7,
    tags: ['savings', 'meal_prep', 'health'],
    variables: { meals: 5 }
  },
  {
    id: 'side_003',
    category: QuestCategory.SIDE_JOBS,
    title: 'Side Hustle Starter',
    description: 'Earn an extra $${amount} this month through a side gig or selling items.',
    difficulty: QuestDifficulty.MEDIUM,
    baseExpReward: 100,
    baseCoinReward: 50,
    estimatedDays: 30,
    tags: ['income', 'side_hustle', 'entrepreneurship'],
    variables: { amount: 100 }
  },
  {
    id: 'side_004',
    category: QuestCategory.SIDE_JOBS,
    title: 'Financial Education Scholar',
    description: 'Read ${count} financial articles or watch educational videos this week.',
    difficulty: QuestDifficulty.EASY,
    baseExpReward: 40,
    baseCoinReward: 20,
    estimatedDays: 7,
    tags: ['education', 'learning', 'knowledge'],
    variables: { count: 3 }
  }
];

// Difficulty multipliers for rewards
export const DIFFICULTY_MULTIPLIERS = {
  [QuestDifficulty.EASY]: { exp: 1.0, coin: 1.0 },
  [QuestDifficulty.MEDIUM]: { exp: 1.5, coin: 1.3 },
  [QuestDifficulty.HARD]: { exp: 2.0, coin: 1.8 }
};

// Level scaling for rewards
export const LEVEL_SCALING = {
  getExpMultiplier: (level: number): number => 1.0 + (level - 1) * 0.1,
  getCoinMultiplier: (level: number): number => 1.0 + (level - 1) * 0.05
};