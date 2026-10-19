import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Bell, Moon, Sun, Save, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Profile = () => {
  const { user, updateProfile } = useData();
  const [activeTab, setActiveTab] = useState('preferences');

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'Computer Science Student');

  const [dailyGoal, setDailyGoal] = useState(user?.preferences?.dailyGoalMinutes || 30);
  const [experienceLevel, setExperienceLevel] = useState(user?.preferences?.experienceLevel || 'Intermediate');
  const [goal, setGoal] = useState(user?.preferences?.goal || 'Interview preparation');

  const [alerts, setAlerts] = useState({
    emailAlerts: user?.preferences?.emailAlerts ?? true,
    driftAlerts: user?.preferences?.driftAlerts ?? true,
    weeklySummary: user?.preferences?.weeklySummary ?? true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role || 'Student');
      setDailyGoal(user.preferences?.dailyGoalMinutes || 30);
      setExperienceLevel(user.preferences?.experienceLevel || 'Intermediate');
      setGoal(user.preferences?.goal || 'Interview preparation');
      setAlerts({
        emailAlerts: user.preferences?.emailAlerts ?? true,
        driftAlerts: user.preferences?.driftAlerts ?? true,
        weeklySummary: user.preferences?.weeklySummary ?? true
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        role,
        preferences: {
          dailyGoalMinutes: dailyGoal,
          experienceLevel,
          goal,
          ...alerts
        }
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Save profile failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const userInitials = (user?.name || "Student")
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Account & Learning Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Manage profile info, AI retention parameters, and notification alerts.</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile preferences saved successfully to your account!</span>
        </div>
      )}

      {/* User Header Pill */}
      <div className="bg-[#0B1F33] text-white p-6 rounded-2xl border border-slate-800 shadow-md flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-teal-500 text-[#0B1F33] font-black text-xl flex items-center justify-center border-2 border-teal-400">
          {userInitials}
        </div>
        <div>
          <h2 className="text-xl font-bold">{user?.name || "Student"}</h2>
          <p className="text-xs text-slate-300 mt-0.5">{user?.role || "Student"} • {user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex border-b border-slate-100 mb-6 gap-6">
          {[
            { id: 'preferences', label: 'Learning Preferences' },
            { id: 'account', label: 'Account Info' },
            { id: 'notifications', label: 'Notifications & Alerts' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Daily Learning Time (Minutes)</label>
                <select
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                >
                  <option value={15}>15 Minutes / day</option>
                  <option value={30}>30 Minutes / day (Recommended)</option>
                  <option value={45}>45 Minutes / day</option>
                  <option value={60}>60 Minutes / day</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Learning Goal</label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-500 focus:outline-none cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Email is permanently associated with this account.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role / Headline</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {[
                { key: 'driftAlerts', title: 'Knowledge Drift High-Risk Alerts', desc: 'Notify immediately when topic decay probability exceeds 75%' },
                { key: 'emailAlerts', title: 'Daily Spaced Repetition Reminders', desc: 'Receive morning schedule summaries' },
                { key: 'weeklySummary', title: 'Weekly Retention Digest', desc: 'Weekly telemetry report on knowledge progression' }
              ].map((item) => (
                <div key={item.key} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={alerts[item.key]}
                    onChange={(e) => setAlerts(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#0B1F33] hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-teal-400" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
