import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Question, ExamSession, SavedExamState, ExamConfig } from '../types';
import { Clock, Flag, ArrowLeft, ArrowRight, Menu, X, Save, AlertTriangle } from 'lucide-react';

interface Props {
  questions: Question[];
  departmentName: string;
  config: ExamConfig;
  initialState?: SavedExamState;
  onComplete: (session: ExamSession) => void;
  onExit: () => void;
}

export const ExamView: React.FC<Props> = ({ questions, departmentName, config, initialState, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(initialState?.currentIndex || 0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>(initialState?.userAnswers || {});
  const [timeLeft, setTimeLeft] = useState(initialState?.timeLeft || questions.length * 90);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set(initialState?.flaggedQuestions || []));
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  // Timer Ref to prevent stale closures
  const timerRef = useRef<NodeJS.Timeout>(null);

  // Auto-save logic
  useEffect(() => {
    const saveState = () => {
      const stateToSave: SavedExamState = {
        config,
        questions,
        userAnswers,
        timeLeft,
        currentIndex,
        flaggedQuestions: Array.from(flaggedQuestions),
        timestamp: Date.now()
      };
      localStorage.setItem('current_exam_state', JSON.stringify(stateToSave));
    };

    // Save every 2 seconds or when critical state changes
    const saveTimeout = setTimeout(saveState, 2000);
    return () => clearTimeout(saveTimeout);
  }, [userAnswers, timeLeft, currentIndex, flaggedQuestions, config, questions]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionSelect = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questions[currentIndex].id]: optionIndex,
    }));
  };

  const toggleFlag = () => {
    const newFlags = new Set(flaggedQuestions);
    if (newFlags.has(currentIndex)) {
      newFlags.delete(currentIndex);
    } else {
      newFlags.add(currentIndex);
    }
    setFlaggedQuestions(newFlags);
  };

  const handleSubmit = useCallback(() => {
    let scoreCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctOptionIndex) {
        scoreCount++;
      }
    });

    const session: ExamSession = {
      questions,
      userAnswers,
      isSubmitted: true,
      score: (scoreCount / questions.length) * 100,
      timeSpent: (questions.length * 90) - timeLeft,
      timestamp: Date.now(),
    };
    
    // Clear saved state on submission
    localStorage.removeItem('current_exam_state');
    onComplete(session);
  }, [questions, userAnswers, timeLeft, onComplete]);

  const handleSafeExit = () => {
    // We intentionally don't clear local storage here so they can resume
    onExit();
  };

  const handleClearAndExit = () => {
    localStorage.removeItem('current_exam_state');
    onExit();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((Object.keys(userAnswers).length) / questions.length) * 100;

  // Navigator Component
  const NavigatorGrid = () => (
    <div className="grid grid-cols-5 gap-2">
      {questions.map((q, idx) => {
        const isAnswered = userAnswers[q.id] !== undefined;
        const isFlagged = flaggedQuestions.has(idx);
        const isCurrent = idx === currentIndex;
        
        let baseClasses = "h-9 w-full rounded-md flex items-center justify-center text-xs font-medium border transition-all relative ";
        if (isCurrent) baseClasses += "border-indigo-600 ring-2 ring-indigo-100 text-indigo-700 bg-indigo-50 ";
        else if (isFlagged) baseClasses += "border-yellow-400 bg-yellow-50 text-yellow-700 ";
        else if (isAnswered) baseClasses += "bg-emerald-50 border-emerald-200 text-emerald-700 ";
        else baseClasses += "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 ";

        return (
          <button
            key={q.id}
            onClick={() => {
              setCurrentIndex(idx);
              setIsNavOpen(false);
            }}
            className={baseClasses}
          >
            {idx + 1}
            {isFlagged && <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm px-4 md:px-6 py-3 flex justify-between items-center z-20 sticky top-0">
        <div className="flex items-center gap-3">
            <button 
                onClick={() => setShowExitConfirm(true)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                title="Save & Exit"
            >
                <ArrowLeft size={20} />
            </button>
            <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">{departmentName}</h2>
            <p className="text-xs text-slate-500 hidden md:block">
                {config.year} • {config.session} • Q{currentIndex + 1}/{questions.length}
            </p>
            </div>
        </div>
        
        <div className="flex items-center space-x-3 md:space-x-6">
          <div className="flex items-center space-x-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg font-mono font-medium text-sm md:text-base">
            <Clock size={18} />
            <span className={timeLeft < 300 ? 'text-red-600 animate-pulse' : ''}>{formatTime(timeLeft)}</span>
          </div>
          
          <button 
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {isNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <button
            onClick={handleSubmit}
            className="hidden lg:block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5">
        <div 
          className="bg-indigo-600 h-1.5 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Navigation Drawer */}
        {isNavOpen && (
            <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm lg:hidden flex flex-col p-4 animate-in fade-in slide-in-from-bottom-10 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800">Question Navigator</h3>
                    <button onClick={() => setIsNavOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto pb-20">
                    <NavigatorGrid />
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                     <button
                        onClick={handleSubmit}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg"
                    >
                        Submit Exam
                    </button>
                </div>
            </div>
        )}

        {/* Sidebar Navigation (Desktop) */}
        <div className="hidden lg:block w-80 bg-white border-r border-slate-200 overflow-y-auto p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Navigator</h3>
             <div className="flex gap-2 text-[10px] text-slate-400">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Done</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400"></div>Flag</div>
             </div>
          </div>
          <NavigatorGrid />
          <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
             <h4 className="text-indigo-900 font-semibold text-sm mb-1 flex items-center gap-2">
                <Save size={14} /> Auto-save Active
             </h4>
             <p className="text-indigo-700 text-xs">
                 Your progress is saved automatically. You can close the browser and resume later.
             </p>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
          <div className="max-w-3xl mx-auto pb-20">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
              
              <div className="flex justify-between items-start mb-6 pl-2">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full uppercase tracking-wide">
                  {questions[currentIndex].topic || "General"}
                </span>
                <button 
                  onClick={toggleFlag}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors px-3 py-1.5 rounded-full ${flaggedQuestions.has(currentIndex) ? 'bg-yellow-100 text-yellow-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                >
                  <Flag size={16} className={flaggedQuestions.has(currentIndex) ? 'fill-yellow-500 text-yellow-500' : ''} />
                  <span>{flaggedQuestions.has(currentIndex) ? 'Flagged' : 'Flag'}</span>
                </button>
              </div>

              <h1 className="text-lg md:text-2xl font-medium text-slate-900 mb-8 leading-relaxed">
                <span className="text-slate-300 font-bold text-3xl float-left mr-3 -mt-1">{currentIndex + 1}</span>
                {questions[currentIndex].text}
              </h1>

              <div className="space-y-3 pl-2">
                {questions[currentIndex].options.map((option, idx) => {
                  const isSelected = userAnswers[questions[currentIndex].id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center group
                        ${isSelected 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' 
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-white text-slate-700'}`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition-colors
                        ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <span className="text-base">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center px-5 py-3 rounded-xl text-slate-600 font-medium disabled:opacity-30 disabled:hover:bg-transparent hover:bg-white hover:shadow-sm transition-all"
              >
                <ArrowLeft size={18} className="mr-2" /> Previous
              </button>
              
              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="lg:hidden flex items-center px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                >
                   Submit Exam
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="flex items-center px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all"
                >
                  Next <ArrowRight size={18} className="ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <div className="flex items-center gap-3 text-amber-500 mb-4">
                    <AlertTriangle size={32} />
                    <h3 className="text-lg font-bold text-slate-900">Pause Exam?</h3>
                </div>
                <p className="text-slate-600 mb-6">
                    Your progress is saved. You can resume this exam later from the home screen.
                </p>
                <div className="space-y-3">
                    <button 
                        onClick={handleSafeExit}
                        className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                    >
                        Save & Exit
                    </button>
                    <button 
                        onClick={handleClearAndExit}
                        className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50"
                    >
                        Discard & Exit
                    </button>
                    <button 
                        onClick={() => setShowExitConfirm(false)}
                        className="w-full py-2.5 text-slate-400 font-medium hover:text-slate-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};