'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScoreCard from '@/components/ScoreCard';
import SuggestionsList from '@/components/SuggestionsList';
import { JobFitAnalysis, Resume } from '@/types';

export default function AnalysisPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<JobFitAnalysis | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load results from sessionStorage
    if (typeof window !== 'undefined') {
      const analysisData = sessionStorage.getItem('analysisResult');
      const resumeData = sessionStorage.getItem('resumeData');

      if (analysisData) {
        setAnalysis(JSON.parse(analysisData));
      }

      if (resumeData) {
        setResume(JSON.parse(resumeData));
      }

      setLoading(false);
    }
  }, []);

  const handleNewAnalysis = () => {
    // Clear session storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('analysisResult');
      sessionStorage.removeItem('resumeData');
    }
    router.push('/upload');
  };

  const handleDownloadReport = () => {
    if (!analysis || !resume) return;

    // Create text report
    const report = `
CV ANALYSIS REPORT
==================

Generated: ${new Date().toLocaleDateString()}

FIT SCORE: ${analysis.fitScore}/100
${analysis.explanation}

MATCHED SKILLS (${analysis.matchedSkills.length}):
${analysis.matchedSkills.map(skill => `- ${skill}`).join('\n')}

MISSING SKILLS (${analysis.missingSkills.length}):
${analysis.missingSkills.map(skill => `- ${skill}`).join('\n')}

SUGGESTIONS TO IMPROVE:
${analysis.suggestionsToImprove.map((s, i) => `${i + 1}. ${s}`).join('\n')}

RECOMMENDED RESOURCES:
${analysis.recommendedResources
  .map(
    (r, i) => `
${i + 1}. ${r.title} (${r.type})
   Provider: ${r.provider}
   Difficulty: ${r.difficulty}
   ${r.url ? `URL: ${r.url}` : ''}
`
  )
  .join('\n')}

YOUR SKILLS:
${resume.skills.join(', ')}
    `;

    // Download as text file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-analysis-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis || !resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <svg
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Analysis Found
          </h2>
          <p className="text-gray-600 mb-6">
            Please upload a resume and run analysis first
          </p>
          <button
            onClick={() => router.push('/upload')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-2"
            >
              <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Home
            </button>
            <h1 className="text-4xl font-bold text-gray-900">
              Analysis Results
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download Report
            </button>

            <button
              onClick={handleNewAnalysis}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Analysis
            </button>
          </div>
        </div>

        {/* Score Card */}
        <div className="mb-8">
          <ScoreCard
            fitScore={analysis.fitScore}
            explanation={analysis.explanation}
            matchedSkills={analysis.matchedSkills}
            missingSkills={analysis.missingSkills}
          />
        </div>

        {/* Suggestions and Resources */}
        <SuggestionsList
          suggestions={analysis.suggestionsToImprove}
          recommendedResources={analysis.recommendedResources}
        />

        {/* Resume Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Your Resume Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {resume.skills.slice(0, 15).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
                {resume.skills.length > 15 && (
                  <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                    +{resume.skills.length - 15} more
                  </span>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Experience</h4>
              <p className="text-gray-600">
                {resume.experience.length} position
                {resume.experience.length !== 1 ? 's' : ''} listed
              </p>

              <h4 className="font-semibold text-gray-700 mb-2 mt-4">
                Education
              </h4>
              <p className="text-gray-600">
                {resume.education.length} degree
                {resume.education.length !== 1 ? 's' : ''} listed
              </p>

              <h4 className="font-semibold text-gray-700 mb-2 mt-4">
                Certifications
              </h4>
              <p className="text-gray-600">
                {resume.certifications.length} certification
                {resume.certifications.length !== 1 ? 's' : ''} listed
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Analysis generated on{' '}
            {new Date(analysis.analyzedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
