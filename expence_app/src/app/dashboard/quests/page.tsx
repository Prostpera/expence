import Navbar from '@/components/Navbar';
import QuestCard from '@/components/QuestCard';

export default function Quests() {
  return (
    <div className="min-h-screen bg-gray-950 font-techno text-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl text-white">Quests</h1>
          <button className="rounded-md border border-purple-500 px-4 py-2 text-purple-300 hover:bg-purple-700 hover:text-white transition duration-200 shadow-md">
            Create New Quest
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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