import React, { useState, useEffect } from 'react';
import { ExamSession } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, RefreshCw, Home, BookOpen, Clock, Activity } from 'lucide-react';
import { getPersonalizedStudyTip } from '../services/geminiService';

interface Props {
  session: ExamSession;
  departmentName: string;
  onRetake: () => void;
  onHome: () => void;
}

export const ResultView: React.FC<Props> = ({ session, departmentName, onRetake, onHome }) => {
  const [expandedExplanation, setExpandedExplanation] = useState<number | null>(null);
  const [studyTip, setStudyTip] = useState<string>("Analyzing your performance...");

  useEffect(() => {
    getPersonalizedStudyTip(session.score, departmentName).then(setStudyTip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const correctCount = session.questions.filter(q => session.userAnswers[q.id] === q.correctOptionIndex).length;
  const incorrectCount = session.questions.length - correctCount;
  const unansweredCount = session.questions.length - Object.keys(session.userAnswers).length;

  // Time Metrics
  const avgTimePerQuestion = session.questions.length > 0 ? Math.round(session.timeSpent / session.questions.length) : 0;

  // Pie Chart Data
  const chartData = [
    { name: 'Correct', value: correctCount, color: '#10b981' }, // emerald-500
    { name: 'Incorrect', value: incorrectCount, color: '#ef4444' }, // red-500
    { name: 'Unanswered', value: unansweredCount, color: '#94a3b8' }, // slate-400
  ].filter(d => d.value > 0);

  const getTopicBreakdown = () => {
    const breakdown: Record<string, { total: number; correct: number }> = {};
    session.questions.forEach(q => {
      const topic = q.topic || 'General';
      if (!breakdown[topic]) breakdown[topic] = { total: 0, correct: 0 };
      breakdown[topic].total++;
      if (session.userAnswers[q.id] === q.correctOptionIndex) breakdown[topic].correct++;
    });
    return Object.entries(breakdown).map(([topic, stats]) => ({
      topic,
      percentage: Math.round((stats.correct / stats.total) * 100),
      total: stats.total
    })).sort((a, b) => b.percentage - a.percentage);
  };

  const topicData = getTopicBreakdown().slice(0, 5); // Top 5 topics for chart

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Result Analysis</h1>
          <p className="text-slate-500 mb-6">{departmentName} • {new Date(session.timestamp).toLocaleDateString()}</p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            <div className="relative">
              {/* Increased size for better visibility */}
              <div className="w-56 h-56"> 
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-4xl font-bold text-slate-800">{Math.round(session.score)}%</span>
                <span className="text-sm text-slate-400 font-medium uppercase mt-1">Score</span>
              </div>
            </div>

            <div className="text-left space-y-4 max-w-md w-full">
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-bold text-emerald-600">{correctCount}</div>
                        <div className="text-xs text-emerald-800 font-medium uppercase tracking-wide">Correct</div>
                    </div>
                    <CheckCircle className="text-emerald-200" size={32} />
                 </div>
                 <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-bold text-indigo-600">{avgTimePerQuestion}s</div>
                        <div className="text-xs text-indigo-800 font-medium uppercase tracking-wide">Avg Time/Q</div>
                    </div>
                    <Clock className="text-indigo-200" size={32} />
                 </div>
              </div>
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-md">
                 <h3 className="text-sm font-semibold text-slate-200 mb-1 flex items-center">
                   <BookOpen size={16} className="mr-2 text-indigo-400" /> AI Insights
                 </h3>
                 <p className="text-slate-300 text-sm italic leading-relaxed">"{studyTip}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={onHome}
            className="flex items-center px-6 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Home size={18} className="mr-2" /> Return Home
          </button>
          <button 
            onClick={onRetake}
            className="flex items-center px-6 py-3 bg-indigo-600 rounded-xl text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
          >
            <RefreshCw size={18} className="mr-2" /> Take Another Exam
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Topic Analysis */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Activity size={20} className="text-indigo-600" /> Topic Performance
              </h3>
              
              {/* Mini Bar Chart for top 3 topics */}
              {topicData.length > 0 && (
                <div className="h-32 mb-6">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topicData}>
                         <XAxis dataKey="topic" hide />
                         <Tooltip 
                              cursor={{fill: '#f1f5f9'}}
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                         />
                         <Bar dataKey="percentage" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
              )}

              <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {getTopicBreakdown().map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-600 font-medium truncate max-w-[150px]" title={item.topic}>{item.topic}</span>
                      <span className={`${item.percentage < 50 ? 'text-red-500' : 'text-emerald-600'} font-bold`}>{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.percentage < 50 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 text-right">{item.total} Questions</div>
                  </div>
                ))}
                {getTopicBreakdown().length === 0 && <p className="text-slate-400 text-sm">No topic data available.</p>}
              </div>
            </div>

            {/* Detailed Review */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Detailed Review</h3>
              {session.questions.map((question, idx) => {
                const userChoice = session.userAnswers[question.id];
                const isCorrect = userChoice === question.correctOptionIndex;
                const isExpanded = expandedExplanation === idx;
                const isSkipped = userChoice === undefined;

                return (
                  <div key={question.id} className={`bg-white rounded-xl shadow-sm border ${isCorrect ? 'border-emerald-100' : isSkipped ? 'border-slate-200' : 'border-red-100'} overflow-hidden`}>
                    <div 
                      className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => setExpandedExplanation(isExpanded ? null : idx)}
                    >
                      <div className="flex items-start gap-3">
                         <div className={`mt-0.5 flex-shrink-0 ${isCorrect ? 'text-emerald-500' : isSkipped ? 'text-slate-400' : 'text-red-500'}`}>
                           {isCorrect ? <CheckCircle size={20} /> : isSkipped ? <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold">?</div> : <XCircle size={20} />}
                         </div>
                         <div className="flex-1">
                            <h4 className="text-slate-900 font-medium text-base mb-2">
                              <span className="text-slate-400 mr-2">Q{idx + 1}.</span>
                              {question.text}
                            </h4>
                            <div className="flex items-center text-sm text-slate-500 mt-2">
                              {isExpanded ? 
                                <span className="text-indigo-600 font-medium flex items-center">Hide Explanation <ChevronUp size={16} className="ml-1"/></span> : 
                                <span className="text-slate-400 flex items-center">Show Answer & Explanation <ChevronDown size={16} className="ml-1"/></span>
                              }
                            </div>
                         </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="bg-slate-50 border-t border-slate-100 p-5 animate-in slide-in-from-top-2">
                        <div className="grid gap-2 mb-4">
                          {question.options.map((opt, optIdx) => {
                            let optionClass = "p-3 rounded-lg border text-sm flex justify-between items-center ";
                            const isThisOptCorrect = optIdx === question.correctOptionIndex;
                            const isThisOptSelected = optIdx === userChoice;
                            
                            if (isThisOptCorrect) optionClass += "bg-emerald-100 border-emerald-200 text-emerald-900 font-medium";
                            else if (isThisOptSelected && !isCorrect) optionClass += "bg-red-50 border-red-200 text-red-900";
                            else optionClass += "bg-white border-slate-200 text-slate-500";
                            
                            return (
                              <div key={optIdx} className={optionClass}>
                                <span><span className="font-mono mr-2 opacity-50">{String.fromCharCode(65 + optIdx)}</span> {opt}</span>
                                {isThisOptCorrect && <CheckCircle size={16} className="text-emerald-600" />}
                                {isThisOptSelected && !isThisOptCorrect && <XCircle size={16} className="text-red-500" />}
                              </div>
                            )
                          })}
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                          <h5 className="text-indigo-900 font-semibold text-sm mb-1 flex items-center">
                             Explanation
                          </h5>
                          <p className="text-indigo-800 text-sm leading-relaxed">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
        </div>
      </div>
    </div>
  );
};