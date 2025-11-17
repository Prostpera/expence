import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import {
  getUserNotifications,
  createNotification,
  getUnreadNotificationCount,
  markAllNotificationsAsRead
} from '@/services/notificationService'
import { NotificationType } from '@/types/notification'

/**
 * GET /api/notifications
 * Fetch notifications for the authenticated user
 * Query params:
 * - limit: number (optional, default: 50)
 * - unread_only: boolean (optional, default: false)
 * - count_only: boolean (optional, default: false) - returns just the unread count
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const unreadOnly = searchParams.get('unread_only') === 'true'
    const countOnly = searchParams.get('count_only') === 'true'

    // If only count requested, return count
    if (countOnly) {
      const count = await getUnreadNotificationCount(user.id)
      return NextResponse.json({ count })
    }

    // Fetch notifications
    const notifications = await getUserNotifications(user.id, limit, unreadOnly)

    return NextResponse.json({
      notifications,
      count: notifications.length
    })

  } catch (error) {
    console.error('Error in GET /api/notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/notifications
 * Create a new notification (typically called by system, not users directly)
 * Body: { user_id, type, title, message?, related_id? }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { user_id, type, title, message, related_id } = body

    // Validation
    if (!user_id || !type || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, type, title' },
        { status: 400 }
      )
    }

    // Validate notification type
    if (!Object.values(NotificationType).includes(type as NotificationType)) {
      return NextResponse.json(
        { error: 'Invalid notification type' },
        { status: 400 }
      )
    }

    // Create notification
    const notification = await createNotification({
      user_id,
      type: type as NotificationType,
      title,
      message,
      related_id
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { notification },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error in POST /api/notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/notifications
 * Mark all notifications as read for the authenticated user
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const success = await markAllNotificationsAsRead(user.id)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to mark notifications as read' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error in PATCH /api/notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
