import Header from '@/components/Header';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Leaderboard() {
  const { signOut } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-neonGreen font-mono">
      <Header onSignOut={signOut} />

      <main className="mx-auto max-w-7xl p-6">
        <h1 className="mb-6 text-4xl font-extrabold text-neonPink tracking-wider neon-text">
          LEADERBOARD
        </h1>

        {/* Filter Options */}
        <div className="mb-6 flex flex-wrap items-center space-x-4">
          <button className="bg-neonPurple px-5 py-2 text-black font-bold rounded shadow-md hover:shadow-neon transition">
            All Time
          </button>
          <button className="bg-gray-800 px-5 py-2 text-neonCyan hover:bg-neonPurple hover:text-black transition rounded">
            This Month
          </button>
          <button className="bg-gray-800 px-5 py-2 text-neonCyan hover:bg-neonPurple hover:text-black transition rounded">
            This Week
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-hidden rounded-xl border border-neonPink bg-opacity-60 bg-black backdrop-blur-sm shadow-[0_0_15px_#f0f]">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-neonPurple bg-gray-900/50 text-left">
                <th className="p-4 text-neonCyan uppercase tracking-widest">Rank</th>
                <th className="p-4 text-neonCyan uppercase tracking-widest">User</th>
                <th className="p-4 text-neonCyan uppercase tracking-widest">Quests</th>
                <th className="p-4 text-neonCyan uppercase tracking-widest">Streak</th>
                <th className="p-4 text-neonCyan uppercase tracking-widest">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {/* First Place */}
              <tr className="hover:bg-neonPurple/10">
                <td className="p-4 text-neonYellow font-bold">1</td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex items-center justify-center bg-neonPurple text-black rounded-full text-xs font-bold">
                      AS
                    </div>
                    <span className="ml-3 text-neonGreen font-semibold">Alex Smith</span>
                  </div>
                </td>
                <td className="p-4 text-neonCyan">24</td>
                <td className="p-4 text-neonCyan">15 days</td>
                <td className="p-4 text-neonPink font-bold">1,245</td>
              </tr>

              {/* Second Place */}
              <tr className="hover:bg-neonPurple/10">
                <td className="p-4 text-white font-bold">2</td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex items-center justify-center bg-gray-700 text-white rounded-full text-xs font-bold">
                      JD
                    </div>
                    <span className="ml-3 text-neonGreen font-semibold">John Doe</span>
                  </div>
                </td>
                <td className="p-4 text-neonCyan">22</td>
                <td className="p-4 text-neonCyan">12 days</td>
                <td className="p-4 text-neonGreen font-bold">987</td>
              </tr>

              {/* User's Position */}
              <tr className="bg-neonPurple/20">
                <td className="p-4 text-white font-bold">7</td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex items-center justify-center bg-neonPurple text-black rounded-full text-xs font-bold">
                      YN
                    </div>
                    <span className="ml-3 text-neonPink font-semibold">You</span>
                  </div>
                </td>
                <td className="p-4 text-white">12</td>
                <td className="p-4 text-white">6 days</td>
                <td className="p-4 text-neonPink font-bold">765</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
