
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Clock,
  Target,
  PlayCircle,
} from 'lucide-react';

import { useData } from '../context/DataContext';
import { ProgressBar } from '../components/common/ProgressBar';

export const Dashboard = () => {
  const navigate = useNavigate();

  const {
    user,
    subjects = [],
    topics = [],
    activities = [],
    revisionPlan = [],
  } = useData();

  const firstName = (user?.name || 'Student').split(' ')[0];

  const completedTopics = subjects.reduce(
    (total, subject) =>
      total + (Number(subject.completedTopics) || 0),
    0
  );

  const totalTopics = topics.length;

  const knowledgeScore = Math.max(
    0,
    Math.min(100, Number(user?.knowledgeScore) || 0)
  );

  // Only show topics that the user has actually started.
  const priorityTopic = topics.find(
    (topic) =>
      Number(topic.accuracy) > 0 &&
      (topic.riskLevel === 'Critical' ||
        topic.riskLevel === 'High')
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      <section>
        <p className="text-sm font-medium text-teal-600 mb-2">
          YOUR LEARNING SPACE
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back, {firstName}!
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          Keep learning, one topic at a time.
        </p>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-slate-500">
              Your learning progress
            </p>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              {knowledgeScore}%
            </h2>
          </div>

          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
            <Target className="w-6 h-6 text-teal-600" />
          </div>
        </div>

        <ProgressBar
          value={knowledgeScore}
          color="auto"
          height="h-2.5"
        />

        <p className="text-xs text-slate-500 mt-3">
          Your overall learning progress
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span className="text-xs sm:text-sm">
              Topics completed
            </span>
          </div>

          <p className="text-2xl font-bold text-slate-900">
            {completedTopics}
            <span className="text-sm font-medium text-slate-400">
              {' '}/ {totalTopics}
            </span>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span className="text-xs sm:text-sm">
              Topics available
            </span>
          </div>

          <p className="text-2xl font-bold text-slate-900">
            {totalTopics}
          </p>
        </div>
      </section>

      <section className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-300 mb-3">
              {priorityTopic
                ? 'Suggested for revision'
                : 'Ready to learn?'}
            </p>

            <h2 className="text-xl font-bold">
              {priorityTopic?.name || 'Explore your subjects'}
            </h2>

            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {priorityTopic
                ? 'Review this topic to strengthen your understanding.'
                : 'Start learning a topic to build your progress.'}
            </p>
          </div>

          <button
            onClick={() =>
              priorityTopic
                ? navigate(`/learn/${priorityTopic.id}`)
                : navigate('/learning')
            }
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm px-5 py-3 transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            {priorityTopic ? 'Revise topic' : 'Start learning'}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              My subjects
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Continue where you left off.
            </p>
          </div>

          <button
            onClick={() => navigate('/learning')}
            className="text-sm font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.slice(0, 4).map((subject) => {
              const subjectProgress = Math.max(
                0,
                Math.min(100, Number(subject.knowledge) || 0)
              );

              return (
                <button
                  key={subject.id}
                  onClick={() => navigate(`/learning/${subject.id}`)}
                  className="text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {subject.name}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {subject.description ||
                          'Explore topics in this subject.'}
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-semibold text-slate-700">
                        {subjectProgress}%
                      </span>
                    </div>

                    <ProgressBar
                      value={subjectProgress}
                      color="auto"
                      height="h-2"
                    />
                  </div>

                  <p className="text-xs text-slate-500 mt-3">
                    {Number(subject.completedTopics) || 0} of{' '}
                    {Number(subject.topicCount) || 0} topics completed
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">
              No subjects to display
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Explore the learning section to get started.
            </p>

            <button
              onClick={() => navigate('/learning')}
              className="mt-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 text-sm font-semibold"
            >
              Explore subjects
            </button>
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Recent activity
          </h2>
        </div>

        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.slice(0, 3).map((activity, index) => (
              <div
                key={activity.id || index}
                className="flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {activity.title}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {activity.subtitle}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No activity yet. Your learning activity will appear here.
          </p>
        )}

        <button
          onClick={() => navigate('/revision-plan')}
          className="mt-5 w-full rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition-colors"
        >
          Revision plan ({revisionPlan.length})
          <ArrowRight className="w-4 h-4 inline ml-1" />
        </button>
      </section>
    </div>
  );
};
