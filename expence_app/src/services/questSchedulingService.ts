import { 
  Quest, 
  QuestSchedule, 
  QuestPreferences, 
  QuestPriority,
  QuestStatus
} from '../types/quest';

// Quest scheduling algorithms adapted from https://github.com/AngelV404/Class-Elective-AI-Advisor

export class QuestSchedulingService {
  
  static autoScheduleQuests(
    quests: Quest[], 
    preferences: QuestPreferences
  ): Quest[] {
    const scheduledQuests: Quest[] = [];
    const timeSlotMap = new Map<string, Quest[]>();
    
    // Sort quests by priority and target date (chronological like class schedule)
    const sortedQuests = this.sortQuestsByPriorityAndDate(quests);
    
    for (const quest of sortedQuests) {
      if (quest.status === QuestStatus.COMPLETED) continue;
      
      const schedule = this.findOptimalTimeSlot(quest, preferences, timeSlotMap);
      if (schedule) {
        const scheduledQuest = { ...quest, schedule };
        scheduledQuests.push(scheduledQuest);
        
        // Track time slot usage like Class Advisor tracks course conflicts
        const slotKey = `${schedule.dayOfWeek}-${schedule.startTime}`;
        if (!timeSlotMap.has(slotKey)) {
          timeSlotMap.set(slotKey, []);
        }
        timeSlotMap.get(slotKey)!.push(scheduledQuest);
      } else {
        // Add without schedule if no slot available
        scheduledQuests.push(quest);
      }
    }
    
    return scheduledQuests;
  }
  
  private static sortQuestsByPriorityAndDate(quests: Quest[]): Quest[] {
    return quests.sort((a, b) => {
      // Priority first (like course requirements)
      const priorityOrder = { 'urgent': 0, 'high': 1, 'medium': 2, 'low': 3 };
      const aPriorityScore = priorityOrder[a.priority] ?? 3;
      const bPriorityScore = priorityOrder[b.priority] ?? 3;
      
      if (aPriorityScore !== bPriorityScore) {
        return aPriorityScore - bPriorityScore;
      }
      
      // Then by target date (chronological order)
      if (a.targetDate && b.targetDate) {
        return a.targetDate.getTime() - b.targetDate.getTime();
      }
      
      // Finally by creation date
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }
  
  private static findOptimalTimeSlot(
    quest: Quest,
    preferences: QuestPreferences,
    existingSlots: Map<string, Quest[]>
  ): QuestSchedule | null {
    
    const timeSlots = this.getTimeSlotsByPreference(preferences);
    
    for (const day of preferences.preferredDays) {
      for (const timeSlot of timeSlots) {
        const slotKey = `${day}-${timeSlot.start}`;
        const existingQuests = existingSlots.get(slotKey) || [];
        
        // Check if slot is available (like checking course conflicts)
        if (existingQuests.length < preferences.maxQuestsPerDay) {
          return {
            id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            questId: quest.id,
            dayOfWeek: day,
            startTime: timeSlot.start,
            endTime: timeSlot.end,
            recurrence: this.getRecurrenceFromQuest(quest),
            reminderEnabled: true
          };
        }
      }
    }
    
    return null;
  }
  
  private static getTimeSlotsByPreference(preferences: QuestPreferences) {
    const timeSlots: { start: string, end: string }[] = [];
    
    for (const timeSlotPref of preferences.preferredTimeSlots) {
      switch (timeSlotPref) {
        case 'morning':
          timeSlots.push({ start: '08:00', end: '09:00' });
          timeSlots.push({ start: '09:00', end: '10:00' });
          timeSlots.push({ start: '10:00', end: '11:00' });
          break;
        case 'afternoon':
          timeSlots.push({ start: '13:00', end: '14:00' });
          timeSlots.push({ start: '14:00', end: '15:00' });
          timeSlots.push({ start: '15:00', end: '16:00' });
          break;
        case 'evening':
          timeSlots.push({ start: '18:00', end: '19:00' });
          timeSlots.push({ start: '19:00', end: '20:00' });
          timeSlots.push({ start: '20:00', end: '21:00' });
          break;
      }
    }
    
    return timeSlots;
  }
  
  private static getRecurrenceFromQuest(quest: Quest): 'daily' | 'weekly' | 'monthly' | 'custom' {
    if (quest.tags.includes('daily')) return 'daily';
    if (quest.tags.includes('weekly')) return 'weekly';
    if (quest.tags.includes('monthly')) return 'monthly';
    return 'custom';
  }
  
  static getQuestsByDay(quests: Quest[]): Map<string, Quest[]> {
    const questsByDay = new Map<string, Quest[]>();
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Initialize all days
    daysOfWeek.forEach(day => questsByDay.set(day, []));
    
    quests.forEach(quest => {
      if (quest.schedule) {
        const existingQuests = questsByDay.get(quest.schedule.dayOfWeek) || [];
        questsByDay.set(quest.schedule.dayOfWeek, [...existingQuests, quest]);
      } else {
        // Add unscheduled quests to a default day based on priority
        const defaultDay = this.getDefaultDayForQuest(quest);
        const existingQuests = questsByDay.get(defaultDay) || [];
        questsByDay.set(defaultDay, [...existingQuests, quest]);
      }
    });
    
    // Sort quests within each day by start time
    questsByDay.forEach((dayQuests, day) => {
      dayQuests.sort((a, b) => {
        if (a.schedule && b.schedule) {
          return a.schedule.startTime.localeCompare(b.schedule.startTime);
        }
        return 0;
      });
    });
    
    return questsByDay;
  }
  
  private static getDefaultDayForQuest(quest: Quest): string {
    switch (quest.priority) {
      case QuestPriority.URGENT:
        return 'Monday'; // Start week strong
      case QuestPriority.HIGH:
        return 'Tuesday';
      case QuestPriority.MEDIUM:
        return 'Wednesday';
      case QuestPriority.LOW:
        return 'Friday'; // End week tasks
      default:
        return 'Monday';
    }
  }
  
  static detectScheduleConflicts(quests: Quest[]): Quest[][] {
    const conflicts: Quest[][] = [];
    const timeSlotMap = new Map<string, Quest[]>();
    
    quests.forEach(quest => {
      if (quest.schedule) {
        const slotKey = `${quest.schedule.dayOfWeek}-${quest.schedule.startTime}`;
        if (!timeSlotMap.has(slotKey)) {
          timeSlotMap.set(slotKey, []);
        }
        timeSlotMap.get(slotKey)!.push(quest);
      }
    });
    
    timeSlotMap.forEach(sameTimeQuests => {
      if (sameTimeQuests.length > 1) {
        conflicts.push(sameTimeQuests);
      }
    });
    
    return conflicts;
  }
}