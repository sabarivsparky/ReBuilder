const ResumePreview = ({ resumeHtml, previewRef }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Document Preview</span>
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
        </div>
      </div>
      
      <div className="p-8 md:p-12 overflow-x-auto bg-gray-50 flex justify-center">
        {/* A4 format simulation */}
        <div 
          ref={previewRef}
          className="bg-white shadow-xl max-w-[21cm] w-full min-h-[29.7cm] p-10 text-gray-800 break-words"
          style={{
            fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
            fontSize: '11pt',
            lineHeight: '1.5'
          }}
        >
          <style>
            {`
              .resume-content h1 { font-size: 24pt; font-weight: bold; margin-bottom: 4px; color: #111827; }
              .resume-content h2 { font-size: 14pt; font-weight: 600; margin-top: 16px; margin-bottom: 8px; border-bottom: 1px solid #d1d5db; padding-bottom: 2px; color: #1f2937; text-transform: uppercase; letter-spacing: 0.05em; }
              .resume-content h3 { font-size: 12pt; font-weight: 600; margin-top: 12px; margin-bottom: 4px; color: #374151; }
              .resume-content p { margin-bottom: 8px; }
              .resume-content ul { list-style-type: disc; padding-left: 20px; margin-bottom: 12px; }
              .resume-content li { margin-bottom: 4px; }
              .resume-content strong { font-weight: 600; }
            `}
          </style>
          <div 
            className="resume-content"
            dangerouslySetInnerHTML={{ __html: resumeHtml }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
