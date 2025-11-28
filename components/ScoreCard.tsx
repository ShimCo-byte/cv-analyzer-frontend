'use client';

import { useEffect, useState } from 'react';

interface ScoreCardProps {
  fitScore: number;
  explanation: string;
  matchedSkills: string[];
  missingSkills: string[];
}

export default function ScoreCard({
  fitScore,
  explanation,
  matchedSkills,
  missingSkills,
}: ScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score
    const duration = 1500;
    const steps = 60;
    const increment = fitScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= fitScore) {
        setAnimatedScore(fitScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [fitScore]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-blue-500 to-cyan-500';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Fit';
    if (score >= 60) return 'Good Fit';
    if (score >= 40) return 'Moderate Fit';
    return 'Limited Fit';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
      {/* Header with Score */}
      <div className={`bg-gradient-to-r ${getScoreGradient(fitScore)} p-8 text-white`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Job Fit Analysis</h2>
          <div className="relative inline-block">
            <svg className="w-48 h-48" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="white"
                strokeWidth="12"
                strokeDasharray={`${(animatedScore / 100) * 502.4} 502.4`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold">{animatedScore}</div>
              <div className="text-xl font-medium opacity-90">/ 100</div>
            </div>
          </div>
          <div className="mt-4 text-xl font-semibold">
            {getScoreLabel(fitScore)}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Analysis Summary
        </h3>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {explanation}
        </p>
      </div>

      {/* Skills Overview */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div>
          <div className="flex items-center mb-3">
            <svg
              className="h-5 w-5 text-green-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <h4 className="font-semibold text-gray-800">
              Matched Skills ({matchedSkills.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.slice(0, 10).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
            {matchedSkills.length > 10 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                +{matchedSkills.length - 10} more
              </span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div>
          <div className="flex items-center mb-3">
            <svg
              className="h-5 w-5 text-red-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <h4 className="font-semibold text-gray-800">
              Missing Skills ({missingSkills.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.slice(0, 10).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
            {missingSkills.length > 10 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                +{missingSkills.length - 10} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
