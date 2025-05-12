// components/NewQuestModal.tsx
'use client';

import { useState } from 'react';

export type QuestData = {
  title: string;
  description: string;
  goal: number;
  days: number;
};

interface QuestModalProps {
  onClose: () => void;
  onCreate: (data: QuestData) => void;
}

export default function NewQuestModal({ onClose, onCreate }: QuestModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [days, setDays] = useState('');

  const handleSubmit = () => {
    onCreate({
      title,
      description,
      goal: Number(goal),
      days: Number(days),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 border border-purple-500 p-6 rounded-md w-[90%] max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Create New Quest</h2>

        <input
          className="w-full mb-2 p-2 bg-gray-800 border border-gray-700"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full mb-2 p-2 bg-gray-800 border border-gray-700"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="w-full mb-2 p-2 bg-gray-800 border border-gray-700"
          placeholder="Goal (number)"
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <input
          className="w-full mb-4 p-2 bg-gray-800 border border-gray-700"
          placeholder="Days to complete"
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />

        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-red-600 text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-cyan-600 text-white"
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
