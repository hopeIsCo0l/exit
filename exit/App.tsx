import React, { useState, useEffect } from 'react';
import { Department, ExamConfig, ExamSession, Question, SavedExamState, ExamHistoryItem } from './types';
import { DEPARTMENTS, AVAILABLE_EXAMS, CATEGORIES } from './constants';
import { generateExamQuestions } from './services/geminiService';
import { DepartmentCard } from './components/DepartmentCard';
import { ExamView } from './components/ExamView';
import { ResultView } from './components/ResultView';
import { GraduationCap, BookOpen, Clock, BarChart3, Loader2, PlayCircle, History, Trash2, ChevronRight } from 'lucide-react';

// App Stages
type AppStage = 'HOME' | 'CONFIG_EXAM' | 'LOADING' | 'EXAM' | 'RESULTS' | 'HISTORY';

function App() {
  const [stage, setStage] = useState<AppStage>('HOME');
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examSession, setExamSession] = useState<ExamSession | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // State for resume and history
  const [savedExam, setSavedExam] = useState<SavedExamState | null>(null);
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);

  // Load Saved Data on Mount
  useEffect(() => {
    const saved = localStorage.getItem('current_exam_state');
    if (saved) {
      try {
        const parsed: SavedExamState = JSON.parse(saved);
        // Only valid if timestamp is within last 24 hours
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            setSavedExam(parsed);
        } else {
            localStorage.removeItem('current_exam_state');
        }
      } catch (e) {
        localStorage.removeItem('current_exam_state');
      }
    }

    const historyData = localStorage.getItem('exam_history');
    if (historyData) {
        try {
            setHistory(JSON.parse(historyData));
        } catch (e) { console.error(e); }
    }
  }, []);

  const handleDepartmentSelect = (dept: Department) => {
    setSelectedDept(dept);
    setStage('CONFIG_EXAM');
  };

  const startExam = async (year: string, session: string) => {
    if (!selectedDept) return;
    
    // Clear any previous incomplete save if starting fresh
    localStorage.removeItem('current_exam_state');
    setSavedExam(null);

    const config = { department: selectedDept.name, year, session };
    setExamConfig(config);
    setStage('LOADING');
    
    try {
      const q = await generateExamQuestions(config);
      setQuestions(q);
      setStage('EXAM');
    } catch (error) {
      console.error("Error starting exam", error);
      setStage('HOME'); 
    }
  };

  const resumeExam = () => {
      if (savedExam) {
          setExamConfig(savedExam.config);
          setQuestions(savedExam.questions);
          setSelectedDept(DEPARTMENTS.find(d => d.name === savedExam.config.department) || null);
          setStage('EXAM');
      }
  };

  const discardSavedExam = () => {
      localStorage.removeItem('current_exam_state');
      setSavedExam(null);
  };

  const handleExamComplete = (session: ExamSession) => {
    setExamSession(session);
    setStage('RESULTS');

    // Save to history
    const historyItem: ExamHistoryItem = {
        id: Date.now().toString(),
        departmentName: selectedDept?.name || "Unknown",
        score: session.score,
        date: new Date().toISOString(),
        timeSpent: session.timeSpent,
        totalQuestions: session.questions.length
    };
    
    const newHistory = [historyItem, ...history];
    setHistory(newHistory);
    localStorage.setItem('exam_history', JSON.stringify(newHistory));
  };

  const resetApp = () => {
    setStage('HOME');
    setSelectedDept(null);
    setExamConfig(null);
    setQuestions([]);
    setExamSession(null);
    
    // Refresh saved state check
    const saved = localStorage.getItem('current_exam_state');
    if (saved) setSavedExam(JSON.parse(saved));
    else setSavedExam(null);
  };

  const clearHistory = () => {
      if(confirm('Are you sure you want to clear your exam history?')) {
          localStorage.removeItem('exam_history');
          setHistory([]);
      }
  };

  // ---------------- Render Helpers ---------------- //

  if (stage === 'LOADING') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <h2 className="text-xl font-semibold">Generating your Exam Paper...</h2>
        <p className="text-slate-500 mt-2">Consulting past records for {selectedDept?.name} ({examConfig?.year})</p>
      </div>
    );
  }

  if (stage === 'EXAM' && selectedDept && examConfig) {
    return (
      <ExamView 
        questions={questions} 
        departmentName={selectedDept.name}
        config={examConfig}
        initialState={savedExam ? savedExam : undefined}
        onComplete={handleExamComplete}
        onExit={resetApp}
      />
    );
  }

  if (stage === 'RESULTS' && examSession && selectedDept) {
    return (
      <ResultView 
        session={examSession} 
        departmentName={selectedDept.name}
        onRetake={resetApp}
        onHome={resetApp}
      />
    );
  }

  if (stage === 'HISTORY') {
      return (
          <div className="min-h-screen bg-slate-50 p-6">
              <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setStage('HOME')} className="p-2 hover:bg-white rounded-full transition-colors"><ChevronRight className="rotate-180"/></button>
                        <h1 className="text-2xl font-bold text-slate-900">Exam History</h1>
                      </div>
                      {history.length > 0 && (
                          <button onClick={clearHistory} className="text-red-500 text-sm hover:underline flex items-center gap-1">
                              <Trash2 size={14}/> Clear History
                          </button>
                      )}
                  </div>

                  {history.length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                          <History size={48} className="mx-auto text-slate-300 mb-4" />
                          <p className="text-slate-500">No exams taken yet.</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          {history.map(item => (
                              <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                                  <div>
                                      <h3 className="font-bold text-slate-800">{item.departmentName}</h3>
                                      <p className="text-sm text-slate-500">{new Date(item.date).toLocaleDateString()} • {Math.round(item.timeSpent / 60)} mins</p>
                                  </div>
                                  <div className="flex flex-col items-end">
                                      <span className={`text-xl font-bold ${item.score >= 50 ? 'text-emerald-600' : 'text-red-500'}`}>
                                          {Math.round(item.score)}%
                                      </span>
                                      <span className="text-xs text-slate-400">Score</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      )
  }

  if (stage === 'CONFIG_EXAM' && selectedDept) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 p-6 text-white text-center relative">
             <button onClick={() => setStage('HOME')} className="absolute left-4 top-6 p-1 hover:bg-white/10 rounded"><ChevronRight className="rotate-180 w-5 h-5"/></button>
            <span className="text-4xl mb-2 block">{selectedDept.icon}</span>
            <h2 className="text-2xl font-bold">{selectedDept.name}</h2>
            <p className="text-indigo-100 opacity-90">Exit Exam Configuration</p>
          </div>
          
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Select Exam Session</label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {AVAILABLE_EXAMS.map((exam, idx) => (
                   <button
                   key={idx}
                   onClick={() => setExamConfig({ department: selectedDept.name, year: exam.year, session: exam.session })}
                   className={`w-full py-3 px-4 text-left rounded-lg text-sm font-medium transition-all border flex justify-between items-center group ${examConfig?.year === exam.year && examConfig?.session === exam.session ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'}`}
                 >
                   <span>{exam.year} - {exam.session}</span>
                   {examConfig?.year === exam.year && examConfig?.session === exam.session && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                 </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => examConfig && startExam(examConfig.year, examConfig.session)}
              disabled={!examConfig}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-lg shadow-slate-200"
            >
              Start Exam
            </button>
            
          </div>
        </div>
      </div>
    );
  }

  // Home Stage
  const filteredDepts = selectedCategory === 'All' 
    ? DEPARTMENTS 
    : DEPARTMENTS.filter(d => d.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setStage('HOME')}>
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-slate-900 tracking-tight">Ethio<span className="text-indigo-600">ExitPrep</span></span>
            </div>
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => setStage('HISTORY')}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
                    title="Exam History"
                >
                    <History size={20} />
                    {history.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>}
                </button>
               <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">ET</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-12 px-4 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-10 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Master Your Exit Exam</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Access simulated past papers from the last 2.5 years (5 Sessions). Practice with timed conditions, save your progress, and analyze your growth.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-6">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <BookOpen size={16} className="text-yellow-400" /> <span className="text-sm">Official Curriculum</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Clock size={16} className="text-cyan-400" /> <span className="text-sm">Real-time Simulation</span>
            </div>
             <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <BarChart3 size={16} className="text-emerald-400" /> <span className="text-sm">Performance History</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Resume Banner */}
        {savedExam && (
            <div className="mb-10 bg-white rounded-2xl p-6 border border-indigo-100 shadow-lg shadow-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                        <PlayCircle size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Continue {savedExam.config.department} Exam</h3>
                        <p className="text-slate-500 text-sm">
                            {savedExam.config.year} • {savedExam.config.session} • {Object.keys(savedExam.userAnswers).length} questions answered
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        onClick={discardSavedExam}
                        className="flex-1 md:flex-none px-4 py-2 text-slate-500 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        Discard
                    </button>
                    <button 
                        onClick={resumeExam}
                        className="flex-1 md:flex-none px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        Resume Exam
                    </button>
                </div>
            </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Select Department</h2>
            <p className="text-slate-500 text-sm mt-1">Choose your field to begin a new practice session</p>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${selectedCategory === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDepts.map(dept => (
            <DepartmentCard 
              key={dept.id} 
              department={dept} 
              onSelect={handleDepartmentSelect} 
            />
          ))}
        </div>

        {filteredDepts.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No departments found in this category.
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} EthioExitPrep. Designed for Ethiopian University Students.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;