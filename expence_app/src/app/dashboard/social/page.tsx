import Header from '@/components/Header';

export default function Social() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Friends</h1>
          
          <div className="flex items-center space-x-4">
            <input 
              type="text"
              placeholder="Find friends..."
              className="rounded-md border-gray-700 bg-gray-800 p-2 text-white focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
            />
            <button className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
              Add Friend
            </button>
          </div>
        </div>
        
        {/* Friends List */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Friend Card */}
          <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
            <div className="flex items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
                AS
              </div>
              <div className="ml-4">
                <p className="font-medium text-white">Alex Smith</p>
                <p className="text-sm text-gray-400">Friend since April 2025</p>
              </div>
            </div>
            
            <div className="mt-4 border-t border-gray-800 pt-4">
              <div className="flex items-center space-x-4">
                <button className="flex-1 rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700">
                  View Profile
                </button>
                <button className="flex-1 rounded-md bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700">
                  Challenge
                </button>
              </div>
            </div>
          </div>
          
          {/* Friend Card */}
          <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
            <div className="flex items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
                EJ
              </div>
              <div className="ml-4">
                <p className="font-medium text-white">Emma Johnson</p>
                <p className="text-sm text-gray-400">Friend since March 2025</p>
              </div>
            </div>
            
            <div className="mt-4 border-t border-gray-800 pt-4">
              <div className="flex items-center space-x-4">
                <button className="flex-1 rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700">
                  View Profile
                </button>
                <button className="flex-1 rounded-md bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700">
                  Challenge
                </button>
              </div>
            </div>
          </div>
          
          {/* Friend Card */}
          <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
            <div className="flex items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-600 text-white">
                MB
              </div>
              <div className="ml-4">
                <p className="font-medium text-white">Michael Brown</p>
                <p className="text-sm text-gray-400">Friend since February 2025</p>
              </div>
            </div>
            
            <div className="mt-4 border-t border-gray-800 pt-4">
              <div className="flex items-center space-x-4">
                <button className="flex-1 rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700">
                  View Profile
                </button>
                <button className="flex-1 rounded-md bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700">
                  Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}