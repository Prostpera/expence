import Navbar from '@/components/Navbar';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <main className="mx-auto max-w-7xl p-6">
        <h1 className="mb-6 text-2xl font-bold text-white">Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
            <h2 className="text-lg font-medium text-gray-400">Total Expenses</h2>
            <p className="mt-2 text-3xl font-bold text-purple-400">$1,245.00</p>
          </div>
          
          <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
            <h2 className="text-lg font-medium text-gray-400">Monthly Saving</h2>
            <p className="mt-2 text-3xl font-bold text-purple-400">$326.50</p>
          </div>
          
          <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
            <h2 className="text-lg font-medium text-gray-400">Active Quests</h2>
            <p className="mt-2 text-3xl font-bold text-purple-400">3</p>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="mb-8 rounded-lg bg-gray-900 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-medium text-white">Recent Activity</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-md bg-gray-800 p-4">
              <div>
                <p className="font-medium text-white">Coffee Shop</p>
                <p className="text-sm text-gray-400">Today</p>
              </div>
              <span className="text-lg font-medium text-red-400">-$4.50</span>
            </div>
            
            <div className="flex items-center justify-between rounded-md bg-gray-800 p-4">
              <div>
                <p className="font-medium text-white">Grocery Store</p>
                <p className="text-sm text-gray-400">Yesterday</p>
              </div>
              <span className="text-lg font-medium text-red-400">-$32.75</span>
            </div>
            
            <div className="flex items-center justify-between rounded-md bg-gray-800 p-4">
              <div>
                <p className="font-medium text-white">Salary</p>
                <p className="text-sm text-gray-400">April 15, 2025</p>
              </div>
              <span className="text-lg font-medium text-green-400">+$1,200.00</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}