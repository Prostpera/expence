import { AIQuestGenerator } from '../../src/services/aiQuestGenerator';
import { mockUserContext, mockUserContexts } from '../utils/testUtils';

// Only run these tests if API key is available
const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

describe('AIQuestGenerator - Real API Integration', () => {
  let generator: AIQuestGenerator;

  beforeAll(() => {
    if (!hasApiKey) {
      console.warn('⚠️  Skipping API tests - ANTHROPIC_API_KEY not found in environment');
    }
    generator = new AIQuestGenerator();
  });

  describe('AQG-001: Real Quest Generation', () => {
    it('should generate actual quest from Claude API', async () => {
      if (!hasApiKey) {
        console.log('Skipping - no API key');
        return;
      }

      const quest = await generator.generatePersonalizedQuest(mockUserContext);
      
      expect(quest).toBeDefined();
      expect(quest.title).toBeTruthy();
      expect(quest.description).toBeTruthy();
      expect(quest.category).toMatch(/main_story|important|side_jobs/);
      expect(quest.difficulty).toMatch(/easy|medium|hard/);
      expect(quest.expReward).toBeGreaterThan(0);
      expect(quest.coinReward).toBeGreaterThan(0);
      expect(quest.id).toMatch(/^ai_quest_/);
      expect(quest.isAIGenerated).toBe(true);

      console.log('✅ Generated quest:', quest.title);
    }, 15000); // 15 second timeout for API call

    it('should generate different quests for different user contexts', async () => {
      if (!hasApiKey) return;

      const [beginnerQuest, advancedQuest] = await Promise.all([
        generator.generatePersonalizedQuest(mockUserContexts.beginner),
        generator.generatePersonalizedQuest(mockUserContexts.advanced)
      ]);

      expect(beginnerQuest.title).not.toBe(advancedQuest.title);
      expect(beginnerQuest).toBeDefined();
      expect(advancedQuest).toBeDefined();

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
      expect(quest.description).toContain('500');
      expect(quest.goal).toBeCloseTo(500, -1); // Within 10% of 500
      
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

      expect(duration).toBeLessThan(10000); // Under 10 seconds
      expect(quest).toBeDefined();
      
      console.log(`⏱️  Quest generated in ${duration}ms`);
    }, 15000);
  });

  describe('AQG-007: Real Safety Validation', () => {
    it('should validate AI-generated content for safety', async () => {
      if (!hasApiKey) return;

      const quest = await generator.generatePersonalizedQuest(mockUserContext);
      const validation = generator.validateQuest(quest);

      expect(validation.isValid).toBe(true);
      expect(validation.issues).toHaveLength(0);
      
      console.log('✅ Quest passed safety validation');
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
        console.log(`Quest ${index + 1}:`, quest.title);
      });
    }, 30000);
  });
});