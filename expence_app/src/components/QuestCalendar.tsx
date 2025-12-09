// Calendar component adapted from https://github.com/AngelV404/Class-Elective-AI-Advisor 

'use client';

import React, { useState, useEffect } from 'react';
import { Quest, QuestStatus } from '../types/quest';
import { QuestSchedulingService } from '../services/questSchedulingService';
import { Calendar, Clock, AlertTriangle, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestCalendarProps {
  quests: Quest[];
  onQuestClick?: (quest: Quest) => void;
  onQuestComplete?: (questId: string) => void;
  onQuestUpdate?: (quest: Quest) => void;
}

const QuestCalendar: React.FC<QuestCalendarProps> = ({ 
  quests, 
  onQuestClick, 
  onQuestComplete, 
  onQuestUpdate 
}) => {
  const [questsByDay, setQuestsByDay] = useState<Map<string, Quest[]>>(new Map());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [expandedQuests, setExpandedQuests] = useState<Quest[]>([]);
  const [editingProgress, setEditingProgress] = useState(false);
  const [tempProgress, setTempProgress] = useState<number>(0);
  const [showAll, setShowAll] = useState(false);
  const [modalQuests, setModalQuests] = useState<Quest[]>([]);


  // Reset editing state when quest changes
  useEffect(() => {
    setEditingProgress(false);
    setTempProgress(selectedQuest?.progress || 0);
  }, [selectedQuest?.id]);
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00', '18:00', '19:00', '20:00'];

  useEffect(() => {
    // Break down large quests into daily/weekly tasks and organize by actual calendar dates
    const newExpandedQuests = expandQuestsToCalendar(quests, currentDate);
    setExpandedQuests(newExpandedQuests);
    const organizedQuests = organizeQuestsByDate(newExpandedQuests, currentDate, viewMode);
    setQuestsByDay(organizedQuests);
  }, [quests, currentDate, viewMode]);

  // Break down large quests into smaller daily/weekly tasks with better distribution
  const expandQuestsToCalendar = (quests: Quest[], baseDate: Date): Quest[] => {
    const expandedQuests: Quest[] = [];
    let dayOffset = 0; // To distribute quests across different days
    
    quests.forEach((quest, questIndex) => {
      // Daily habits - show as daily reminders but don't duplicate excessively
      if (quest.tags.includes('daily')) {
        // Show the daily task for the next 7 days only
        const daysToShow = 7;
        const startDay = 0; // Start from today
        
        for (let i = 0; i < daysToShow; i++) {
          const questDate = new Date(baseDate);
          questDate.setDate(baseDate.getDate() + startDay + i);
          expandedQuests.push({
            ...quest,
            id: `${quest.id}_daily_${i}`,
            title: quest.title,
            description: `Daily: ${quest.description}`,
            targetDate: questDate,
            goal: 1, // Each daily instance is just "do it today"
            daysLeft: quest.daysLeft - i, // Countdown the original days
            schedule: {
              id: `schedule_${quest.id}_${i}`,
              questId: quest.id,
              dayOfWeek: questDate.toLocaleDateString('en-US', { weekday: 'long' }),
              startTime: '09:00',
              endTime: '09:30',
              recurrence: 'daily',
              reminderEnabled: true
            }
          });
        }
      }
      // Weekly milestones for larger goals
      else if (quest.daysLeft > 14) {
        const weeksNeeded = Math.ceil(quest.daysLeft / 7);
        const weeklyGoal = Math.ceil(quest.goal / weeksNeeded);
        
        for (let week = 0; week < weeksNeeded; week++) {
          const questDate = new Date(baseDate);
          // Spread weekly tasks across different days of the week
          const dayOfWeek = (questIndex + week) % 7;
          questDate.setDate(baseDate.getDate() + (week * 7) + dayOfWeek);
          
          expandedQuests.push({
            ...quest,
            id: `${quest.id}_week_${week}`,
            title: `${quest.title} - Week ${week + 1}`,
            description: `Weekly target: $${weeklyGoal} (${quest.goal - (weeklyGoal * week)} remaining)`,
            targetDate: questDate,
            goal: weeklyGoal,
            daysLeft: Math.min(7, quest.daysLeft - (week * 7)),
            schedule: {
              id: `schedule_${quest.id}_week_${week}`,
              questId: quest.id,
              dayOfWeek: questDate.toLocaleDateString('en-US', { weekday: 'long' }),
              startTime: '10:00',
              endTime: '11:00',
              recurrence: 'weekly',
              reminderEnabled: true
            }
          });
        }
      }
      // Shorter tasks
      else {
        const targetDate = new Date(baseDate);
        // Distribute across different days based on category and index
        const daysToAdd = quest.category === 'main_story' ? 1 : 
                         quest.category === 'important' ? 2 + (questIndex % 3) : 
                         5 + (questIndex % 7); // side_jobs
        
        targetDate.setDate(baseDate.getDate() + daysToAdd);
        
        expandedQuests.push({
          ...quest,
          targetDate,
          schedule: {
            id: `schedule_${quest.id}`,
            questId: quest.id,
            dayOfWeek: targetDate.toLocaleDateString('en-US', { weekday: 'long' }),
            startTime: quest.category === 'main_story' ? '09:00' : '14:00',
            endTime: quest.category === 'main_story' ? '10:00' : '15:00',
            recurrence: 'custom',
            reminderEnabled: true
          }
        });
      }
    });
    
    return expandedQuests;
  };

  const organizeQuestsByDate = (quests: Quest[], baseDate: Date, view: string): Map<string, Quest[]> => {
    const questsByDate = new Map<string, Quest[]>();
    
    if (view === 'month') {
      const startOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
      const startOfWeek = new Date(startOfMonth);
      startOfWeek.setDate(startOfMonth.getDate() - startOfMonth.getDay()); // Start from Sunday
      
      // 42 days (6 weeks) for complete calendar grid
      for (let i = 0; i < 42; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        questsByDate.set(dateKey, []);
      }
    }
    
    // Assign quests to their target dates
    quests.forEach(quest => {
      if (quest.targetDate) {
        const dateKey = quest.targetDate.toISOString().split('T')[0];
        const existingQuests = questsByDate.get(dateKey) || [];
        questsByDate.set(dateKey, [...existingQuests, quest]);
      }
    });
    
    return questsByDate;
  };

  // nav functions
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const moveQuestToDate = (questId: string, newDate: Date) => {
    setExpandedQuests(prevExpanded => {
      const newExpanded = prevExpanded.map(quest => 
        quest.id === questId 
          ? { ...quest, targetDate: newDate }
          : quest
      );
      
      // Re-organize with updated quests
      const newOrganized = organizeQuestsByDate(newExpanded, currentDate, viewMode);
      setQuestsByDay(newOrganized);
      
      return newExpanded;
    });
  };

  const handleQuestComplete = async (questId: string) => {
    // For expanded quests (daily/weekly instances), extract the original quest ID
    if (questId.includes('_daily_') || questId.includes('_week_')) {
      // Extract original quest ID 
      const originalQuestId = questId.includes('_daily_') 
        ? questId.split('_daily_')[0] 
        : questId.split('_week_')[0];
      
      // Just mark this calendar instance as complete locally (visual feedback)
      setExpandedQuests(prevExpanded => {
        const newExpanded = prevExpanded.map(quest => 
          quest.id === questId 
            ? { ...quest, progress: quest.goal, status: 'completed' as any }
            : quest
        );
        
        // Re-organize with updated quests
        const newOrganized = organizeQuestsByDate(newExpanded, currentDate, viewMode);
        setQuestsByDay(newOrganized);
        
        return newExpanded;
      });
      
      
      // Check if all daily/weekly instances are now complete
      const allInstances = expandedQuests.filter(eq => 
        eq.id.startsWith(originalQuestId + '_daily_') || eq.id.startsWith(originalQuestId + '_week_')
      );
      const completedInstances = allInstances.filter(eq => 
        eq.status === 'completed' || eq.id === questId // Include the one we just completed
      );
      
      // If all daily instances are complete, auto-complete the original quest
      if (allInstances.length > 0 && completedInstances.length >= allInstances.length) {
        if (onQuestComplete) {
          setTimeout(() => {
            // Delay slightly to allow local state update first
            onQuestComplete(originalQuestId);
          }, 500);
        }
      }
    } else {
      // For original quests, call the proper completion handler that updates database
      
      // This will update the database and sync across all views
      if (onQuestComplete) {
        await onQuestComplete(questId);
      }
      
      // The quest context will reload data from database, which will update our quests prop
      // and trigger a re-render with the updated data
    }
  };

  const handleProgressUpdate = async (questId: string, newProgress: number) => {
    // Extract original quest ID if this is a daily/weekly instance
    const originalQuestId = (questId.includes('_daily_') || questId.includes('_week_')) 
      ? (questId.includes('_daily_') ? questId.split('_daily_')[0] : questId.split('_week_')[0])
      : questId;

    if (onQuestUpdate) {
      // Create updated quest with new progress
      const questToUpdate = quests.find(q => q.id === originalQuestId);
      if (questToUpdate) {
        const updatedQuest = {
          ...questToUpdate,
          progress: newProgress,
          // Auto-complete if progress reaches goal
          status: newProgress >= questToUpdate.goal ? QuestStatus.COMPLETED : questToUpdate.status
        };
        await onQuestUpdate(updatedQuest);
        
        // If quest completed, also trigger completion handler
        if (newProgress >= questToUpdate.goal && onQuestComplete) {
          await onQuestComplete(originalQuestId);
        }
      }
    }
    
    setEditingProgress(false);
  };

  const getMonthName = (date: Date): string => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'main_story':
        return 'bg-red-500 border-red-600 text-white';
      case 'important':
        return 'bg-orange-500 border-orange-600 text-white';
      case 'side_jobs':
        return 'bg-blue-500 border-blue-600 text-white';
      default:
        return 'bg-gray-500 border-gray-600 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'main_story':
        return <AlertTriangle size={14} />;
      case 'important':
        return <Zap size={14} />;
      case 'side_jobs':
        return <Clock size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const formatTime = (timeStr: string): string => {
    const hour = parseInt(timeStr.split(':')[0]);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}${period}`;
  };

  const QuestCard = ({ quest, compact = false }: { quest: Quest; compact?: boolean }) => {
    const isCompleted = quest.status === 'completed' || quest.progress >= quest.goal;
    
    return (
      <div
        className={`${compact ? 'p-1' : 'p-2'} rounded border-l-2 cursor-grab transition-all duration-200 hover:scale-110 hover:shadow-lg ${getCategoryColor(quest.category)} mb-1 text-xs ${isCompleted ? 'opacity-60' : ''}`}
        draggable={!isCompleted}
        onDragStart={(e) => {
          if (!isCompleted) {
            e.dataTransfer.setData('questId', quest.id);
            e.dataTransfer.effectAllowed = 'move';
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          setShowAll(false)
          setSelectedQuest(quest);
        }}
        title={`${quest.title} - Click for details, drag to reschedule`}
      >
        <div className={`flex items-start ${compact ? 'gap-1' : 'gap-2'}`}>
          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isCompleted) {
                handleQuestComplete(quest.id);
              }
            }}
            className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
              isCompleted 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-400 hover:border-green-400'
            }`}
          >
            {isCompleted && <span className="text-xs">✓</span>}
          </button>

          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold truncate ${compact ? 'text-xs' : ''} ${isCompleted ? 'line-through' : ''}`}>
              {compact ? quest.title.substring(0, 12) : quest.title.substring(0, 25)}
              {quest.title.length > (compact ? 12 : 25) && '...'}
            </h4>
            
            {compact ? (
              <div className="text-xs opacity-75 flex items-center justify-between">
                <span>${quest.goal}</span>
                {quest.schedule && (
                  <span className="text-xs opacity-60">
                    {quest.schedule.startTime.substring(0, 5)}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs opacity-75">
                  ${quest.goal}
                </span>
                {quest.schedule && (
                  <span className="text-xs opacity-75">
                    {formatTime(quest.schedule.startTime)}
                  </span>
                )}
                <span className="text-xs opacity-60">
                  {quest.daysLeft}d
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const MonthView = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startOfCalendar = new Date(startOfMonth);
    startOfCalendar.setDate(startOfCalendar.getDate() - startOfMonth.getDay());

    const calendarDays: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startOfCalendar);
      date.setDate(startOfCalendar.getDate() + i);
      calendarDays.push(date);
    }

    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        {/* Month Header */}
        <div className="p-4 border-b border-gray-600">
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center font-semibold text-gray-300 p-2">
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-2">
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const dateKey = date.toISOString().split('T')[0];
              const dayQuests = questsByDay.get(dateKey) || [];
              const isCurrentDay = isToday(date);
              const isInCurrentMonth = isCurrentMonth(date);

              return (
                <div
                  key={index}
                  className={`min-h-20 p-1 border border-gray-600 rounded overflow-hidden transition-colors hover:bg-gray-700 ${
                    isCurrentDay 
                      ? 'bg-cyan-900 border-cyan-500' 
                      : isInCurrentMonth 
                        ? 'bg-gray-800' 
                        : 'bg-gray-900 opacity-50'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const questId = e.dataTransfer.getData('questId');
                    if (questId) {
                      moveQuestToDate(questId, date);
                    }
                  }}
                  onDragEnter={(e) => {
                    e.currentTarget.classList.add('ring-2', 'ring-cyan-400');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('ring-2', 'ring-cyan-400');
                  }}
                >
                  <div className={`text-xs font-semibold mb-1 flex justify-between items-center ${
                    isCurrentDay 
                      ? 'text-cyan-300' 
                      : isInCurrentMonth 
                        ? 'text-white' 
                        : 'text-gray-500'
                  }`}>
                    <span>{date.getDate()}</span>
                    {dayQuests.length > 0 && (
                      <span className="text-xs bg-cyan-600 px-1 rounded">
                        {dayQuests.length}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 px-2 max-h-16 flex flex-col overflow-y-auto overflow-x-hidden">
                    {dayQuests.slice(0, 2).map((quest) => (
                      <QuestCard key={quest.id} quest={quest} compact={true} />
                    ))}
                    {dayQuests.length > 2 && (
                      <button 
                        onClick={() => {
                          setShowAll(true)
                          setModalQuests(dayQuests);
                        }}
                        
                        className="text-xs text-gray-400 text-center hover:scale-110 hover:underline rounded px-1 transition transform">
                        +{dayQuests.length - 2} more
                      </button> 
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const WeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Start from Sunday

    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }

    return (
      <div className="grid grid-cols-7 gap-4 h-full">
        {weekDays.map((date, index) => {
          const dateKey = date.toISOString().split('T')[0];
          const dayQuests = questsByDay.get(dateKey) || [];
          const isCurrentDay = isToday(date);
          
          return (
            <div 
              key={index} className={`bg-gray-800 rounded-lg p-3 border ${
              isCurrentDay ? 'border-cyan-500' : 'border-gray-700'}`}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                e.preventDefault();
                const questId = e.dataTransfer.getData('questId');
                if (questId) {
                  moveQuestToDate(questId, date);
                }
              }}
              onDragEnter={(e) => {
                e.currentTarget.classList.add('ring-2', 'ring-cyan-400');
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('ring-2', 'ring-cyan-400');
              }}
            >  
              <h3 className={`font-bold text-center mb-3 pb-2 border-b border-gray-600 ${isCurrentDay ? 'text-cyan-300' : 'text-white'}`}>
                <div className="text-sm">{daysOfWeek[index]}</div>
                <div className="text-lg">{date.getDate()}</div>
              </h3>
              <div className="space-y-2 max-h-96 overflow-visible">
                {dayQuests.length > 0 ? (
                  dayQuests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))
                ) : (
                  <div className="text-gray-400 text-center text-sm py-4">
                    No quests scheduled
                  </div>
                )}
              </div>
              {dayQuests.length > 3 && (
                <div className="text-center mt-2">
                  <span className="text-xs text-gray-400">
                    +{dayQuests.length - 3} more
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };


  return (
    <div className="w-full h-full bg-gray-950 text-white">
      {/* Header - Enhanced calendar navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3">
          <Calendar size={24} className="text-cyan-400" />
          <div>
            <h2 className="text-xl font-bold">
              Quest Schedule - <span className="text-cyan-400">Financial Calendar</span>
            </h2>
            <p className="text-sm text-gray-400">
              {viewMode === 'month' ? getMonthName(currentDate) : 
               `Week of ${currentDate.toLocaleDateString()}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (viewMode === 'month') navigateMonth('prev');
                else navigateWeek('prev');
              }}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
            </button>
            <button
              onClick={() => {
                if (viewMode === 'month') navigateMonth('next');
                else navigateWeek('next');
              }}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm rounded transition-all ${
                viewMode === 'month' 
                  ? 'bg-cyan-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded transition-all ${
                viewMode === 'week' 
                  ? 'bg-cyan-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Category Legend */}
      <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <h4 className="text-sm font-semibold mb-2 text-gray-300">Quest Categories</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded border border-red-600"></div>
            <span className="text-sm text-gray-300">Main Quests</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded border border-orange-600"></div>
            <span className="text-sm text-gray-300">Important</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded border border-blue-600"></div>
            <span className="text-sm text-gray-300">Side Jobs</span>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="flex-1">
        {viewMode === 'month' ? <MonthView /> : <WeekView />}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
        <p className="text-sm text-gray-300 text-center">
          💡 <strong>Click</strong> tasks for details • <strong>Drag and drop</strong> to reschedule • <strong>Check off</strong> when complete
        </p>
      </div>

      {/* Quest Details Modal */}
      {selectedQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-900 border border-purple-500 p-6 rounded-lg w-[90%] max-w-lg text-white max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {getCategoryIcon(selectedQuest.category)}
                <h2 className="text-xl font-bold">{selectedQuest.title}</h2>
              </div>
              <button
                onClick={() => setSelectedQuest(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-cyan-400 mb-2">Description</h3>
                <p className="text-gray-300">{selectedQuest.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-1">Goal</h3>
                  <p className="text-white">${selectedQuest.goal}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-1">Days Left</h3>
                  <p className="text-white">{selectedQuest.daysLeft} days</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-1">Category</h3>
                  <p className={`font-semibold ${
                    selectedQuest.category === 'main_story' ? 'text-red-400' :
                    selectedQuest.category === 'important' ? 'text-orange-400' : 'text-blue-400'
                  }`}>
                    {selectedQuest.category === 'main_story' ? 'MAIN QUEST' :
                     selectedQuest.category === 'important' ? 'IMPORTANT' : 'SIDE JOB'}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-cyan-400">Progress</h3>
                    <button
                      onClick={() => {
                        setEditingProgress(!editingProgress);
                        setTempProgress(selectedQuest.progress);
                      }}
                      className="text-xs text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {editingProgress ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                  
                  {editingProgress ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={selectedQuest.goal}
                          value={tempProgress}
                          onChange={(e) => setTempProgress(Number(e.target.value))}
                          className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                          placeholder="Enter progress..."
                        />
                        <span className="text-sm text-gray-400">/ ${selectedQuest.goal}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProgressUpdate(selectedQuest.id, tempProgress)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingProgress(false)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${(selectedQuest.progress / selectedQuest.goal) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-300">
                          {Math.round((selectedQuest.progress / selectedQuest.goal) * 100)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        ${selectedQuest.progress} / ${selectedQuest.goal}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {selectedQuest.schedule && (
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-2">Schedule</h3>
                  <div className="bg-gray-800 p-3 rounded">
                    <p className="text-gray-300">
                      <strong>{selectedQuest.schedule.dayOfWeek}</strong> at{' '}
                      {formatTime(selectedQuest.schedule.startTime)} - {formatTime(selectedQuest.schedule.endTime)}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Recurrence: {selectedQuest.schedule.recurrence}
                    </p>
                  </div>
                </div>
              )}

              {/* Progress Tracking for Expanded Quests */}
              {(selectedQuest.id.includes('_daily_') || selectedQuest.id.includes('_week_')) && (
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-2">Daily Progress Tracking</h3>
                  <div className="bg-gray-800 rounded p-3">
                    {(() => {
                      const originalQuestId = selectedQuest.id.includes('_daily_') 
                        ? selectedQuest.id.split('_daily_')[0] 
                        : selectedQuest.id.split('_week_')[0];
                      
                      // Count completed daily/weekly instances for this quest
                      const completedInstances = expandedQuests.filter(eq => 
                        (eq.id.startsWith(originalQuestId + '_daily_') || eq.id.startsWith(originalQuestId + '_week_')) &&
                        eq.status === 'completed'
                      ).length;
                      
                      const totalInstances = expandedQuests.filter(eq => 
                        eq.id.startsWith(originalQuestId + '_daily_') || eq.id.startsWith(originalQuestId + '_week_')
                      ).length;
                      
                      const progressPercent = totalInstances > 0 ? (completedInstances / totalInstances) * 100 : 0;
                      
                      return (
                        <>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Daily Tasks Completed</span>
                            <span>{completedInstances}/{totalInstances}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Complete daily tasks for progress, or use &quot;Complete Quest&quot; to finish immediately
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {selectedQuest.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-cyan-400 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedQuest.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-4 border-t border-gray-700">
                {/* Show different actions based on whether this is a daily/weekly instance or original quest */}
                {selectedQuest.id.includes('_daily_') || selectedQuest.id.includes('_week_') ? (
                  <>
                    {/* For daily/weekly instances - show both daily progress and original completion options */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          handleQuestComplete(selectedQuest.id);
                          setSelectedQuest(null);
                        }}
                        disabled={selectedQuest.status === 'completed' || selectedQuest.progress >= selectedQuest.goal}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white py-2 px-4 rounded transition-colors"
                      >
                        {selectedQuest.status === 'completed' ? 'Daily Complete ✓' : 'Mark Daily Complete'}
                      </button>
                      <button
                        onClick={async () => {
                          // Extract original quest ID and complete the whole quest
                          const originalQuestId = selectedQuest.id.includes('_daily_') 
                            ? selectedQuest.id.split('_daily_')[0] 
                            : selectedQuest.id.split('_week_')[0];
                          
                          if (onQuestComplete) {
                            await onQuestComplete(originalQuestId);
                          }
                          setSelectedQuest(null);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
                      >
                        🎯 Complete Quest
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 text-center">
                      Blue = Mark daily progress | Green = Complete entire quest
                    </div>
                  </>
                ) : (
                  <>
                    {/* For original quests - direct completion */}
                    <button
                      onClick={() => {
                        handleQuestComplete(selectedQuest.id);
                        setSelectedQuest(null);
                      }}
                      disabled={selectedQuest.status === 'completed' || selectedQuest.progress >= selectedQuest.goal}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white py-2 px-4 rounded transition-colors"
                    >
                      {selectedQuest.status === 'completed' ? 'Completed ✓' : '🎯 Complete Quest'}
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setSelectedQuest(null)}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* All Quests Modal */}
      {showAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-900 border border-orange-500 p-6 rounded-lg w-[90%] max-w-lg text-white h-auto max-h-[80vh]">
            <h2 className="text-xl font-bold">All Quests</h2>

            <div className="space-1 p-3 h-auto flex flex-col overflow-visible">
              {
              modalQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} compact={true} />
              ))}
            </div>

            <button
              onClick={() => setShowAll(false)}
              className="mt-3 py-1 text-sm text-red-400 hover:text-red-300 underline text-center"> Close
            </button>
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-400">
              {quests.filter(q => q.category === 'main_story').length}
            </div>
            <div className="text-sm text-gray-300">Main Quests</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">
              {quests.filter(q => q.category === 'important').length}
            </div>
            <div className="text-sm text-gray-300">Important</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {quests.filter(q => q.category === 'side_jobs').length}
            </div>
            <div className="text-sm text-gray-300">Side Jobs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {quests.filter(q => q.status === 'completed' || q.progress >= q.goal).length}
            </div>
            <div className="text-sm text-gray-300">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCalendar;