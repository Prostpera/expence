export enum NotificationType {
  QUEST_COMPLETE = 'quest_complete',
  LEVEL_UP = 'level_up',
  ACHIEVEMENT = 'achievement',
  FRIEND_REQUEST = 'friend_request',
  DAILY_REMINDER = 'daily_reminder',
  SYSTEM_ALERT = 'system_alert'
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string | null
  related_id: string | null
  is_read: boolean
  created_at: string
  read_at: string | null
}

export interface CreateNotificationInput {
  user_id: string
  type: NotificationType
  title: string
  message?: string
  related_id?: string
}

export interface NotificationWithRelated extends Notification {
  relatedQuest?: {
    id: string
    title: string
  }
  relatedUser?: {
    id: string
    username: string
  }
}
