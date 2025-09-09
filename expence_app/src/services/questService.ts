import { 
  Quest, 
  QuestTemplate, 
  QuestCategory, 
  QuestDifficulty, 
  QuestStatus, 
  UserContext,
  QUEST_TEMPLATES,
  DIFFICULTY_MULTIPLIERS,
  LEVEL_SCALING
} from '../types/quest';

export class QuestService {
  private quests: Quest[] = [];
  private templates: QuestTemplate[] = QUEST_TEMPLATES;

  generateQuestFromTemplate(
    template: QuestTemplate, 
    userContext: UserContext, 
    customVariables?: { [key: string]: string | number }
  ): Quest {
    const variables = { ...template.variables, ...customVariables };
    
    let title = template.title;
    let description = template.description;
    
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `\${${key}}`;
        title = title.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value));
        description = description.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value));
      });
    }

    // rewards based on user level and difficulty
    const levelExpMultiplier = LEVEL_SCALING.getExpMultiplier(userContext.currentLevel);
    const levelCoinMultiplier = LEVEL_SCALING.getCoinMultiplier(userContext.currentLevel);
    const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[template.difficulty];

    const expReward = Math.floor(
      template.baseExpReward * 
      levelExpMultiplier * 
      difficultyMultiplier.exp
    );

    const coinReward = Math.floor(
      template.baseCoinReward * 
      levelCoinMultiplier * 
      difficultyMultiplier.coin
    );

    return {
      id: `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      category: template.category,
      difficulty: template.difficulty,
      status: QuestStatus.NEW,
      progress: 0,
      goal: this.calculateGoalFromTemplate(template, variables),
      daysLeft: template.estimatedDays,
      expReward,
      coinReward,
      prerequisites: template.prerequisites,
      tags: [...template.tags],
      createdAt: new Date(),
      updatedAt: new Date(),
      isAIGenerated: false,
      userContext
    };
  }

  getQuestsByCategory(category: QuestCategory): Quest[] {
    return this.quests.filter(quest => quest.category === category);
  }

  getAvailableQuests(userContext: UserContext): Quest[] {
    return this.quests.filter(quest => {
      if (quest.status === QuestStatus.COMPLETED || quest.status === QuestStatus.EXPIRED) {
        return false;
      }

      if (quest.prerequisites && quest.prerequisites.length > 0) {
        const completedQuests = userContext.completedQuests;
        return quest.prerequisites.every(prereq => completedQuests.includes(prereq));
      }

      return true;
    });
  }

  getPersonalizedQuests(userContext: UserContext, count: number = 3): Quest[] {
    const availableTemplates = this.getPersonalizedTemplates(userContext);
    const quests: Quest[] = [];

    if (userContext.currentLevel <= 3) {
      const mainStoryTemplates = availableTemplates.filter(t => t.category === QuestCategory.MAIN_STORY);
      if (mainStoryTemplates.length > 0) {
        quests.push(this.generateQuestFromTemplate(mainStoryTemplates[0], userContext));
      }
    }

    // Add important quests based on goals
    const importantTemplates = availableTemplates.filter(t => t.category === QuestCategory.IMPORTANT);
    const goalBasedQuests = this.filterQuestsByGoals(importantTemplates, userContext.financialGoals);
    
    if (goalBasedQuests.length > 0) {
      quests.push(this.generateQuestFromTemplate(goalBasedQuests[0], userContext));
    }

    // Fill remaining slots with side jobs
    while (quests.length < count) {
      const sideJobTemplates = availableTemplates.filter(t => t.category === QuestCategory.SIDE_JOBS);
      if (sideJobTemplates.length > 0) {
        const randomTemplate = sideJobTemplates[Math.floor(Math.random() * sideJobTemplates.length)];
        quests.push(this.generateQuestFromTemplate(randomTemplate, userContext));
      } else {
        break;
      }
    }

    return quests;
  }

  updateQuestProgress(questId: string, progress: number): Quest | null {
    const quest = this.quests.find(q => q.id === questId);
    if (!quest) return null;

    quest.progress = Math.min(progress, quest.goal);
    quest.updatedAt = new Date();

    if (quest.progress >= quest.goal) {
      quest.status = QuestStatus.COMPLETED;
      quest.completedAt = new Date();
    } else if (quest.progress > 0) {
      quest.status = QuestStatus.IN_PROGRESS;
    }

    return quest;
  }

  // Complete quest
  completeQuest(questId: string): Quest | null {
    const quest = this.quests.find(q => q.id === questId);
    if (!quest) return null;

    quest.status = QuestStatus.COMPLETED;
    quest.progress = quest.goal;
    quest.completedAt = new Date();
    quest.updatedAt = new Date();

    return quest;
  }

  addQuest(quest: Quest): void {
    this.quests.push(quest);
  }

  removeQuest(questId: string): boolean {
    const index = this.quests.findIndex(q => q.id === questId);
    if (index === -1) return false;

    this.quests.splice(index, 1);
    return true;
  }

  getQuestStats(): {
    total: number;
    completed: number;
    inProgress: number;
    byCategory: { [key in QuestCategory]: number };
    byDifficulty: { [key in QuestDifficulty]: number };
  } {
    const stats = {
      total: this.quests.length,
      completed: this.quests.filter(q => q.status === QuestStatus.COMPLETED).length,
      inProgress: this.quests.filter(q => q.status === QuestStatus.IN_PROGRESS).length,
      byCategory: {
        [QuestCategory.MAIN_STORY]: 0,
        [QuestCategory.IMPORTANT]: 0,
        [QuestCategory.SIDE_JOBS]: 0
      },
      byDifficulty: {
        [QuestDifficulty.EASY]: 0,
        [QuestDifficulty.MEDIUM]: 0,
        [QuestDifficulty.HARD]: 0
      }
    };

    this.quests.forEach(quest => {
      stats.byCategory[quest.category]++;
      stats.byDifficulty[quest.difficulty]++;
    });

    return stats;
  }

  private getPersonalizedTemplates(userContext: UserContext): QuestTemplate[] {
    // Filter templates based on user level and completed quests
    return this.templates.filter(template => {
      if (template.prerequisites) {
        return template.prerequisites.every(prereq => 
          userContext.completedQuests.includes(prereq)
        );
      }
      return true;
    });
  }

  private filterQuestsByGoals(templates: QuestTemplate[], goals: string[]): QuestTemplate[] {
    if (goals.length === 0) return templates;

    return templates.filter(template => {
      return goals.some(goal => 
        template.tags.some(tag => 
          tag.toLowerCase().includes(goal.toLowerCase()) ||
          goal.toLowerCase().includes(tag.toLowerCase())
        )
      );
    });
  }

  private calculateGoalFromTemplate(template: QuestTemplate, variables?: { [key: string]: string | number }): number {
    if (variables?.amount) return Number(variables.amount);
    if (variables?.count) return Number(variables.count);
    if (variables?.days) return Number(variables.days);
    if (variables?.points) return Number(variables.points);
    
    switch (template.category) {
      case QuestCategory.MAIN_STORY: return 1;
      case QuestCategory.IMPORTANT: return 1;
      case QuestCategory.SIDE_JOBS: return template.estimatedDays;
      default: return 1;
    }
  }
}

export const questService = new QuestService();