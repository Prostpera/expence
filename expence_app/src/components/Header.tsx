'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Bell, Trophy, TrendingUp, AlertCircle, Gift, Star } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from './auth/AuthProvider';
import { supabase } from '@/lib/supabase';

// Dummy notification data
const DUMMY_NOTIFICATIONS = [
  {
    id: '1',
    type: 'quest_complete',
    title: 'Quest Completed!',
    message: 'You completed "Emergency Fund Booster" and earned 150 EXP',
    icon: Trophy,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-900',
    time: '5 min ago',
    unread: true
  },
  {
    id: '2',
    type: 'level_up',
    title: 'Level Up!',
    message: 'Congratulations! You reached Level 8',
    icon: Star,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900',
    time: '1 hour ago',
    unread: true
  },
  {
    id: '3',
    type: 'achievement',
    title: 'New Achievement Unlocked',
    message: 'Earned "Budget Master" badge',
    icon: Gift,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-900',
    time: '3 hours ago',
    unread: true
  },
  {
    id: '4',
    type: 'friend',
    title: 'Friend Request',
    message: 'Sarah Johnson sent you a friend request',
    icon: AlertCircle,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-900',
    time: '1 day ago',
    unread: false
  },
  {
    id: '5',
    type: 'leaderboard',
    title: 'Rank Update',
    message: 'You climbed to #12 on the leaderboard!',
    icon: TrendingUp,
    color: 'text-green-400',
    bgColor: 'bg-green-900',
    time: '2 days ago',
    unread: false
  }
];

interface HeaderProps {
  onSignOut?: () => Promise<void>;
}

export default function Header({ onSignOut }: HeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const [userLevel, setUserLevel] = useState(1);
  const [username, setUsername] = useState('USER_42X');
  const [expToNextLevel, setExpToNextLevel] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Fetch user stats on mount
  useEffect(() => {
    if (user?.id) {
      fetchUserStats();
    }
  }, [user?.id]);

  // Listen for stats updates (e.g., when a quest is completed)
  useEffect(() => {
    const handleStatsUpdate = () => {
      if (user?.id) {
        fetchUserStats();
      }
    };

    window.addEventListener('statsUpdated', handleStatsUpdate);
    return () => window.removeEventListener('statsUpdated', handleStatsUpdate);
  }, [user?.id]);

  const fetchUserStats = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('level, username, exp_to_next_level')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user stats:', error);
        return;
      }

      if (data) {
        setUserLevel(data.level || 1);
        setUsername(data.username || 'USER_42X');
        setExpToNextLevel(data.exp_to_next_level || 0);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, unread: false } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, unread: false })));
  };

  const handleSignOut = async () => {
    try {
      if (onSignOut) {
        await onSignOut();
      }
      // The AuthProvider will handle clearing storage and redirecting
      window.location.replace('/');
    } catch (error) {
      console.error('Sign out error:', error);
      // Force redirect even if sign out fails
      window.location.replace('/');
    }
  };

  return (
    <header className="bg-gray-900 shadow-md relative z-20 border-b border-purple-900">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600"></div>
      
      <div className="mx-auto w-full px-4 py-3 flex items-center justify-between">
        {/* User Info */}
        <div className="flex flex-col">
          <div className="text-white font-medium text-sm">{username}</div>
          <div className="text-xs text-cyan-400">LEVEL {userLevel}</div>
        </div>

        {/* EXP to Next Level */}
        <div className="cyber-border cyber-border-blue flex items-center bg-gray-800 bg-opacity-80 px-2 py-1 border border-blue-700 relative">
          <span className="text-blue-400 font-bold mr-1">🔋</span>
          <span className="text-blue-400 font-medium">{expToNextLevel.toLocaleString()}</span>
          <span className="text-blue-300 font-light text-xs ml-1">EXP TO NEXT LVL</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2">
          {/* Notifications Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative px-3 py-1 text-cyan-400 group overflow-visible bg-cyan-500 border border-cyan-900 bg-opacity-15 hover:bg-opacity-50 transition-all"
            >
              <div className="relative flex items-center">
                <Bell size={14} className="mr-1" />
                <span className="text-xs">NOTIFS</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-cyan-500 shadow-lg max-h-96 overflow-y-auto z-50">
                {/* Header */}
                <div className="p-3 border-b border-cyan-700 flex items-center justify-between bg-gray-800">
                  <div className="flex items-center">
                    <div className="h-4 w-1 bg-cyan-500 mr-2"></div>
                    <h3 className="text-white font-medium text-sm">NOTIFICATIONS</h3>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="divide-y divide-gray-700">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-3 hover:bg-gray-800 cursor-pointer transition-colors ${
                            notification.unread ? 'bg-gray-800 bg-opacity-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`${notification.bgColor} bg-opacity-30 p-2 rounded`}>
                              <Icon size={16} className={notification.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${notification.unread ? 'text-white' : 'text-gray-300'}`}>
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <span className="h-2 w-2 bg-cyan-500 rounded-full flex-shrink-0"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-2 border-t border-cyan-700 bg-gray-800">
                    <button className="w-full text-xs text-cyan-400 hover:text-cyan-300 transition-colors text-center py-1">
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dashboard Button */}
          <Link href="/dashboard" className="relative px-3 py-1 text-purple-400 group overflow-hidden bg-purple-500 border border-purple-900 bg-opacity-15 hover:bg-opacity-50">
            <div className="relative flex items-center">
              <LayoutDashboard size={14} className="mr-1" />
              <span className="text-xs">DASH</span>
            </div>
          </Link>

          {/* Exit Button */}
          <button
            onClick={handleSignOut}
            type="button"
            className="relative px-3 py-1 text-red-400 group overflow-hidden bg-gray-800 border border-red-900 hover:bg-red-900 hover:bg-opacity-30 transition-all duration-300"
          >
            <div className="absolute bottom-0 left-0 w-5 h-1 bg-red-500 group-hover:w-full transition-all duration-300"></div>
            <div className="relative flex items-center">
              <LogOut size={14} className="mr-1" />
              <span className="text-xs">EXIT</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}