import { 
  Quest, 
  QuestCategory, 
  QuestDifficulty, 
  QuestStatus, 
  UserContext 
} from '../types/quest';

import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

interface LangChainConfig {
  modelName: string;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
}

interface AIGeneratedQuestData {
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  tags: string[];
  estimatedDays: number;
  goal: number;
  expReward: number;
  coinReward: number;
}

export class AIQuestGenerator {
  private config: LangChainConfig;
  private llm: ChatAnthropic | null = null;
  private fallbackQuests: AIGeneratedQuestData[];
  private isAIEnabled: boolean = false;

  constructor() {
    this.config = {
      modelName: 'claude-3-sonnet-20240229',
      temperature: 0.7,
      maxTokens: 1000,
      apiKey: process.env.ANTHROPIC_API_KEY
    };

    // Initialize LangChain if API key is available
    this.initializeLangChain();

    // Fallback quests for when AI is unavailable
    this.fallbackQuests = [
      {
        title: "Emergency Fund Booster",
        description: "Add $50 to your emergency fund this week to build financial security.",
        category: QuestCategory.IMPORTANT,
        difficulty: QuestDifficulty.EASY,
        tags: ["emergency_fund", "savings", "security"],
        estimatedDays: 7,
        goal: 50,
        expReward: 100,
        coinReward: 50
      },
      {
        title: "Expense Detective",
        description: "Track and categorize all your expenses for 5 days to identify spending patterns.",
        category: QuestCategory.SIDE_JOBS,
        difficulty: QuestDifficulty.EASY,
        tags: ["tracking", "awareness", "budgeting"],
        estimatedDays: 5,
        goal: 5,
        expReward: 80,
        coinReward: 40
      },
      {
        title: "Investment Learning Path",
        description: "Research and learn about index funds for 30 minutes this week.",
        category: QuestCategory.IMPORTANT,
        difficulty: QuestDifficulty.MEDIUM,
        tags: ["education", "investing", "research"],
        estimatedDays: 7,
        goal: 1,
        expReward: 150,
        coinReward: 75
      }
    ];
  }

  private initializeLangChain(): void {
    try {
      if (this.config.apiKey && this.config.apiKey.startsWith('sk-ant-')) {
        this.llm = new ChatAnthropic({
          model: this.config.modelName,
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens,
          anthropicApiKey: this.config.apiKey,
        });
        this.isAIEnabled = true;
        console.log('✅ LangChain initialized with Claude model:', this.config.modelName);
      } else {
        console.warn('⚠️  No valid Anthropic API key found, using fallback mode');
        this.isAIEnabled = false;
      }
    } catch (error) {
      console.error('❌ Failed to initialize LangChain:', error);
      this.isAIEnabled = false;
    }
  }

  async generateCustomQuest(
    userContext: UserContext,
    userPrompt: string,
    preferredCategory?: QuestCategory,
    preferredDifficulty?: QuestDifficulty
  ): Promise<Quest> {
    try {
      let aiQuestData: AIGeneratedQuestData;

      if (this.isAIEnabled && this.llm) {
        console.log('🎯 Generating custom quest with Claude for:', userPrompt);
        aiQuestData = await this.generateCustomWithLangChain(userContext, userPrompt, preferredCategory, preferredDifficulty);
      } else {
        console.log('🔄 Using template-based custom quest generation...');
        aiQuestData = await this.generateCustomFromTemplate(userContext, userPrompt, preferredCategory, preferredDifficulty);
      }
      
      return this.createQuestFromAIData(aiQuestData, userContext);
    } catch (error) {
      console.warn('Custom quest generation failed, using fallback:', error);
      return this.generateCustomFallbackQuest(userContext, userPrompt, preferredCategory, preferredDifficulty);
    }
  }

  private async generateCustomWithLangChain(
    userContext: UserContext,
    userPrompt: string,
    preferredCategory?: QuestCategory,
    preferredDifficulty?: QuestDifficulty
  ): Promise<AIGeneratedQuestData> {
    if (!this.llm) {
      throw new Error('LangChain not initialized');
    }

    const systemPrompt = this.buildCustomSystemPrompt();
    const customUserPrompt = this.buildCustomUserPrompt(userContext, userPrompt, preferredCategory, preferredDifficulty);

    try {
      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(customUserPrompt)
      ];

      console.log('📤 Sending custom quest request to Claude...');
      const response = await this.llm.invoke(messages);
      console.log('📥 Received custom quest response from Claude');

      return this.parseAIResponse(response.content as string);
    } catch (error) {
      console.error('❌ Custom LangChain generation failed:', error);
      throw error;
    }
  }

  private buildCustomSystemPrompt(): string {
    return `You are an expert financial literacy quest generator specializing in creating personalized financial challenges based on user goals and requests. You transform user financial aspirations into actionable, achievable quests.

CUSTOM QUEST PRINCIPLES:
- Convert user goals into structured, step-by-step financial quests
- Break down large financial goals into manageable milestones
- Provide realistic timelines based on typical income and expenses
- Include specific, measurable actions the user can take
- Make the quest engaging with gaming terminology
- Ensure financial advice is safe and conservative

GOAL ANALYSIS:
- Parse the user's financial goal (savings target, purchase, debt payoff, etc.)
- Calculate reasonable timeframes based on goal amount and user context
- Suggest practical saving/earning strategies appropriate for their situation
- Include milestone tracking to maintain motivation

QUEST STRUCTURE:
- Title should be engaging and specific to their goal
- Description should include the target amount and practical steps
- Goal should represent the target amount or key metric
- Timeline should be realistic but motivating
- Rewards should scale with difficulty and commitment required

SAFETY GUIDELINES:
- Never suggest unsafe financial practices
- Keep recommendations appropriate for user's age and income level
- Suggest emergency fund consideration for larger purchases
- Include reminders about budgeting and responsible spending

You must respond with ONLY a valid JSON object, no additional text.`;
  }

  private buildCustomUserPrompt(
    userContext: UserContext,
    userPrompt: string,
    preferredCategory?: QuestCategory,
    preferredDifficulty?: QuestDifficulty
  ): string {
    const level = userContext.currentLevel;
    const riskTolerance = userContext.preferences.riskTolerance;
    const age = userContext.demographics.age;
    const income = userContext.demographics.income;

    return `Create a personalized financial quest based on this user's specific request:

USER REQUEST: "${userPrompt}"

USER PROFILE:
- Age: ${age}
- Current Level: ${level}
- Risk Tolerance: ${riskTolerance}
- Income: ${income ? `${income}` : 'Not specified'}
${preferredCategory ? `- Preferred Category: ${preferredCategory}` : ''}
${preferredDifficulty ? `- Preferred Difficulty: ${preferredDifficulty}` : ''}

QUEST CREATION GUIDELINES:
1. Analyze their request and extract the financial goal
2. Calculate a realistic timeline based on the goal amount and their profile
3. Create actionable steps they can take to achieve this goal
4. Make it engaging with gaming terminology
5. Include specific milestone markers

Examples of good quest creation:
- "I want to save for a $135 ball game" → Create a savings quest with weekly targets
- "I need to pay off my credit card" → Create a debt payoff strategy quest
- "I want to start investing" → Create an investment learning and action quest

Return ONLY this JSON format:

{
  "title": "Engaging quest title related to their goal (max 60 characters)",
  "description": "Specific description with their goal amount and actionable steps (max 200 characters)",
  "category": "main_story|important|side_jobs",
  "difficulty": "easy|medium|hard",
  "tags": ["relevant", "tags", "for_goal"],
  "estimatedDays": realistic_number_of_days_needed,
  "goal": target_amount_or_measurable_metric,
  "expReward": number_between_50_and_500_based_on_difficulty,
  "coinReward": number_between_25_and_250_based_on_difficulty
}

Make it specific to their request and achievable for their profile!`;
  }

  // Generate custom quest from template (fallback)
  private async generateCustomFromTemplate(
    userContext: UserContext,
    userPrompt: string,
    preferredCategory?: QuestCategory,
    preferredDifficulty?: QuestDifficulty
  ): Promise<AIGeneratedQuestData> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const promptLower = userPrompt.toLowerCase();
    const amountMatch = userPrompt.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    const targetAmount = amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : 100;

    let questTemplate: Partial<AIGeneratedQuestData> = {};

    // Detect intent and create appropriate quest
    if (promptLower.includes('save') || promptLower.includes('saving')) {
      questTemplate = {
        title: `Save for ${userPrompt.split(' ').slice(-2).join(' ')}`,
        description: `Save ${targetAmount} by setting aside money weekly and tracking your progress.`,
        category: QuestCategory.IMPORTANT,
        difficulty: targetAmount > 500 ? QuestDifficulty.HARD : targetAmount > 100 ? QuestDifficulty.MEDIUM : QuestDifficulty.EASY,
        tags: ['savings', 'goal', 'planning'],
        estimatedDays: Math.max(7, Math.min(90, Math.floor(targetAmount / 10))),
        goal: targetAmount,
        expReward: Math.floor(targetAmount / 2) + 50,
        coinReward: Math.floor(targetAmount / 4) + 25
      };
    } else if (promptLower.includes('pay off') || promptLower.includes('debt')) {
      questTemplate = {
        title: `Debt Elimination Quest`,
        description: `Pay off ${targetAmount} in debt using strategic payments and budget optimization.`,
        category: QuestCategory.MAIN_STORY,
        difficulty: QuestDifficulty.HARD,
        tags: ['debt', 'payoff', 'budgeting'],
        estimatedDays: Math.max(14, Math.min(180, Math.floor(targetAmount / 20))),
        goal: targetAmount,
        expReward: Math.floor(targetAmount / 1.5) + 100,
        coinReward: Math.floor(targetAmount / 3) + 50
      };
    } else if (promptLower.includes('invest') || promptLower.includes('investment')) {
      questTemplate = {
        title: `Investment Journey Quest`,
        description: `Start investing with ${targetAmount} after researching and choosing appropriate investments.`,
        category: QuestCategory.IMPORTANT,
        difficulty: QuestDifficulty.MEDIUM,
        tags: ['investing', 'research', 'growth'],
        estimatedDays: 21,
        goal: targetAmount,
        expReward: 200,
        coinReward: 100
      };
    } else {
      // Generic financial goal
      questTemplate = {
        title: `Custom Financial Goal`,
        description: `Achieve your goal of ${userPrompt} through planned saving and smart financial decisions.`,
        category: QuestCategory.SIDE_JOBS,
        difficulty: QuestDifficulty.MEDIUM,
        tags: ['custom', 'goal', 'savings'],
        estimatedDays: 30,
        goal: targetAmount,
        expReward: 150,
        coinReward: 75
      };
    }

    if (preferredCategory) questTemplate.category = preferredCategory;
    if (preferredDifficulty) questTemplate.difficulty = preferredDifficulty;

    // Adjust based on user level
    const levelMultiplier = 1 + (userContext.currentLevel - 1) * 0.1;
    questTemplate.expReward = Math.floor((questTemplate.expReward || 100) * levelMultiplier);
    questTemplate.coinReward = Math.floor((questTemplate.coinReward || 50) * levelMultiplier);

    return questTemplate as AIGeneratedQuestData;
  }

  private generateCustomFallbackQuest(
    userContext: UserContext,
    userPrompt: string,
    preferredCategory?: QuestCategory,
    preferredDifficulty?: QuestDifficulty
  ): Quest {
    const amountMatch = userPrompt.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    const targetAmount = amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : 100;

    const fallbackData: AIGeneratedQuestData = {
      title: 'Custom Savings Challenge',
      description: `Work towards your goal: ${userPrompt}`,
      category: preferredCategory || QuestCategory.IMPORTANT,
      difficulty: preferredDifficulty || QuestDifficulty.MEDIUM,
      tags: ['custom', 'savings', 'goal'],
      estimatedDays: 30,
      goal: targetAmount,
      expReward: 150,
      coinReward: 75
    };

    return this.createQuestFromAIData(fallbackData, userContext);
  }
  async generatePersonalizedQuest(
    userContext: UserContext,
    preferredCategory?: QuestCategory,
    preferredDifficulty?: QuestDifficulty
  ): Promise<Quest> {
    try {
      let aiQuestData: AIGeneratedQuestData;

      if (this.isAIEnabled && this.llm) {
        console.log('🤖 Generating quest with Claude...');
        aiQuestData = await this.generateWithLangChain(userContext, preferredCategory, preferredDifficulty);
      } else {
        console.log('🔄 Using fallback quest generation...');
        aiQuestData = await this.generateFromTemplate(userContext, preferredCategory, preferredDifficulty);
      }
      
      return this.createQuestFromAIData(aiQuestData, userContext);
    } catch (error) {
      console.warn('AI quest generation failed, using fallback:', error);
      return this.generateFallbackQuest(userContext, preferredCategory, preferredDifficulty);
    }
  }

  private async generateWithLangChain(
    userContext: UserContext,
    preferredCategory?: QuestCategory,
    preferredDifficulty?: QuestDifficulty
  ): Promise<AIGeneratedQuestData> {
    if (!this.llm) {
      throw new Error('LangChain not initialized');
    }

    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(userContext, preferredCategory, preferredDifficulty);

    try {
      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt)
      ];

      console.log('📤 Sending request to Claude...');
      const response = await this.llm.invoke(messages);
      console.log('📥 Received response from Claude');

      return this.parseAIResponse(response.content as string);
    } catch (error) {
      console.error('❌ LangChain generation failed:', error);
      throw error;
    }
  }

  private buildSystemPrompt(): string {
    return `You are an expert financial literacy quest generator for Generation Z users (ages 18-25). Your role is to create engaging, practical, and safe financial challenges that help young adults build financial management skills.

QUEST DESIGN PRINCIPLES:
- Use gaming terminology and RPG-style language
- Focus on practical, actionable steps
- Ensure goals are achievable and realistic
- Avoid risky or extreme financial advice
- Make it fun and engaging for Gen Z users

SAFETY REQUIREMENTS:
- Never suggest investing more than someone can afford to lose
- Avoid get-rich-quick schemes or guarantees
- Keep savings goals reasonable (typically $25-$500)
- Suggest conservative, well-established financial practices
- Include appropriate disclaimers when needed

QUEST CATEGORIES:
- main_story: Core financial literacy progression (budgeting, emergency funds, debt basics)
- important: Goal-specific actions (investing, credit building, major financial decisions)  
- side_jobs: Daily habits and quick wins (expense tracking, small savings challenges)

DIFFICULTY LEVELS:
- easy: Simple actions, low commitment (save $25, track expenses for 3 days)
- medium: Moderate goals, some research needed (open investment account, improve credit score)
- hard: Significant commitment or advanced concepts (pay off debt, create comprehensive budget)

You must respond with ONLY a valid JSON object, no additional text.`;
  }

  // Build user-specific prompt
  private buildUserPrompt(
    userContext: UserContext,
    preferredCategory?: QuestCategory,
    preferredDifficulty?: QuestDifficulty
  ): string {
    const goals = userContext.financialGoals.join(', ');
    const level = userContext.currentLevel;
    const riskTolerance = userContext.preferences.riskTolerance;
    const learningStyle = userContext.preferences.learningStyle;
    const age = userContext.demographics.age;
    const income = userContext.demographics.income;

    return `Create a personalized financial quest for this user:

USER PROFILE:
- Age: ${age}
- Current Level: ${level}
- Financial Goals: ${goals}
- Risk Tolerance: ${riskTolerance}
- Learning Style: ${learningStyle}
- Income: ${income ? `$${income}` : 'Not specified'}
${preferredCategory ? `- Preferred Category: ${preferredCategory}` : ''}
${preferredDifficulty ? `- Preferred Difficulty: ${preferredDifficulty}` : ''}

Generate a quest that matches their profile and is appropriate for their level. Return ONLY this JSON format:

{
  "title": "Engaging quest title (max 60 characters)",
  "description": "Clear, actionable description (max 150 characters)",
  "category": "main_story|important|side_jobs",
  "difficulty": "easy|medium|hard",
  "tags": ["tag1", "tag2", "tag3"],
  "estimatedDays": number_between_1_and_30,
  "goal": number_representing_target_amount_or_count,
  "expReward": number_between_50_and_500,
  "coinReward": number_between_25_and_250
}

Ensure the quest is specific, achievable, and engaging for a Gen Z user!`;
  }

  private parseAIResponse(response: string): AIGeneratedQuestData {
    try {
      // Clean the response to extract JSON
      let jsonStr = response.trim();
      
      // Remove any markdown code block markers
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/, '').replace(/```$/, '');
      }
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n?/, '').replace(/```$/, '');
      }

      const parsed = JSON.parse(jsonStr);
      
      // Validate required fields
      if (!parsed.title || !parsed.description || !parsed.category || !parsed.difficulty) {
        throw new Error('Missing required fields in AI response');
      }

      return {
        title: parsed.title,
        description: parsed.description,
        category: parsed.category as QuestCategory,
        difficulty: parsed.difficulty as QuestDifficulty,
        tags: parsed.tags || [],
        estimatedDays: parsed.estimatedDays || 7,
        goal: parsed.goal || 1,
        expReward: parsed.expReward || 100,
        coinReward: parsed.coinReward || 50
      };
    } catch (error) {
      console.error('❌ Failed to parse AI response:', error);
      console.log('Raw response:', response);
      throw new Error(`Failed to parse AI response: ${error}`);
    }
  }

  // Generate multiple quests for variety
  async generateQuestBatch(
    userContext: UserContext,
    count: number = 3
  ): Promise<Quest[]> {
    const quests: Quest[] = [];
    const categories = [QuestCategory.MAIN_STORY, QuestCategory.IMPORTANT, QuestCategory.SIDE_JOBS];
    
    console.log(`🎯 Generating ${count} quests...`);
    
    for (let i = 0; i < count; i++) {
      try {
        const category = categories[i % categories.length];
        console.log(`🔄 Generating quest ${i + 1}/${count} (${category})`);
        
        const quest = await this.generatePersonalizedQuest(userContext, category);
        quests.push(quest);
        
        // Small delay between requests to avoid rate limiting
        if (this.isAIEnabled && i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.warn(`❌ Failed to generate quest ${i + 1}:`, error);
        // Continue with other quests even if one fails
      }
    }
    
    console.log(`✅ Generated ${quests.length}/${count} quests successfully`);
    return quests;
  }

  // Template-based generation (fallback)
  private async generateFromTemplate(
    userContext: UserContext,
    preferredCategory?: QuestCategory,
    preferredDifficulty?: QuestDifficulty
  ): Promise<AIGeneratedQuestData> {
    // Add processing delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const templates = [
      {
        title: "Savings Sprint Challenge",
        description: "Save $${amount} this week by cutting one daily expense you don't really need.",
        category: QuestCategory.SIDE_JOBS,
        difficulty: QuestDifficulty.EASY,
        tags: ["savings", "challenge", "daily_habits"],
        estimatedDays: 7,
        goalBase: 25,
        expBase: 75,
        coinBase: 35
      },
      {
        title: "Budget Mastery Mission",
        description: "Create and stick to a weekly budget, tracking every expense for ${days} days.",
        category: QuestCategory.IMPORTANT,
        difficulty: QuestDifficulty.MEDIUM,
        tags: ["budgeting", "tracking", "discipline"],
        estimatedDays: 7,
        goalBase: 7,
        expBase: 150,
        coinBase: 75
      },
      {
        title: "Investment Explorer Quest",
        description: "Research ${count} different investment options and write a brief summary of each.",
        category: QuestCategory.MAIN_STORY,
        difficulty: QuestDifficulty.MEDIUM,
        tags: ["investing", "research", "education"],
        estimatedDays: 10,
        goalBase: 3,
        expBase: 200,
        coinBase: 100
      }
    ];

    // Select template based on preferences or randomly
    let template;
    if (preferredCategory) {
      const categoryTemplates = templates.filter(t => t.category === preferredCategory);
      template = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)] || templates[0];
    } else {
      template = templates[Math.floor(Math.random() * templates.length)];
    }

    // Personalize based on user context
    const levelMultiplier = 1 + (userContext.currentLevel - 1) * 0.2;
    const riskMultiplier = userContext.preferences.riskTolerance === 'high' ? 1.3 : 
                          userContext.preferences.riskTolerance === 'medium' ? 1.1 : 0.9;

    // Replace variables in description
    let description = template.description;
    const variables = {
      amount: Math.floor(template.goalBase * levelMultiplier * riskMultiplier),
      days: template.estimatedDays,
      count: Math.min(Math.max(Math.floor(template.goalBase / 20), 1), 5)
    };

    Object.entries(variables).forEach(([key, value]) => {
      description = description.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), String(value));
    });

    return {
      title: template.title,
      description,
      category: preferredCategory || template.category,
      difficulty: preferredDifficulty || template.difficulty,
      tags: template.tags,
      estimatedDays: template.estimatedDays,
      goal: variables.amount || variables.count || variables.days || 1,
      expReward: Math.floor(template.expBase * levelMultiplier),
      coinReward: Math.floor(template.coinBase * levelMultiplier)
    };
  }

  private generateFallbackQuest(
    userContext: UserContext,
    preferredCategory?: QuestCategory,
    preferredDifficulty?: QuestDifficulty
  ): Quest {
    let fallback = this.fallbackQuests[Math.floor(Math.random() * this.fallbackQuests.length)];
    
    // match preferences
    if (preferredCategory) {
      const categoryFallbacks = this.fallbackQuests.filter(q => q.category === preferredCategory);
      if (categoryFallbacks.length > 0) {
        fallback = categoryFallbacks[Math.floor(Math.random() * categoryFallbacks.length)];
      }
    }

    return this.createQuestFromAIData(fallback, userContext);
  }

  private createQuestFromAIData(aiData: AIGeneratedQuestData, userContext: UserContext): Quest {
    return {
      id: `ai_quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: aiData.title,
      description: aiData.description,
      category: aiData.category,
      difficulty: aiData.difficulty,
      status: QuestStatus.NEW,
      progress: 0,
      goal: aiData.goal,
      daysLeft: aiData.estimatedDays,
      expReward: aiData.expReward,
      coinReward: aiData.coinReward,
      prerequisites: [],
      tags: aiData.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAIGenerated: this.isAIEnabled,
      userContext
    };
  }

  validateQuest(quest: Quest): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Basic validation
    if (!quest.title || quest.title.length === 0) {
      issues.push('Quest title is missing');
    }
    if (!quest.description || quest.description.length === 0) {
      issues.push('Quest description is missing');
    }
    if (quest.title.length > 100) {
      issues.push('Quest title is too long');
    }
    if (quest.description.length > 300) {
      issues.push('Quest description is too long');
    }

    // Financial safety checks
    // if (quest.goal > 10000) {
    //   issues.push('Quest goal amount seems unreasonably high');
    // }
    // if (quest.daysLeft > 365) {
    //   issues.push('Quest timeframe is too long');
    // }
    if (quest.daysLeft < 1) {
      issues.push('Quest timeframe is too short');
    }

    // Content safety checks
    const unsafeTerms = ['invest all', 'put everything', 'maximum risk', 'guaranteed profit', 'get rich quick'];
    const questText = `${quest.title} ${quest.description}`.toLowerCase();
    
    unsafeTerms.forEach(term => {
      if (questText.includes(term)) {
        issues.push(`Contains potentially unsafe financial advice: "${term}"`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  switchModel(modelName: string): void {
    this.config.modelName = modelName;
    this.initializeLangChain();
  }

  getModelInfo(): LangChainConfig {
    return { 
      ...this.config,
      apiKey: this.config.apiKey ? '***hidden***' : 'not set'
    };
  }

  isAIAvailable(): boolean {
    return this.isAIEnabled;
  }

  getAIStatus(): { enabled: boolean; model: string; hasApiKey: boolean } {
    return {
      enabled: this.isAIEnabled,
      model: this.config.modelName,
      hasApiKey: !!this.config.apiKey
    };
  }
}

export const aiQuestGenerator = new AIQuestGenerator();