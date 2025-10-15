import { supabase, supabaseAdmin } from '@/lib/supabase';
import { Quest, QuestStatus, UserContext } from '@/types/quest';
import crypto from 'crypto';

interface CreateQuestData {
  title?: string;
  description?: string;
  category?: string;
  difficulty?: string;
  expReward?: number;
  status?: QuestStatus;
  progress?: number;
  goal?: number;
  daysLeft?: number;
  coinReward?: number;
  tags?: string[];
  prerequisites?: string[];
  isAIGenerated?: boolean;
  userContext?: UserContext;
}

class EncryptionService {
  private encryptionKey: string;

  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || 'fallback-dev-key-change-in-prod';
  }

  encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.encryptionKey).subarray(0, 32), iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      return text;
    }
  }

  decrypt(text: string): string {
    try {
      const textParts = text.split(':');
      const iv = Buffer.from(textParts.shift()!, 'hex');
      const encryptedText = textParts.join(':');
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.encryptionKey).subarray(0, 32), iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return text;
    }
  }
}

export class UserQuestService {
  private encryption = new EncryptionService();

  async createUserQuest(userId: string, questData: CreateQuestData): Promise<Quest | null> {
    try {
      const encryptedQuestData = questData.userContext 
        ? this.encryption.encrypt(JSON.stringify(questData.userContext))
        : null;

      const { data, error } = await supabaseAdmin
        .from('quests')
        .insert({
          user_id: userId,
          goal_id: null,
          title: questData.title,
          description: questData.description,
          category: questData.category,
          difficulty: questData.difficulty,
          exp_reward: questData.expReward || 0,
          status: questData.status || QuestStatus.NEW,
          due_date: questData.daysLeft ? new Date(Date.now() + questData.daysLeft * 24 * 60 * 60 * 1000).toISOString() : null,
          ai_generated: questData.isAIGenerated || false,
          quest_data: {
            ...questData,
            userContext: encryptedQuestData,
            progress: questData.progress || 0,
            goal: questData.goal || 1,
            coinReward: questData.coinReward || 0,
            tags: questData.tags || [],
            prerequisites: questData.prerequisites || []
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user quest:', error);
        return null;
      }

      return this.mapDatabaseQuestToQuest(data);
    } catch (error) {
      console.error('Error in createUserQuest:', error);
      return null;
    }
  }

  async getUserQuests(userId: string, status?: QuestStatus): Promise<Quest[]> {
    try {
      console.log('getUserQuests called with userId:', userId);
      
      let query = supabaseAdmin  // Use supabaseAdmin instead of supabase
        .from('quests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      console.log('About to execute query...');
      const { data, error } = await query;
      
    //   console.log('Query result - data:', data);
    //   console.log('Query result - error:', error);
      console.log('Raw data length:', data?.length);

      if (error) {
        console.error('Error fetching user quests:', error);
        return [];
      }

      if (!data || data.length === 0) {
        console.log('No quests found in database for user:', userId);
        return [];
      }

      console.log('Mapping quests...');
      const mappedQuests = data.map((quest: any) => {
        console.log('Mapping quest:', quest.id, quest.title);
        return this.mapDatabaseQuestToQuest(quest);
      });

    //   console.log('Final mapped quests:', mappedQuests);
      return mappedQuests;
    } catch (error) {
      console.error('Error in getUserQuests:', error);
      return [];
    }
  }

  async deleteQuest(questId: string, userId: string): Promise<boolean> {
    try {
        const { error } = await supabaseAdmin
        .from('quests')
        .delete()
        .eq('id', questId)
        .eq('user_id', userId);

        if (error) {
        console.error('Error deleting quest:', error);
        return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteQuest:', error);
        return false;
    }
    }

  async updateQuestProgress(questId: string, userId: string, progress: number): Promise<{ quest: Quest | null, expGained: number }> {
    try {
      const { data: currentQuest, error: fetchError } = await supabaseAdmin
        .from('quests')
        .select('*')
        .eq('id', questId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !currentQuest) {
        console.error('Quest not found:', fetchError);
        return { quest: null, expGained: 0 };
      }

      const questData = currentQuest.quest_data || {};
      const goal = questData.goal || 1;
      const newProgress = Math.min(progress, goal);
      const isCompleted = newProgress >= goal;
      
      const updateData: any = {
        quest_data: {
          ...questData,
          progress: newProgress
        },
        updated_at: new Date().toISOString()
      };

      let expGained = 0;

      if (isCompleted && currentQuest.status !== QuestStatus.COMPLETED) {
        updateData.status = QuestStatus.COMPLETED;
        updateData.completion_date = new Date().toISOString();
        expGained = currentQuest.exp_reward;

        await this.updateUserExperience(userId, expGained);
      } else if (newProgress > 0 && currentQuest.status === QuestStatus.NEW) {
        updateData.status = QuestStatus.IN_PROGRESS;
      }

      const { data: updatedQuest, error: updateError } = await supabaseAdmin
        .from('quests')
        .update(updateData)
        .eq('id', questId)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating quest progress:', updateError);
        return { quest: null, expGained: 0 };
      }

      return {
        quest: this.mapDatabaseQuestToQuest(updatedQuest),
        expGained
      };
    } catch (error) {
      console.error('Error in updateQuestProgress:', error);
      return { quest: null, expGained: 0 };
    }
  }

  async completeQuest(questId: string, userId: string): Promise<{ success: boolean, expGained: number }> {
    try {
      const quest = await this.getUserQuest(questId, userId);
      if (!quest) {
        return { success: false, expGained: 0 };
      }

      const questData = quest.quest_data || {};
      const result = await this.updateQuestProgress(questId, userId, questData.goal || 1);
      
      return {
        success: result.quest !== null,
        expGained: result.expGained
      };
    } catch (error) {
      console.error('Error in completeQuest:', error);
      return { success: false, expGained: 0 };
    }
  }

  async getUserQuest(questId: string, userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('id', questId)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user quest:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserQuest:', error);
      return null;
    }
  }

  async updateUserExperience(userId: string, expGained: number): Promise<{ newLevel: number, leveledUp: boolean }> {
    try {
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('level, total_exp, current_exp, exp_to_next_level')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        console.error('Error fetching user for exp update:', userError);
        return { newLevel: 1, leveledUp: false };
      }

      let newTotalExp = (user.total_exp || 0) + expGained;
      let newCurrentExp = (user.current_exp || 0) + expGained;
      let newLevel = user.level || 1;
      let leveledUp = false;

      let expToNextLevel = user.exp_to_next_level || this.calculateExpForLevel(newLevel + 1);

      while (newCurrentExp >= expToNextLevel) {
        newCurrentExp -= expToNextLevel;
        newLevel++;
        leveledUp = true;
        expToNextLevel = this.calculateExpForLevel(newLevel + 1);
      }

      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          level: newLevel,
          total_exp: newTotalExp,
          current_exp: newCurrentExp,
          exp_to_next_level: expToNextLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user experience:', updateError);
      }

      return { newLevel, leveledUp };
    } catch (error) {
      console.error('Error in updateUserExperience:', error);
      return { newLevel: 1, leveledUp: false };
    }
  }

  private calculateExpForLevel(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5));
  }

  async getUserStats(userId: string): Promise<{
    level: number;
    totalExp: number;
    currentExp: number;
    expToNextLevel: number;
    completedQuests: number;
    activeQuests: number;
  } | null> {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('level, total_exp, current_exp, exp_to_next_level')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (userError) {
        console.error('Error fetching user stats:', userError);
        return null;
      }

      // If no user found, return default stats
      if (!user) {
        return {
          level: 1,
          totalExp: 0,
          currentExp: 0,
          expToNextLevel: 100,
          completedQuests: 0,
          activeQuests: 0
        };
      }

      const { data: quests, error: questError } = await supabase
        .from('quests')
        .select('status')
        .eq('user_id', userId);

      if (questError) {
        console.error('Error fetching quest counts:', questError);
        return {
          level: user.level || 1,
          totalExp: user.total_exp || 0,
          currentExp: user.current_exp || 0,
          expToNextLevel: user.exp_to_next_level || 100,
          completedQuests: 0,
          activeQuests: 0
        };
      }

      const completedQuests = quests.filter((q: any) => q.status === QuestStatus.COMPLETED).length;
      const activeQuests = quests.filter((q: any) => 
        q.status === QuestStatus.NEW || q.status === QuestStatus.IN_PROGRESS
      ).length;

      return {
        level: user.level || 1,
        totalExp: user.total_exp || 0,
        currentExp: user.current_exp || 0,
        expToNextLevel: user.exp_to_next_level || 100,
        completedQuests,
        activeQuests
      };
    } catch (error) {
      console.error('Error in getUserStats:', error);
      return null;
    }
  }

  async updateQuestFields(questId: string, userId: string, updates: any): Promise<Quest | null> {
    try {
      // Fetch current quest
      const { data: currentQuest, error: fetchError } = await supabaseAdmin
        .from('quests')
        .select('*')
        .eq('id', questId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !currentQuest) {
        console.error('Quest not found:', fetchError);
        return null;
      }

      // Merge updates into quest_data
      const questData = currentQuest.quest_data || {};
      const newQuestData = {
        ...questData,
        ...updates,
      };

      // Also update top-level fields if present
      const updateFields: any = {
        quest_data: newQuestData,
        updated_at: new Date().toISOString(),
      };
      if (updates.title) updateFields.title = updates.title;
      if (updates.description) updateFields.description = updates.description;
      if (updates.category) updateFields.category = updates.category;
      if (updates.difficulty) updateFields.difficulty = updates.difficulty;

      const { data: updatedQuest, error: updateError } = await supabaseAdmin
        .from('quests')
        .update(updateFields)
        .eq('id', questId)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating quest fields:', updateError);
        return null;
      }

      return this.mapDatabaseQuestToQuest(updatedQuest);
    } catch (error) {
      console.error('Error in updateQuestFields:', error);
      return null;
    }
  }

  private mapDatabaseQuestToQuest(dbQuest: any): Quest {
    const questData = dbQuest.quest_data || {};
    
    let userContext = null;
    if (questData.userContext) {
      try {
        const decryptedContext = this.encryption.decrypt(questData.userContext);
        userContext = JSON.parse(decryptedContext);
      } catch (error) {
        console.error('Error decrypting user context:', error);
      }
    }

    return {
      id: dbQuest.id,
      title: dbQuest.title,
      description: dbQuest.description,
      category: dbQuest.category,
      difficulty: dbQuest.difficulty,
      status: dbQuest.status,
      progress: questData.progress || 0,
      goal: questData.goal || 1,
      daysLeft: dbQuest.due_date ? Math.ceil((new Date(dbQuest.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0,
      expReward: dbQuest.exp_reward,
      coinReward: questData.coinReward || 0,
      prerequisites: questData.prerequisites || [],
      tags: questData.tags || [],
      createdAt: new Date(dbQuest.created_at),
      updatedAt: new Date(dbQuest.updated_at),
      completedAt: dbQuest.completion_date ? new Date(dbQuest.completion_date) : undefined,
      isAIGenerated: dbQuest.ai_generated,
      userContext
    };
  }
}

export const userQuestService = new UserQuestService();