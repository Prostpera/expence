export interface DailyQuestCompletion {
  id: string
  user_id: string
  quest_id: string
  completed_date: string
  completed_at: string
  exp_earned: number
  streak_count: number
  created_at: string
}

export interface DailyQuestStatus {
  quest_id: string
  can_check_in_today: boolean
  last_check_in_date: string | null
  current_streak: number
  total_completions: number
  checked_in_today: boolean
}

export interface CheckInResult {
  success: boolean
  completion: DailyQuestCompletion | null
  streak: number
  exp_earned: number
  message: string
}

export interface DailyQuestWithStatus {
  quest_id: string
  title: string
  description: string
  exp_reward: number
  status: DailyQuestStatus
}
