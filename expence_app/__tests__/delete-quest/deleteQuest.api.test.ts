import { DELETE } from '../../src/app/api/quests/[questId]/route';
import { NextRequest } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { userQuestService } from '@/services/userQuestService';

// Mock dependencies
jest.mock('@/lib/supabase');
jest.mock('@/services/userQuestService');

describe('DELETE /api/quests/[questId]', () => {
  const mockUserId = 'test-user-123';
  const mockQuestId = 'quest-456';

  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createServerSupabase as jest.Mock).mockResolvedValue(mockSupabase);
  });

  // Test Case DQ-BE-001: Delete quest successfully
  test('should delete quest successfully with valid authentication', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: mockUserId } },
      error: null,
    });

    (userQuestService.deleteQuest as jest.Mock).mockResolvedValue(true);

    const mockRequest = {
      // NextRequest mock
    } as unknown as NextRequest;

    const context = {
      params: Promise.resolve({ questId: mockQuestId }),
    };

    const response = await DELETE(mockRequest, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(userQuestService.deleteQuest).toHaveBeenCalledWith(mockQuestId, mockUserId);
  });

  // Test Case DQ-BE-002: Return 401 if not authenticated
  test('should return 401 if user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Not authenticated' },
    });

    const mockRequest = {} as unknown as NextRequest;

    const context = {
      params: Promise.resolve({ questId: mockQuestId }),
    };

    const response = await DELETE(mockRequest, context);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  // Test Case DQ-BE-003: Return 500 if deletion fails
  test('should return 500 if quest deletion fails', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: mockUserId } },
      error: null,
    });

    (userQuestService.deleteQuest as jest.Mock).mockResolvedValue(false);

    const mockRequest = {} as unknown as NextRequest;

    const context = {
      params: Promise.resolve({ questId: mockQuestId }),
    };

    const response = await DELETE(mockRequest, context);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to delete quest');
  });

  // Test Case DQ-BE-004: Return 500 on service error
  test('should return 500 if service throws error', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: mockUserId } },
      error: null,
    });

    const testError = new Error('Database error');
    (userQuestService.deleteQuest as jest.Mock).mockRejectedValue(testError);

    const mockRequest = {} as unknown as NextRequest;

    const context = {
      params: Promise.resolve({ questId: mockQuestId }),
    };

    const response = await DELETE(mockRequest, context);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });

  // Test Case DQ-BE-005: Call deleteQuest with correct parameters
  test('should call deleteQuest with correct questId and userId', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: mockUserId } },
      error: null,
    });

    (userQuestService.deleteQuest as jest.Mock).mockResolvedValue(true);

    const mockRequest = {} as unknown as NextRequest;

    const context = {
      params: Promise.resolve({ questId: mockQuestId }),
    };

    await DELETE(mockRequest, context);

    expect(userQuestService.deleteQuest).toHaveBeenCalledWith(mockQuestId, mockUserId);
    expect(userQuestService.deleteQuest).toHaveBeenCalledTimes(1);
  });

  // Test Case DQ-BE-006: Return 401 on auth error
  test('should return 401 if auth check returns error', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Auth failed'),
    });

    const mockRequest = {} as unknown as NextRequest;

    const context = {
      params: Promise.resolve({ questId: mockQuestId }),
    };

    const response = await DELETE(mockRequest, context);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
    expect(userQuestService.deleteQuest).not.toHaveBeenCalled();
  });
});
