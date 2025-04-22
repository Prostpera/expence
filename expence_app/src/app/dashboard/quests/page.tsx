import Navbar from '@/components/Navbar';

export default function Quests() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Quests</h1>
          
          <button className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
            Create New Quest
          </button>
        </div>
        
        {/* Quests Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quest Card */}
          <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-yellow-500 bg-opacity-20 px-3 py-1 text-xs font-medium text-yellow-400">
                In Progress
              </span>
              <span className="text-sm text-gray-400">3 days left</span>
            </div>
            
            <h3 className="mb-2 text-lg font-medium text-white">Save $100 on groceries</h3>
            <p className="mb-4 text-sm text-gray-400">Reduce your grocery spending by $100 this month.</p>
            
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-purple-400">$65 / $100</span>
            </div>
            
            <div className="mb-4 h-2 w-full rounded-full bg-gray-800">
              <div className="h-2 w-3/5 rounded-full bg-purple-600"></div>
            </div>
            
            <button className="w-full rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700">
              View Details
            </button>
          </div>
          
          {/* Quest Card */}
          <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-green-500 bg-opacity-20 px-3 py-1 text-xs font-medium text-green-400">
                Completed
              </span>
              <span className="text-sm text-gray-400">Finished</span>
            </div>
            
            <h3 className="mb-2 text-lg font-medium text-white">No eating out week</h3>
            <p className="mb-4 text-sm text-gray-400">Avoid restaurants and takeout for a whole week.</p>
            
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-green-400">Completed!</span>
            </div>
            
            <div className="mb-4 h-2 w-full rounded-full bg-gray-800">
              <div className="h-2 w-full rounded-full bg-green-500"></div>
            </div>
            
            <button className="w-full rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700">
              View Details
            </button>
          </div>
          
          {/* Quest Card */}
          <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-blue-500 bg-opacity-20 px-3 py-1 text-xs font-medium text-blue-400">
                New
              </span>
              <span className="text-sm text-gray-400">7 days left</span>
            </div>
            
            <h3 className="mb-2 text-lg font-medium text-white">Start an emergency fund</h3>
            <p className="mb-4 text-sm text-gray-400">Save $200 towards your emergency fund goal.</p>
            
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-purple-400">$0 / $200</span>
            </div>
            
            <div className="mb-4 h-2 w-full rounded-full bg-gray-800">
              <div className="h-2 w-0 rounded-full bg-purple-600"></div>
            </div>
            
            <button className="w-full rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700">
              View Details
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}