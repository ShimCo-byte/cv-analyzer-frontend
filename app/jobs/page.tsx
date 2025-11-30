'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getJobOffers, getJobStats, getMatchedJobsForProfile, getPersonalizedResume } from '@/lib/api';
import ResumeModal from '../components/ResumeModal';
import JobDetailModal from '../components/JobDetailModal';
import Header from '../components/Header';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  source: string;
  description: string;
  type: string;
  experienceLevel: string;
  postedDate: string;
  salary?: string;
  matchScore?: number;
  matchReasons?: string[];
}

interface JobStats {
  totalJobs: number;
  lastUpdate: string;
  categories: string[];
  companies: number;
}

function JobsPageContent() {
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
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

  // Modals
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [generatedResume, setGeneratedResume] = useState('');
  const [loadingResume, setLoadingResume] = useState(false);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [detailJob, setDetailJob] = useState<Job | null>(null);

  // Filters
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedEmployment, setSelectedEmployment] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Get user's country from profile
  const userCountry = userProfile?.location?.country?.toLowerCase() || '';

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = job.title.toLowerCase().includes(query) ||
                             job.company.toLowerCase().includes(query) ||
                             job.description?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Job type filter (Frontend, Backend, etc.)
      if (selectedType && job.type !== selectedType) return false;

      // Experience level filter
      if (selectedExperience && job.experienceLevel !== selectedExperience) return false;

      // Location filter
      if (selectedLocation) {
        const loc = job.location.toLowerCase();
        if (selectedLocation === 'remote' && !loc.includes('remote')) return false;
        if (selectedLocation === 'my-country' && userCountry) {
          if (!loc.includes(userCountry)) return false;
        }
        if (selectedLocation === 'eu') {
          const euCountries = ['europe', 'germany', 'france', 'netherlands', 'spain', 'italy', 'poland', 'austria', 'slovakia', 'czech', 'belgium', 'ireland', 'sweden', 'denmark', 'finland', 'portugal', 'hungary', 'romania', 'bulgaria', 'croatia', 'slovenia', 'estonia', 'latvia', 'lithuania', 'luxembourg', 'malta', 'cyprus', 'greece'];
          if (!euCountries.some(c => loc.includes(c)) && !loc.includes('eu') && !loc.includes('europe')) return false;
        }
        if (selectedLocation === 'usa') {
          if (!loc.includes('usa') && !loc.includes('united states') && !loc.includes('us') && !loc.includes('america')) return false;
        }
        if (selectedLocation === 'worldwide') {
          // No filter needed - show all
        }
      }

      // Employment type filter (simulated based on description/title)
      if (selectedEmployment) {
        const desc = (job.description + ' ' + job.title).toLowerCase();
        if (selectedEmployment === 'full-time' && (desc.includes('part-time') || desc.includes('part time') || desc.includes('contract') || desc.includes('freelance'))) return false;
        if (selectedEmployment === 'part-time' && !desc.includes('part-time') && !desc.includes('part time')) return false;
        if (selectedEmployment === 'contract' && !desc.includes('contract') && !desc.includes('freelance') && !desc.includes('contractor')) return false;
        if (selectedEmployment === 'internship' && !desc.includes('intern') && !desc.includes('internship') && !desc.includes('trainee')) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedType, selectedLocation, selectedEmployment, selectedExperience, userCountry]);

  // Load saved jobs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      try {
        const savedJobs = JSON.parse(saved);
        setSavedJobIds(new Set(savedJobs.map((j: any) => j.id)));
      } catch (e) {
        console.error('Error loading saved jobs:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (fromProfile) {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));
    }
  }, [fromProfile]);

  useEffect(() => {
    if (matchedMode && userProfile) {
      loadMatchedJobs();
    } else {
      loadJobs();
      loadStats();
    }
  }, [matchedMode, userProfile]);

  async function loadMatchedJobs() {
    try {
      setLoading(true);
      const data = await getMatchedJobsForProfile(userProfile, { minScore: 40, maxResults: 50 });
      setJobs(data.jobs);
      setMatchStats(data.stats);
      setStats({ totalJobs: data.totalJobs, lastUpdate: new Date().toISOString(), categories: [], companies: 0 });
      if (data.generatedResume) setGeneratedResume(data.generatedResume);
    } catch (err: any) {
      setError(err.message || 'Failed to load matched jobs');
    } finally {
      setLoading(false);
    }
  }

  async function loadJobs() {
    try {
      setLoading(true);
      const filters: any = {};
      if (selectedType) filters.type = selectedType;
      if (selectedLocation) filters.location = selectedLocation;
      if (searchQuery) filters.search = searchQuery;
      const data = await getJobOffers(filters);
      setJobs(data.jobs);
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
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

  const handleApplyNow = (job: Job) => {
    setSelectedJob(job);
    setGeneratedResume('');
    setShowResumeModal(true);
  };

  const handleGenerateResume = async () => {
    if (!selectedJob || !userProfile) return;

    setLoadingResume(true);
    try {
      const result = await getPersonalizedResume(userProfile, selectedJob.id);
      if (result?.resume) setGeneratedResume(result.resume);
    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      setLoadingResume(false);
    }
  };

  const handleJobClick = (job: Job) => {
    setDetailJob(job);
    setShowJobDetail(true);
  };

  const toggleSaveJob = (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const saved = localStorage.getItem('savedJobs');
    let savedJobs: any[] = saved ? JSON.parse(saved) : [];

    if (savedJobIds.has(job.id)) {
      // Remove from saved
      savedJobs = savedJobs.filter(j => j.id !== job.id);
      setSavedJobIds(prev => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
    } else {
      // Add to saved with full job details for the modal
      savedJobs.push({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        matchScore: job.matchScore,
        employmentType: job.type,
        url: job.url,
        savedAt: new Date().toISOString(),
        description: job.description,
        type: job.type,
        experienceLevel: job.experienceLevel,
        source: job.source,
        postedDate: job.postedDate,
        matchReasons: job.matchReasons,
      });
      setSavedJobIds(prev => new Set(prev).add(job.id));
    }

    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  };

  const handleGetResumeFromDetail = () => {
    if (!detailJob) return;
    setSelectedJob(detailJob);
    setGeneratedResume('');
    setShowJobDetail(false);
    setShowResumeModal(true);
  };

  const formatDate = (dateString: string) => {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return new Date(dateString).toLocaleDateString();
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

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'Junior': 'bg-green-50 text-green-700 border-green-200',
      'Mid': 'bg-blue-50 text-blue-700 border-blue-200',
      'Senior': 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return colors[level] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };

  const displayJobs = filteredJobs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                  {matchedMode
                    ? `Showing ${displayJobs.length} of ${jobs.length} matches`
                    : `Showing ${displayJobs.length} of ${stats.totalJobs} positions`
                  }
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
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by job title, company, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="">All Locations</option>
              <option value="remote">Remote Only</option>
              {userCountry && <option value="my-country">My Country ({userProfile?.location?.country})</option>}
              <option value="eu">Europe (EU)</option>
              <option value="usa">United States</option>
              <option value="worldwide">Worldwide</option>
            </select>

            {/* Employment Type Filter */}
            <select
              value={selectedEmployment}
              onChange={(e) => setSelectedEmployment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="">All Employment Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract / Freelance</option>
              <option value="internship">Internship</option>
            </select>

            {/* Job Category Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="">All Categories</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full Stack">Full Stack</option>
              <option value="DevOps">DevOps</option>
              <option value="Data">Data / AI / ML</option>
              <option value="Mobile">Mobile</option>
            </select>

            {/* Experience Level Filter */}
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="">All Levels</option>
              <option value="Junior">Junior / Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior / Lead</option>
            </select>

            {/* Clear Filters */}
            {(searchQuery || selectedType || selectedLocation || selectedEmployment || selectedExperience) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('');
                  setSelectedLocation('');
                  setSelectedEmployment('');
                  setSelectedExperience('');
                }}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {(selectedLocation || selectedEmployment || selectedType || selectedExperience) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedLocation && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {selectedLocation === 'remote' ? 'Remote' :
                   selectedLocation === 'my-country' ? `${userProfile?.location?.country}` :
                   selectedLocation === 'eu' ? 'Europe' :
                   selectedLocation === 'usa' ? 'USA' : 'Worldwide'}
                  <button onClick={() => setSelectedLocation('')} className="ml-1 hover:text-blue-900">&times;</button>
                </span>
              )}
              {selectedEmployment && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {selectedEmployment === 'full-time' ? 'Full-time' :
                   selectedEmployment === 'part-time' ? 'Part-time' :
                   selectedEmployment === 'contract' ? 'Contract' : 'Internship'}
                  <button onClick={() => setSelectedEmployment('')} className="ml-1 hover:text-green-900">&times;</button>
                </span>
              )}
              {selectedType && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {selectedType}
                  <button onClick={() => setSelectedType('')} className="ml-1 hover:text-purple-900">&times;</button>
                </span>
              )}
              {selectedExperience && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  {selectedExperience}
                  <button onClick={() => setSelectedExperience('')} className="ml-1 hover:text-orange-900">&times;</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Jobs List */}
        {!loading && !error && (
          <div className="space-y-4">
            {displayJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            ) : (
              displayJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleJobClick(job)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border-l-4"
                  style={{
                    borderLeftColor: job.matchScore
                      ? job.matchScore >= 80 ? '#10b981' : job.matchScore >= 60 ? '#3b82f6' : '#f59e0b'
                      : '#e5e7eb'
                  }}
                >
                  {/* Match Score */}
                  {matchedMode && job.matchScore && (
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${getMatchScoreColor(job.matchScore)}`}>
                        {job.matchScore}% Match
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>

                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <span className="font-medium">{job.company}</span>
                    <span className="text-gray-400">•</span>
                    <span>{job.location}</span>
                  </div>

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

                  {/* Match Reasons */}
                  {matchedMode && job.matchReasons && job.matchReasons.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Why this matches:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {job.matchReasons.slice(0, 3).map((reason, idx) => (
                          <li key={idx}>• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Posted {formatDate(job.postedDate)} • via {job.source}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => toggleSaveJob(job, e)}
                        className={`p-2 rounded-lg transition-colors ${
                          savedJobIds.has(job.id)
                            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title={savedJobIds.has(job.id) ? 'Remove from saved' : 'Save job'}
                      >
                        <svg className="w-5 h-5" fill={savedJobIds.has(job.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                      {userProfile && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleApplyNow(job); }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                        >
                          Get Resume
                        </button>
                      )}
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        Apply
                      </a>
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
          onClose={() => { setShowResumeModal(false); setSelectedJob(null); setGeneratedResume(''); }}
          resume={generatedResume}
          jobTitle={selectedJob.title}
          jobCompany={selectedJob.company}
          loading={loadingResume}
          onGenerate={handleGenerateResume}
        />
      )}

      {/* Job Detail Modal */}
      {detailJob && (
        <JobDetailModal
          isOpen={showJobDetail}
          onClose={() => { setShowJobDetail(false); setDetailJob(null); }}
          job={detailJob}
          onGetResume={handleGetResumeFromDetail}
          hasProfile={!!userProfile}
          isSaved={savedJobIds.has(detailJob.id)}
          onToggleSave={() => toggleSaveJob(detailJob)}
        />
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>}>
      <JobsPageContent />
    </Suspense>
  );
}
