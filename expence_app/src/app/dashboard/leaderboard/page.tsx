import Header from '@/components/Header';
/*NMW updates*/
export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <main className="mx-auto max-w-7xl p-6">
        <h1 className="mb-6 text-2xl font-bold text-white">Leaderboard</h1>
        
        {/* Filter Options */}
        <div className="mb-6 flex items-center space-x-4">
          <button className="bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
            All Time
          </button>
          <button className="bg-gray-800 px-4 py-2 text-white hover:bg-gray-700">
            This Month
          </button>
          <button className="bg-gray-800 px-4 py-2 text-white hover:bg-gray-700">
            This Week
          </button>
        </div>
        
        {/* Leaderboard Table */}
        <div className="overflow-hidden bg-gray-900 shadow-lg">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800 text-left">
                <th className="p-4 text-sm font-medium text-gray-400">Rank</th>
                <th className="p-4 text-sm font-medium text-gray-400">User</th>
                <th className="p-4 text-sm font-medium text-gray-400">Quests</th>
                <th className="p-4 text-sm font-medium text-gray-400">Streak</th>
                <th className="p-4 text-sm font-medium text-gray-400">Points</th>
              </tr>
            </thead>
            <tbody>
              {/* First Place */}
              <tr className="border-b border-gray-800">
                <td className="p-4 font-medium text-white">1</td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center bg-purple-600 text-sm text-white">
                      AS
                    </div>
                    <span className="ml-3 font-medium text-white">Alex Smith</span>
                  </div>
                </td>
                <td className="p-4 text-gray-300">24</td>
                <td className="p-4 text-gray-300">15 days</td>
                <td className="p-4 font-medium text-purple-400">1,245</td>
              </tr>
              
              {/* Second Place */}
              <tr className="border-b border-gray-800">
                <td className="p-4 font-medium text-white">2</td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center bg-gray-700 text-sm text-white">
                      JD
                    </div>
                    <span className="ml-3 font-medium text-white">John Doe</span>
                  </div>
                </td>
                <td className="p-4 text-gray-300">22</td>
                <td className="p-4 text-gray-300">12 days</td>
                <td className="p-4 font-medium text-white">987</td>
              </tr>
              
              {/* User's Position */}
              <tr className="border-b border-gray-800 bg-purple-900 bg-opacity-20">
                <td className="p-4 font-medium text-white">7</td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center bg-purple-600 text-sm text-white">
                      YN
                    </div>
                    <span className="ml-3 font-medium text-white">You</span>
                  </div>
                </td>
                <td className="p-4 text-white">12</td>
                <td className="p-4 text-white">6 days</td>
                <td className="p-4 font-medium text-purple-400">765</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}