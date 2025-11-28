'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { checkHealth } from '@/lib/api';
import Header from './components/Header';

export default function Home() {
  const router = useRouter();
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    // Check backend health on mount
    checkHealth().then(setIsBackendHealthy);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {/* Global Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-5xl w-full text-center">
          {/* Hero Section */}
          <div className="space-y-6 mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Find Your Perfect Job Match
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl mx-auto font-light">
              AI analyzes your answers and finds the best-fit jobs for you — in minutes.
            </p>
          </div>

        {/* Question Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Do you want to start your job-matching quiz?
          </h2>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-4xl mx-auto">
            <button
              onClick={() => router.push('/profile')}
              className="group flex-1 px-10 py-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-2 border-blue-700"
            >
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="font-bold text-2xl mb-2">Start the Quiz</div>
              <div className="text-base opacity-90 leading-relaxed">Get personalized matches by answering a few quick questions</div>
            </button>
            <button
              onClick={() => router.push('/jobs')}
              className="group flex-1 px-10 py-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-green-700"
            >
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="font-bold text-2xl mb-2">Browse Jobs</div>
              <div className="text-base opacity-90 leading-relaxed">Search 150+ remote & freelance jobs worldwide</div>
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Smart Matching</h3>
            <p className="text-gray-600 leading-relaxed">
              AI analyzes your skills and experience to match you with perfect job opportunities
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Professional Resume</h3>
            <p className="text-gray-600 leading-relaxed">
              Get a beautifully formatted CV following industry standards, ready to send
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Global Opportunities</h3>
            <p className="text-gray-600 leading-relaxed">
              Access hundreds of jobs in Slovakia and remote positions worldwide
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Finding your dream job has never been easier. Our AI-powered platform guides you through every step.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Path 1: Build Resume */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-10 border-2 border-blue-200">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                  A
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Build Your Resume</h3>
              </div>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Create Your Profile</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Fill in your basic information, contact details, and current location. Takes only 2 minutes to get started.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Add Experience & Skills</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Input your work history, education, technical skills, and certifications. Our smart forms guide you through each section.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">AI Finds Your Matches</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Based on your profile, we automatically match you with relevant job opportunities from our database of 500+ positions.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Generate Professional Resume</h4>
                    <p className="text-gray-600 leading-relaxed">
                      We automatically create a polished, ATS-friendly resume using your profile data. Download and start applying immediately.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/profile')}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Build Your Profile →
              </button>
            </div>

            {/* Path 2: Have Resume */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-10 border-2 border-gray-300">
              <div className="flex items-center mb-6">
                <div className="bg-gray-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                  B
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Already Have a Resume?</h3>
              </div>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-gray-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Upload Your CV</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Simply drag and drop your PDF resume or paste the text. Our system accepts all standard CV formats.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-gray-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">AI Analyzes Your Profile</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Our advanced AI extracts your skills, experience, education, and qualifications. We identify your strengths and career level automatically.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-gray-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Get Instant Job Matches</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Receive personalized job recommendations from Slovakia and remote positions worldwide. Each match includes a compatibility score.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-gray-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">Download Professional CV</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Get a beautifully formatted, industry-standard resume ready to send to employers. Available in English or Slovak.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/quick-match')}
                className="mt-8 w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Start with Your Resume →
              </button>
            </div>
          </div>

          {/* What Makes Us Different */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-12 text-white">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">What Makes Us Different?</h3>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                We combine cutting-edge AI technology with human-centered design to make job hunting effortless.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <h4 className="font-bold text-xl mb-2">Smart AI Matching</h4>
                <p className="opacity-90">Our AI learns from your profile to find jobs that truly fit your skills and career goals.</p>
              </div>

              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-bold text-xl mb-2">Save Time</h4>
                <p className="opacity-90">Stop manually searching job boards. Get personalized recommendations in seconds, not hours.</p>
              </div>

              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-bold text-xl mb-2">Professional CV</h4>
                <p className="opacity-90">Get an ATS-optimized resume that passes automated screening and impresses recruiters.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-3xl font-bold text-gray-900 ml-2">4.8/5</span>
            </div>
            <p className="text-xl text-gray-600 font-medium">Trusted by thousands of job seekers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"Found my dream job in just 2 days! The AI matching is incredibly accurate."</p>
              <p className="text-sm font-semibold text-gray-900">Martin K.</p>
              <p className="text-xs text-gray-500">Software Developer</p>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"The resume builder is fantastic. Got 3 interview calls within a week!"</p>
              <p className="text-sm font-semibold text-gray-900">Petra S.</p>
              <p className="text-xs text-gray-500">Marketing Specialist</p>
            </div>

            {/* Review 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex mb-3">
                {[1, 2, 3, 4].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-gray-700 mb-4 italic">"Great platform with lots of remote opportunities. Easy to use!"</p>
              <p className="text-sm font-semibold text-gray-900">Jakub M.</p>
              <p className="text-xs text-gray-500">Data Analyst</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
