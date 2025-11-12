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
  Trophy,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  X,
  Pencil
} from 'lucide-react';
import { useQuests } from '../contexts/QuestContext';
import Modal from './Modal';

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
  const { updateQuest } = useQuests();
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editData, setEditData] = React.useState({
    title: quest.title,
    description: quest.description,
    goal: quest.goal,
    subquests: quest.subquests ? [...quest.subquests] : []
  });

  const getCategoryColor = (category: QuestCategory): string => {
    switch (category) {
      case QuestCategory.MAIN_QUESTS: return 'green';
      case QuestCategory.IMPORTANT: return 'blue';
      case QuestCategory.SIDE_JOBS: return 'purple';
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
      case QuestCategory.MAIN_QUESTS: return 'Main Quest';
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
  const canComplete = quest.status === QuestStatus.IN_PROGRESS;
  const canPause = quest.status === QuestStatus.IN_PROGRESS;
  
  // Debug quest status
  console.log(`Quest "${quest.title}": status="${quest.status}", canStart=${canStart}, onStart=${!!onStart}`);

  const handleEditSave = () => {
    updateQuest(quest.id, {
      title: editData.title,
      description: editData.description,
      goal: editData.goal,
      subquests: editData.subquests
    });
    setIsEditOpen(false);
  };

  const EditDots = () => (
    <span className="inline-flex items-center gap-1">
      <span className="w-2 h-2 rounded-full bg-green-400 opacity-80" />
      <span className="w-2 h-2 rounded-full bg-cyan-400 opacity-80" />
      <span className="w-2 h-2 rounded-full bg-purple-400 opacity-80" />
    </span>
  );

  return (
    <div className={`
      relative bg-gray-900 rounded-lg p-6 shadow-lg mb-6 border-2
      ${categoryColor === 'green' ? 'border-emerald-500' : ''}
      ${categoryColor === 'blue' ? 'border-blue-500' : ''}
      ${categoryColor === 'purple' ? 'border-purple-500' : ''}
      ${categoryColor === 'gray' ? 'border-gray-500' : ''}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`
              px-2 py-1 text-xs font-bold rounded
              ${categoryColor === 'green' ? 'bg-emerald-900/50 text-emerald-300' : ''}
              ${categoryColor === 'blue' ? 'bg-blue-900/50 text-blue-300' : ''}
              ${categoryColor === 'purple' ? 'bg-purple-900/50 text-purple-300' : ''}
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
            ${categoryColor === 'green' ? 'text-emerald-300' : ''}
            ${categoryColor === 'blue' ? 'text-blue-300' : ''}
            ${categoryColor === 'purple' ? 'text-purple-300' : ''}
          `}>
            {quest.title}
          </h3>
        </div>
        
        {/* Right side: Difficulty stars */}
        <div className="flex items-center gap-1">
          {getDifficultyIcon(quest.difficulty)}
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
              ${categoryColor === 'green' ? 'bg-emerald-400' : ''}
              ${categoryColor === 'blue' ? 'bg-blue-400' : ''}
              ${categoryColor === 'purple' ? 'bg-purple-400' : ''}
            `}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Quest Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1 text-gray-400">
          <Clock size={12} />
          <span>{quest.daysLeft} days</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Trophy size={12} />
          <span>{quest.expReward} EXP</span>
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
                ${categoryColor === 'green' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                ${categoryColor === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                ${categoryColor === 'purple' ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}
              `}
            >
              Start Quest
            </button>
          )}

          {canComplete && onComplete && (
            <button
              onClick={() => onComplete(quest.id)}
              className="px-3 py-1 text-xs font-bold rounded bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-300 shadow-lg shadow-emerald-500/25"
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

          <button
            onClick={() => setIsEditOpen(true)}
            className="px-3 py-1 text-xs font-bold rounded border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-1"
            title="Edit Quest"
          >
            <Pencil size={12} />
            <span>Edit</span>
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(quest.id)}
              className="px-2 py-1 text-xs font-bold rounded bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
              title="Delete Quest"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      {quest.tags && quest.tags.length > 0 && (
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
            <h2 className="text-lg font-bold mb-4 text-white">Edit Quest</h2>
            
            <label className="block text-sm text-gray-300 mb-1">Title</label>
            <input
              className="w-full mb-3 p-2 bg-gray-800 border border-gray-700 rounded text-white"
              value={editData.title}
              onChange={e => setEditData({ ...editData, title: e.target.value })}
              placeholder="Title"
            />
            
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              className="w-full mb-3 p-2 bg-gray-800 border border-gray-700 rounded text-white min-h-[80px]"
              value={editData.description}
              onChange={e => setEditData({ ...editData, description: e.target.value })}
              placeholder="Description"
            />
            
            <label className="block text-sm text-gray-300 mb-1">Goal</label>
            <input
              className="w-full mb-3 p-2 bg-gray-800 border border-gray-700 rounded text-white"
              type="number"
              value={editData.goal}
              onChange={e => setEditData({ ...editData, goal: Number(e.target.value) })}
              placeholder="Goal"
            />
            
            {/* Subquest editing */}
            {editData.subquests && editData.subquests.length > 0 && (
              <div className="mb-3">
                <h3 className="text-md font-semibold mb-2 text-white">Subquests</h3>
                {editData.subquests.map((sq, idx) => (
                  <div key={sq.id} className="flex gap-2 mb-2 items-center">
                    <input
                      className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                      value={sq.title}
                      onChange={e => {
                        const newSubquests = [...editData.subquests];
                        newSubquests[idx].title = e.target.value;
                        setEditData({ ...editData, subquests: newSubquests });
                      }}
                      placeholder="Subquest title"
                    />
                    <button
                      className="px-2 py-1 text-red-400 hover:text-red-300 text-sm"
                      onClick={() => {
                        const newSubquests = editData.subquests.filter((_, i) => i !== idx);
                        setEditData({ ...editData, subquests: newSubquests });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
                onClick={handleEditSave}
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuestCard;