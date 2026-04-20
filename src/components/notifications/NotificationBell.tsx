import React, { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { getMyNotifications, markNotificationAsRead } from '../../services/api';
import type { Notification } from '../../shared/constants/types';
import NotificationDropdown from './NotificationDropdown';
import { toast } from 'sonner';

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await getMyNotifications();
      const allNotifs = response.data;
      setNotifications(allNotifs);
      setUnreadCount(allNotifs.filter((n: Notification) => !n.is_read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void fetchNotifications();
    }, 0);
    const interval = setInterval(() => {
      void fetchNotifications();
    }, 30000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationAsRead(id);
    } catch {
      toast.error('Failed to mark notification as read');
      // Revert if failed
      fetchNotifications();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-2xl transition-all duration-300 group ${
          isOpen
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
            : 'bg-gray-50 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-100'
        }`}
      >
        <Bell
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? '' : 'group-hover:rotate-12'}`}
        />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default NotificationBell;
