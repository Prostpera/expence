import { QuestSchedulingService } from '../../src/services/questSchedulingService';
import {
  Quest,
  QuestSchedule,
  QuestCategory,
  QuestDifficulty,
  QuestStatus,
  QuestPreferences
} from '../../src/types/quest';

const baseDate = new Date('2024-01-01T00:00:00Z');

const buildSchedule = (overrides: Partial<QuestSchedule> = {}): QuestSchedule => ({
  id: overrides.id ?? `schedule-${Math.random()}`,
  questId: overrides.questId ?? 'quest-id',
  dayOfWeek: overrides.dayOfWeek ?? 'Monday',
  startTime: overrides.startTime ?? '09:00',
  endTime: overrides.endTime ?? '10:00',
  recurrence: overrides.recurrence ?? 'weekly',
  reminderEnabled: overrides.reminderEnabled ?? true
});

const buildQuest = (overrides: Partial<Quest> = {}): Quest => ({
  id: overrides.id ?? `quest-${Math.random()}`,
  title: overrides.title ?? 'Test Quest',
  description: overrides.description ?? 'Quest description',
  category: overrides.category ?? QuestCategory.SIDE_JOBS,
  difficulty: overrides.difficulty ?? QuestDifficulty.EASY,
  status: overrides.status ?? QuestStatus.NEW,
  progress: overrides.progress ?? 0,
  goal: overrides.goal ?? 100,
  daysLeft: overrides.daysLeft ?? 7,
  expReward: overrides.expReward ?? 50,
  coinReward: overrides.coinReward ?? 25,
  prerequisites: overrides.prerequisites ?? [],
  tags: overrides.tags ?? ['habit'],
  createdAt: overrides.createdAt ?? baseDate,
  updatedAt: overrides.updatedAt ?? baseDate,
  isAIGenerated: overrides.isAIGenerated ?? false,
  userContext: overrides.userContext,
  schedule: overrides.schedule,
  targetDate: overrides.targetDate
});

const buildPreferences = (overrides: Partial<QuestPreferences> = {}): QuestPreferences => ({
  preferredDays: overrides.preferredDays ?? ['Monday', 'Wednesday'],
  preferredTimeSlots: overrides.preferredTimeSlots ?? ['morning'],
  maxQuestsPerDay: overrides.maxQuestsPerDay ?? 2,
  autoSchedule: overrides.autoSchedule ?? true
});

describe('QuestSchedulingService.autoScheduleQuests', () => {
  it('assigns quests to the earliest preferred day and slot while preserving recurrence tags', () => {
    const quests = [
      buildQuest({
        id: 'main-quest',
        category: QuestCategory.MAIN_QUESTS,
        tags: ['weekly'],
        status: QuestStatus.IN_PROGRESS
      })
    ];

    const preferences = buildPreferences({
      preferredDays: ['Monday', 'Thursday'],
      preferredTimeSlots: ['morning']
    });

    const [scheduledQuest] = QuestSchedulingService.autoScheduleQuests(quests, preferences);

    expect(scheduledQuest.schedule).toBeDefined();
    expect(scheduledQuest.schedule).toMatchObject({
      dayOfWeek: 'Monday',
      startTime: '08:00',
      recurrence: 'weekly'
    });
  });

  it('moves to the next available time slot when the preferred slot is taken', () => {
    const quests = [
      buildQuest({ id: 'priority-quest', category: QuestCategory.MAIN_QUESTS }),
      buildQuest({ id: 'secondary-quest', category: QuestCategory.IMPORTANT, createdAt: new Date('2024-01-02') })
    ];

    const preferences = buildPreferences({ preferredDays: ['Monday'], preferredTimeSlots: ['morning'], maxQuestsPerDay: 1 });

    const scheduledQuests = QuestSchedulingService.autoScheduleQuests(quests, preferences);
    const primary = scheduledQuests.find(q => q.id === 'priority-quest');
    const secondary = scheduledQuests.find(q => q.id === 'secondary-quest');

    expect(primary?.schedule?.startTime).toBe('08:00');
    expect(secondary?.schedule?.startTime).toBe('09:00');
  });
});

describe('QuestSchedulingService.getQuestsByDay', () => {
  it('groups scheduled quests and assigns default days for unscheduled ones', () => {
    const scheduledQuest = buildQuest({
      id: 'scheduled',
      schedule: buildSchedule({ dayOfWeek: 'Wednesday', startTime: '10:00' })
    });

    const unscheduledMain = buildQuest({
      id: 'main-unscheduled',
      category: QuestCategory.MAIN_QUESTS,
      schedule: undefined
    });

    const unscheduledImportant = buildQuest({
      id: 'important-unscheduled',
      category: QuestCategory.IMPORTANT,
      schedule: undefined
    });

    const questsByDay = QuestSchedulingService.getQuestsByDay([
      scheduledQuest,
      unscheduledMain,
      unscheduledImportant
    ]);

    expect(questsByDay.get('Wednesday')?.map(q => q.id)).toContain('scheduled');
    expect(questsByDay.get('Monday')?.map(q => q.id)).toContain('main-unscheduled');
    expect(questsByDay.get('Tuesday')?.map(q => q.id)).toContain('important-unscheduled');
  });
});

describe('QuestSchedulingService.detectScheduleConflicts', () => {
  it('returns quest groups that share the same day and start time', () => {
    const questA = buildQuest({
      id: 'quest-a',
      schedule: buildSchedule({ questId: 'quest-a', dayOfWeek: 'Friday', startTime: '14:00' })
    });

    const questB = buildQuest({
      id: 'quest-b',
      schedule: buildSchedule({ questId: 'quest-b', dayOfWeek: 'Friday', startTime: '14:00' })
    });

    const questC = buildQuest({
      id: 'quest-c',
      schedule: buildSchedule({ questId: 'quest-c', dayOfWeek: 'Friday', startTime: '15:00' })
    });

    const conflicts = QuestSchedulingService.detectScheduleConflicts([
      questA,
      questB,
      questC
    ]);

    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].map(q => q.id).sort()).toEqual(['quest-a', 'quest-b']);
  });
});
