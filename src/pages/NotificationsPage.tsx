import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCircle2, AlertTriangle, Info, Clock, CheckCheck } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { markNotificationsAsRead } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-001',
      title: 'Upcoming Deadline Alert',
      message: 'DSA Assignment on Binary Tree Traversal is due on Oct 5 at 11:59 PM.',
      type: 'warning',
      is_read: false,
      timestamp: 'Today, 09:30 AM'
    },
    {
      id: 'notif-002',
      title: 'AI Performance Improvement',
      message: 'Your performance score in Python Programming improved by +12% this month!',
      type: 'success',
      is_read: false,
      timestamp: 'Yesterday, 02:15 PM'
    },
    {
      id: 'notif-003',
      title: 'New High-Match Opportunity',
      message: 'National AI & Machine Learning Hackathon matches 94% of your profile skills.',
      type: 'info',
      is_read: false,
      timestamp: 'Oct 01, 06:00 PM'
    },
    {
      id: 'notif-004',
      title: 'Teacher Feedback Released',
      message: 'Prof. Sharma published graded feedback on your Dijkstra Algorithm submission.',
      type: 'info',
      is_read: true,
      timestamp: 'Sep 28, 11:00 AM'
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    markNotificationsAsRead();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Notification Center</h2>
          <p className="text-xs text-slate-500 mt-1">Real-time alerts for deadlines, grade updates, and AI recommendations</p>
        </div>
        <button
          onClick={markAllRead}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center space-x-1.5"
        >
          <CheckCheck className="w-4 h-4 text-indigo-600" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-2xl border transition flex items-start space-x-4 ${
              !n.is_read ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-slate-200/80'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold ${
              n.type === 'warning' ? 'bg-rose-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}>
              {n.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : n.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                <span className="text-[11px] text-slate-400 font-mono flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> {n.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
