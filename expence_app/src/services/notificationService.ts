import { supabaseAdmin } from '@/lib/supabase'
import { Notification, NotificationType, CreateNotificationInput } from '@/types/notification'

/**
 * Create a new notification for a user
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<Notification | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: input.user_id,
        type: input.type,
        title: input.title,
        message: input.message || null,
        related_id: input.related_id || null,
        is_read: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      return null
    }

    return data as Notification
  } catch (error) {
    console.error('Exception creating notification:', error)
    return null
  }
}

/**
 * Get all notifications for a user
 * @param userId - User ID to fetch notifications for
 * @param limit - Maximum number of notifications to return (default: 50)
 * @param onlyUnread - If true, only return unread notifications
 */
export async function getUserNotifications(
  userId: string,
  limit: number = 50,
  onlyUnread: boolean = false
): Promise<Notification[]> {
  try {
    let query = supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (onlyUnread) {
      query = query.eq('is_read', false)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching notifications:', error)
      return []
    }

    return (data as Notification[]) || []
  } catch (error) {
    console.error('Exception fetching notifications:', error)
    return []
  }
}

/**
 * Get a single notification by ID
 */
export async function getNotificationById(
  notificationId: string
): Promise<Notification | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('id', notificationId)
      .single()

    if (error) {
      console.error('Error fetching notification:', error)
      return null
    }

    return data as Notification
  } catch (error) {
    console.error('Exception fetching notification:', error)
    return null
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .eq('user_id', userId) // Security: ensure user owns this notification

    if (error) {
      console.error('Error marking notification as read:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Exception marking notification as read:', error)
    return false
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_read', false) // Only update unread ones

    if (error) {
      console.error('Error marking all notifications as read:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Exception marking all notifications as read:', error)
    return false
  }
}

/**
 * Get count of unread notifications for a user
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Exception fetching unread count:', error)
    return 0
  }
}

/**
 * Delete a notification (optional - might not be needed)
 */
export async function deleteNotification(
  notificationId: string,
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId) // Security: ensure user owns this notification

    if (error) {
      console.error('Error deleting notification:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Exception deleting notification:', error)
    return false
  }
}
