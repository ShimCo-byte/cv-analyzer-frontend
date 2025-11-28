'use client';

import { useEffect, useRef } from 'react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  source: string;
  category: string;
  postedDate: string;
  scrapedAt: string;
  description: string;
  fullDescription?: string;
  type: string;
  experienceLevel: string;
  salary?: string;
  employmentType?: string;
  benefits?: string[];
  requirements?: string[];
  responsibilities?: string[];
  skills?: string[];
  companyInfo?: {
    name: string;
    size: string;
    industry: string;
    founded: number;
    website: string;
    description: string;
  };
  applicationDeadline?: string;
  numberOfApplicants?: number;
  matchScore?: number;
  matchReasons?: string[];
}

interface JobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  onApply?: () => void;
  onGetResume?: () => void;
  hasProfile?: boolean;
}

export default function JobDetailModal({
  isOpen,
  onClose,
  job,
  onApply,
  onGetResume,
  hasProfile
}: JobDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  }

  function formatDeadline(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) return 'Expired';
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays < 7) return `${diffInDays} days left`;
    return date.toLocaleDateString();
  }

  function getMatchScoreColor(score: number) {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  }

  function getTypeColor(type: string) {
    const colors: any = {
      'Frontend': 'bg-blue-100 text-blue-800',
      'Backend': 'bg-green-100 text-green-800',
      'Full Stack': 'bg-purple-100 text-purple-800',
      'DevOps': 'bg-orange-100 text-orange-800',
      'Data': 'bg-pink-100 text-pink-800',
      'Mobile': 'bg-indigo-100 text-indigo-800',
      'Design': 'bg-cyan-100 text-cyan-800',
      'Marketing': 'bg-rose-100 text-rose-800',
      'Finance': 'bg-emerald-100 text-emerald-800',
      'HR': 'bg-amber-100 text-amber-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors['General'];
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <div
          ref={modalRef}
          className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-8">
                {/* Match Score Badge */}
                {job.matchScore !== undefined && (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border mb-2 ${getMatchScoreColor(job.matchScore)}`}>
                    {job.matchScore}% Match
                  </span>
                )}

                <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                <div className="flex items-center gap-3 mt-2 text-gray-600">
                  <span className="font-semibold text-lg">{job.company}</span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Quick Info Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(job.type)}`}>
                {job.type}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                {job.experienceLevel}
              </span>
              {job.employmentType && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                  {job.employmentType}
                </span>
              )}
              {job.salary && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
                  {job.salary}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 overflow-y-auto max-h-[calc(85vh-200px)]">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 uppercase">Posted</p>
                <p className="font-semibold text-gray-900">{formatDate(job.postedDate)}</p>
              </div>
              {job.applicationDeadline && (
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 uppercase">Deadline</p>
                  <p className="font-semibold text-gray-900">{formatDeadline(job.applicationDeadline)}</p>
                </div>
              )}
              {job.numberOfApplicants !== undefined && (
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 uppercase">Applicants</p>
                  <p className="font-semibold text-gray-900">{job.numberOfApplicants}+</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 uppercase">Source</p>
                <p className="font-semibold text-gray-900">{job.source}</p>
              </div>
            </div>

            {/* Match Reasons */}
            {job.matchReasons && job.matchReasons.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Why this job matches you
                </h3>
                <ul className="space-y-1">
                  {job.matchReasons.map((reason, idx) => (
                    <li key={idx} className="text-blue-800 text-sm flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* About the Role */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Role</h3>
              <div className="text-gray-700 prose prose-sm max-w-none">
                {(job.fullDescription || job.description).split('\n').map((line, idx) => {
                  // Handle markdown-style headers
                  if (line.startsWith('## ')) {
                    return <h4 key={idx} className="text-md font-semibold text-gray-900 mt-4 mb-2">{line.replace('## ', '')}</h4>;
                  }
                  // Handle bold text with **
                  if (line.includes('**')) {
                    const parts = line.split(/\*\*(.*?)\*\*/g);
                    return (
                      <p key={idx} className="mb-1">
                        {parts.map((part, i) =>
                          i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                        )}
                      </p>
                    );
                  }
                  // Handle bullet points
                  if (line.startsWith('• ')) {
                    return (
                      <div key={idx} className="flex items-start gap-2 ml-2 mb-1">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{line.replace('• ', '')}</span>
                      </div>
                    );
                  }
                  // Empty lines
                  if (line.trim() === '') {
                    return <div key={idx} className="h-2" />;
                  }
                  // Regular text
                  return <p key={idx} className="mb-1">{line}</p>;
                })}
              </div>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
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
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits & Perks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company Info */}
            {job.companyInfo && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About {job.companyInfo.name}</h3>
                <p className="text-gray-700 mb-4">{job.companyInfo.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Industry</p>
                    <p className="font-medium text-gray-900">{job.companyInfo.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Company Size</p>
                    <p className="font-medium text-gray-900">{job.companyInfo.size}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Founded</p>
                    <p className="font-medium text-gray-900">{job.companyInfo.founded}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Website</p>
                    <a
                      href={job.companyInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Job ID: {job.id.slice(0, 12)}...
              </div>
              <div className="flex gap-3">
                {hasProfile && onGetResume && (
                  <button
                    onClick={onGetResume}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Get Tailored Resume
                  </button>
                )}
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  Apply Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
