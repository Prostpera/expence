'use client';

import React from 'react';
import { 
  Quest, 
  QuestCategory, 
  QuestDifficulty, 
  QuestStatus 
} from '../types/quest';
import { 
  Clock, 
  Star, 
  Target, 
  Coins, 
  Trophy,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  X,
  Pencil
} from 'lucide-react';
import { useQuests } from '../contexts/QuestContext';
import Modal from './Modal'; // If you have a Modal component, otherwise use a simple div

interface QuestCardProps {
  quest: Quest;
  onStart?: (questId: string) => void;
  onComplete?: (questId: string) => void;
  onPause?: (questId: string) => void;
  onDelete?: (questId: string) => void;
  onViewDetails?: (questId: string) => void;
  onSubQuestToggle?: (questId: string, subQuestId: string) => void;
}

const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onStart,
  onComplete,
  onPause,
  onDelete,
  onViewDetails,
  onSubQuestToggle
}) => {
  const getCategoryColor = (category: QuestCategory): string => {
    switch (category) {
      case QuestCategory.MAIN_STORY: return 'purple';
      case QuestCategory.IMPORTANT: return 'cyan';
      case QuestCategory.SIDE_JOBS: return 'yellow';
      default: return 'gray';
    }
  };

  const getDifficultyIcon = (difficulty: QuestDifficulty) => {
    const stars = difficulty === QuestDifficulty.EASY ? 1 : 
                 difficulty === QuestDifficulty.MEDIUM ? 2 : 3;
    
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };

  const getStatusIcon = (status: QuestStatus) => {
    switch (status) {
      case QuestStatus.NEW: return <Target size={16} className="text-blue-400" />;
      case QuestStatus.IN_PROGRESS: return <Play size={16} className="text-green-400" />;
      case QuestStatus.COMPLETED: return <CheckCircle size={16} className="text-green-500" />;
      case QuestStatus.FAILED: return <AlertCircle size={16} className="text-red-400" />;
      case QuestStatus.EXPIRED: return <AlertCircle size={16} className="text-gray-400" />;
      default: return <Target size={16} className="text-gray-400" />;
    }
  };

  const getCategoryLabel = (category: QuestCategory): string => {
    switch (category) {
      case QuestCategory.MAIN_STORY: return 'Main Story';
      case QuestCategory.IMPORTANT: return 'Important';
      case QuestCategory.SIDE_JOBS: return 'Side Job';
      default: return 'Unknown';
    }
  };

  const getStatusLabel = (status: QuestStatus): string => {
    switch (status) {
      case QuestStatus.NEW: return 'New';
      case QuestStatus.IN_PROGRESS: return 'In Progress';
      case QuestStatus.COMPLETED: return 'Completed';
      case QuestStatus.FAILED: return 'Failed';
      case QuestStatus.EXPIRED: return 'Expired';
      default: return 'Unknown';
    }
  };

  const progressPercentage = Math.floor((quest.progress / quest.goal) * 100);
  const categoryColor = getCategoryColor(quest.category);
  const isCompleted = quest.status === QuestStatus.COMPLETED;
  const canStart = quest.status === QuestStatus.NEW;
  const canComplete = quest.status === QuestStatus.IN_PROGRESS && quest.progress >= quest.goal;
  const canPause = quest.status === QuestStatus.IN_PROGRESS;

  const { updateQuest } = useQuests();
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editData, setEditData] = React.useState({
    title: quest.title,
    description: quest.description,
    goal: quest.goal,
    subquests: quest.subquests ? [...quest.subquests] : []
  });

  const handleEditSave = () => {
    updateQuest(quest.id, {
      title: editData.title,
      description: editData.description,
      goal: editData.goal,
      subquests: editData.subquests
    });
    setIsEditOpen(false);
  };

  // Add this helper for the colored dots
  const EditDots = () => (
    <span className="inline-flex items-center gap-1">
      <span className="w-2 h-2 rounded-full bg-yellow-400 opacity-80" />
      <span className="w-2 h-2 rounded-full bg-cyan-400 opacity-80" />
      <span className="w-2 h-2 rounded-full bg-purple-400 opacity-80" />
    </span>
  );

  return (
    <div className="relative bg-gray-900 border border-yellow-500 rounded-lg p-6 shadow-lg mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`
              px-2 py-1 text-xs font-bold rounded
              ${categoryColor === 'purple' ? 'bg-purple-900/50 text-purple-300' : ''}
              ${categoryColor === 'cyan' ? 'bg-cyan-900/50 text-cyan-300' : ''}
              ${categoryColor === 'yellow' ? 'bg-yellow-900/50 text-yellow-300' : ''}
            `}>
              {getCategoryLabel(quest.category)}
            </span>
            {quest.isAIGenerated && (
              <span className="px-2 py-1 text-xs font-bold rounded bg-pink-900/50 text-pink-300">
                AI
              </span>
            )}
          </div>
          <h3 className={`
            font-bold text-lg mb-2 group-hover:text-white transition-colors
            ${categoryColor === 'purple' ? 'text-purple-300' : ''}
            ${categoryColor === 'cyan' ? 'text-cyan-300' : ''}
            ${categoryColor === 'yellow' ? 'text-yellow-300' : ''}
          `}>
            {quest.title}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {getDifficultyIcon(quest.difficulty)}
        </div>
      </div>

      {/* Edit Button with Colored Dots */}
      <div className="flex items-center justify-between mb-2">
        <div>
          {/* ...existing title and category... */}
        </div>
        <div className="flex items-center gap-2">
          {/* ...existing rating stars... */}
          {/* Edit button with colored dots */}
          <button
            className="px-2 py-1 bg-gray-800 bg-opacity-60 rounded flex items-center gap-1 hover:bg-gray-700 transition-colors text-xs"
            title="Edit Quest"
            onClick={() => setIsEditOpen(true)}
          >
            <EditDots />
            <span className="ml-1">Edit</span>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {quest.description}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">Progress</span>
          <span className="text-xs text-gray-400">
            {quest.progress} / {quest.goal} ({progressPercentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className={`
              h-2 rounded-full transition-all duration-300
              ${categoryColor === 'purple' ? 'bg-purple-500' : ''}
              ${categoryColor === 'cyan' ? 'bg-cyan-500' : ''}
              ${categoryColor === 'yellow' ? 'bg-yellow-500' : ''}
            `}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Quest Info */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1 text-gray-400">
          <Clock size={12} />
          <span>{quest.daysLeft} days</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Trophy size={12} />
          <span>{quest.expReward} EXP</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Coins size={12} />
          <span>{quest.coinReward} coins</span>
        </div>
      </div>

      {/* Status and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          {getStatusIcon(quest.status)}
          <span className="text-sm text-gray-300">
            {getStatusLabel(quest.status)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {canStart && onStart && (
            <button
              onClick={() => onStart(quest.id)}
              className={`
                px-3 py-1 text-xs font-bold rounded transition-all duration-300
                ${categoryColor === 'purple' ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}
                ${categoryColor === 'cyan' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : ''}
                ${categoryColor === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-700 text-black' : ''}
              `}
            >
              Start Quest
            </button>
          )}

          {canComplete && onComplete && (
            <button
              onClick={() => onComplete(quest.id)}
              className="px-3 py-1 text-xs font-bold rounded bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
            >
              Complete
            </button>
          )}

          {canPause && onPause && (
            <button
              onClick={() => onPause(quest.id)}
              className="px-2 py-1 text-xs font-bold rounded bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300"
            >
              <Pause size={12} />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(quest.id)}
              className="px-2 py-1 text-xs font-bold rounded bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
              title="Delete Quest"
            >
              <X size={12} />
            </button>
          )}

          {onViewDetails && (
            <button
              onClick={() => onViewDetails(quest.id)}
              className="px-3 py-1 text-xs font-bold rounded border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white transition-all duration-300"
            >
              Details
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      {quest.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-800">
          {quest.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-400"
            >
              #{tag}
            </span>
          ))}
          {quest.tags.length > 3 && (
            <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-400">
              +{quest.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <Modal onClose={() => setIsEditOpen(false)}>
          <div className="p-4 bg-gray-900 rounded">
            <h2 className="text-lg font-bold mb-2">Edit Quest</h2>
            <label className="block text-sm text-gray-300 mb-1">Title</label>
            <input
              className="w-full mb-2 p-2 bg-gray-800 border border-gray-700 rounded"
              value={editData.title}
              onChange={e => setEditData({ ...editData, title: e.target.value })}
              placeholder="Title"
            />
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              className="w-full mb-2 p-2 bg-gray-800 border border-gray-700 rounded"
              value={editData.description}
              onChange={e => setEditData({ ...editData, description: e.target.value })}
              placeholder="Description"
            />
            <label className="block text-sm text-gray-300 mb-1">Goal</label>
            <input
              className="w-full mb-2 p-2 bg-gray-800 border border-gray-700 rounded"
              type="number"
              value={editData.goal}
              onChange={e => setEditData({ ...editData, goal: Number(e.target.value) })}
              placeholder="Goal"
            />
            {/* Subquest editing (simple) */}
            {editData.subquests && editData.subquests.length > 0 && (
              <div className="mb-2">
                <h3 className="text-md font-semibold mb-1">Subquests</h3>
                {editData.subquests.map((sq, idx) => (
                  <div key={sq.id} className="flex gap-2 mb-1">
                    <label className="block text-xs text-gray-400">Subquest Title</label>
                    <input
                      className="flex-1 p-1 bg-gray-800 border border-gray-700 rounded"
                      value={sq.title}
                      onChange={e => {
                        const newSubquests = [...editData.subquests];
                        newSubquests[idx].title = e.target.value;
                        setEditData({ ...editData, subquests: newSubquests });
                      }}
                    />
                    <button
                      className="text-red-400"
                      onClick={() => {
                        const newSubquests = editData.subquests.filter((_, i) => i !== idx);
                        setEditData({ ...editData, subquests: newSubquests });
                      }}
                    >Remove</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded"
                onClick={() => setIsEditOpen(false)}
              >Cancel</button>
              <button
                className="px-4 py-2 bg-cyan-600 text-white rounded"
                onClick={handleEditSave}
              >Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuestCard;