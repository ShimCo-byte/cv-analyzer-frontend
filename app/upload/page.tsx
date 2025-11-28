'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ResumeUploader from '@/components/ResumeUploader';
import JobSelector from '@/components/JobSelector';
import { uploadResume, analyzeJobFit } from '@/lib/api';
import { Resume, JobFitAnalysis } from '@/types';

export default function UploadPage() {
  const router = useRouter();

  // Resume upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');

  // Job requirements state
  const [jobDescription, setJobDescription] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');

  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate inputs
      if (!selectedFile && !textInput) {
        setError('Please upload a resume or enter text');
        return;
      }

      if (!jobDescription && !selectedProgram) {
        setError('Please select a study program or enter a job description');
        return;
      }

      // Step 1: Upload resume
      const resume: Resume = await uploadResume(selectedFile || undefined, textInput || undefined);

      // Step 2: Analyze job fit
      const analysis: JobFitAnalysis = await analyzeJobFit(resume, {
        jobDescription: jobDescription || undefined,
        studyProgram: selectedProgram || undefined,
      });

      // Step 3: Store results and navigate
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('analysisResult', JSON.stringify(analysis));
        sessionStorage.setItem('resumeData', JSON.stringify(resume));
        router.push('/analysis');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
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

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Analyze Your Resume
          </h1>
          <p className="text-gray-600">
            Upload your resume and select job requirements to get personalized insights
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Resume Uploader */}
          <ResumeUploader
            onFileSelect={setSelectedFile}
            onTextChange={setTextInput}
            selectedFile={selectedFile}
            textInput={textInput}
          />

          {/* Job Selector */}
          <JobSelector
            onJobDescriptionChange={setJobDescription}
            onStudyProgramChange={setSelectedProgram}
            jobDescription={jobDescription}
            selectedProgram={selectedProgram}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
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
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`px-8 py-4 bg-gradient-to-r from-primary-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg flex items-center ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                Analyze Resume
                <svg
                  className="ml-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Your data is processed securely and not stored permanently</p>
        </div>
      </div>
    </div>
  );
}
