import {
  createNotification,
  getUserNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  deleteNotification
} from '@/services/notificationService'
import { supabaseAdmin } from '@/lib/supabase'
import { NotificationType } from '@/types/notification'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn()
  }
}))

describe('notificationService', () => {
  const mockUserId = 'user-123'
  const mockNotificationId = 'notif-456'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createNotification', () => {
    it('should create a notification successfully', async () => {
      const mockNotification = {
        id: mockNotificationId,
        user_id: mockUserId,
        type: NotificationType.QUEST_COMPLETE,
        title: 'Quest Completed!',
        message: 'You completed the quest',
        related_id: 'quest-789',
        is_read: false,
        created_at: new Date().toISOString(),
        read_at: null
      }

      const mockSelect = jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ data: mockNotification, error: null })
      })

      const mockInsert = jest.fn().mockReturnValue({
        select: mockSelect
      })

      ;(supabaseAdmin.from as jest.Mock).mockReturnValue({
        insert: mockInsert
      })

      const result = await createNotification({
        user_id: mockUserId,
        type: NotificationType.QUEST_COMPLETE,
        title: 'Quest Completed!',
        message: 'You completed the quest',
        related_id: 'quest-789'
      })

      expect(result).toEqual(mockNotification)
      expect(supabaseAdmin.from).toHaveBeenCalledWith('notifications')
      expect(mockInsert).toHaveBeenCalled()
    })

    it('should return null on error', async () => {
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } })
        })
      })

      ;(supabaseAdmin.from as jest.Mock).mockReturnValue({
        insert: mockInsert
      })

      const result = await createNotification({
        user_id: mockUserId,
        type: NotificationType.LEVEL_UP,
        title: 'Level Up!'
      })

      expect(result).toBeNull()
    })
  })

  describe('getUserNotifications', () => {
    it('should fetch user notifications with default params', async () => {
      const mockNotifications = [
        {
          id: '1',
          user_id: mockUserId,
          type: NotificationType.QUEST_COMPLETE,
          title: 'Quest 1',
          message: null,
          related_id: null,
          is_read: false,
          created_at: new Date().toISOString(),
          read_at: null
        },
        {
          id: '2',
          user_id: mockUserId,
          type: NotificationType.LEVEL_UP,
          title: 'Level Up!',
          message: 'You are now level 5',
          related_id: null,
          is_read: true,
          created_at: new Date().toISOString(),
          read_at: new Date().toISOString()
        }
      ]

      const mockLimit = jest.fn().mockResolvedValue({ data: mockNotifications, error: null })
      const mockOrder = jest.fn().mockReturnValue({ limit: mockLimit })
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder })
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })

      ;(supabaseAdmin.from as jest.Mock).mockReturnValue({
        select: mockSelect
      })

      const result = await getUserNotifications(mockUserId)

      expect(result).toEqual(mockNotifications)
      expect(mockLimit).toHaveBeenCalledWith(50)
    })

    it('should filter by unread only', async () => {
      const mockNotifications = [
        {
          id: '1',
          user_id: mockUserId,
          type: NotificationType.QUEST_COMPLETE,
          title: 'Quest 1',
          message: null,
          related_id: null,
          is_read: false,
          created_at: new Date().toISOString(),
          read_at: null
        }
      ]

      const mockLimit = jest.fn().mockResolvedValue({ data: mockNotifications, error: null })
      const mockEq2 = jest.fn().mockReturnValue({ limit: mockLimit })
      const mockOrder = jest.fn().mockReturnValue({ eq: mockEq2 })
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder })
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })

      ;(supabaseAdmin.from as jest.Mock).mockReturnValue({
        select: mockSelect
      })

      const result = await getUserNotifications(mockUserId, 50, true)

      expect(result).toEqual(mockNotifications)
      expect(mockEq2).toHaveBeenCalledWith('is_read', false)
    })

    it('should return empty array on error', async () => {
      const mockLimit = jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } })
      const mockOrder = jest.fn().mockReturnValue({ limit: mockLimit })
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder })
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })

      ;(supabaseAdmin.from as jest.Mock).mockReturnValue({
        select: mockSelect
      })

      const result = await getUserNotifications(mockUserId)

      expect(result).toEqual([])
    })
  })

  describe('markNotificationAsRead', () => {
    it('should mark notification as read successfully', async () => {
      const mockEq2 = jest.fn().mockResolvedValue({ error: null })
      const mockEq = jest.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq })

      ;(supabaseAdmin.from as jest.Mock).mockReturnValue({
        update: mockUpdate
      })

      const result = await markNotificationAsRead(mockNotificationId, mockUserId)

      expect(result).toBe(true)
      expect(mockUpdate).toHaveBeenCalled()
      expect(mockEq).toHaveBeenCalledWith('id', mockNotificationId)
      expect(mockEq2).toHaveBeenCalledWith('user_id', mockUserId)
    })

    it('should return false on error', async () => {
      const mockEq2 = jest.fn().mockResolvedValue({ error: { message: 'DB error' } })
      const mockEq = jest.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq })

      ;(supabaseAdmin.from as jest.Mock).mockReturnValue({
        update: mockUpdate
      })

      const result = await markNotificationAsRead(mockNotificationId, mockUserId)

      expect(result).toBe(false)
    })
  })

  describe('markAllNotificationsAsRead', () => {
    it('should mark all notifications as read', async () => {
      const mockEq2 = jest.fn().mockResolvedValue({ error: null })
      const mockEq = jest.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq })

      ;(supabaseAdmin.from as jest.Mock).mockReturnValue({
        update: mockUpdate
      })

      const result = await markAllNotificationsAsRead(mockUserId)

      expect(result).toBe(true)
      expect(mockEq).toHaveBeenCalledWith('user_id', mockUserId)
      expect(mockEq2).toHaveBeenCalledWith('is_read', false)
    })
  })

  describe('getUnreadNotificationCount', () => {
    it('should return unread count', async () => {
      const mockEq2 = jest.fn().mockResolvedValue({ count: 5, error: null })
      const mockEq = jest.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })

      ;(supabaseAdmin.from as jest.Mock).mockReturnValue({
        select: mockSelect
      })

      const result = await getUnreadNotificationCount(mockUserId)

      expect(result).toBe(5)
      expect(mockSelect).toHaveBeenCalledWith('*', { count: 'exact', head: true })
    })

    it('should return 0 on error', async () => {
      const mockEq2 = jest.fn().mockResolvedValue({ count: null, error: { message: 'DB error' } })
      const mockEq = jest.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq })

      ;(supabaseAdmin.from as jest.Mock).mockReturnValue({
        select: mockSelect
      })

      const result = await getUnreadNotificationCount(mockUserId)

      expect(result).toBe(0)
    })
  })

  describe('deleteNotification', () => {
    it('should delete notification successfully', async () => {
      const mockEq2 = jest.fn().mockResolvedValue({ error: null })
      const mockEq = jest.fn().mockReturnValue({ eq: mockEq2 })
      const mockDelete = jest.fn().mockReturnValue({ eq: mockEq })

      ;(supabaseAdmin.from as jest.Mock).mockReturnValue({
        delete: mockDelete
      })

      const result = await deleteNotification(mockNotificationId, mockUserId)

      expect(result).toBe(true)
      expect(mockEq).toHaveBeenCalledWith('id', mockNotificationId)
      expect(mockEq2).toHaveBeenCalledWith('user_id', mockUserId)
    })

    it('should return false on error', async () => {
      const mockEq2 = jest.fn().mockResolvedValue({ error: { message: 'DB error' } })
      const mockEq = jest.fn().mockReturnValue({ eq: mockEq2 })
      const mockDelete = jest.fn().mockReturnValue({ eq: mockEq })

      ;(supabaseAdmin.from as jest.Mock).mockReturnValue({
        delete: mockDelete
      })

      const result = await deleteNotification(mockNotificationId, mockUserId)

      expect(result).toBe(false)
    })
  })
})
