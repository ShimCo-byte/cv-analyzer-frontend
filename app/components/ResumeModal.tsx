'use client';

import { useState, useRef } from 'react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: string;
  jobTitle: string;
  jobCompany: string;
  loading?: boolean;
}

export default function ResumeModal({ isOpen, onClose, resume, jobTitle, jobCompany, loading = false }: ResumeModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'text'>('preview');
  const resumeRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownloadPDF = async () => {
    // Dynamic import to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;

    if (resumeRef.current) {
      const opt = {
        margin: [10, 15, 10, 15],
        filename: `Resume_${jobCompany.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(resumeRef.current).save();
    }
  };

  // Parse resume text into structured sections
  const parseResume = (text: string) => {
    const lines = text.split('\n');
    const sections: { type: 'name' | 'contact' | 'heading' | 'subheading' | 'bullet' | 'text' | 'empty'; content: string }[] = [];

    let isFirstLine = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        sections.push({ type: 'empty', content: '' });
        continue;
      }

      // First non-empty line is the name
      if (isFirstLine) {
        sections.push({ type: 'name', content: line });
        isFirstLine = false;
        continue;
      }

      // Contact info (email, phone, links, location)
      if (line.includes('@') || line.includes('linkedin.com') || line.includes('github.com') ||
          line.match(/^\+?\d[\d\s\-()]+$/) || line.includes(' | ') ||
          line.startsWith('Email:') || line.startsWith('Phone:') || line.startsWith('Location:') ||
          line.startsWith('LinkedIn:') || line.startsWith('GitHub:') || line.startsWith('Portfolio:') ||
          line.startsWith('Work Preference:') || line.startsWith('Preferencia:') ||
          line.startsWith('Telefón:') || line.startsWith('Lokalita:')) {
        sections.push({ type: 'contact', content: line });
        continue;
      }

      // Section headings (ALL CAPS or ends with :)
      if ((line === line.toUpperCase() && line.length > 2 && !line.startsWith('•') && !line.startsWith('-')) ||
          (line.endsWith(':') && line.length < 30)) {
        sections.push({ type: 'heading', content: line.replace(/:$/, '') });
        continue;
      }

      // Subheadings (job titles, company names - usually followed by dates)
      if (line.match(/\d{4}/) && (line.includes(' - ') || line.includes(' – ') || line.includes('Present'))) {
        sections.push({ type: 'subheading', content: line });
        continue;
      }

      // Bullet points
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./)) {
        const content = line.replace(/^[•\-*]\s*/, '').replace(/^\d+\.\s*/, '');
        sections.push({ type: 'bullet', content });
        continue;
      }

      // Regular text
      sections.push({ type: 'text', content: line });
    }

    return sections;
  };

  const renderFormattedResume = () => {
    const sections = parseResume(resume);

    return (
      <div ref={resumeRef} className="bg-white p-8 max-w-[210mm] mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
        {sections.map((section, idx) => {
          switch (section.type) {
            case 'name':
              return (
                <h1 key={idx} className="text-2xl font-bold text-gray-900 text-center mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                  {section.content}
                </h1>
              );
            case 'contact':
              return (
                <div key={idx} className="flex items-start gap-2 my-0.5">
                  <span className="text-gray-600">•</span>
                  <p className="text-sm text-gray-600">{section.content}</p>
                </div>
              );
            case 'heading':
              return (
                <h2 key={idx} className="text-sm font-bold text-gray-900 uppercase tracking-wider mt-5 mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                  {section.content}
                </h2>
              );
            case 'subheading':
              return (
                <p key={idx} className="font-semibold text-gray-800 mt-3 mb-1">
                  {section.content}
                </p>
              );
            case 'bullet':
              return (
                <div key={idx} className="flex items-start gap-2 ml-4 my-1">
                  <span className="text-gray-600 mt-1">•</span>
                  <p className="text-sm text-gray-700 leading-relaxed flex-1">{section.content}</p>
                </div>
              );
            case 'text':
              return (
                <p key={idx} className="text-sm text-gray-700 leading-relaxed my-1">
                  {section.content}
                </p>
              );
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
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {loading ? 'Generating Resume...' : 'Your Resume'}
              </h2>
              {loading && (
                <p className="text-gray-600 mt-1">
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating resume...
                  </span>
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Tab Switcher */}
          {!loading && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                PDF Preview
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'text'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Plain Text
              </button>
            </div>
          )}
        </div>

        {/* Resume Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 text-lg">Analyzing job requirements...</p>
              <p className="text-gray-500 text-sm mt-2">Highlighting your relevant skills and experience</p>
            </div>
          ) : activeTab === 'preview' ? (
            <div className="shadow-lg rounded-lg overflow-hidden">
              {renderFormattedResume()}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
                {resume}
              </pre>
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {loading ? 'Please wait...' : activeTab === 'preview' ? 'Download as PDF or switch to plain text to copy' : 'Copy and paste into job application'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              {!loading && activeTab === 'preview' && (
                <button
                  onClick={handleDownloadPDF}
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
              )}
              {!loading && activeTab === 'text' && (
                <button
                  onClick={handleCopy}
                  className={`px-6 py-2 font-medium rounded-lg transition-all ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Text
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
