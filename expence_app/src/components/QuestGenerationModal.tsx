'use client';

import React, { useState, useEffect } from 'react';
import {
  Quest,
  QuestCategory,
  QuestDifficulty,
  UserContext
} from '../types/quest';
import { aiQuestGenerator } from '../services/aiQuestGenerator';
import QuestCard from './QuestCard';
import {
  X,
  Sparkles,
  RefreshCw,
  Settings,
  CheckCircle,
  AlertTriangle,
  Wand2,
  Target,
  Lightbulb
} from 'lucide-react';

interface QuestGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestGenerated: (quest: Quest) => void;
  userContext: UserContext;
}

const QuestGenerationModal: React.FC<QuestGenerationModalProps> = ({
  isOpen,
  onClose,
  onQuestGenerated,
  userContext
}) => {
  const [generatedQuests, setGeneratedQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | ''>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestDifficulty | ''>('');
  const [generationStep, setGenerationStep] = useState<'setup' | 'generating' | 'review'>('setup');
  const [validationIssues, setValidationIssues] = useState<{ [questId: string]: string[] }>({});

  useEffect(() => {
    if (isOpen) {
      setGenerationStep('setup');
      setGeneratedQuests([]);
      setValidationIssues({});
    }
  }, [isOpen]);

  const handleGenerateQuests = async () => {
    setLoading(true);
    setGenerationStep('generating');
    setGeneratedQuests([]);
    setValidationIssues({});

    try {
      const quests = await aiQuestGenerator.generateQuestBatch(userContext, 3);
      
      // Validate each quest
      const issues: { [questId: string]: string[] } = {};
      quests.forEach(quest => {
        const validation = aiQuestGenerator.validateQuest(quest);
        if (!validation.isValid) {
          issues[quest.id] = validation.issues;
        }
      });

      setGeneratedQuests(quests);
      setValidationIssues(issues);
      setGenerationStep('review');
    } catch (error) {
      console.error('Failed to generate quests:', error);
      setGenerationStep('setup');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateQuest = async (questIndex: number) => {
    setLoading(true);
    
    try {
      const newQuest = await aiQuestGenerator.generatePersonalizedQuest(
        userContext,
        selectedCategory as QuestCategory || undefined,
        selectedDifficulty as QuestDifficulty || undefined
      );

      const validation = aiQuestGenerator.validateQuest(newQuest);
      if (!validation.isValid) {
        setValidationIssues(prev => ({
          ...prev,
          [newQuest.id]: validation.issues
        }));
      } else {
        setValidationIssues(prev => {
          const newIssues = { ...prev };
          delete newIssues[newQuest.id];
          return newIssues;
        });
      }

      setGeneratedQuests(prev => 
        prev.map((quest, index) => index === questIndex ? newQuest : quest)
      );
    } catch (error) {
      console.error('Failed to regenerate quest:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuest = (quest: Quest) => {
    onQuestGenerated(quest);
    // Don't close modal immediately, let user accept more quests
    console.log('Quest accepted:', quest.title);
  };

  const handleAcceptAll = () => {
    const validQuests = generatedQuests.filter(quest => !validationIssues[quest.id]);
    validQuests.forEach(quest => onQuestGenerated(quest));
    console.log(`${validQuests.length} quests accepted`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-gray-900 border border-cyan-500 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 p-4 border-b border-cyan-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-cyan-400" size={24} />
            <h2 className="text-xl font-bold text-white">AI Quest Generator</h2>
            <span className="px-2 py-1 text-xs bg-pink-900/50 text-pink-300 rounded">
              BETA
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Setup Step */}
          {generationStep === 'setup' && (
            <div className="space-y-6">
              <div className="text-center">
                <Wand2 className="mx-auto mb-4 text-cyan-400" size={48} />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Generate Personalized Quests
                </h3>
                <p className="text-gray-300">
                  Our AI will create custom financial literacy quests based on your goals and preferences
                </p>
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Target className="inline mr-2" size={16} />
                    Quest Category (Optional)
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as QuestCategory)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Any Category</option>
                    <option value={QuestCategory.MAIN_STORY}>Main Story</option>
                    <option value={QuestCategory.IMPORTANT}>Important</option>
                    <option value={QuestCategory.SIDE_JOBS}>Side Jobs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Settings className="inline mr-2" size={16} />
                    Difficulty Level (Optional)
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as QuestDifficulty)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Any Difficulty</option>
                    <option value={QuestDifficulty.EASY}>Easy</option>
                    <option value={QuestDifficulty.MEDIUM}>Medium</option>
                    <option value={QuestDifficulty.HARD}>Hard</option>
                  </select>
                </div>
              </div>

              {/* User Context Display */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-3">
                  <Lightbulb className="inline mr-2" size={16} />
                  AI will consider your profile:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Level:</span>
                    <span className="text-cyan-400 ml-2">{userContext.currentLevel}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Risk Tolerance:</span>
                    <span className="text-cyan-400 ml-2 capitalize">{userContext.preferences.riskTolerance}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Learning Style:</span>
                    <span className="text-cyan-400 ml-2 capitalize">{userContext.preferences.learningStyle}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Goals:</span>
                    <span className="text-cyan-400 ml-2">{userContext.financialGoals.length}</span>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center">
                <button
                  onClick={handleGenerateQuests}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-pink-600 text-white font-bold rounded-lg hover:from-cyan-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="inline mr-2" size={20} />
                  Generate AI Quests
                </button>
              </div>
            </div>
          )}

          {/* Generating Step */}
          {generationStep === 'generating' && (
            <div className="text-center py-12">
              <RefreshCw className="mx-auto mb-4 text-cyan-400 animate-spin" size={64} />
              <h3 className="text-2xl font-bold text-white mb-2">
                Generating Your Quests...
              </h3>
              <p className="text-gray-300 mb-4">
                AI is analyzing your financial goals and creating personalized challenges
              </p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}

          {/* Review Step */}
          {generationStep === 'review' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Generated Quests
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGenerationStep('setup')}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Back to Setup
                  </button>
                  <button
                    onClick={handleGenerateQuests}
                    disabled={loading}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="inline mr-2" size={16} />
                    Regenerate All
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    disabled={Object.keys(validationIssues).length > 0}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="inline mr-2" size={16} />
                    Accept All Valid
                  </button>
                </div>
              </div>

              {/* Generated Quests */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {generatedQuests.map((quest, index) => (
                  <div key={quest.id} className="relative">
                    {/* Validation Issues Warning */}
                    {validationIssues[quest.id] && (
                      <div className="mb-2 p-2 bg-red-900/30 border border-red-500 rounded text-red-300 text-xs">
                        <AlertTriangle className="inline mr-1" size={12} />
                        Issues detected: {validationIssues[quest.id].join(', ')}
                      </div>
                    )}
                    
                    <QuestCard
                      quest={quest}
                      onViewDetails={() => {}}
                    />
                    
                    {/* Quest Actions */}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleAcceptQuest(quest)}
                        disabled={!!validationIssues[quest.id]}
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="inline mr-1" size={14} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleRegenerateQuest(index)}
                        disabled={loading}
                        className="px-3 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className="inline mr-1" size={14} />
                        Regenerate
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Model Info */}
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Settings size={16} />
                  <span>AI Model: {aiQuestGenerator.getModelInfo().modelName}</span>
                  <span>•</span>
                  <span>Temperature: {aiQuestGenerator.getModelInfo().temperature}</span>
                  <span>•</span>
                  <span>Generated with safety validation</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestGenerationModal;