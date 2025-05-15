import { useEffect, useRef, useState } from 'react';
import { X, Send, Minimize, Maximize } from 'lucide-react';
import Image from 'next/image';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerNewQuest: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatbotModal = ({ isOpen, onClose, onTriggerNewQuest }: ChatbotModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Sage, your EXPence Assistant. How can I help with your financial quests today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Trigger a quest only for the demo message
    const shouldTrigger = inputValue
      .toLowerCase()
      .includes('$200') && inputValue.toLowerCase().includes('budget');

    setInputValue('');

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: shouldTrigger
          ? "Got it! I’ve added your $200 budget quest for this week. Let's track it together!"
          : "Thanks for the message! Let me know how I can assist your financial goals.",
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (shouldTrigger) {
        onTriggerNewQuest(); // <-- Call the trigger from parent
      }
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6">
      <div
        className={`bg-gray-900 border border-cyan-500 shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${
          isMinimized
            ? 'w-[300px] h-[60px]'
            : 'w-[350px] sm:w-[400px] h-[500px] sm:h-[600px]'
        }`}
      >
        {/* Header */}
        <div className="bg-gray-800 p-3 flex items-center justify-between border-b border-cyan-700">
          <div className="flex items-center">
            <div className="h-4 w-1 bg-cyan-500 mr-2"></div>
            <h3 className="text-white font-medium text-sm">
              EXPence<span className="text-cyan-400">ASSISTANT</span>
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {isMinimized ? (
              <Maximize
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer"
                onClick={() => setIsMinimized(false)}
              />
            ) : (
              <Minimize
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer"
                onClick={() => setIsMinimized(true)}
              />
            )}
            <X
              size={18}
              className="text-gray-400 hover:text-white cursor-pointer"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Chat content */}
        {!isMinimized && (
          <div className="flex flex-col h-[calc(100%-56px)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'ai' && (
                    <div className="mr-2 self-start">
                      <Image
                        src="/just_briefcase.png"
                        alt="Sage"
                        width={24}
                        height={24}
                        className="min-w-[24px]"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-cyan-900 bg-opacity-70 text-white'
                        : 'bg-gray-800 border-l-2 border-cyan-500'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-700 bg-gray-800">
              <div className="flex items-center">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-sm resize-none focus:outline-none focus:border-cyan-500"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className={`ml-2 p-2 rounded-full ${
                    inputValue.trim()
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-gray-900'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotModal;