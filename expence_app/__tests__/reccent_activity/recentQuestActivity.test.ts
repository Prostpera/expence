import { QuestStatus } from '@/types/quest';

// Mock quest data for testing
const mockQuests = [
  { id: 1, title: 'Quest 1', status: QuestStatus.COMPLETED, completedAt: '2025-10-10', updatedAt: '2025-10-10', createdAt: '2025-10-01', category: 'main_story', expReward: 100, goal: 'Goal 1' },
  { id: 2, title: 'Quest 2', status: QuestStatus.IN_PROGRESS, createdAt: '2025-10-12', category: 'side_jobs', expReward: 50, goal: 'Goal 2' },
  { id: 3, title: 'Quest 3', status: QuestStatus.NEW, createdAt: '2025-10-13', category: 'important', expReward: 75, goal: 'Goal 3' },
  { id: 4, title: 'Quest 4', status: QuestStatus.COMPLETED, completedAt: '2025-10-15', updatedAt: '2025-10-15', createdAt: '2025-10-05', category: 'side_jobs', expReward: 60, goal: 'Goal 4' },
  { id: 5, title: 'Quest 5', status: QuestStatus.NEW, createdAt: '2025-10-16', category: 'main_story', expReward: 80, goal: 'Goal 5' },
  { id: 6, title: 'Quest 6', status: QuestStatus.COMPLETED, completedAt: '2025-10-17', updatedAt: '2025-10-17', createdAt: '2025-10-07', category: 'important', expReward: 90, goal: 'Goal 6' },
];

function getCompletedQuests(quests) {
  return quests
    .filter(q => q.status === QuestStatus.COMPLETED)
    .sort((a, b) => {
      const aDate = new Date(a.completedAt || a.updatedAt).getTime();
      const bDate = new Date(b.completedAt || b.updatedAt).getTime();
      return bDate - aDate;
    })
    .slice(0, 5);
}

function getRecentlyCreatedQuests(quests) {
  return quests
    .filter(q => q.status !== QuestStatus.COMPLETED)
    .sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();
      return bDate - aDate;
    })
    .slice(0, 5);
}

describe('Recent Quest Activity Logic', () => {
  it('returns the 5 most recently completed quests sorted by completion date', () => {
    const completed = getCompletedQuests(mockQuests);
    expect(completed).toHaveLength(3);
    expect(completed[0].title).toBe('Quest 6');
    expect(completed[1].title).toBe('Quest 4');
    expect(completed[2].title).toBe('Quest 1');
  });

  it('excludes completed quests from recently created quests and returns only active ones', () => {
    const recentCreated = getRecentlyCreatedQuests(mockQuests);
    expect(recentCreated.every(q => q.status !== QuestStatus.COMPLETED)).toBe(true);
    expect(recentCreated.map(q => q.title)).toEqual(['Quest 2', 'Quest 3', 'Quest 5']);
  });
});
