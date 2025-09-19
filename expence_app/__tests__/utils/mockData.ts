export const mockUserContext = {
  currentLevel: 2,
  financialGoals: ["emergency_fund", "debt_payoff"],
  preferences: { 
    riskTolerance: "medium" as const, 
    learningStyle: "visual" as const 
  },
  demographics: { age: 22, income: 35000 }
};

export const mockValidQuest = {
  id: "test_quest_123",
  title: "Save $100 Emergency Fund",
  description: "Start building your emergency fund by saving $100",
  category: "main_story" as const,
  difficulty: "easy" as const,
  expReward: 100,
  coinReward: 50,
  goal: 100,
  daysLeft: 7,
  tags: ["saving", "emergency"]
};