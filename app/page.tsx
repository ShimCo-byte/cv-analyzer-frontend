'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { checkHealth } from '@/lib/api';
import Header from './components/Header';
import Footer from './components/Footer';

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
              <div className="text-base opacity-90 leading-relaxed">Search 270+ remote & freelance jobs worldwide</div>
            </button>
          </div>
        </div>

        {/* How It Works - Ako to funguje */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Ako to funguje?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white">
              <div className="absolute -top-4 -left-4 bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-blue-500">
                1
              </div>
              <div className="flex items-center justify-center mb-6 mt-4">
                <svg className="h-16 w-16 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3">Vyplň krátky kvíz</h3>
              <p className="text-white/90 leading-relaxed">
                Povedz nám o sebe, svojich schopnostiach a preferenciách. Trvá to len 2 minúty.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white">
              <div className="absolute -top-4 -left-4 bg-white text-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-purple-500">
                2
              </div>
              <div className="flex items-center justify-center mb-6 mt-4">
                <svg className="h-16 w-16 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3">Získaj odporúčania</h3>
              <p className="text-white/90 leading-relaxed">
                Na základe tvojho profilu ti nájdeme práce, ktoré sú pre teba najvhodnejšie.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white">
              <div className="absolute -top-4 -left-4 bg-white text-green-600 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-green-500">
                3
              </div>
              <div className="flex items-center justify-center mb-6 mt-4">
                <svg className="h-16 w-16 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-3">Prihlás sa</h3>
              <p className="text-white/90 leading-relaxed">
                Vyber si prácu a prihlás sa priamo cez našu platformu. Jednoduché a rýchle.
              </p>
            </div>
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

      </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
