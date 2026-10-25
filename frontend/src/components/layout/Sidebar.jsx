
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  BrainCircuit,
  CalendarCheck,
  BarChart3,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, revisionPlan } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const revisionTaskCount = Array.isArray(revisionPlan)
    ? revisionPlan.length
    : 0;

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'My Learning',
      path: '/learning',
      icon: BookOpen
    },
    {
      label: 'AI Insights',
      path: '/predictions',
      icon: BrainCircuit,
      badge: 'AI'
    },
    {
      label: 'Revision Plan',
      path: '/revision-plan',
      icon: CalendarCheck,
      badge: revisionTaskCount > 0
        ? `${revisionTaskCount}`
        : null
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: BarChart3
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: User
    }
  ];

  const userInitials = (user?.name || 'Student')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const retention = user?.retentionRate ?? 75;
  const atRiskCount = user?.topicsAtRiskCount ?? 0;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B1F33] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <NavLink
            to="/Landing"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-[#0B1F33] flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-teal-400 transition-colors">
              <Sparkles className="w-4 h-4 text-[#0B1F33] fill-[#0B1F33]" />
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white leading-none">
                keep<span className="text-teal-400">Learning</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                Knowledge Intelligence
              </span>
            </div>
          </NavLink>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Platform Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.path ||
              (
                item.path !== '/dashboard' &&
                location.pathname.startsWith(item.path)
              );

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-4 border-teal-400 pl-2.5'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-teal-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      item.badge === 'AI'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-3 mx-3 mb-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-300 font-medium">
              Retention Health
            </span>
            <span className="text-xs font-bold text-teal-400">
              {retention}%
            </span>
          </div>

          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${retention}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>{atRiskCount} topic(s) need review</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </p>
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#081726]">
          <div className="flex items-center justify-between">
            <NavLink
              to="/profile"
              className="flex items-center gap-3 min-w-0 group"
              onClick={onClose}
            >
              <div className="w-9 h-9 rounded-full bg-teal-600/30 text-teal-300 border border-teal-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                {userInitials}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-teal-300 transition-colors">
                  {user?.name || 'Student'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.role || 'Student'}
                </p>
              </div>
            </NavLink>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
