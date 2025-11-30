'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import JobDetailModal from '../components/JobDetailModal';

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  matchScore?: number;
  savedAt: string;
  employmentType?: string;
  url?: string;
  description?: string;
  type?: string;
  experienceLevel?: string;
  source?: string;
  postedDate?: string;
  matchReasons?: string[];
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [detailJob, setDetailJob] = useState<SavedJob | null>(null);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = () => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      try {
        const jobs = JSON.parse(saved);
        setSavedJobs(jobs);
      } catch (e) {
        console.error('Error parsing saved jobs:', e);
      }
    }
    setLoading(false);
  };

  const removeJob = (jobId: string) => {
    const updatedJobs = savedJobs.filter(job => job.id !== jobId);
    setSavedJobs(updatedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
  };

  const clearAllJobs = () => {
    if (confirm('Are you sure you want to remove all saved jobs?')) {
      setSavedJobs([]);
      localStorage.removeItem('savedJobs');
    }
  };

  const handleJobClick = (job: SavedJob) => {
    setDetailJob(job);
    setShowJobDetail(true);
  };

  const handleToggleSaveFromModal = () => {
    if (detailJob) {
      removeJob(detailJob.id);
      setShowJobDetail(false);
      setDetailJob(null);
    }
  };

  // Convert SavedJob to the format expected by JobDetailModal
  const convertToModalJob = (job: SavedJob) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    url: job.url || '',
    source: job.source || 'Saved',
    postedDate: job.postedDate || job.savedAt,
    description: job.description || `${job.title} position at ${job.company}`,
    type: job.employmentType || job.type || 'Full Stack',
    experienceLevel: job.experienceLevel || 'Mid',
    salary: job.salary,
    matchScore: job.matchScore,
    matchReasons: job.matchReasons,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
            <p className="text-gray-600 mt-2">
              {savedJobs.length === 0
                ? 'No saved jobs yet. Start browsing to save interesting positions.'
                : `You have ${savedJobs.length} saved job${savedJobs.length !== 1 ? 's' : ''}.`}
            </p>
          </div>
          {savedJobs.length > 0 && (
            <button
              onClick={clearAllJobs}
              className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs</h3>
            <p className="text-gray-500 mb-6">
              When you find jobs you're interested in, save them here to review later.
            </p>
            <Link
              href="/jobs?fromProfile=true"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Jobs
            </Link>
          </div>
        ) : (
          /* Jobs List */
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        {job.employmentType && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {job.employmentType}
                          </span>
                        )}
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.salary}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Saved on {new Date(job.savedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {job.matchScore && (
                      <div className="text-center">
                        <p className="text-xl font-bold text-green-600">{job.matchScore}%</p>
                        <p className="text-xs text-gray-500">match</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Job"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeJob(job.id); }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Job Detail Modal */}
      {detailJob && (
        <JobDetailModal
          isOpen={showJobDetail}
          onClose={() => { setShowJobDetail(false); setDetailJob(null); }}
          job={convertToModalJob(detailJob)}
          isSaved={true}
          onToggleSave={handleToggleSaveFromModal}
        />
      )}
    </div>
  );
}
