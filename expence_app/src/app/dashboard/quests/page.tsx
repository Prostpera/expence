'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import QuestCard from '@/components/QuestCard';
import Header from '@/components/Header';
import QuestModal from '@/components/QuestModal';
import type { QuestData } from '@/components/QuestModal';
import Image from 'next/image';
import ChatbotModal from '@/components/ChatbotModal';

export default function Quests() {
  const [showModal, setShowModal] = useState(false);

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  const handleBriefcaseClick = () => {
    setIsChatbotOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e30_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0px,transparent_1px,#3c3c5c_1px,transparent_2px,transparent_4px)] bg-[size:100%_4px] opacity-5 z-0"></div>

      <Header />

      {/* Modal */}
      {showModal && (
        <QuestModal
          onClose={() => setShowModal(false)}
          onCreate={(questData: QuestData) => {
            console.log('New Quest:', questData);
            setShowModal(false);
          }}
        />
      )}

      <main className="flex-1 w-full max-w-7xl p-4 md:p-6 mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-purple-800 pb-4">
          <div className="flex items-center">
            <div className="h-6 w-1 bg-cyan-500 mr-3"></div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              QUESTS_<span className="text-cyan-400">MAIN</span>
            </h1>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="relative bg-cyan-900 bg-opacity-30 h-16 flex flex-col items-center justify-center clip-pentagon-button text-center p-2 border border-cyan-500 hover:bg-opacity-75 w-full sm:w-auto px-6"
          >
            <span className="text-cyan-400 font-medium text-sm">Create New Quest</span>
          </button>
        </div>

        {/* Quest Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <QuestCard
            title="Save $100 on groceries"
            description="Reduce your grocery spending by $100 this month."
            status="In Progress"
            progress={65}
            goal={100}
            daysLeft={3}
          />
          <QuestCard
            title="No eating out week"
            description="Avoid restaurants and takeout for a whole week."
            status="Completed"
            progress={100}
            goal={100}
            daysLeft={0}
          />
          <QuestCard
            title="Start an emergency fund"
            description="Save $200 towards your emergency fund goal."
            status="New"
            progress={0}
            goal={200}
            daysLeft={7}
          />
          <QuestCard
            title="Cancel a subscription"
            description="Save $15/month by canceling an unused service."
            status="New"
            progress={0}
            goal={15}
            daysLeft={5}
          />
          <QuestCard
            title="Track expenses daily"
            description="Log all spending for the next 7 days."
            status="In Progress"
            progress={4}
            goal={7}
            daysLeft={3}
          />
          <QuestCard
            title="Sell unused items"
            description="List at least 3 unused items for sale online."
            status="In Progress"
            progress={2}
            goal={3}
            daysLeft={4}
          />
        </div>

        {/* Chatbot Modal */}
        <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

        {/* Floating Briefcase Icon */}
        {!isChatbotOpen && (
          <div 
            className="fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-50 pointer-events-auto"
            onClick={handleBriefcaseClick}
          >
            <div className="relative">
              <Image
                src="/briefcase.png"
                alt="Briefcase"
                width={240}
                height={160}
                priority={true}
                className="w-[180px] h-[120px] sm:w-[210px] sm:h-[140px] md:w-[240px] md:h-[160px] hover:scale-105 transition-transform cursor-pointer"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
