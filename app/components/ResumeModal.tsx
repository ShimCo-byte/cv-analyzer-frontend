'use client';

import { useState, useRef } from 'react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: string;
  jobTitle: string;
  jobCompany: string;
  loading?: boolean;
  onGenerate?: () => void;
}

export default function ResumeModal({ isOpen, onClose, resume, jobTitle, jobCompany, loading = false, onGenerate }: ResumeModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'text'>('preview');
  const resumeRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    if (resumeRef.current) {
      html2pdf().set({
        margin: [10, 15, 10, 15] as [number, number, number, number],
        filename: `Resume_${jobCompany.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      }).from(resumeRef.current).save();
    }
  };

  // Simple resume parser
  const parseResume = (text: string) => {
    const lines = text.split('\n');
    const sections: { type: 'name' | 'contact' | 'heading' | 'bullet' | 'text' | 'empty'; content: string }[] = [];
    let isFirstLine = true;

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed) {
        sections.push({ type: 'empty', content: '' });
        continue;
      }

      if (isFirstLine) {
        sections.push({ type: 'name', content: trimmed });
        isFirstLine = false;
        continue;
      }

      // Contact info
      if (trimmed.includes('@') || trimmed.includes('linkedin') || trimmed.includes(' | ') ||
          trimmed.startsWith('Email:') || trimmed.startsWith('Phone:') || trimmed.startsWith('Location:')) {
        sections.push({ type: 'contact', content: trimmed });
        continue;
      }

      // Headings (ALL CAPS)
      if (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && !trimmed.startsWith('•')) {
        sections.push({ type: 'heading', content: trimmed.replace(/:$/, '') });
        continue;
      }

      // Bullets
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
        sections.push({ type: 'bullet', content: trimmed.replace(/^[•\-*]\s*/, '') });
        continue;
      }

      sections.push({ type: 'text', content: trimmed });
    }

    return sections;
  };

  const renderResume = () => {
    const sections = parseResume(resume);

    return (
      <div ref={resumeRef} className="bg-white p-8 max-w-[210mm] mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
        {sections.map((section, idx) => {
          switch (section.type) {
            case 'name':
              return <h1 key={idx} className="text-2xl font-bold text-gray-900 text-center mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>{section.content}</h1>;
            case 'contact':
              return <p key={idx} className="text-sm text-gray-600 text-center">{section.content}</p>;
            case 'heading':
              return <h2 key={idx} className="text-sm font-bold text-gray-900 uppercase tracking-wider mt-5 mb-2 border-b border-gray-300 pb-1" style={{ fontFamily: 'Arial, sans-serif' }}>{section.content}</h2>;
            case 'bullet':
              return <div key={idx} className="flex gap-2 ml-4 my-1"><span className="text-gray-600">•</span><p className="text-sm text-gray-700 flex-1">{section.content}</p></div>;
            case 'text':
              return <p key={idx} className="text-sm text-gray-700 my-1">{section.content}</p>;
            case 'empty':
              return <div key={idx} className="h-2" />;
            default:
              return null;
          }
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Generating Resume...' : 'Your Resume'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          {!loading && resume && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${activeTab === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                PDF Preview
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${activeTab === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Plain Text
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Generating your personalized resume...</p>
            </div>
          ) : !resume && onGenerate ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Tailored CV</h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                Click below to generate a personalized CV tailored specifically for the <strong>{jobTitle}</strong> position at <strong>{jobCompany}</strong>.
              </p>
              <button
                onClick={onGenerate}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate CV Now
              </button>
            </div>
          ) : activeTab === 'preview' ? (
            <div className="shadow-lg rounded-lg overflow-hidden">{renderResume()}</div>
          ) : (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">{resume}</pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {loading ? 'Please wait...' : !resume ? 'Generate a CV tailored for this job' : activeTab === 'preview' ? 'Download as PDF' : 'Copy and paste into application'}
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">
                Close
              </button>
              {!loading && resume && activeTab === 'preview' && (
                <button onClick={handleDownloadPDF} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
              )}
              {!loading && resume && activeTab === 'text' && (
                <button onClick={handleCopy} className={`px-6 py-2 rounded-lg ${copied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
