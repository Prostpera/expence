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
  const cookieStore = await cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
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
          quest_data: any | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type FinancialGoal = Database['public']['Tables']['financial_goals']['Row']
export type Quest = Database['public']['Tables']['quests']['Row']