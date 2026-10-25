import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, CheckCircle2, Play, Clock, Sparkles, AlertTriangle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { ProgressBar } from '../components/common/ProgressBar';

export const RevisionPlan = () => {
  const navigate = useNavigate();
  const { revisionPlan, markRevisionCompleted, rescheduleTask } = useData();

  const allTasks = revisionPlan || [];
  const todayTasks = allTasks.filter(r => r.dueDateCategory === 'Today');
  const tomorrowTasks = allTasks.filter(r => r.dueDateCategory === 'Tomorrow');
  const laterTasks = allTasks.filter(r => r.dueDateCategory !== 'Today' && r.dueDateCategory !== 'Tomorrow');

  const completedCount = allTasks.filter(r => r.completed).length;
  const totalCount = allTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Spaced Repetition Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Your Revision Plan</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Prioritized daily revision schedule designed by AI to prevent knowledge decay.
          </p>
        </div>

        {/* Weekly Progress Box */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs min-w-[240px]">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
            <span>Weekly Target Progress</span>
            <span className="text-teal-600">{completedCount}/{totalCount} Completed</span>
          </div>
          <ProgressBar value={progressPercent} color="teal" height="h-2" />
        </div>
      </div>

      {/* Render Task Groups */}
      {[
        { title: "Today's Priorities", category: "Today", tasks: todayTasks, icon: AlertTriangle, color: "text-rose-600" },
        { title: "Tomorrow's Schedule", category: "Tomorrow", tasks: tomorrowTasks, icon: Clock, color: "text-amber-600" },
        { title: "Upcoming Later This Week", category: "Later", tasks: laterTasks, icon: Sparkles, color: "text-sky-600" }
      ].map((group, gIdx) => {
        const Icon = group.icon;
        return (
          <div key={gIdx} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Icon className={`w-5 h-5 ${group.color}`} />
                <span>{group.title}</span>
              </h2>
              <span className="text-xs font-bold text-slate-400">{group.tasks.length} Task(s)</span>
            </div>

            {group.tasks.length > 0 ? (
              <div className="space-y-3">
                {group.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      task.completed
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <button
                        onClick={() => markRevisionCompleted(task.id)}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 hover:border-teal-500 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-base font-bold ${task.completed ? 'line-through text-slate-500' : 'text-[#0F172A]'}`}>
                            {task.topicName}
                          </h3>
                          <span className="text-xs font-semibold text-slate-400">• {task.subjectName}</span>
                          <RiskBadge level={task.riskLevel} size="sm" />
                        </div>
                        <p className="text-xs text-slate-500">
                          {task.reason} — <strong className="text-slate-700">{task.timeMinutes} mins</strong> revision + {task.questionsCount} questions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      {!task.completed ? (
                        <>
                          <select
                            onChange={(e) => rescheduleTask(task.id, e.target.value)}
                            defaultValue=""
                            className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-2 rounded-lg border-0 focus:outline-none cursor-pointer"
                          >
                            <option value="" disabled>Reschedule</option>
                            <option value="Today">Today</option>
                            <option value="Tomorrow">Tomorrow</option>
                            <option value="Friday">Friday</option>
                          </select>

                          <button
                            onClick={() => navigate(`/learn/${task.topicId}`)}
                            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-[#0B1F33] text-xs font-extrabold rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 fill-[#0B1F33]" />
                            <span>Start Revision</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                No tasks scheduled for {group.category}.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
