'use client';

import React, { useState } from 'react';
import { useNotifications, Notification } from '../hooks/useNotifications';
import { Bell, X, CheckCircle, Clock } from 'lucide-react';

const NotificationPanel: React.FC = () => {
  const {
    notifications,
    markAsRead,
    removeNotification,
    clearAllNotifications,
    unreadCount
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'daily_reminder':
        return <Clock size={16} className="text-cyan-400" />;
      case 'quest_complete':
        return <CheckCircle size={16} className="text-green-400" />;
      default:
        return <Bell size={16} className="text-blue-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-300 hover:text-cyan-400 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-12 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="font-semibold text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  <Bell size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-800 hover:bg-gray-800 transition-colors ${
                        !notification.isRead ? 'bg-gray-850 border-l-4 border-l-cyan-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-sm leading-tight">
                            {notification.title}
                          </h4>
                          <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {formatTime(notification.timestamp)}
                            </span>
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                  Mark Read
                                </button>
                              )}
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPanel;