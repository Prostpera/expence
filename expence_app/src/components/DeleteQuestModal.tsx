'use client';

import React from 'react';
import { AlertCircle, Trash2, X } from 'lucide-react';

interface DeleteQuestModalProps {
  questTitle: string;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteQuestModal: React.FC<DeleteQuestModalProps> = ({
  questTitle,
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border-2 border-red-600 rounded-lg shadow-2xl w-[90%] max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 to-red-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className="text-red-300" />
            <h2 className="text-xl font-bold text-white">Delete Quest</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-red-200 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-200 text-base">
            Are you sure you want to delete this quest?
          </p>
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
            <p className="text-red-300 font-semibold text-lg truncate">
              &quot;{questTitle}&quot;
            </p>
          </div>
          <p className="text-gray-400 text-sm">
            This action cannot be undone. All progress will be lost permanently.
          </p>
        </div>

        {/* Actions */}
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-700">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin">
                  <Trash2 size={16} />
                </div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Quest</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteQuestModal;
