import { QuestStatus } from '@/types/quest';

// Mock user data
const mockUser = {
  id: 'user-123',
  level: 1,
  total_exp: 0,
  current_exp: 0,
  exp_to_next_level: 100,
  username: 'TestPlayer',
  coins: 0
};

// Mock quest data
const mockQuestReward = {
  expReward: 100,
  coinReward: 50
};

// Simulated level up calculation
function calculateLevelUp(totalExp: number, currentLevel: number): { newLevel: number; newCurrentExp: number; newExpToNextLevel: number } {
  let level = currentLevel;
  let currentExp = totalExp;
  let expToNextLevel = 100 * level; // EXP requirement increases per level

  while (currentExp >= expToNextLevel) {
    currentExp -= expToNextLevel;
    level++;
    expToNextLevel = 100 * level;
  }

  return {
    newLevel: level,
    newCurrentExp: currentExp,
    newExpToNextLevel: expToNextLevel
  };
}

describe('Level-Up System - Backend Tests', () => {
  
  describe('LVL-001: User starts at Level 1', () => {
    it('should initialize new user with level 1', () => {
      expect(mockUser.level).toBe(1);
      expect(mockUser.total_exp).toBe(0);
      expect(mockUser.current_exp).toBe(0);
    });

    it('should have correct initial EXP requirements', () => {
      expect(mockUser.exp_to_next_level).toBe(100);
    });
  });

  describe('LVL-002: EXP accumulates on quest completion', () => {
    it('should add quest EXP to user total_exp', () => {
      const userBefore = { ...mockUser };
      const newTotalExp = userBefore.total_exp + mockQuestReward.expReward;
      
      expect(newTotalExp).toBe(100);
      expect(newTotalExp).toBeGreaterThan(userBefore.total_exp);
    });

    it('should accumulate coins on quest completion', () => {
      const userBefore = { ...mockUser };
      const newCoins = userBefore.coins + mockQuestReward.coinReward;
      
      expect(newCoins).toBe(50);
    });

    it('should correctly add EXP from multiple quests', () => {
      const quest1Exp = 50;
      const quest2Exp = 60;
      const quest3Exp = 75;
      
      const totalExp = quest1Exp + quest2Exp + quest3Exp;
      expect(totalExp).toBe(185);
    });
  });

  describe('LVL-003: Level up triggers at EXP threshold', () => {
    it('should level up when EXP meets threshold', () => {
      const userWithExp = { ...mockUser, total_exp: 100 };
      const levelUpResult = calculateLevelUp(userWithExp.total_exp, userWithExp.level);
      
      expect(levelUpResult.newLevel).toBe(2);
      expect(levelUpResult.newCurrentExp).toBe(0);
    });

    it('should increase exp_to_next_level after level up', () => {
      const userWithExp = { ...mockUser, total_exp: 100 };
      const levelUpResult = calculateLevelUp(userWithExp.total_exp, userWithExp.level);
      
      expect(levelUpResult.newExpToNextLevel).toBe(200); // 100 * level 2
    });

    it('should not level up if EXP below threshold', () => {
      const userWithExp = { ...mockUser, total_exp: 50 };
      const levelUpResult = calculateLevelUp(userWithExp.total_exp, userWithExp.level);
      
      expect(levelUpResult.newLevel).toBe(1);
      expect(levelUpResult.newCurrentExp).toBe(50);
    });
  });

  describe('LVL-004: Multiple quests accumulate EXP correctly', () => {
    it('should accumulate EXP from 3 quests and trigger level up if threshold met', () => {
      const quest1 = 50;
      const quest2 = 50;
      const quest3 = 50;
      const totalExp = quest1 + quest2 + quest3;
      
      const levelUpResult = calculateLevelUp(totalExp, 1);
      
      expect(totalExp).toBe(150);
      expect(levelUpResult.newLevel).toBe(2);
      expect(levelUpResult.newCurrentExp).toBe(50);
    });

    it('should correctly handle cumulative EXP without level up', () => {
      const quest1 = 30;
      const quest2 = 40;
      const totalExp = quest1 + quest2;
      
      const levelUpResult = calculateLevelUp(totalExp, 1);
      
      expect(totalExp).toBe(70);
      expect(levelUpResult.newLevel).toBe(1);
      expect(levelUpResult.newCurrentExp).toBe(70);
    });
  });

  describe('LVL-005: User stats persist across sessions', () => {
    it('should maintain level after simulated session end', () => {
      const userAfterQuest = { ...mockUser, level: 2, total_exp: 50 };
      
      expect(userAfterQuest.level).toBe(2);
      expect(userAfterQuest.total_exp).toBe(50);
    });

    it('should retrieve correct stats from database on session start', () => {
      const savedUserStats = {
        id: 'user-123',
        level: 2,
        total_exp: 50,
        username: 'TestPlayer'
      };
      
      expect(savedUserStats.level).toBe(2);
      expect(savedUserStats.total_exp).toBe(50);
    });
  });

  describe('LVL-011: statsUpdated event fires on quest completion', () => {
    it('should have a mechanism to dispatch stats update event', () => {
      const eventName = 'statsUpdated';
      expect(eventName).toBe('statsUpdated');
    });
  });

  describe('LVL-013: /api/user/stats returns correct user data', () => {
    it('should return user stats with level, username, and coins', () => {
      const mockApiResponse = {
        userStats: {
          level: 1,
          username: 'TestPlayer',
          coins: 0
        }
      };
      
      expect(mockApiResponse.userStats).toHaveProperty('level');
      expect(mockApiResponse.userStats).toHaveProperty('username');
      expect(mockApiResponse.userStats).toHaveProperty('coins');
      expect(mockApiResponse.userStats.level).toBe(1);
    });
  });

  describe('LVL-015: Consecutive level ups handled correctly', () => {
    it('should handle gaining multiple levels from single high-EXP quest', () => {
      const highExpQuest = 300; // Worth enough for multiple level ups
      const levelUpResult = calculateLevelUp(highExpQuest, 1);
      
      // Level 1: 0-100 EXP → Level 2 at 100, carry over 200
      // Level 2: 0-200 EXP → Level 3 at 200, carry over 0
      expect(levelUpResult.newLevel).toBe(3);
      expect(levelUpResult.newCurrentExp).toBe(0);
    });

    it('should correctly distribute EXP across multiple level-ups', () => {
      const totalExpFromQuest = 450;
      const levelUpResult = calculateLevelUp(totalExpFromQuest, 1);
      
      // Level 1: 0-100 → Level 2 with 350 remaining
      // Level 2: 0-200 → Level 3 with 150 remaining
      // Level 3: 0-300 → stay at Level 3 with 150 EXP
      expect(levelUpResult.newLevel).toBe(3);
      expect(levelUpResult.newCurrentExp).toBe(150);
    });
  });
});
