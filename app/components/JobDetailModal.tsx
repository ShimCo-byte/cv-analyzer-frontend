'use client';

import { useEffect } from 'react';

// Simple markdown parser for job descriptions
function parseJobDescription(text: string) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ## Heading
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={key++} className="text-lg font-semibold text-gray-900 mt-6 mb-3 first:mt-0">
          {line.substring(3)}
        </h3>
      );
    }
    // **Bold text:** value
    else if (line.startsWith('**') && line.includes(':**')) {
      const match = line.match(/^\*\*(.+?):\*\*\s*(.*)$/);
      if (match) {
        elements.push(
          <p key={key++} className="text-gray-700 mb-1">
            <strong className="font-semibold text-gray-900">{match[1]}:</strong> {match[2]}
          </p>
        );
      } else {
        elements.push(<p key={key++} className="text-gray-700">{line}</p>);
      }
    }
    // • Bullet point
    else if (line.startsWith('• ')) {
      elements.push(
        <li key={key++} className="flex items-start gap-2 text-gray-700 ml-4">
          <span className="text-blue-500 mt-1">•</span>
          <span>{line.substring(2)}</span>
        </li>
      );
    }
    // Empty line
    else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />);
    }
    // Regular text
    else {
      elements.push(<p key={key++} className="text-gray-700">{line}</p>);
    }
  }

  return <div className="space-y-1">{elements}</div>;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  source: string;
  postedDate: string;
  description: string;
  fullDescription?: string;
  type: string;
  experienceLevel: string;
  salary?: string;
  requirements?: string[];
  skills?: string[];
  matchScore?: number;
  matchReasons?: string[];
}

interface JobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  onGetResume?: () => void;
  hasProfile?: boolean;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export default function JobDetailModal({ isOpen, onClose, job, onGetResume, hasProfile, isSaved, onToggleSave }: JobDetailModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return new Date(dateString).toLocaleDateString();
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Frontend': 'bg-blue-100 text-blue-800',
      'Backend': 'bg-green-100 text-green-800',
      'Full Stack': 'bg-purple-100 text-purple-800',
      'DevOps': 'bg-orange-100 text-orange-800',
      'Data': 'bg-pink-100 text-pink-800',
      'Mobile': 'bg-indigo-100 text-indigo-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-8">
                {job.matchScore !== undefined && (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border mb-2 ${getMatchScoreColor(job.matchScore)}`}>
                    {job.matchScore}% Match
                  </span>
                )}
                <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                <div className="flex items-center gap-3 mt-2 text-gray-600">
                  <span className="font-semibold">{job.company}</span>
                  <span className="text-gray-300">|</span>
                  <span>{job.location}</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(job.type)}`}>{job.type}</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">{job.experienceLevel}</span>
              {job.salary && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200">{job.salary}</span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 overflow-y-auto max-h-[calc(85vh-200px)]">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 uppercase">Posted</p>
                <p className="font-semibold text-gray-900">{formatDate(job.postedDate)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 uppercase">Source</p>
                <p className="font-semibold text-gray-900">{job.source}</p>
              </div>
            </div>

            {/* Match Reasons */}
            {job.matchReasons && job.matchReasons.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Why this job matches you</h3>
                <ul className="space-y-1">
                  {job.matchReasons.map((reason, idx) => (
                    <li key={idx} className="text-blue-800 text-sm">• {reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              {job.fullDescription ? (
                parseJobDescription(job.fullDescription)
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Role</h3>
                  <div className="text-gray-700 whitespace-pre-line">{job.description}</div>
                </>
              )}
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-500">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              {onToggleSave && (
                <button
                  onClick={onToggleSave}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isSaved
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {isSaved ? 'Saved' : 'Save Job'}
                </button>
              )}
              <div className="flex items-center gap-3">
                {hasProfile && onGetResume && (
                  <button onClick={onGetResume} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                    Get Tailored Resume
                  </button>
                )}
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
