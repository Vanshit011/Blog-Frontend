import React from 'react';
import { Check, BellOff, X } from 'lucide-react';
import type { Notification } from '../../shared/constants/types';
import { markNotificationAsRead } from '../../services/api';
import { toast } from 'sonner';

interface NotificationDropdownProps {
  notifications: Notification[];
  onRefresh: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  notifications, 
  onRefresh, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      onRefresh();
    } catch {
      toast.error('Failed to mark notification as read');
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-transparent" 
        onClick={onClose} 
      />
      <div className="absolute right-0 mt-4 w-96 max-h-[500px] overflow-hidden bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-indigo-100 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-gray-900">Notifications</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[400px] scrollbar-hide">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-5 hover:bg-indigo-50/50 transition-all group relative ${!notif.isRead ? 'bg-indigo-50/20' : ''}`}
                >
                  <div className="flex gap-4">
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-indigo-600' : 'bg-transparent'}`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <p className={`text-sm font-bold ${!notif.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notif.title}
                        </p>
                        {!notif.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="bg-white p-1.5 rounded-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium">
                        {notif.message}
                      </p>
                      <p className="text-[11px] font-semibold text-gray-400 mt-2">
                        {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <BellOff className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-bold">All caught up!</p>
              <p className="text-sm text-gray-400">No notifications to show</p>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Recent Notifications
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationDropdown;
