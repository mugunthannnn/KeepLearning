
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  BookOpen,
  ChevronRight,
  Code2,
  Database,
  Binary,
  Server,
  History,
  GraduationCap,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { ProgressBar } from '../components/common/ProgressBar';

export const Learning = () => {
  const navigate = useNavigate();
  const { subjects } = useData();

  const [activeTab, setActiveTab] = useState('explore');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');

  const categories = [
    'All',
    'Languages',
    'Databases',
    'Computer Science',
    'Backend',
  ];

  const getSubjectIcon = (iconName) => {
    switch (iconName) {
      case 'Code2':
        return Code2;
      case 'Database':
        return Database;
      case 'Binary':
        return Binary;
      case 'Server':
        return Server;
      default:
        return BookOpen;
    }
  };

  const filteredSubjects = subjects.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      (sub.description || '').toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || sub.category === selectedCategory;

    const matchesRisk =
      selectedRisk === 'All' || sub.riskLevel === selectedRisk;

    return matchesSearch && matchesCategory && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          My Learning
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore your subjects, continue learning, and review your quiz
          performance.
        </p>
      </div>

      {/* Learning Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'explore'
              ? 'border-teal-500 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Explore Topics
        </button>

        <button
          onClick={() => navigate('/quiz-history')}
          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors"
        >
          <History className="w-4 h-4" />
          Quiz History
        </button>
      </div>

      {/* Catalogue */}
      {activeTab === 'explore' && (
        <>
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0B1F33] text-teal-400 font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Risk Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none"
              >
                <option value="All">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
                <option value="Critical">Critical Risk</option>
              </select>
            </div>
          </div>

          {/* Subject Cards */}
          {filteredSubjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSubjects.map((sub) => {
                const IconComponent = getSubjectIcon(sub.iconName);

                return (
                  <div
                    key={sub.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#0B1F33] text-teal-400 flex items-center justify-center font-bold">
                            <IconComponent className="w-5 h-5" />
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-teal-600 transition-colors">
                              {sub.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {sub.category}
                            </p>
                          </div>
                        </div>

                        <RiskBadge level={sub.riskLevel} />
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-6">
                        {sub.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[11px]">
                            Completed Topics
                          </span>
                          <span className="font-bold text-slate-900">
                            {sub.completedTopics} / {sub.topicCount}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-500 block text-[11px]">
                            Last Studied
                          </span>
                          <span className="font-bold text-slate-900">
                            {sub.lastStudied}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-6">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-600">
                            Knowledge Retention
                          </span>
                          <span className="text-slate-900 font-extrabold">
                            {sub.knowledge}%
                          </span>
                        </div>

                        <ProgressBar
                          value={sub.knowledge}
                          color="auto"
                          height="h-2.5"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/learning/${sub.id}`)}
                      className="w-full py-3 bg-slate-900 hover:bg-[#0B1F33] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Explore Subject Topics</span>
                      <ChevronRight className="w-4 h-4 text-teal-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800">
                No subjects found
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Try changing your search or filters.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                  setSelectedRisk('All');
                }}
                className="mt-4 text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                Clear filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
