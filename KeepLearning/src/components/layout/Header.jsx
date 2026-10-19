import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  LogOut
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Header = ({ onOpenSidebar }) => {
  const { user, topics, logout } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Knowledge Drift Risk: Spring Security",
      desc: "Predicted decay score reached 84%. Revision recommended today.",
      time: "10 min ago",
      type: "alert"
    },
    {
      id: 2,
      title: "Revision Milestone Reached",
      desc: "You maintained a consistent learning streak!",
      time: "2 hours ago",
      type: "success"
    },
    {
      id: 3,
      title: "HashMap Quiz Update",
      desc: "Knowledge score recovered to 72%.",
      time: "1 day ago",
      type: "info"
    }
  ];

  const filteredTopics = searchQuery.trim()
    ? (topics || []).filter(t => 
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.subjectName?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const userInitials = (user?.name || "Student")
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search topics, subjects, or concepts (e.g. HashMap, JOINs)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Search Results Dropdown */}
          {showSearchDropdown && searchQuery.trim() !== '' && (
            <div 
              className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden"
              onMouseLeave={() => setShowSearchDropdown(false)}
            >
              <div className="p-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Matching Topics ({filteredTopics.length})
              </div>
              {filteredTopics.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {filteredTopics.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        navigate(`/topic/${t.id}`);
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-3 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.subjectName}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        t.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {t.knowledge}%
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  No matching topics found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Notifications & Profile Pill */}
      <div className="flex items-center gap-3">
        {/* Daily Streak Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
          <span>{user?.learningStreak ?? 1} Day Streak</span>
        </div>

        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-sm font-bold text-slate-900">AI Intelligence Alerts</span>
                <span className="text-xs text-teal-600 font-medium">3 New</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors flex gap-3">
                    {n.type === 'alert' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 text-center bg-slate-50/50">
                <button 
                  onClick={() => {
                    navigate('/predictions');
                    setShowNotifications(false);
                  }} 
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                >
                  View All Predictions & Alerts →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 pl-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#0B1F33] text-teal-400 font-bold text-xs flex items-center justify-center border border-slate-200">
            {userInitials}
          </div>
          <span className="hidden md:inline-block text-xs font-semibold text-slate-700 group-hover:text-teal-600 transition-colors">
            {user?.name || "Student"}
          </span>
        </div>
      </div>
    </header>
  );
};
