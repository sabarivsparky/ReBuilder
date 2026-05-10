import html2pdf from 'html2pdf.js';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

const DownloadButton = ({ previewRef, filename = "resume.pdf" }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!previewRef.current) return;
    
    setIsDownloading(true);
    
    const element = previewRef.current;
    const opt = {
      margin:       0,
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setIsDownloading(false);
    });
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all ${
        isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900 hover:shadow-lg'
      }`}
    >
      {isDownloading ? (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      ) : (
        <Download className="w-5 h-5 mr-2" />
      )}
      {isDownloading ? 'Generating PDF...' : 'Download PDF'}
    </button>
  );
};

export default DownloadButton;
