'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Send, User, Bot } from 'lucide-react';
import {
  ConversationalScenario,
  ConversationMessage,
  ConversationNode,
  ConversationChoice
} from '@/types/conversationalScenario';

interface ConversationalChatProps {
  scenario: ConversationalScenario;
  onComplete: (score: number, learningPointsAchieved: number) => void;
  onExit: () => void;
}

export default function ConversationalChat({ 
  scenario, 
  onComplete, 
  onExit 
}: ConversationalChatProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentNode, setCurrentNode] = useState<ConversationNode | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [learningMilestones, setLearningMilestones] = useState<string[]>([]);
  const [conversationQuality, setConversationQuality] = useState(0);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true); // Toggle for suggested responses
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText, typingText]);

  // Refs for typewriter cancellation (must be before typeMessage)
  const typingCancelRef = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup typing on unmount
  useEffect(() => {
    return () => {
      typingCancelRef.current = true;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const typeMessage = (text: string, speaker: 'case' | 'user') => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingCancelRef.current = false;

    if (speaker === 'user') {
      // User messages appear instantly
      const newMessage: ConversationMessage = {
        id: `${Date.now()}-${speaker}-${Math.random().toString(36).substr(2, 9)}`,
        speaker,
        text,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
    } else {
      // Case messages type out character by character
      setIsTyping(true);
      setTypingText('');

      let index = 0;
      const typingSpeed = 20;
      const punctuationPause = 200;

      const typeNextChar = () => {
        if (typingCancelRef.current) return;

        if (index < text.length) {
          setTypingText(text.slice(0, index + 1));
          const currentChar = text[index];
          index++;

          if (currentChar === '.' || currentChar === '!' || currentChar === '?') {
            typingTimeoutRef.current = setTimeout(typeNextChar, punctuationPause);
          } else {
            typingTimeoutRef.current = setTimeout(typeNextChar, typingSpeed);
          }
        } else {
          setIsTyping(false);
          setTypingText('');

          const newMessage: ConversationMessage = {
            id: `${Date.now()}-${speaker}-${Math.random().toString(36).substr(2, 9)}`,
            speaker,
            text,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, newMessage]);
        }
      };

      typeNextChar();
    }
  };

  // Initialize chat with first node - uses typewriter effect
  useEffect(() => {
    if (!isInitialized) {
      const startNode = scenario.nodes.find(node => node.id === scenario.startNodeId);
      if (startNode) {
        setCurrentNode(startNode);
        setIsInitialized(true);
        typeMessage(startNode.caseMessage, 'case');
      }
    }
  }, [scenario, isInitialized]);

  const handleSuggestionClick = (choiceText: string) => {
    setUserInput(choiceText);
  };

  const assessLearning = (userMessage: string, context: string) => {
    const lowerMessage = userMessage.toLowerCase();
    let newMilestone = '';
    let qualityPoints = 0;
    
    // Check for learning milestones and quality
    if (context.includes('emergency fund') || context.includes('Emergency Fund')) {
      if (lowerMessage.includes('3-6 months') || lowerMessage.includes('emergency fund')) {
        newMilestone = 'Understands emergency fund basics';
        qualityPoints = 2;
      } else if (lowerMessage.includes('save')) {
        qualityPoints = 1;
      }
    } else if (context.includes('debt') || context.includes('Debt')) {
      if (lowerMessage.includes('avalanche') || lowerMessage.includes('high interest')) {
        newMilestone = 'Knows debt avalanche method';
        qualityPoints = 2;
      } else if (lowerMessage.includes('minimum payment')) {
        newMilestone = 'Understands minimum payments';
        qualityPoints = 2;
      } else if (lowerMessage.includes('pay off')) {
        qualityPoints = 1;
      }
    } else if (context.includes('invest') || context.includes('Investment')) {
      if (lowerMessage.includes('401k') || lowerMessage.includes('employer match')) {
        newMilestone = 'Prioritizes employer matching';
        qualityPoints = 2;
      } else if (lowerMessage.includes('index fund') || lowerMessage.includes('diversif')) {
        newMilestone = 'Understands index fund benefits';
        qualityPoints = 2;
      }
    }

    return { newMilestone, qualityPoints };
  };

  const generateAISuggestions = (context: string, recentMessages: ConversationMessage[]) => {
    const characterName = scenario.characterName;
    
    if (context.includes('Emergency Fund') || context.includes('emergency fund')) {
      return [
        `${characterName} should build an emergency fund first`,
        `What about starting with $1000 as a mini emergency fund?`,
        `How much should ${characterName} save each month?`,
        `What if ${characterName} has a car emergency next week?`
      ];
    } else if (context.includes('Debt') || context.includes('debt')) {
      return [
        `Pay minimums first, then attack highest interest rate`,
        `What about a balance transfer to 0% APR?`,
        `${characterName} should avoid new purchases while paying off debt`,
        `How long will it take to pay off at current rate?`
      ];
    } else if (context.includes('Investment') || context.includes('invest')) {
      return [
        `Max out the employer 401k match first - it's free money!`,
        `Index funds are better than trying to pick individual stocks`,
        `${characterName} shouldn't try to time the market`,
        `What about opening a Roth IRA after the 401k match?`
      ];
    }
    
    return [
      `What would be the safest approach for ${characterName}?`,
      `How does this affect ${characterName}'s long-term goals?`,
      `What are the risks and benefits here?`,
      `What would a financial advisor typically recommend?`
    ];
  };

  const generateAIResponse = async (userMessage: string, context: string, conversationHistory: ConversationMessage[]) => {
    // Assess learning and update milestones
    const assessment = assessLearning(userMessage, context);
    
    if (assessment.newMilestone && !learningMilestones.includes(assessment.newMilestone)) {
      setLearningMilestones(prev => [...prev, assessment.newMilestone]);
    }
    
    setConversationQuality(prev => Math.min(100, prev + assessment.qualityPoints));

    try {
      // Build conversation context for Claude
      const recentHistory = conversationHistory.slice(-6).map(msg => 
        `${msg.speaker === 'case' ? 'Case' : 'User'}: ${msg.text}`
      ).join('\n');

      const prompt = `You are Case, an AI financial advisor helping users guide someone named ${scenario.characterName} through financial decisions.

Current scenario: ${scenario.title}
Learning focus: ${context}
Character situation: ${scenario.summary}

Recent conversation:
${recentHistory}
User: ${userMessage}

CRITICAL: Respond in EXACTLY 1-2 complete sentences. Be super concise but ensure sentences are fully finished. Ask one focused question to keep the conversation moving. No long explanations or paragraphs.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          conversationHistory: []
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.response || `I understand you're thinking about ${scenario.characterName}'s situation. Let me help you work through this step by step. What specific aspect would you like to explore?`;
      
    } catch (error) {
      console.error('Error calling Claude API:', error);
      // Fallback to a more contextual response
      return `I understand you're thinking about ${scenario.characterName}'s situation. Let me help you work through this step by step. What specific aspect would you like to explore?`;
    }
  };

  const handleCustomInput = async () => {
    if (isTyping || !userInput.trim()) return;

    const currentInput = userInput;
    setUserInput(''); // Clear input immediately

    // Add user message
    const userMessage: ConversationMessage = {
      id: `${Date.now()}-user-${Math.random().toString(36).substr(2, 9)}`,
      speaker: 'user',
      text: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Track interactions
    setTotalInteractions(prev => prev + 1);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Generate AI response based on user input and current context
      const context = currentNode?.learningPoint || scenario.title;
      const currentMessages = [...messages, userMessage];
      const aiResponse = await generateAIResponse(currentInput, context, currentMessages);
      
      // Send AI response after a brief delay
      setTimeout(() => {
        typeMessage(aiResponse, 'case');
      }, 500);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      setTimeout(() => {
        typeMessage(`I'm having trouble processing that right now. Could you tell me more about what you're thinking regarding ${scenario.characterName}'s situation?`, 'case');
      }, 500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 bg-opacity-80">
      {/* Chat Header */}
      <div className="p-4 border-b border-cyan-700 bg-gray-800 flex items-center justify-between">
        <div className="flex items-center">
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
            <p className="text-xs text-cyan-400">AI Financial Advisor</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-cyan-400">
            Helping: <span className="text-white font-semibold">{scenario.characterName}</span>
          </span>
          <span className="text-gray-400">
            Milestones: {learningMilestones.length}/5
          </span>
          <span className="text-green-400">
            Quality: {conversationQuality}%
          </span>
          <button
            onClick={onExit}
            className="text-gray-400 hover:text-red-400 transition-colors text-xs"
          >
            EXIT
          </button>
        </div>
      </div>


      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.speaker === 'user'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.speaker === 'case' && (
                  <Bot size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                )}
                {message.speaker === 'user' && (
                  <User size={16} className="text-cyan-200 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Typing message with typewriter effect */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-700 text-gray-100">
              <div className="flex items-start space-x-2">
                <Bot size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  {typingText}
                  <span className="animate-pulse text-cyan-400">▋</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!isTyping && (
        <div className="p-4 border-t border-gray-700 bg-gray-800 bg-opacity-50">
          {/* Suggestions Toggle and Responses */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-xs">SUGGESTIONS</span>
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                    showSuggestions ? 'bg-cyan-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      showSuggestions ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* AI-Generated Suggested Responses */}
            {showSuggestions && (
              <div className="flex flex-wrap gap-2">
                {generateAISuggestions(currentNode?.learningPoint || scenario.title, messages).map((suggestion, index) => (
                  <button
                    key={`suggestion-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 text-xs rounded border border-gray-600 bg-gray-700 bg-opacity-40 hover:border-cyan-500 hover:bg-cyan-900 hover:bg-opacity-30 transition-all text-gray-200 hover:text-white"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomInput()}
              placeholder={`Chat with Case about helping ${scenario.characterName}...`}
              className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 text-sm rounded focus:border-cyan-500 focus:outline-none"
            />
            <button
              onClick={handleCustomInput}
              disabled={!userInput.trim()}
              className={`px-4 py-2 rounded flex items-center space-x-1 transition-all ${
                userInput.trim()
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
          
          {currentNode?.learningPoint && (
            <div className="mt-3 p-2 bg-cyan-900 bg-opacity-20 border border-cyan-800 rounded">
              <p className="text-xs text-cyan-300">
                <span className="font-semibold">Learning Focus:</span> {currentNode.learningPoint}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Completion State - Can be triggered manually or after certain milestones */}
      {learningMilestones.length >= 3 && totalInteractions >= 5 && (
        <div className="p-4 border-t border-green-700 bg-green-900 bg-opacity-20">
          <div className="text-center">
            <p className="text-green-400 font-semibold mb-2">Great Conversation!</p>
            <p className="text-gray-300 text-sm">
              You&apos;ve had a meaningful discussion about helping {scenario.characterName}.
            </p>
            <div className="mt-3 flex justify-center space-x-4 text-sm">
              <span className="text-cyan-400">
                Milestones: {learningMilestones.length}/5
              </span>
              <span className="text-green-400">
                Quality: {conversationQuality}%
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="text-center">
                <span className="text-yellow-400 text-sm">+5 🍞 for chatting with Case!</span>
              </div>
              <button
                onClick={() => onComplete(conversationQuality, learningMilestones.length)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
              >
                Complete Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}