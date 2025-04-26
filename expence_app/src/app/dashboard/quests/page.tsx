'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import QuestCard from '@/components/QuestCard';
import Header from '@/components/Header';

export default function Quests() {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e30_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0px,transparent_1px,#3c3c5c_1px,transparent_2px,transparent_4px)] bg-[size:100%_4px] opacity-5 z-0"></div>

      <Header />

      <main className="flex-1 w-full max-w-7xl p-4 md:p-6 mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center">
            <div className="h-6 w-1 bg-cyan-500 mr-3"></div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              QUESTS_<span className="text-cyan-400">MAIN</span>
            </h1>
          </div>

          <button className="border border-purple-500 bg-gray-800 px-4 py-2 text-purple-400 hover:bg-purple-700 hover:bg-opacity-40 w-full sm:w-auto">
            Create New Quest
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
        </div>
      </main>
    </div>
  );
}