import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Brain,
  TrendingDown,
  Clock,
  CheckCircle,
  Zap,
  Target,
  LineChart,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  ChevronRight
} from 'lucide-react';
import { KnowledgeForecastChart } from '../components/predictions/KnowledgeForecastChart';

export const Landing = () => {
  const navigate = useNavigate();

  const sampleForecastData = [
    { day: "Today", predictedWithoutRev: 64, predictedWithRev: 85 },
    { day: "+3 Days", predictedWithoutRev: 60, predictedWithRev: 83 },
    { day: "+7 Days", predictedWithoutRev: 53, predictedWithRev: 81 },
    { day: "+10 Days", predictedWithoutRev: 48, predictedWithRev: 80 },
    { day: "+14 Days", predictedWithoutRev: 45, predictedWithRev: 78 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0B1F33] text-teal-400 flex items-center justify-center font-black text-xl shadow-md">
              <Sparkles className="w-5 h-5 text-teal-400 fill-teal-400" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#0B1F33]">
              keep<span className="text-teal-600">Learning</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#problem" className="hover:text-teal-600 transition-colors">The Problem</a>
            <a href="#how-it-works" className="hover:text-teal-600 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
            <a href="#users" className="hover:text-teal-600 transition-colors">Who It's For</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 text-sm font-bold bg-[#0B1F33] text-white rounded-lg hover:bg-slate-800 shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 bg-linear-to-b from-slate-900 via-[#0B1F33] to-slate-900 text-white overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14B8A6_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Predictive Knowledge Retention Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
              Learn today. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 via-sky-300 to-teal-200">
                Remember tomorrow.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-8">
              keepLearning monitors your practice, predicts what concepts you are likely to forget, and creates personalized revision plans before your knowledge decays.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-3.5 text-base font-bold bg-teal-500 text-[#0B1F33] hover:bg-teal-400 rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-xl border border-slate-700 transition-all"
              >
                See How It Works
              </button>
            </div>
          </div>

          {/* Hero UI Visualization Box */}
          <div className="max-w-5xl mx-auto rounded-2xl bg-slate-950/80 border border-slate-800 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-slate-300">keepLearning Dashboard — Live Forecast</span>
              </div>
              <span className="text-teal-400 font-medium">AI Active</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: AI Recommendation Card */}
              <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                      High Drift Risk
                    </span>
                    <span className="text-xs text-slate-400">Predicted Decay</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">HashMap Internal Mechanics</h3>
                  <p className="text-xs text-slate-400 mb-4">Data Structures & Algorithms</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Current Knowledge:</span>
                      <span className="font-bold text-white">64%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Drift Probability:</span>
                      <span className="font-bold text-rose-400">78% High</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Recommended Session:</span>
                      <span className="font-semibold text-teal-300">20 min revision</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-[#0B1F33] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Revise Now in Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right Column: Chart */}
              <div className="lg:col-span-2 bg-slate-900/90 rounded-xl p-4 border border-slate-800">
                <KnowledgeForecastChart data={sampleForecastData} topicName="HashMap Mechanics" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: The Problem */}
      <section id="problem" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-teal-600 mb-2">The Ebbinghaus Forgetting Curve</h2>
            <p className="text-3xl font-extrabold text-[#0F172A]">Why learning once is never enough</p>
            <p className="mt-4 text-base text-slate-600">
              Human memory rapidly loses up to 70% of new information within 48 hours if it is not reinforced. Traditional learning platforms only measure what you completed today, ignoring what you will forget tomorrow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Silent Knowledge Decay</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Concepts you scored 90% on last week can drop below passing thresholds within 10 days without targeted spaced repetition.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Inefficient Cramming</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Re-reading entire books before exams or interviews wastes hours. You only need to revise the specific concepts at risk of fading.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">The keepLearning Solution</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our intelligence algorithms monitor your practice gaps and quiz response speeds to predict knowledge decline before it happens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-teal-600 mb-2">Product Philosophy</h2>
            <p className="text-3xl font-extrabold text-[#0F172A]">Learn → Practice → Predict → Revise → Improve</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            {[
              { step: "01", title: "Learn", desc: "Study core concepts with structured interactive modules" },
              { step: "02", title: "Practice", desc: "Test comprehension with adaptive quizzes" },
              { step: "03", title: "Analyze", desc: "System tracks accuracy, speed & practice intervals" },
              { step: "04", title: "Predict", desc: "AI forecasts knowledge decay probability" },
              { step: "05", title: "Revise", desc: "Get prioritized daily revision tasks before memory fades" },
              { step: "06", title: "Improve", desc: "Watch long-term retention reach optimal levels" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-[#0B1F33] text-teal-400 font-extrabold text-xs flex items-center justify-center mb-3">
                  {item.step}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Target Users */}
      <section id="users" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-teal-600 mb-2">Designed For High Performers</h2>
            <p className="text-3xl font-extrabold text-[#0F172A]">Who uses keepLearning?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "College Students", desc: "Master complex subjects like Data Structures, DBMS, and OS without exam-week stress.", icon: BookOpen },
              { title: "Software Developers", desc: "Retain key framework APIs (Spring Boot, React, SQL) for production coding efficiency.", icon: Zap },
              { title: "Certification Learners", desc: "Pass AWS, Java, and Cloud exams by retaining dense technical specs reliably.", icon: Award },
              { title: "Self-Learners", desc: "Turn online video courses into permanent, long-term working knowledge.", icon: Users }
            ].map((u, idx) => {
              const Icon = u.icon;
              return (
                <div key={idx} className="p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#0B1F33] text-teal-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{u.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{u.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#0B1F33] text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Don't wait until you forget.
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
            Start building permanent retention today. Join thousands of engineers and learners using predictive revision.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-[#0B1F33] font-extrabold text-base rounded-xl shadow-lg transition-all"
          >
            Start Learning with keepLearning
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span className="font-extrabold text-lg text-white">keepLearning</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The AI-powered knowledge retention platform predicting memory decay and personalizing revision.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-teal-400">Dashboard</Link></li>
              <li><Link to="/learning" className="hover:text-teal-400">My Learning</Link></li>
              <li><Link to="/predictions" className="hover:text-teal-400">AI Predictions</Link></li>
              <li><Link to="/revision-plan" className="hover:text-teal-400">Revision Plan</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#problem" className="hover:text-teal-400">Ebbinghaus Curve</a></li>
              <li><a href="#how-it-works" className="hover:text-teal-400">Methodology</a></li>
              <li><Link to="/analytics" className="hover:text-teal-400">Analytics Insights</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Account</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-teal-400">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-teal-400">Create Account</Link></li>
              <li><Link to="/onboarding" className="hover:text-teal-400">Onboarding Setup</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-900 text-xs text-center text-slate-400">
          © {new Date().getFullYear()} keepLearning. All rights reserved. Designed for Production & AI EdTech SaaS.
        </div>
      </footer>
    </div>
  );
};
