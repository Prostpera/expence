import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg bg-gray-900 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-purple-400">Expence App</h1>
        <p className="mb-8 text-center text-gray-400">Track your expenses and save money with quests</p>
        
        <div className="space-y-4">
          <Link href="/dashboard" className="flex w-full items-center justify-center rounded-md bg-purple-600 px-4 py-3 text-white hover:bg-purple-700">
            Enter Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}