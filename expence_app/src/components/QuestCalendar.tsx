// Calendar component adapted from https://github.com/AngelV404/Class-Elective-AI-Advisor 

'use client';

import React, { useState, useEffect } from 'react';
import { Quest, QuestPriority } from '../types/quest';
import { QuestSchedulingService } from '../services/questSchedulingService';
import { Calendar, Clock, AlertTriangle, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestCalendarProps {
  quests: Quest[];
  onQuestClick?: (quest: Quest) => void;
}

const QuestCalendar: React.FC<QuestCalendarProps> = ({ quests, onQuestClick }) => {
  const [questsByDay, setQuestsByDay] = useState<Map<string, Quest[]>>(new Map());
  const [currentWeek, setCurrentWeek] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00', '18:00', '19:00', '20:00'];

  useEffect(() => {
    // Organize quests by day using our adapted scheduling algorithm
    const organizedQuests = QuestSchedulingService.getQuestsByDay(quests);
    setQuestsByDay(organizedQuests);
  }, [quests]);

  const getPriorityColor = (priority: QuestPriority): string => {
    switch (priority) {
      case QuestPriority.URGENT:
        return 'bg-red-500 border-red-600 text-white';
      case QuestPriority.HIGH:
        return 'bg-orange-500 border-orange-600 text-white';
      case QuestPriority.MEDIUM:
        return 'bg-yellow-500 border-yellow-600 text-black';
      case QuestPriority.LOW:
        return 'bg-blue-500 border-blue-600 text-white';
      default:
        return 'bg-gray-500 border-gray-600 text-white';
    }
  };

  const getPriorityIcon = (priority: QuestPriority) => {
    switch (priority) {
      case QuestPriority.URGENT:
        return <AlertTriangle size={14} />;
      case QuestPriority.HIGH:
        return <Zap size={14} />;
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

  const QuestCard = ({ quest }: { quest: Quest }) => (
    <div
      className={`p-2 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${getPriorityColor(quest.priority)} mb-2 text-xs`}
      onClick={() => onQuestClick?.(quest)}
    >
      <div className="flex items-start gap-2">
        {getPriorityIcon(quest.priority)}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate">{quest.title}</h4>
          <p className="text-xs opacity-90 truncate">{quest.description}</p>
          <div className="flex items-center gap-2 mt-1">
            {quest.schedule && (
              <span className="text-xs opacity-75">
                {formatTime(quest.schedule.startTime)}-{formatTime(quest.schedule.endTime)}
              </span>
            )}
            <span className="text-xs opacity-75">
              {quest.daysLeft}d left
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const WeekView = () => (
    <div className="grid grid-cols-7 gap-4 h-full">
      {daysOfWeek.map((day) => {
        const dayQuests = questsByDay.get(day) || [];
        return (
          <div key={day} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <h3 className="font-bold text-white text-center mb-3 pb-2 border-b border-gray-600">
              {day}
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
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

  const DayView = () => {
    const selectedDay = daysOfWeek[currentWeek % 7];
    const dayQuests = questsByDay.get(selectedDay) || [];
    
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="font-bold text-white text-xl mb-4 text-center">
          {selectedDay} Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeSlots.map((timeSlot) => {
            const slotQuests = dayQuests.filter(quest => 
              quest.schedule?.startTime === timeSlot
            );
            
            return (
              <div key={timeSlot} className="bg-gray-900 rounded-lg p-3 border border-gray-600">
                <h4 className="font-semibold text-cyan-400 mb-2">
                  {formatTime(timeSlot)}
                </h4>
                {slotQuests.length > 0 ? (
                  slotQuests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">
                    Available
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Unscheduled quests for the day */}
        <div className="mt-6">
          <h4 className="font-semibold text-white mb-3">Unscheduled Quests</h4>
          <div className="space-y-2">
            {dayQuests.filter(quest => !quest.schedule).map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-gray-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3">
          <Calendar size={24} className="text-cyan-400" />
          <h2 className="text-xl font-bold">
            Quest Schedule - <span className="text-cyan-400">Chronological View</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'week' 
                  ? 'bg-cyan-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'day' 
                  ? 'bg-cyan-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Day
            </button>
          </div>
          
          {/* Week Navigation (for day view) */}
          {viewMode === 'day' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentWeek(currentWeek - 1)}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm px-3">
                {daysOfWeek[Math.abs(currentWeek) % 7]}
              </span>
              <button
                onClick={() => setCurrentWeek(currentWeek + 1)}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Priority Legend */}
      <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <h4 className="text-sm font-semibold mb-2 text-gray-300">Priority Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded border border-red-600"></div>
            <span className="text-sm text-gray-300">Urgent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded border border-orange-600"></div>
            <span className="text-sm text-gray-300">High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded border border-yellow-600"></div>
            <span className="text-sm text-gray-300">Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded border border-blue-600"></div>
            <span className="text-sm text-gray-300">Low Priority</span>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="flex-1">
        {viewMode === 'week' ? <WeekView /> : <DayView />}
      </div>

      {/* Stats Footer */}
      <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-400">
              {quests.filter(q => q.priority === QuestPriority.URGENT).length}
            </div>
            <div className="text-sm text-gray-300">Urgent Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">
              {quests.filter(q => q.priority === QuestPriority.HIGH).length}
            </div>
            <div className="text-sm text-gray-300">High Priority</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {quests.filter(q => q.schedule).length}
            </div>
            <div className="text-sm text-gray-300">Scheduled</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400">
              {quests.filter(q => !q.schedule).length}
            </div>
            <div className="text-sm text-gray-300">Unscheduled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCalendar;