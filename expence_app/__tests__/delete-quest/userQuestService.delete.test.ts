import { userQuestService } from '../../src/services/userQuestService';
import { supabaseAdmin } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase');

describe('UserQuestService.deleteQuest', () => {
  const mockUserId = 'user-123';
  const mockQuestId = 'quest-456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case DQ-SVC-001: Delete quest successfully
  test('should delete quest successfully', async () => {
    const mockEq = jest.fn()
      .mockReturnThis()
      .mockResolvedValueOnce({ error: null, data: null });

    const mockDelete = jest.fn(() => ({
      eq: mockEq,
    }));

    const mockFrom = jest.fn(() => ({
      delete: mockDelete,
    }));

    (supabaseAdmin as unknown as jest.Mock).mockReturnValue({
      from: mockFrom,
    });

    const result = await userQuestService.deleteQuest(mockQuestId, mockUserId);

    expect(result).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith('quests');
    expect(mockDelete).toHaveBeenCalled();
  });

  // Test Case DQ-SVC-002: Return false if quest not found
  test('should return false if quest does not exist', async () => {
    const mockEq = jest.fn()
      .mockReturnThis()
      .mockResolvedValueOnce({
        error: { message: 'No rows deleted' },
        data: null,
      });

    const mockDelete = jest.fn(() => ({
      eq: mockEq,
    }));

    const mockFrom = jest.fn(() => ({
      delete: mockDelete,
    }));

    (supabaseAdmin as unknown as jest.Mock).mockReturnValue({
      from: mockFrom,
    });

    const result = await userQuestService.deleteQuest(mockQuestId, mockUserId);

    expect(result).toBe(false);
  });

  // Test Case DQ-SVC-003: Delete quest with correct filters
  test('should delete quest with correct questId and userId filters', async () => {
    const mockEq = jest.fn()
      .mockReturnThis()
      .mockResolvedValueOnce({ error: null });

    const mockDelete = jest.fn(() => ({
      eq: mockEq,
    }));

    const mockFrom = jest.fn(() => ({
      delete: mockDelete,
    }));

    (supabaseAdmin as unknown as jest.Mock).mockReturnValue({
      from: mockFrom,
    });

    await userQuestService.deleteQuest(mockQuestId, mockUserId);

    expect(mockFrom).toHaveBeenCalledWith('quests');
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', mockQuestId);
  });

  // Test Case DQ-SVC-004: Handle database errors gracefully
  test('should handle database errors gracefully', async () => {
    const testError = new Error('Database connection failed');
    const mockDelete = jest.fn(() => ({
      eq: jest.fn().mockRejectedValueOnce(testError),
    }));

    const mockFrom = jest.fn(() => ({
      delete: mockDelete,
    }));

    (supabaseAdmin as unknown as jest.Mock).mockReturnValue({
      from: mockFrom,
    });

    await expect(userQuestService.deleteQuest(mockQuestId, mockUserId)).rejects.toThrow(
      'Database connection failed'
    );
  });

  // Test Case DQ-SVC-005: Delete only own quests (user isolation)
  test('should only delete quests belonging to the user', async () => {
    const mockEq = jest.fn()
      .mockReturnThis()
      .mockResolvedValueOnce({ error: null, data: null });

    const mockDelete = jest.fn(() => ({
      eq: mockEq,
    }));

    const mockFrom = jest.fn(() => ({
      delete: mockDelete,
    }));

    (supabaseAdmin as unknown as jest.Mock).mockReturnValue({
      from: mockFrom,
    });

    await userQuestService.deleteQuest(mockQuestId, mockUserId);

    // Verify that id filter was applied
    expect(mockEq.mock.calls[0][0]).toBe('id');
  });

  // Test Case DQ-SVC-006: Return false on deletion error
  test('should return false if delete operation returns error', async () => {
    const mockEq = jest.fn()
      .mockReturnThis()
      .mockResolvedValueOnce({
        error: { message: 'Permission denied' },
        data: null,
      });

    const mockDelete = jest.fn(() => ({
      eq: mockEq,
    }));

    const mockFrom = jest.fn(() => ({
      delete: mockDelete,
    }));

    (supabaseAdmin as unknown as jest.Mock).mockReturnValue({
      from: mockFrom,
    });

    const result = await userQuestService.deleteQuest(mockQuestId, mockUserId);

    expect(result).toBe(false);
  });
});
