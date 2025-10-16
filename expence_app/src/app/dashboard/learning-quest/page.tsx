'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Image from 'next/image';
import { ArrowLeft, Send, Zap, Brain, TrendingUp } from 'lucide-react';
import {
  LEARNING_SCENARIOS,
  LearningScenario,
  ScenarioQuestion,
  ScenarioDifficulty
} from '@/types/learningScenario';
import { useAuth } from '@/components/auth/AuthProvider';

type GameState = 'selection' | 'playing' | 'completed';

export default function LearningQuestPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [gameState, setGameState] = useState<GameState>('selection');
  const [selectedScenario, setSelectedScenario] = useState<LearningScenario | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customAnswer, setCustomAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const difficultyColors = {
    [ScenarioDifficulty.EASY]: {
      bg: 'bg-green-900',
      border: 'border-green-500',
      text: 'text-green-400',
      accent: 'bg-green-500'
    },
    [ScenarioDifficulty.MEDIUM]: {
      bg: 'bg-yellow-900',
      border: 'border-yellow-500',
      text: 'text-yellow-400',
      accent: 'bg-yellow-500'
    },
    [ScenarioDifficulty.HARD]: {
      bg: 'bg-red-900',
      border: 'border-red-500',
      text: 'text-red-400',
      accent: 'bg-red-500'
    }
  };

  const difficultyIcons = {
    [ScenarioDifficulty.EASY]: Zap,
    [ScenarioDifficulty.MEDIUM]: Brain,
    [ScenarioDifficulty.HARD]: TrendingUp
  };

  // Typewriter effect for situation text with pauses at punctuation
  useEffect(() => {
    if (gameState === 'playing' && selectedScenario && !showFeedback) {
      const currentQuestion = selectedScenario.questions[currentQuestionIndex];
      const fullText = currentQuestion.situation;

      setIsTyping(true);
      setDisplayedText('');

      let index = 0;
      const typingSpeed = 20; // milliseconds per character
      const punctuationPause = 200; // pause after . ! ?

      const typeNextChar = () => {
        if (index < fullText.length) {
          setDisplayedText(fullText.slice(0, index + 1));
          const currentChar = fullText[index];
          index++;

          // Check if current character is punctuation that should pause
          if (currentChar === '.' || currentChar === '!' || currentChar === '?') {
            setTimeout(typeNextChar, punctuationPause);
          } else {
            setTimeout(typeNextChar, typingSpeed);
          }
        } else {
          setIsTyping(false);
        }
      };

      typeNextChar();

      return () => {
        setIsTyping(false);
      };
    }
  }, [gameState, selectedScenario, currentQuestionIndex, showFeedback]);

  const handleScenarioSelect = (scenario: LearningScenario) => {
    setSelectedScenario(scenario);
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setDisplayedText('');
    setIsTyping(true);
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setCustomAnswer('');
  };

  const handleSubmitAnswer = () => {
    if (!selectedScenario || (!selectedOption && !customAnswer.trim())) return;

    const currentQuestion = selectedScenario.questions[currentQuestionIndex];
    const selectedOptionData = currentQuestion.options.find(opt => opt.id === selectedOption);

    let isCorrect = false;
    let feedbackText = '';

    if (selectedOptionData) {
      isCorrect = selectedOptionData.isCorrect;
      feedbackText = selectedOptionData.feedback;
    } else {
      // Custom answer - we'll give general feedback
      feedbackText = "Interesting answer! Let me share what financial experts recommend...";
    }

    if (isCorrect) {
      setScore(score + 1);
      setFeedback(`✓ ${currentQuestion.correctFeedback}\n\n${feedbackText}`);
    } else {
      setFeedback(`✗ ${feedbackText}\n\n${currentQuestion.incorrectFeedback}`);
    }

    setShowFeedback(true);
    setUserAnswers([...userAnswers, selectedOption || customAnswer]);
  };

  const handleNextQuestion = () => {
    if (!selectedScenario) return;

    if (currentQuestionIndex < selectedScenario.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setCustomAnswer('');
      setShowFeedback(false);
      setFeedback('');
      setDisplayedText('');
      setIsTyping(true);
    } else {
      setGameState('completed');
    }
  };

  const handleRestart = () => {
    setGameState('selection');
    setSelectedScenario(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setCustomAnswer('');
    setShowFeedback(false);
    setFeedback('');
    setScore(0);
  };

  const currentQuestion: ScenarioQuestion | undefined = selectedScenario?.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden flex flex-col">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e30_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0px,transparent_1px,#3c3c5c_1px,transparent_2px,transparent_4px)] bg-[size:100%_4px] opacity-5 z-0"></div>

      {/* Header */}
      <Header onSignOut={signOut} />

      <main className="flex-1 w-full max-w-6xl p-4 md:p-6 mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => gameState === 'selection' ? router.push('/dashboard') : handleRestart()}
          className="mb-4 flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span className="text-sm">{gameState === 'selection' ? 'BACK_TO_DASHBOARD' : 'SCENARIO_SELECT'}</span>
        </button>

        {/* Page Title */}
        <div className="flex items-center mb-6">
          <div className="h-6 w-1 bg-green-500 mr-3"></div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            LEARNING_<span className="text-green-400">QUEST</span>
          </h1>
        </div>

        {/* Scenario Selection */}
        {gameState === 'selection' && (
          <div className="space-y-6">
            <p className="text-gray-300 text-sm mb-6">
              Choose a financial scenario to test your decision-making skills. Each scenario presents realistic situations with multiple choices.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {LEARNING_SCENARIOS.map((scenario) => {
                const colors = difficultyColors[scenario.difficulty];
                const Icon = difficultyIcons[scenario.difficulty];

                return (
                  <button
                    key={scenario.id}
                    onClick={() => handleScenarioSelect(scenario)}
                    className={`${colors.bg} bg-opacity-30 border ${colors.border} p-6 hover:bg-opacity-50 transition-all relative overflow-hidden group`}
                  >
                    <div className={`absolute top-0 right-0 w-16 h-16 ${colors.accent} opacity-10`}></div>
                    <div className={`absolute bottom-0 left-0 w-5 h-1 ${colors.accent} group-hover:w-full transition-all duration-300`}></div>

                    <div className="relative">
                      <div className={`inline-flex items-center ${colors.text} mb-3`}>
                        <Icon size={20} className="mr-2" />
                        <span className="text-xs font-bold uppercase">{scenario.difficulty}</span>
                      </div>

                      <h3 className="text-white font-bold text-lg mb-2">{scenario.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{scenario.description}</p>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{scenario.totalQuestions} Questions</span>
                        <div className="flex items-center space-x-3">
                          <span className={colors.text}>+{scenario.expReward} EXP</span>
                          <span className="text-yellow-400">+{scenario.coinReward} 🍞</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && selectedScenario && currentQuestion && (
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">
                  Question {currentQuestionIndex + 1} of {selectedScenario.totalQuestions}
                </span>
                <span className="text-sm text-cyan-400">Score: {score}/{currentQuestionIndex + (showFeedback ? 1 : 0)}</span>
              </div>
              <div className="w-full bg-gray-800 h-2">
                <div
                  className="bg-green-500 h-2 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / selectedScenario.totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="bg-gray-900 bg-opacity-80 border border-cyan-500 shadow-lg">
              {/* Case Header */}
              <div className="p-4 border-b border-cyan-700 bg-gray-800 flex items-center">
                <div className="relative w-12 h-12 rounded-full border-2 border-cyan-500 overflow-hidden mr-3 flex-shrink-0">
                  <Image
                    src="/briefcase.png"
                    alt="Case"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold">Case</h3>
                  <p className="text-xs text-cyan-400">Financial Advisor</p>
                </div>
              </div>

              {/* Situation */}
              <div className="p-6 border-b border-gray-800">
                <div className="bg-gray-800 bg-opacity-60 p-4 rounded border-l-4 border-cyan-500">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {displayedText}
                    {isTyping && <span className="animate-pulse">▋</span>}
                  </p>
                </div>
              </div>

              {/* Question - Only show after typing is complete */}
              {!isTyping && (
                <div className="p-6">
                  <p className="text-white font-bold mb-4">{currentQuestion.question}</p>

                  {!showFeedback ? (
                    <>
                      {/* Options */}
                      <div className="space-y-3 mb-4">
                      {currentQuestion.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleOptionSelect(option.id)}
                          className={`w-full text-left p-4 border transition-all ${
                            selectedOption === option.id
                              ? 'border-cyan-500 bg-cyan-900 bg-opacity-30'
                              : 'border-gray-700 bg-gray-800 bg-opacity-40 hover:border-gray-600'
                          }`}
                        >
                          <span className="text-gray-300 text-sm">{option.text}</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Answer */}
                    <div className="mb-4">
                      <label className="text-gray-400 text-xs mb-2 block">OR TYPE YOUR OWN ANSWER:</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={customAnswer}
                          onChange={(e) => {
                            setCustomAnswer(e.target.value);
                            setSelectedOption(null);
                          }}
                          placeholder="Enter your answer..."
                          className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedOption && !customAnswer.trim()}
                      className={`w-full py-3 flex items-center justify-center space-x-2 transition-all ${
                        selectedOption || customAnswer.trim()
                          ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Send size={16} />
                      <span className="font-bold text-sm">SUBMIT_ANSWER</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Feedback */}
                    <div className={`p-4 mb-4 border-l-4 ${
                      feedback.startsWith('✓') ? 'bg-green-900 bg-opacity-30 border-green-500' : 'bg-red-900 bg-opacity-30 border-red-500'
                    }`}>
                      <p className="text-white text-sm leading-relaxed whitespace-pre-line">
                        {feedback}
                      </p>
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm transition-all"
                    >
                      {currentQuestionIndex < selectedScenario.questions.length - 1 ? 'NEXT_QUESTION' : 'VIEW_RESULTS'}
                    </button>
                  </>
                )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Completed State */}
        {gameState === 'completed' && selectedScenario && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 bg-opacity-80 border border-green-500 shadow-lg p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-900 bg-opacity-30 border-2 border-green-500 mb-4">
                  <span className="text-4xl">✓</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">SCENARIO_COMPLETE!</h2>
                <p className="text-gray-400">{selectedScenario.title}</p>
              </div>

              <div className="bg-gray-800 bg-opacity-60 p-6 mb-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">YOUR SCORE</p>
                    <p className="text-3xl font-bold text-cyan-400">{score}/{selectedScenario.totalQuestions}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">ACCURACY</p>
                    <p className="text-3xl font-bold text-green-400">
                      {Math.round((score / selectedScenario.totalQuestions) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 bg-opacity-60 p-4 mb-6">
                <p className="text-gray-400 text-sm mb-2">REWARDS EARNED</p>
                <div className="flex items-center justify-center space-x-6">
                  <span className="text-cyan-400 font-bold">+{selectedScenario.expReward} EXP</span>
                  <span className="text-yellow-400 font-bold">+{selectedScenario.coinReward} 🍞</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm transition-all"
                >
                  TRY_ANOTHER_SCENARIO
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm transition-all"
                >
                  RETURN_TO_DASHBOARD
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
