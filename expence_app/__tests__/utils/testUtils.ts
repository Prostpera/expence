import { AIQuestGenerator } from '../../src/services/aiQuestGenerator';
import { UserContext, QuestCategory, QuestDifficulty, QuestStatus } from '../../src/types/quest';
// Mock the environment variables for testing
export function mockEnvironment() {
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key-for-testing';
}

// Create a test instance of AIQuestGenerator
export function createTestGenerator(): AIQuestGenerator {
  mockEnvironment();
  return new AIQuestGenerator();
}

export const mockUserContext: UserContext = {
  currentLevel: 2,
  financialGoals: ["emergency_fund", "debt_payoff"],
  preferences: { 
    riskTolerance: "medium" as const, 
    learningStyle: "visual" as const,
    timeCommitment: "moderate" as const
  },
  demographics: { 
    age: 22, 
    income: 35000,
    educationLevel: "college"
  },
  completedQuests: []
};

// Additional test contexts for different scenarios
export const mockUserContexts = {
  beginner: {
    ...mockUserContext,
    currentLevel: 1,
    preferences: {
      riskTolerance: "low" as const,
      learningStyle: "practical" as const,
      timeCommitment: "minimal" as const
    },
    demographics: {
      age: 18,
      income: 15000,
      educationLevel: "high_school"
    }
  },
  
  advanced: {
    ...mockUserContext,
    currentLevel: 10,
    preferences: {
      riskTolerance: "high" as const,
      learningStyle: "theoretical" as const,
      timeCommitment: "intensive" as const
    },
    demographics: {
      age: 25,
      income: 75000,
      educationLevel: "graduate"
    }
  },

  noIncome: {
    ...mockUserContext,
    demographics: { 
      age: 19, 
      income: 0,  // Note: income is optional in the type definition
      educationLevel: "college"
    }
  },

  // Additional context for education-based testing
  highSchoolStudent: {
    ...mockUserContext,
    currentLevel: 1,
    demographics: {
      age: 17,
      income: 5000,  // Part-time job
      educationLevel: "high_school"
    },
    preferences: {
      riskTolerance: "low" as const,
      learningStyle: "visual" as const,
      timeCommitment: "minimal" as const
    }
  },

  graduateStudent: {
    ...mockUserContext,
    currentLevel: 5,
    demographics: {
      age: 24,
      income: 25000,  // Graduate stipend
      educationLevel: "graduate"
    },
    preferences: {
      riskTolerance: "medium" as const,
      learningStyle: "theoretical" as const,
      timeCommitment: "intensive" as const
    }
  }
};

export const mockValidQuest = {
  id: "test_quest_123",
  title: "Save $100 Emergency Fund",
  description: "Start building your emergency fund by saving $100",
  category: QuestCategory.MAIN_QUESTS,
  difficulty: QuestDifficulty.EASY,
  status: QuestStatus.NEW,
  progress: 0,
  goal: 100,
  daysLeft: 7,
  expReward: 100,
  coinReward: 50,
  prerequisites: [],
  tags: ["saving", "emergency"],
  createdAt: new Date(),
  updatedAt: new Date(),
  isAIGenerated: true,
  userContext: mockUserContext
};