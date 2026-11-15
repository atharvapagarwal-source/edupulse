import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTeacherNotifications } from '../services/api';
import { NotificationItem } from '../types';
import { Bell, CheckCircle2, AlertTriangle, Info, Clock, CheckCheck, FileText, MessageSquareHeart, Users } from 'lucide-react';

export const TeacherNotificationsPage: React.FC = () => {
  const { user, markNotificationsAsRead } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTeacherNotifications(user?.id)
      .then((res) => {
        setNotifications(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading teacher notifications:", err);
        setLoading(false);
      });
  }, [user?.id]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    markNotificationsAsRead();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans text-[#344541]">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#DCE9E1]/80 via-[#F5F3ED] to-[#DCE9E1]/50 border border-[#DCE9E1] shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#173F3A]/10 text-[#173F3A] text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5 text-[#E7B978]" />
            <span>Faculty Notification Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Teacher Notifications & Alerts
          </h2>
          <p className="text-sm text-[#344541]/75 mt-1 font-medium">
            Course alerts, student assignment submissions, and department communications for {user?.name}.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="px-4 py-2 rounded-xl bg-white border border-[#DCE9E1] text-[#173F3A] text-xs font-bold transition flex items-center space-x-1.5 hover:bg-[#FAF9F5] shadow-2xs cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-[#79A995]" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#344541]/60 bg-white rounded-3xl border border-[#DCE9E1]">
            Loading faculty notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#344541]/60 bg-white rounded-3xl border border-[#DCE9E1]">
            No notifications found for this faculty member.
          </div>
        ) : (
          notifications.map((n) => {
            const isUnread = !n.is_read;
            return (
              <div
                key={n.id}
                className={`p-5 rounded-3xl border transition flex items-start space-x-4 ${
                  isUnread
                    ? 'bg-white border-[#79A995]/60 shadow-xs ring-1 ring-[#79A995]/20'
                    : 'bg-[#FAF9F5] border-[#E5E2D9]'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold ${
                  n.type === 'warning'
                    ? 'bg-[#E7B978] text-[#173F3A]'
                    : n.type === 'success'
                    ? 'bg-[#79A995]'
                    : 'bg-[#173F3A]'
                }`}>
                  {n.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : n.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-[#173F3A] text-sm">{n.title}</h4>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#E7B978]" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#344541]/60 flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-[#79A995]" /> {n.created_at}
                    </span>
                  </div>
                  <p className="text-xs text-[#344541]/80 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
