import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 px-6 py-4 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" className="text-xl font-bold text-purple-400">
            Expence App
          </Link>
        </div>
        
        <div className="hidden space-x-8 md:flex">
          <Link href="/dashboard" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link href="/dashboard/quests" className="text-gray-300 hover:text-white">
            Quests
          </Link>
          <Link href="/dashboard/social" className="text-gray-300 hover:text-white">
            Social
          </Link>
          <Link href="/dashboard/leaderboard" className="text-gray-300 hover:text-white">
            Leaderboard
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/settings" className="text-gray-300 hover:text-white">
            Settings
          </Link>
          <Link href="/" className="rounded-md border border-red-500 px-4 py-2 text-red-400 hover:bg-red-900 hover:bg-opacity-20">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}