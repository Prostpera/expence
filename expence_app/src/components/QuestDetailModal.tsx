'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { QuestCardProps } from './QuestCard';

interface QuestDetailModalProps {
  quest: QuestCardProps;
  onClose: () => void;
  onUpdate: (updatedQuest: QuestCardProps) => void;
}

const QuestDetailModal: React.FC<QuestDetailModalProps> = ({ quest, onClose, onUpdate }) => {
  const [progress, setProgress] = useState(quest.progress);
  const [daysLeft, setDaysLeft] = useState(quest.daysLeft);

  const handleSave = () => {
    onUpdate({ ...quest, progress, daysLeft });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-gray-900 border border-cyan-500 rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-4 border-b border-cyan-500 pb-2">
          {quest.title}
        </h2>

        <p className="text-gray-300 mb-4">{quest.description}</p>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Progress</label>
          <input
            type="number"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full bg-gray-800 text-white p-2 rounded border border-cyan-600"
            min={0}
            max={quest.goal}
          />
          <p className="text-xs text-gray-500 mt-1">Goal: {quest.goal}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Days Left</label>
          <input
            type="number"
            value={daysLeft}
            onChange={(e) => setDaysLeft(Number(e.target.value))}
            className="w-full bg-gray-800 text-white p-2 rounded border border-cyan-600"
            min={0}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-cyan-500 text-gray-900 font-semibold px-4 py-2 rounded hover:bg-cyan-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestDetailModal;
