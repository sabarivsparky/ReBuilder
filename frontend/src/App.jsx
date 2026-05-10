import { useState, useRef, useEffect } from 'react';
import ResumeForm from './components/ResumeForm';
import ATSScoreDisplay from './components/ATSScoreDisplay';
import ResumePreview from './components/ResumePreview';
import DownloadButton from './components/DownloadButton';
import { useResumeGeneration } from './hooks/useResumeGeneration';

function App() {
  const { loading, error, result, generateResume } = useResumeGeneration();
  const previewRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
              AI
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">ATS Resume Builder</h1>
          </div>
          <div className="text-sm font-medium text-gray-500 hidden sm:block">
            Optimize for Top 1% Roles
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center shadow-sm">
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className={`transition-all duration-500 ease-in-out ${result ? 'grid grid-cols-1 lg:grid-cols-12 gap-8' : 'max-w-3xl mx-auto'}`}>
          
          {/* Form Column */}
          <div className={`${result ? 'lg:col-span-5' : ''}`}>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's build your resume</h2>
              <p className="text-gray-600">Fill in your details below and our AI will generate an ATS-optimized resume tailored to your target job.</p>
            </div>
            <ResumeForm onSubmit={generateResume} loading={loading} />
          </div>

          {/* Results Column */}
          {result && (
            <div className="lg:col-span-7" ref={resultsRef}>
              <div className="sticky top-24 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Optimized Resume</h2>
                  <p className="text-gray-600 mb-6">Review your ATS score, suggested improvements, and the final document.</p>
                </div>
                
                <ATSScoreDisplay 
                  score={result.atsScore} 
                  missingKeywords={result.missingKeywords} 
                  suggestions={result.suggestions} 
                />
                
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <span className="text-sm text-gray-500 font-medium">Preview automatically updates to best version</span>
                  <DownloadButton previewRef={previewRef} filename={`${result.userInput.fullName.replace(/\s+/g, '_')}_Resume.pdf`} />
                </div>
                
                <ResumePreview resumeHtml={result.resume} previewRef={previewRef} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
          Built with React, Tailwind CSS, & OpenAI
        </div>
      </footer>
    </div>
  );
}

export default App;
