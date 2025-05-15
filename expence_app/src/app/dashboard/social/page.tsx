import Header from '@/components/Header';

export default function Social() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cyan-400 animate-pulse [text-shadow:_0_0_10px_rgb(34_211_238_/_50%)]">Friends</h1>
          
          <div className="flex items-center space-x-4">
            <input 
              type="text"
              placeholder="Find friends..."
              className="rounded-md border-2 border-cyan-400 bg-black p-2 text-cyan-400 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 placeholder-cyan-400/50 [box-shadow:_0_0_15px_rgb(34_211_238_/_20%)]"
            />
            <button className="rounded-md bg-pink-500 px-4 py-2 text-white hover:bg-pink-600 transition-all duration-300 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] [text-shadow:_0_0_10px_rgb(236_72_153_/_50%)]">
              Add Friend
            </button>
          </div>
        </div>
        
        {/* Friends List */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Friend Card */}
          <div className="group rounded-lg bg-gray-900/50 p-6 shadow-lg border border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] [box-shadow:_0_0_20px_rgb(34_211_238_/_10%)]">
            <div className="flex items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 text-white [box-shadow:_0_0_15px_rgb(34_211_238_/_30%)]">
                AS
              </div>
              <div className="ml-4">
                <p className="font-medium text-cyan-400 [text-shadow:_0_0_10px_rgb(34_211_238_/_50%)]">Alex Smith</p>
                <p className="text-sm text-pink-400 [text-shadow:_0_0_10px_rgb(236_72_153_/_50%)]">Friend since April 2025</p>
              </div>
            </div>
            
            <div className="mt-4 border-t border-cyan-400/30 pt-4">
              <div className="flex items-center space-x-4">
                <button className="flex-1 rounded-md bg-black border border-cyan-400/50 px-3 py-2 text-sm text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 [text-shadow:_0_0_10px_rgb(34_211_238_/_50%)] hover:[box-shadow:_0_0_15px_rgb(34_211_238_/_30%)]">
                  View Profile
                </button>
                <button className="flex-1 rounded-md bg-red-500/80 px-3 py-2 text-sm text-white hover:bg-red-600 transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] opacity-0 group-hover:opacity-100 [text-shadow:_0_0_10px_rgb(239_68_68_/_50%)]">
                  Remove Friend
                </button>
              </div>
            </div>
          </div>
          
          {/* Friend Card */}
          <div className="group rounded-lg bg-gray-900/50 p-6 shadow-lg border border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] [box-shadow:_0_0_20px_rgb(34_211_238_/_10%)]">
            <div className="flex items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 text-white [box-shadow:_0_0_15px_rgb(236_72_153_/_30%)]">
                EJ
              </div>
              <div className="ml-4">
                <p className="font-medium text-cyan-400 [text-shadow:_0_0_10px_rgb(34_211_238_/_50%)]">Emma Johnson</p>
                <p className="text-sm text-pink-400 [text-shadow:_0_0_10px_rgb(236_72_153_/_50%)]">Friend since March 2025</p>
              </div>
            </div>
            
            <div className="mt-4 border-t border-cyan-400/30 pt-4">
              <div className="flex items-center space-x-4">
                <button className="flex-1 rounded-md bg-black border border-cyan-400/50 px-3 py-2 text-sm text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 [text-shadow:_0_0_10px_rgb(34_211_238_/_50%)] hover:[box-shadow:_0_0_15px_rgb(34_211_238_/_30%)]">
                  View Profile
                </button>
                <button className="flex-1 rounded-md bg-red-500/80 px-3 py-2 text-sm text-white hover:bg-red-600 transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] opacity-0 group-hover:opacity-100 [text-shadow:_0_0_10px_rgb(239_68_68_/_50%)]">
                  Remove Friend
                </button>
              </div>
            </div>
          </div>
          
          {/* Friend Card */}
          <div className="group rounded-lg bg-gray-900/50 p-6 shadow-lg border border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] [box-shadow:_0_0_20px_rgb(34_211_238_/_10%)]">
            <div className="flex items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 text-white [box-shadow:_0_0_15px_rgb(34_211_238_/_30%)]">
                MB
              </div>
              <div className="ml-4">
                <p className="font-medium text-cyan-400 [text-shadow:_0_0_10px_rgb(34_211_238_/_50%)]">Michael Brown</p>
                <p className="text-sm text-pink-400 [text-shadow:_0_0_10px_rgb(236_72_153_/_50%)]">Friend since February 2025</p>
              </div>
            </div>
            
            <div className="mt-4 border-t border-cyan-400/30 pt-4">
              <div className="flex items-center space-x-4">
                <button className="flex-1 rounded-md bg-black border border-cyan-400/50 px-3 py-2 text-sm text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 [text-shadow:_0_0_10px_rgb(34_211_238_/_50%)] hover:[box-shadow:_0_0_15px_rgb(34_211_238_/_30%)]">
                  View Profile
                </button>
                <button className="flex-1 rounded-md bg-red-500/80 px-3 py-2 text-sm text-white hover:bg-red-600 transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] opacity-0 group-hover:opacity-100 [text-shadow:_0_0_10px_rgb(239_68_68_/_50%)]">
                  Remove Friend
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}