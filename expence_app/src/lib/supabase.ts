import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

let clientInstance: any = null;

export const createClientSupabase = () => {
  // Return the same instance to avoid multiple clients
  if (!clientInstance) {
    clientInstance = createClientComponentClient();
  }
  return clientInstance;
}

// Server-side client
export const createServerSupabase = async () => {
  const { cookies } = await import('next/headers')
  return createServerComponentClient({ cookies });
}

// Admin client for server-side operations
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Default client export for consistency
export const supabase = createClientSupabase();

// Database Types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          display_name: string | null
          avatar_url: string | null
          level: number
          total_exp: number
          current_exp: number
          exp_to_next_level: number
          rank: string
          financial_profile: any | null
          privacy_settings: any | null
          age_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          level?: number
          total_exp?: number
          current_exp?: number
          exp_to_next_level?: number
          rank?: string
          financial_profile?: any | null
          privacy_settings?: any | null
          age_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          level?: number
          total_exp?: number
          current_exp?: number
          exp_to_next_level?: number
          rank?: string
          financial_profile?: any | null
          privacy_settings?: any | null
          age_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      financial_goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: string
          target_amount: number | null
          current_amount: number
          target_date: string | null
          priority: string
          status: string
          progress_percentage: number
          created_at: string
          updated_at: string
        }
      }
      quests: {
        Row: {
          id: string
          user_id: string
          goal_id: string | null
          title: string
          description: string
          category: string
          difficulty: string
          exp_reward: number
          status: string
          due_date: string | null
          completion_date: string | null
          ai_generated: boolean
          is_daily: boolean
          quest_data: any | null
          created_at: string
          updated_at: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'quest_complete' | 'level_up' | 'achievement' | 'friend_request' | 'daily_reminder' | 'system_alert'
          title: string
          message: string | null
          related_id: string | null
          is_read: boolean
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'quest_complete' | 'level_up' | 'achievement' | 'friend_request' | 'daily_reminder' | 'system_alert'
          title: string
          message?: string | null
          related_id?: string | null
          is_read?: boolean
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'quest_complete' | 'level_up' | 'achievement' | 'friend_request' | 'daily_reminder' | 'system_alert'
          title?: string
          message?: string | null
          related_id?: string | null
          is_read?: boolean
          created_at?: string
          read_at?: string | null
        }
      }
      daily_quest_completions: {
        Row: {
          id: string
          user_id: string
          quest_id: string
          completed_date: string
          completed_at: string
          exp_earned: number
          streak_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quest_id: string
          completed_date: string
          completed_at?: string
          exp_earned?: number
          streak_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quest_id?: string
          completed_date?: string
          completed_at?: string
          exp_earned?: number
          streak_count?: number
          created_at?: string
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type FinancialGoal = Database['public']['Tables']['financial_goals']['Row']
export type Quest = Database['public']['Tables']['quests']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type DailyQuestCompletion = Database['public']['Tables']['daily_quest_completions']['Row']