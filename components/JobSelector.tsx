'use client';

import { useState, useEffect } from 'react';
import { StudyProgram } from '@/types';
import { getStudyPrograms } from '@/lib/api';

interface JobSelectorProps {
  onJobDescriptionChange: (description: string) => void;
  onStudyProgramChange: (programId: string) => void;
  jobDescription: string;
  selectedProgram: string;
}

export default function JobSelector({
  onJobDescriptionChange,
  onStudyProgramChange,
  jobDescription,
  selectedProgram,
}: JobSelectorProps) {
  const [mode, setMode] = useState<'job' | 'program'>('program');
  const [programs, setPrograms] = useState<StudyProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const data = await getStudyPrograms();
        setPrograms(data);
      } catch (error) {
        console.error('Failed to fetch programs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Job Requirements
        </h2>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMode('program')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'program'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Study Program
          </button>
          <button
            onClick={() => setMode('job')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'job'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Job Description
          </button>
        </div>
      </div>

      {mode === 'program' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Study Program
          </label>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {programs.map((program) => (
                <button
                  key={program.id}
                  onClick={() => onStudyProgramChange(program.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedProgram === program.id
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {program.name}
                      </h3>
                      <span
                        className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                          program.difficulty
                        )}`}
                      >
                        {program.difficulty}
                      </span>
                    </div>
                    {selectedProgram === program.id && (
                      <svg
                        className="h-6 w-6 text-primary-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <label
            htmlFor="jobDescription"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Job Description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            placeholder="Paste the job description here...&#10;&#10;Example:&#10;We are looking for a Senior Full-Stack Developer with 3+ years of experience.&#10;&#10;Required Skills:&#10;- React, TypeScript&#10;- Node.js, Express&#10;- MongoDB, PostgreSQL&#10;- REST APIs, GraphQL&#10;- Git, Docker"
            className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none text-sm"
          />
          <p className="mt-2 text-xs text-gray-500">
            {jobDescription.length} characters
          </p>
        </div>
      )}
    </div>
  );
}
