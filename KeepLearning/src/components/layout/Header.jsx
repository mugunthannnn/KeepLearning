
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  Brain,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Header = ({ onOpenSidebar }) => {
  const { user, topics = [], quizHistory = [] } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Recommendations are generated only from saved quiz attempts.
  const notifications = useMemo(() => {
    const attempts = Array.isArray(quizHistory) ? quizHistory : [];
    const topicList = Array.isArray(topics) ? topics : [];
    const latestByTopic = new Map();

    [...attempts]
      .sort(
        (a, b) =>
          new Date(b.timestamp || 0).getTime() -
          new Date(a.timestamp || 0).getTime()
      )
      .forEach((attempt) => {
        const topicId = attempt.topicId || attempt.topic_id;
        if (topicId && !latestByTopic.has(String(topicId))) {
          latestByTopic.set(String(topicId), attempt);
        }
      });

    return [...latestByTopic.entries()]
      .map(([topicId, attempt]) => {
        const score = Number(attempt.score);

        if (!Number.isFinite(score)) return null;

        const topic = topicList.find(
          (item) => String(item.id) === String(topicId)
        );

        const name =
          attempt.topicName ||
          attempt.topic_name ||
          topic?.name ||
          'this topic';

        if (score < 40) {
          return {
            id: `review-${topicId}`,
            topicId,
            score,
            type: 'alert',
            title: `Revise ${name}`,
            desc: `Your latest quiz score is ${score}%. Review the core concepts and try again.`,
          };
        }

        if (score < 80) {
          return {
            id: `practice-${topicId}`,
            topicId,
            score,
            type: 'info',
            title: `Strengthen ${name}`,
            desc: `You scored ${score}%. Practise the concepts you missed to improve.`,
          };
        }

        return {
          id: `progress-${topicId}`,
          topicId,
          score,
          type: 'success',
          title: `Great progress in ${name}`,
          desc: `You scored ${score}%. Try advanced questions to deepen your understanding.`,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);
  }, [quizHistory, topics]);

  const filteredTopics = searchQuery.trim()
    ? topicListFilter(topics, searchQuery)
    : [];

  const userInitials = (user?.name || 'Student')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleNotificationClick = (notification) => {
    setShowNotifications(false);

    if (notification.topicId) {
      navigate(`/topic/${notification.topicId}`);
    } else {
      navigate('/predictions');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
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
              placeholder="Search topics, subjects, or concepts..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setShowSearchDropdown(false);
              }}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
            />

            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {showSearchDropdown && searchQuery.trim() !== '' && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
              <div className="p-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Matching Topics ({filteredTopics.length})
              </div>

              {filteredTopics.length ? (
                <div className="divide-y divide-slate-100">
                  {filteredTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => {
                        navigate(`/topic/${topic.id}`);
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-3 hover:bg-slate-50 flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-600">
                          {topic.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {topic.subjectName}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {topic.knowledge != null &&
                        topic.knowledge !== '' &&
                        Number.isFinite(Number(topic.knowledge))
                          ? `${topic.knowledge}%`
                          : 'Not assessed'}
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

      <div className="flex items-center gap-3">
        {Number(user?.learningStreak) > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>{user.learningStreak} Day Streak</span>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setShowNotifications((visible) => !visible)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative"
            aria-label={`Learning insights, ${notifications.length} recommendations`}
            aria-expanded={showNotifications}
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-teal-600" />
                  AI Learning Insights
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {notifications.length}{' '}
                  {notifications.length === 1
                    ? 'recommendation'
                    : 'recommendations'}
                </span>
              </div>

              {notifications.length ? (
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className="w-full text-left p-3.5 hover:bg-slate-50 flex gap-3"
                    >
                      {item.type === 'alert' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      ) : item.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.desc}
                        </p>
                        <span className="text-[10px] text-teal-600 mt-1 block">
                          View topic →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <CheckCircle2 className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">
                    No recommendations yet
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete a quiz to receive recommendations based on your results.
                  </p>
                </div>
              )}

              <div className="p-2 border-t border-slate-100 text-center bg-slate-50/50">
                <button
                  onClick={() => {
                    navigate('/predictions');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                >
                  View AI Insights →
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 pl-2 cursor-pointer group"
          aria-label="Open profile"
        >
          <div className="w-8 h-8 rounded-full bg-[#0B1F33] text-teal-400 font-bold text-xs flex items-center justify-center border border-slate-200">
            {userInitials}
          </div>
          <span className="hidden md:inline-block text-xs font-semibold text-slate-700 group-hover:text-teal-600">
            {user?.name || 'Student'}
          </span>
        </button>
      </div>
    </header>
  );
};

function topicListFilter(topics, query) {
  const list = Array.isArray(topics) ? topics : [];
  const normalized = query.toLowerCase();

  return list
    .filter(
      (topic) =>
        topic.name?.toLowerCase().includes(normalized) ||
        topic.subjectName?.toLowerCase().includes(normalized)
    )
    .slice(0, 5);
}
