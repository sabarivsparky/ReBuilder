import { CheckCircle, AlertTriangle, XCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const ATSScoreDisplay = ({ score, missingKeywords, suggestions }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getScoreColor = () => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = () => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const Icon = score >= 90 ? CheckCircle : score >= 70 ? AlertTriangle : XCircle;

  return (
    <div className={`p-6 rounded-xl border ${getScoreBg()} mb-8 transition-all`}>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3"
              />
              <path
                className={`${getScoreColor().replace('text-', 'stroke-')}`}
                strokeDasharray={`${score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-xl font-bold font-mono text-gray-800">{score}</div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              ATS Match Score <Icon className={`ml-2 w-5 h-5 ${getScoreColor()}`} />
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {score >= 90 ? 'Excellent! Highly optimized.' : score >= 70 ? 'Good, but has room for improvement.' : 'Needs significant optimization.'}
            </p>
          </div>
        </div>
      </div>

      {(missingKeywords?.length > 0 || suggestions?.length > 0) && (
        <div className="mt-6 border-t border-gray-200/50 pt-4">
          <button 
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 w-full justify-between"
          >
            <span>View Analysis Details</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showSuggestions ? 'rotate-180' : ''}`} />
          </button>
          
          {showSuggestions && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              {missingKeywords?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Missing Target Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {missingKeywords.map((kw, i) => (
                      <span key={i} className="px-2 py-1 bg-white rounded border border-gray-200 text-xs text-gray-600 shadow-sm">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
              {suggestions?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Improvement Suggestions</h4>
                  <ul className="space-y-2">
                    {suggestions.map((sugg, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-2 flex-shrink-0"></span>
                        {sugg}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ATSScoreDisplay;
