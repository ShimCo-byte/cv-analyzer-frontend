'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getJobOffers, getJobStats, getMatchedJobsForProfile, getPersonalizedResume } from '@/lib/api';
import ResumeModal from '../components/ResumeModal';
import JobDetailModal from '../components/JobDetailModal';
import Header from '../components/Header';
import { useAuth } from '@/contexts/AuthContext';

// Chrome extension type declarations
declare global {
  interface Window {
    chrome?: typeof chrome;
  }
}

declare const chrome: {
  runtime?: {
    sendMessage: (
      extensionId: string,
      message: any,
      callback: (response: any) => void
    ) => void;
    lastError?: { message: string };
  };
} | undefined;

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
  suitable?: boolean;
}

interface JobStats {
  totalJobs: number;
  lastUpdate: string;
  categories: string[];
  companies: number;
}

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromProfile = searchParams?.get('fromProfile') === 'true';

  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedMode, setMatchedMode] = useState(fromProfile);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [matchStats, setMatchStats] = useState<any>(null);

  // Resume modal
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [generatedResume, setGeneratedResume] = useState<string>('');
  const [loadingResume, setLoadingResume] = useState(false);

  // Job detail modal
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [detailJob, setDetailJob] = useState<Job | null>(null);

  // Filters
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter jobs client-side for matched mode
  const filteredJobs = useMemo(() => {
    if (!matchedMode) return jobs;

    return jobs.filter(job => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = job.title.toLowerCase().includes(query) ||
                             job.company.toLowerCase().includes(query) ||
                             job.description?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (selectedType && job.type !== selectedType) return false;

      // Location filter
      if (selectedLocation) {
        const jobLocation = job.location.toLowerCase();
        const jobCompany = job.company.toLowerCase();
        const jobTitle = job.title.toLowerCase();

        if (selectedLocation === 'myCountry') {
          const userCountry = (userProfile?.country || 'Slovakia').toLowerCase();
          const countryMatch = jobLocation.includes(userCountry) ||
                              jobLocation.includes(userCountry.split(' ')[0]);
          if (!countryMatch) return false;
        } else if (selectedLocation === 'remote') {
          const isRemote = jobLocation.includes('remote') ||
                          jobLocation.includes('worldwide') ||
                          jobLocation.includes('global') ||
                          jobLocation.includes('work from anywhere') ||
                          jobLocation.includes('any location') ||
                          jobCompany.includes('(remote)') ||
                          jobTitle.includes('remote') ||
                          jobTitle.includes('freelance');
          if (!isRemote) return false;
        } else if (selectedLocation === 'eu') {
          const euCountries = ['europe', 'eu', 'germany', 'france', 'netherlands', 'spain', 'italy',
                              'poland', 'austria', 'belgium', 'sweden', 'denmark', 'finland', 'norway',
                              'portugal', 'ireland', 'czech', 'hungary', 'slovakia', 'greece', 'luxembourg',
                              'berlin', 'munich', 'amsterdam', 'paris', 'barcelona', 'milan', 'vienna',
                              'warsaw', 'prague', 'budapest', 'brussels', 'dublin', 'lisbon', 'stockholm',
                              'copenhagen', 'helsinki', 'oslo', 'athens'];
          const isEU = euCountries.some(country => jobLocation.includes(country));
          if (!isEU) return false;
        } else if (selectedLocation === 'freelance') {
          const isFreelance = jobTitle.includes('freelance') ||
                             jobTitle.includes('contract') ||
                             jobLocation.includes('freelance') ||
                             jobCompany.includes('upwork') ||
                             jobCompany.includes('fiverr') ||
                             jobCompany.includes('toptal');
          if (!isFreelance) return false;
        }
      }

      return true;
    });
  }, [jobs, matchedMode, searchQuery, selectedType, selectedLocation, userProfile]);

  useEffect(() => {
    // Load user profile from localStorage if coming from profile
    if (fromProfile) {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    }
  }, [fromProfile]);

  useEffect(() => {
    if (matchedMode && userProfile) {
      loadMatchedJobs();
    } else {
      loadJobs();
      loadStats();
    }
  }, [matchedMode, userProfile, selectedType, selectedLevel, selectedLocation, searchQuery]);

  async function loadMatchedJobs() {
    try {
      setLoading(true);
      const data = await getMatchedJobsForProfile(userProfile, {
        minScore: 40,
        maxResults: 50,
        sortBy: 'score'
      });

      setJobs(data.jobs);
      setMatchStats(data.stats);
      setStats({
        totalJobs: data.totalJobs,
        lastUpdate: new Date().toISOString(),
        categories: [],
        companies: 0
      });

      // Store generated resume
      if (data.generatedResume) {
        setGeneratedResume(data.generatedResume);
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load matched jobs');
      console.error('Error loading matched jobs:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleApplyNow = async (job: Job) => {
    setSelectedJob(job);
    setShowResumeModal(true);

    // If we have a user profile, generate personalized resume for this specific job
    if (userProfile) {
      setLoadingResume(true);
      try {
        const result = await getPersonalizedResume(userProfile, job.id);
        if (result && result.resume) {
          setGeneratedResume(result.resume);
        }
      } catch (error) {
        console.error('Error generating personalized resume:', error);
        // Fall back to the generic resume if personalization fails
      } finally {
        setLoadingResume(false);
      }
    }
  };

  const handleJobClick = (job: Job) => {
    setDetailJob(job);
    setShowJobDetail(true);
  };

  const handleGetResumeFromDetail = async () => {
    if (detailJob) {
      setSelectedJob(detailJob);
      setShowJobDetail(false);
      setShowResumeModal(true);

      // If we have a user profile, generate personalized resume for this specific job
      if (userProfile) {
        setLoadingResume(true);
        try {
          const result = await getPersonalizedResume(userProfile, detailJob.id);
          if (result && result.resume) {
            setGeneratedResume(result.resume);
          }
        } catch (error) {
          console.error('Error generating personalized resume:', error);
        } finally {
          setLoadingResume(false);
        }
      }
    }
  };

  // Chrome Extension ID - update after loading extension in chrome://extensions
  const EXTENSION_ID = 'YOUR_EXTENSION_ID_HERE';

  const handleAutoApply = (job: Job) => {
    if (!userProfile) {
      alert('Please complete your profile first to use Auto Apply.');
      return;
    }

    // Try to communicate with Chrome extension
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      try {
        chrome.runtime.sendMessage(
          EXTENSION_ID,
          {
            type: 'AUTO_APPLY',
            profile: userProfile,
            job: {
              id: job.id,
              title: job.title,
              company: job.company,
              location: job.location,
              url: job.url,
              description: job.description
            }
          },
          (response) => {
            if (chrome.runtime.lastError) {
              showExtensionInstallPrompt(job);
            } else if (response?.success) {
              console.log('Auto Apply initiated');
            }
          }
        );
      } catch {
        showExtensionInstallPrompt(job);
      }
    } else {
      showExtensionInstallPrompt(job);
    }
  };

  const showExtensionInstallPrompt = (job: Job) => {
    const install = confirm(
      'Auto Apply requires the CV Analyzer Chrome Extension.\n\n' +
      'Click OK to open the job page manually.\n\n' +
      'To install the extension:\n' +
      '1. Open chrome://extensions\n' +
      '2. Enable "Developer mode"\n' +
      '3. Click "Load unpacked"\n' +
      '4. Select the cv-analyzer-extension folder'
    );

    if (install) {
      window.open(job.url, '_blank');
    }
  };

  async function loadJobs() {
    try {
      setLoading(true);
      const filters: any = {};
      if (selectedType) filters.type = selectedType;
      if (selectedLevel) filters.experienceLevel = selectedLevel;
      if (selectedLocation) filters.location = selectedLocation;
      if (searchQuery) filters.search = searchQuery;

      const data = await getJobOffers(filters);
      setJobs(data.jobs);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const data = await getJobStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }

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

  function getTypeColor(type: string) {
    const colors: any = {
      'Frontend': 'bg-blue-100 text-blue-800',
      'Backend': 'bg-green-100 text-green-800',
      'Full Stack': 'bg-purple-100 text-purple-800',
      'DevOps': 'bg-orange-100 text-orange-800',
      'Data': 'bg-pink-100 text-pink-800',
      'Mobile': 'bg-indigo-100 text-indigo-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors['General'];
  }

  function getLevelColor(level: string) {
    const colors: any = {
      'Junior': 'bg-green-50 text-green-700 border-green-200',
      'Mid': 'bg-blue-50 text-blue-700 border-blue-200',
      'Senior': 'bg-purple-50 text-purple-700 border-purple-200',
      'Internship': 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };
    return colors[level] || colors['Mid'];
  }

  function getMatchScoreColor(score: number) {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Global Header */}
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {matchedMode ? 'Your Matching Jobs' : 'Browse Jobs'}
              </h1>
              {stats && (
                <p className="text-gray-600 mt-2">
                  {matchedMode ? (
                    <>
                      {jobs.length} perfect matches out of {stats.totalJobs} positions
                      {matchStats && (
                        <span className="text-gray-400 ml-2">
                          • {matchStats.avgScore}% average match
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      {stats.totalJobs} positions from {stats.companies} companies
                      <span className="text-gray-400 ml-2">
                        • Last updated: {formatDate(stats.lastUpdate)}
                      </span>
                    </>
                  )}
                </p>
              )}
            </div>

            {userProfile && (
              <div className="flex gap-2">
                <button
                  onClick={() => setMatchedMode(!matchedMode)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  {matchedMode ? 'Show All Jobs' : 'Show My Matches'}
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters for matched mode */}
        {matchedMode && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Your Country Only Toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <input
                  type="checkbox"
                  checked={selectedLocation === 'myCountry'}
                  onChange={(e) => setSelectedLocation(e.target.checked ? 'myCountry' : '')}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-blue-700">Your Country Only ({userProfile?.country || 'Slovakia'})</span>
              </label>

              {/* Remote Only Toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <input
                  type="checkbox"
                  checked={selectedLocation === 'remote'}
                  onChange={(e) => setSelectedLocation(e.target.checked ? 'remote' : '')}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-green-700">Remote Only</span>
              </label>

              {/* EU Only Toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
                <input
                  type="checkbox"
                  checked={selectedLocation === 'eu'}
                  onChange={(e) => setSelectedLocation(e.target.checked ? 'eu' : '')}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-purple-700">EU Only</span>
              </label>

              {/* Freelance Toggle */}
              <label className="flex items-center gap-2 cursor-pointer bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                <input
                  type="checkbox"
                  checked={selectedLocation === 'freelance'}
                  onChange={(e) => setSelectedLocation(e.target.checked ? 'freelance' : '')}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-orange-700">Freelance</span>
              </label>

              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Job Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">All Types</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Full Stack">Full Stack</option>
                <option value="DevOps">DevOps</option>
                <option value="Data">Data</option>
                <option value="Mobile">Mobile</option>
              </select>

              {/* Small Match Stats */}
              {matchStats && (
                <div className="flex items-center gap-2 text-xs text-gray-500 ml-auto">
                  <span className="text-green-600 font-medium">{matchStats.excellent} great</span>
                  <span>•</span>
                  <span className="text-blue-600 font-medium">{matchStats.good} good</span>
                  <span>•</span>
                  <span>{matchStats.moderate + matchStats.low} other</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filters (only in non-matched mode) */}
        {!matchedMode && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  <option value="remote">Remote (Worldwide)</option>
                  <option value="freelance">Freelance</option>
                  <option value="europe">Europe</option>
                  <option value="slovakia">Slovakia</option>
                  <option value="germany">Germany</option>
                  <option value="usa">USA (Remote)</option>
                  <option value="uk">UK (Remote)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Data">Data</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  <option value="Internship">Internship</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
            </div>

            {(selectedType || selectedLevel || selectedLocation || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedType('');
                  setSelectedLevel('');
                  setSelectedLocation('');
                  setSearchQuery('');
                }}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Jobs List */}
        {!loading && !error && (
          <div className="space-y-4">
            {/* Show count for matched mode */}
            {matchedMode && filteredJobs.length > 0 && (
              <p className="text-sm text-gray-500 mb-2">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </p>
            )}
            {(matchedMode ? filteredJobs : jobs).length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-gray-400 text-5xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {matchedMode ? 'No matching jobs found' : 'No jobs found'}
                </h3>
                <p className="text-gray-600">
                  {matchedMode
                    ? 'Try adjusting your filters or clear them to see all matches'
                    : 'Try adjusting your filters or search query'}
                </p>
              </div>
            ) : (
              (matchedMode ? filteredJobs : jobs).map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 cursor-pointer"
                  style={{
                    borderLeftColor: matchedMode && job.matchScore
                      ? job.matchScore >= 80 ? '#10b981'
                        : job.matchScore >= 60 ? '#3b82f6'
                        : job.matchScore >= 40 ? '#f59e0b'
                        : '#6b7280'
                      : '#e5e7eb'
                  }}
                  onClick={() => handleJobClick(job)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Match Score (only in matched mode) */}
                      {matchedMode && job.matchScore !== undefined && (
                        <div className="mb-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${getMatchScoreColor(job.matchScore)}`}>
                            {job.matchScore}% Match
                          </span>
                        </div>
                      )}

                      {/* Job Title */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>

                      {/* Company and Location */}
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <span className="font-medium">{job.company}</span>
                        <span className="text-gray-400">•</span>
                        <span>{job.location}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(job.type)}`}>
                          {job.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(job.experienceLevel)}`}>
                          {job.experienceLevel}
                        </span>
                        {job.salary && (
                          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
                            {job.salary}
                          </span>
                        )}
                      </div>

                      {/* Match Reasons (only in matched mode) */}
                      {matchedMode && job.matchReasons && job.matchReasons.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Why this matches:</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {job.matchReasons.map((reason, idx) => (
                              <li key={idx}>• {reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-gray-600 mb-4">{job.description}</p>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Posted {formatDate(job.postedDate)}</span>
                          <span className="text-gray-300">•</span>
                          <span>via {job.source}</span>
                        </div>

                        <div className="flex gap-2">
                          {userProfile && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleApplyNow(job); }}
                              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Get Resume
                            </button>
                          )}
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Apply Now
                          </a>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleJobClick(job); }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Resume Modal */}
      {selectedJob && (
        <ResumeModal
          isOpen={showResumeModal}
          onClose={() => {
            setShowResumeModal(false);
            setSelectedJob(null);
          }}
          resume={generatedResume}
          jobTitle={selectedJob.title}
          jobCompany={selectedJob.company}
          loading={loadingResume}
        />
      )}

      {/* Job Detail Modal */}
      {detailJob && (
        <JobDetailModal
          isOpen={showJobDetail}
          onClose={() => {
            setShowJobDetail(false);
            setDetailJob(null);
          }}
          job={detailJob}
          onGetResume={handleGetResumeFromDetail}
          hasProfile={!!userProfile}
        />
      )}
    </div>
  );
}
