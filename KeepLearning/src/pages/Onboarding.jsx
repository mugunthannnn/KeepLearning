import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Onboarding = () => {
  const navigate = useNavigate();
  const { updateOnboarding } = useData();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subjects: ['Java', 'Data Structures', 'SQL'],
    level: 'Intermediate',
    goal: 'Interview preparation',
    dailyTime: '30'
  });

  const availableSubjects = [
    { id: 'Java', label: 'Java Programming', category: 'Backend & OOP' },
    { id: 'SQL', label: 'SQL & Databases', category: 'Data & Querying' },
    { id: 'Data Structures', label: 'Data Structures & Algorithms', category: 'CS Fundamentals' },
    { id: 'Spring Boot', label: 'Spring Boot & Microservices', category: 'Frameworks' }
  ];

  const toggleSubject = (sub) => {
    setFormData(prev => {
      const exists = prev.subjects.includes(sub);
      if (exists) {
        return { ...prev, subjects: prev.subjects.filter(s => s !== sub) };
      } else {
        return { ...prev, subjects: [...prev.subjects, sub] };
      }
    });
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await updateOnboarding(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding failed:', err);
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-xl">
        {/* Header Branding */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0B1F33] text-teal-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-teal-400 fill-teal-400" />
            </div>
            <span className="font-extrabold text-lg text-[#0F172A]">keepLearning</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Step {step} of 4</span>
            <div className="flex gap-1.5 ml-2">
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  className={`w-6 h-1.5 rounded-full transition-all ${
                    s <= step ? 'bg-teal-500' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* STEP 1: SUBJECTS */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mb-2">
              What do you want to learn & retain?
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Select one or more topics to populate your personalized learning matrix.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {availableSubjects.map((sub) => {
                const isSelected = formData.subjects.includes(sub.id);
                return (
                  <div
                    key={sub.id}
                    onClick={() => toggleSubject(sub.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/40 text-[#0B1F33]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">{sub.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{sub.category}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-teal-500 text-white' : 'border border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                disabled={formData.subjects.length === 0}
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-[#0B1F33] hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: EXPERIENCE LEVEL */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mb-2">
              What is your current experience level?
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Our prediction engine adjusts memory decay rates based on your foundation.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { id: 'Beginner', title: 'Beginner (Student)', desc: 'Learning core fundamentals and starting initial practice' },
                { id: 'Intermediate', title: 'Intermediate (Junior Engineer)', desc: 'Comfortable with standard coding, preparing for interviews' },
                { id: 'Advanced', title: 'Advanced (Experienced)', desc: 'Solid conceptual understanding, optimizing retention' }
              ].map((lvl) => {
                const isSelected = formData.level === lvl.id;
                return (
                  <div
                    key={lvl.id}
                    onClick={() => setFormData(prev => ({ ...prev, level: lvl.id }))}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/40 text-[#0B1F33]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">{lvl.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{lvl.desc}</p>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-teal-600 stroke-[3]" />}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-[#0B1F33] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DAILY TIME GOAL */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mb-2">
              Target Daily Revision Time
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Short, consistent daily intervals generate maximum stability against knowledge decay.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { time: '15', label: '15 mins/day', desc: 'Light review' },
                { time: '30', label: '30 mins/day', desc: 'Optimal pace (Recommended)' },
                { time: '60', label: '60 mins/day', desc: 'Intensive prep' }
              ].map((t) => {
                const isSelected = formData.dailyTime === t.time;
                return (
                  <div
                    key={t.time}
                    onClick={() => setFormData(prev => ({ ...prev, dailyTime: t.time }))}
                    className={`p-5 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/40 text-[#0B1F33]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <p className="text-lg font-black text-slate-900">{t.time} min</p>
                    <p className="text-xs font-bold text-slate-600 mt-1">{t.label}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{t.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 bg-[#0B1F33] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: GOAL & FINISH */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mb-2">
              What is your primary goal?
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              We personalize knowledge drift alerts according to your objective.
            </p>

            <div className="space-y-3 mb-8">
              {[
                "Technical Interview Preparation",
                "College Semester Exams & Faculty Review",
                "Long-Term Professional Skill Retention",
                "Certification & Competitive Programming"
              ].map((g) => {
                const isSelected = formData.goal === g;
                return (
                  <div
                    key={g}
                    onClick={() => setFormData(prev => ({ ...prev, goal: g }))}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between text-xs font-bold ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/40 text-[#0B1F33]'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                    }`}
                  >
                    <span>{g}</span>
                    {isSelected && <Check className="w-4 h-4 text-teal-600 stroke-[3]" />}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleFinish}
                className="px-8 py-3 bg-teal-500 hover:bg-teal-400 text-[#0B1F33] font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#0B1F33]" />
                    <span>Configuring Workspace...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#0B1F33]" />
                    <span>Launch My Learning Workspace</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
