'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import JobDetailModal from '../components/JobDetailModal';
import { getMatchedJobsForProfile } from '@/lib/api';

interface ProfileStats {
  completionPercent: number;
  skillsCount: number;
  experienceYears: number;
  savedJobsCount: number;
}

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

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<ProfileStats>({
    completionPercent: 0,
    skillsCount: 0,
    experienceYears: 0,
    savedJobsCount: 0,
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);

  useEffect(() => {
    // Load profile data
    const savedProfile = localStorage.getItem('userProfile');
    const savedJobs = localStorage.getItem('savedJobs');

    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);

        // Calculate profile completion
        let completedFields = 0;
        const totalFields = 10;
        if (profile.firstName) completedFields++;
        if (profile.lastName) completedFields++;
        if (profile.email) completedFields++;
        if (profile.phone) completedFields++;
        if (profile.country) completedFields++;
        if (profile.currentLocation) completedFields++;
        if (profile.primarySkills?.length > 0) completedFields++;
        if (profile.yearsOfExperience) completedFields++;
        if (profile.desiredPosition) completedFields++;
        if (profile.workExperience?.length > 0) completedFields++;

        setStats({
          completionPercent: Math.round((completedFields / totalFields) * 100),
          skillsCount: (profile.primarySkills?.length || 0) + (profile.secondarySkills?.length || 0),
          experienceYears: profile.yearsOfExperience || 0,
          savedJobsCount: savedJobs ? JSON.parse(savedJobs).length : 0,
        });

        if (profile.firstName) {
          setUserName(profile.firstName);
        }
      } catch (e) {
        console.error('Error parsing profile:', e);
      }
    }

    // Load recent matching jobs from API
    const loadMatchingJobs = async () => {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          const matchedJobs = await getMatchedJobsForProfile(profile);
          // Take top 3 jobs for dashboard
          setRecentJobs(matchedJobs.slice(0, 3));
        } catch (error) {
          console.error('Error loading matching jobs:', error);
        }
      }
      setLoading(false);
    };

    loadMatchingJobs();
  }, []);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetail(true);
  };

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {userName ? `Welcome back, ${userName}!` : 'Welcome to Match Your Job!'}
          </h1>
          <p className="text-gray-600 mt-2">Here's an overview of your job search progress.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Profile Completion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completionPercent}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.completionPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Skills Listed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.skillsCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Add more skills to improve matching</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Years of Experience</p>
                <p className="text-2xl font-bold text-gray-900">{stats.experienceYears}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Professional experience</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Saved Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.savedJobsCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
            <Link href="/saved-jobs" className="text-sm text-blue-600 hover:text-blue-700 mt-4 inline-block">
              View saved jobs →
            </Link>
          </div>
        </div>

        {/* Quick Actions & Recent Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/profile"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Update Profile</p>
                  <p className="text-sm text-gray-500">Keep your info current</p>
                </div>
              </Link>

              <Link
                href="/jobs?fromProfile=true"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Find Jobs</p>
                  <p className="text-sm text-gray-500">Browse matching positions</p>
                </div>
              </Link>

              <Link
                href="/career-tips"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Career Tips</p>
                  <p className="text-sm text-gray-500">Improve your chances</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Matching Jobs */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top Matching Jobs</h2>
              <Link href="/jobs?fromProfile=true" className="text-sm text-blue-600 hover:text-blue-700">
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleJobClick(job)}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{job.matchScore || 0}%</p>
                        <p className="text-xs text-gray-500">match</p>
                      </div>
                      <div className="p-2 text-gray-400 group-hover:text-blue-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No matching jobs found yet.</p>
                  <Link href="/profile" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
                    Complete your profile to see matches
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={showJobDetail}
          onClose={() => {
            setShowJobDetail(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
}
