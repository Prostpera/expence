import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { AIQuestGenerator } from '../../src/services/aiQuestGenerator';
import { mockUserContext, mockUserContexts } from '../utils/testUtils';
import { QuestCategory, QuestDifficulty, QuestStatus } from '../../src/types/quest';

// Debug environment loading
console.log('API Key loaded in test:', !!process.env.ANTHROPIC_API_KEY);
console.log('API Key starts with sk-ant:', process.env.ANTHROPIC_API_KEY?.startsWith('sk-ant-'));

const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
// Only run these tests if API key is available

describe('AIQuestGenerator - Real API Tests', () => {
  let generator: AIQuestGenerator;

  beforeAll(() => {
    if (!hasApiKey) {
      console.warn('Skipping API tests - ANTHROPIC_API_KEY not found');
    }
    generator = new AIQuestGenerator();
  });

  describe('AQG-001: Basic Quest Generation', () => {
    it('should generate valid personalized quest from Claude', async () => {
      if (!hasApiKey) return;

      const quest = await generator.generatePersonalizedQuest(mockUserContext);
      
      expect(quest).toBeDefined();
      expect(quest.title).toBeTruthy();
      expect(quest.title.length).toBeGreaterThan(5);
      expect(quest.description).toBeTruthy();
      expect(quest.description.length).toBeGreaterThan(10);
      expect(quest.category).toMatch(/main_story|important|side_jobs/);
      expect(quest.difficulty).toMatch(/easy|medium|hard/);
      expect(quest.expReward).toBeGreaterThan(0);
      expect(quest.coinReward).toBeGreaterThan(0);
      expect(quest.goal).toBeGreaterThan(0);
      expect(quest.daysLeft).toBeGreaterThan(0);
      expect(quest.isAIGenerated).toBe(true);

      console.log('Generated quest:', quest.title);
      console.log('Description:', quest.description);
    }, 15000);
  });

  describe('AQG-002: Quest Categories', () => {
    it('should respect category preferences', async () => {
      if (!hasApiKey) return;

      const sideJobQuest = await generator.generatePersonalizedQuest(
        mockUserContext, 
        QuestCategory.SIDE_JOBS
      );
      
      expect(sideJobQuest.category).toBe(QuestCategory.SIDE_JOBS);
      console.log('Side job quest:', sideJobQuest.title);
    }, 15000);
  });

  describe('AQG-003: Difficulty Scaling', () => {
    it('should generate different difficulty levels', async () => {
      if (!hasApiKey) return;

      const easyQuest = await generator.generatePersonalizedQuest(
        mockUserContext, 
        undefined, 
        QuestDifficulty.EASY
      );
      
      const hardQuest = await generator.generatePersonalizedQuest(
        mockUserContext, 
        undefined, 
        QuestDifficulty.HARD
      );

      expect(easyQuest.difficulty).toBe(QuestDifficulty.EASY);
      expect(hardQuest.difficulty).toBe(QuestDifficulty.HARD);
      expect(hardQuest.expReward).toBeGreaterThan(easyQuest.expReward);

      console.log('Easy quest reward:', easyQuest.expReward);
      console.log('Hard quest reward:', hardQuest.expReward);
    }, 20000);
  });

  describe('AQG-004: User Level Adaptation', () => {
    it('should adapt to different user levels', async () => {
      if (!hasApiKey) return;

      const beginnerQuest = await generator.generatePersonalizedQuest(mockUserContexts.beginner);
      const advancedQuest = await generator.generatePersonalizedQuest(mockUserContexts.advanced);

      expect(beginnerQuest.title).not.toBe(advancedQuest.title);
      
      console.log('Beginner quest:', beginnerQuest.title);
      console.log('Advanced quest:', advancedQuest.title);
    }, 20000);
  });

  describe('AQG-011: Custom Quest Generation', () => {
    it('should generate quest based on custom prompt', async () => {
      if (!hasApiKey) return;

      const customPrompt = "I want to save $500 for a gaming setup in 3 months";
      const quest = await generator.generateCustomQuest(
        mockUserContext, 
        customPrompt
      );

      expect(quest.title).toBeTruthy();
      expect(quest.description).toBeTruthy();
      
      const containsAmount = quest.description.includes('$500') || quest.description.includes('500');
      expect(containsAmount).toBe(true);
      
      console.log('Custom quest:', quest.title);
      console.log('Description:', quest.description);
    }, 15000);
  });

  describe('AQG-019: Performance Testing', () => {
    it('should generate quest within acceptable time', async () => {
      if (!hasApiKey) return;

      const startTime = Date.now();
      const quest = await generator.generatePersonalizedQuest(mockUserContext);
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(10000);
      expect(quest).toBeDefined();
      
      console.log(`Quest generated in ${duration}ms`);
    }, 15000);
  });

  describe('AQG-020: Batch Generation', () => {
    it('should generate multiple different quests', async () => {
      if (!hasApiKey) return;

      const quests = await generator.generateQuestBatch(mockUserContext, 3);

      expect(quests).toHaveLength(3);
      expect(quests[0].title).not.toBe(quests[1].title);
      expect(quests[1].title).not.toBe(quests[2].title);

      quests.forEach((quest, index) => {
        expect(quest.title).toBeTruthy();
        expect(quest.description).toBeTruthy();
        console.log(`Quest ${index + 1}: ${quest.title}`);
      });
    }, 30000);
  });

  describe('AQG-007: Safety Validation', () => {
    it('should validate real AI-generated content', async () => {
      if (!hasApiKey) return;

      const quest = await generator.generatePersonalizedQuest(mockUserContext);
      const validation = generator.validateQuest(quest);

      expect(validation.isValid).toBe(true);
      expect(validation.issues).toHaveLength(0);
      
      console.log('Quest passed safety validation');
    }, 15000);
  });
});