// src/app/dashboard/page.tsx
import Link from 'next/link';
import { 
  Compass, 
  Users, 
  Trophy,
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Wallet, 
  BarChart3,
  Briefcase,
  AlertTriangle,
  PiggyBank
} from 'lucide-react';
import Header from '@/components/Header';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden flex flex-col">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e30_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0px,transparent_1px,#3c3c5c_1px,transparent_2px,transparent_4px)] bg-[size:100%_4px] opacity-5 z-0"></div>
      
      <Header />
      
      <main className="flex-1 w-full max-w-7xl p-4 md:p-6 mx-auto relative z-10">
        <div className="flex items-center mb-6">
          <div className="h-6 w-1 bg-cyan-500 mr-3"></div>
          <h1 className="text-xl md:text-2xl font-bold text-white">DASHBOARD_<span className="text-cyan-400">MAIN</span></h1>
        </div>

        {/* Navigation Buttons Grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-8">
          <Link href="/dashboard" className="group col-span-1 md:col-span-2">
            <div className="relative bg-purple-900 bg-opacity-50 h-16 flex flex-col items-center justify-center clip-pentagon-button text-center p-2 border border-purple-500 hover:bg-opacity-75">
              <div className="text-purple-400 mb-1">
                <BarChart3 size={20} className="mx-auto" />
              </div>
              <div className="text-white font-medium text-sm">DASH</div>
            </div>
          </Link>
          
          <Link href="/dashboard/quests" className="group col-span-1 md:col-span-2">
            <div className="relative bg-cyan-900 bg-opacity-30 h-16 flex flex-col items-center justify-center clip-pentagon-button text-center p-2 border border-cyan-500 hover:bg-opacity-75">
              <div className="relative">
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</div>
                <Compass size={20} className="text-cyan-400 mx-auto" />
              </div>
              <div className="text-white font-medium text-sm mt-1">QUESTS</div>
            </div>
          </Link>
          
          <Link href="/dashboard/social" className="group col-span-1 md:col-span-2">
            <div className="relative bg-indigo-900 bg-opacity-30 h-16 flex flex-col items-center justify-center clip-pentagon-button text-center p-2 border border-indigo-500 hover:bg-opacity-75">
              <div className="text-indigo-400 mb-1">
                <Users size={20} className="mx-auto" />
              </div>
              <div className="text-white font-medium text-sm">SOCIAL</div>
            </div>
          </Link>
          
          <Link href="/dashboard/leaderboard" className="group col-span-1 md:col-span-2">
            <div className="relative bg-amber-900 bg-opacity-30 h-16 flex flex-col items-center justify-center clip-pentagon-button text-center p-2 border border-amber-500 hover:bg-opacity-75">
              <div className="text-amber-400 mb-1">
                <Trophy size={20} className="mx-auto" />
              </div>
              <div className="text-white font-medium text-sm">RANKS</div>
            </div>
          </Link>
        </div>
        
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* TOTAL_EXPENSES card */}
          <div className="bg-gray-900 bg-opacity-80 shadow-lg relative overflow-hidden group border border-purple-500">
            <div className="absolute top-0 right-0 w-8 h-8 bg-purple-900 clip-corner-rotated"></div>
                        
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-400 flex items-center relative">
                <BarChart3 size={18} className="mr-2 text-purple-400" />
                <span>TOTAL_EXPENSES</span>
              </h2>
              <p className="mt-2 text-3xl font-bold text-purple-400">$1,245.00</p>
              <div className="mt-4 text-xs text-gray-500 flex items-center">
                <AlertTriangle size={10} className="mr-1 text-purple-500" />
                <span>LAST_UPDATED: TODAY</span>
              </div>
            </div>
          </div>
          
          {/* MONTHLY_SAVING card */}
          <div className="bg-gray-900 bg-opacity-80 shadow-lg relative overflow-hidden group border border-cyan-500">
            {/* Rotated corner */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-900 clip-corner-rotated"></div>
                        
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-400 flex items-center relative">
                <PiggyBank size={18} className="mr-2 text-cyan-400" />
                <span>MONTHLY_SAVING</span>
              </h2>
              <p className="mt-2 text-3xl font-bold text-cyan-400">$326.50</p>
              <div className="mt-4 text-xs text-gray-500 flex items-center">
                <AlertTriangle size={10} className="mr-1 text-cyan-500" />
                <span>TARGET: $500.00</span>
              </div>
            </div>
          </div>
          
          {/* ACTIVE_QUESTS card */}
          <Link href="/dashboard/quests" className="bg-gray-900 bg-opacity-80 shadow-lg relative overflow-hidden group sm:col-span-2 lg:col-span-1 border border-yellow-500">
          <div className="bg-gray-900 bg-opacity-80 shadow-lg relative overflow-hidden group sm:col-span-2 lg:col-span-1 border border-yellow-500">
            <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-900 clip-corner-rotated"></div>
            <div className="absolute bottom-0 left-0 w-5 h-1 bg-yellow-500 group-hover:w-full transition-all duration-300"></div>
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-400 flex items-center relative">
                <Briefcase size={18} className="mr-2 text-yellow-400" />
                <span>ACTIVE_QUESTS</span>
              </h2>
              <p className="mt-2 text-3xl font-bold text-yellow-400">3</p>
              <div className="mt-4 text-xs text-gray-500 flex items-center">
                <AlertTriangle size={10} className="mr-1 text-yellow-500" />
                <span>2 MISSIONS PENDING</span>
              </div>
            </div>
          </div>
          </Link>
        </div>
        
        {/* Recent Activity */}
        <div className="mb-8 bg-gray-900 bg-opacity-80 shadow-lg relative border border-purple-500">
          {/* Top line accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600"></div>
          
          <div className="absolute top-0 right-0 w-8 h-8"></div>
          
          <div className="p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <div className="h-5 w-1 bg-purple-500 mr-2"></div>
              <h2 className="text-lg sm:text-xl font-medium text-white">RECENT_ACTIVITY</h2>
              <div className="ml-auto text-xs text-cyan-400 border border-cyan-700 px-2 py-1 cursor-pointer hover:bg-gray-800">
                VIEW_ALL
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-800 bg-opacity-60 p-3 sm:p-4 border-l-2 border-red-500 relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-900 clip-corner-rotated-inverse"></div>
                
                <div>
                  <p className="font-medium text-white flex items-center">
                    <span className="inline-block w-2 h-2 bg-red-500 mr-2"></span>
                    Coffee Shop
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 ml-4">Today</p>
                </div>
                <span className="text-base sm:text-lg font-medium text-red-400">-$4.50</span>
              </div>
              
              <div className="flex items-center justify-between bg-gray-800 bg-opacity-60 p-3 sm:p-4 border-l-2 border-red-500 relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-900 clip-corner-rotated-inverse"></div>
                
                <div>
                  <p className="font-medium text-white flex items-center">
                    <span className="inline-block w-2 h-2 bg-red-500 mr-2"></span>
                    Grocery Store
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 ml-4">Yesterday</p>
                </div>
                <span className="text-base sm:text-lg font-medium text-red-400">-$32.75</span>
              </div>
              
              <div className="flex items-center justify-between bg-gray-800 bg-opacity-60 p-3 sm:p-4 border-l-2 border-green-500 relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-900 clip-corner-rotated-inverse"></div>
                
                <div>
                  <p className="font-medium text-white flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-500 mr-2"></span>
                    Salary
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 ml-4">April 15, 2025</p>
                </div>
                <span className="text-base sm:text-lg font-medium text-green-400">+$1,200.00</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}