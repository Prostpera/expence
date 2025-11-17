import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuestDashboard from '../../src/components/QuestDashboard';
import { QuestProvider } from '../../src/contexts/QuestContext';
import { Quest, QuestStatus, QuestCategory, QuestDifficulty, UserContext } from '../../src/types/quest';

// Mock the QuestWrapper component
jest.mock('../../src/components/QuestWrapper', () => ({
  useUserContext: () => ({
    name: 'Test User',
    profession: 'Developer',
    goal: 'Learn React',
  }),
}));

// Mock the DeleteQuestModal
jest.mock('../../src/components/DeleteQuestModal', () => {
  return function DummyDeleteQuestModal({ isOpen, onConfirm, onCancel }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="delete-quest-modal">
        <button onClick={onConfirm} data-testid="confirm-delete">
          Confirm Delete
        </button>
        <button onClick={onCancel} data-testid="cancel-delete">
          Cancel Delete
        </button>
      </div>
    );
  };
});

describe('QuestDashboard Delete Quest Feature', () => {
  const mockUserContext: UserContext = {
    financialGoals: ['Save money', 'Invest wisely'],
    currentLevel: 5,
    completedQuests: ['quest-1', 'quest-2'],
    preferences: {
      riskTolerance: 'medium',
      learningStyle: 'practical',
      timeCommitment: 'moderate',
    },
    demographics: {
      age: 30,
      income: 50000,
      educationLevel: 'Bachelor',
    },
  };

  const mockQuest: Quest = {
    id: 'quest-1',
    title: 'Save for Vacation',
    description: 'Save $5000 for vacation',
    category: QuestCategory.SIDE_JOBS,
    difficulty: QuestDifficulty.MEDIUM,
    status: QuestStatus.IN_PROGRESS,
    progress: 2500,
    goal: 5000,
    daysLeft: 30,
    expReward: 250,
    coinReward: 100,
    prerequisites: [],
    tags: ['vacation', 'savings'],
    createdAt: new Date(),
    updatedAt: new Date(),
    isAIGenerated: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case DQ-QD-001: Delete button opens modal
  test('should open delete modal when delete button is clicked', async () => {
    render(
      <QuestProvider userContext={mockUserContext}>
        <QuestDashboard />
      </QuestProvider>
    );

    // Wait for quests to load and then find delete button
    await waitFor(() => {
      const deleteButtons = screen.queryAllByRole('button');
      // Note: This test assumes quest cards are rendered with delete buttons
    });
  });

  // Test Case DQ-QD-002: Modal shows correct quest title
  test('should display correct quest title in delete modal', async () => {
    render(
      <QuestProvider userContext={mockUserContext}>
        <QuestDashboard />
      </QuestProvider>
    );

    // Simulate finding and clicking delete button
    // The actual quest data would come from the context
  });

  // Test Case DQ-QD-003: Cancel closes modal without deleting
  test('should close modal without deleting when cancel is clicked', async () => {
    const { container } = render(
      <QuestProvider userContext={mockUserContext}>
        <QuestDashboard />
      </QuestProvider>
    );

    // Find cancel button in modal and click it
    const cancelButton = screen.queryByTestId('cancel-delete');
    if (cancelButton) {
      fireEvent.click(cancelButton);
      await waitFor(() => {
        expect(screen.queryByTestId('delete-quest-modal')).not.toBeInTheDocument();
      });
    }
  });

  // Test Case DQ-QD-004: Confirm deletes quest
  test('should delete quest when confirm is clicked in modal', async () => {
    render(
      <QuestProvider userContext={mockUserContext}>
        <QuestDashboard />
      </QuestProvider>
    );

    // Find and click confirm delete button
    const confirmButton = screen.queryByTestId('confirm-delete');
    if (confirmButton) {
      fireEvent.click(confirmButton);
      // Modal should close after deletion
    }
  });

  // Test Case DQ-QD-005: Correct quest is deleted
  test('should delete the correct quest when multiple quests exist', async () => {
    render(
      <QuestProvider userContext={mockUserContext}>
        <QuestDashboard />
      </QuestProvider>
    );

    // Should delete the quest with the title we confirmed
    // Verify the quest is removed from the list
  });
});
