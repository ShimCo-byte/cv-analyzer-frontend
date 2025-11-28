'use client';

import { useState, useRef, ChangeEvent } from 'react';

interface ResumeUploaderProps {
  onFileSelect: (file: File | null) => void;
  onTextChange: (text: string) => void;
  selectedFile: File | null;
  textInput: string;
}

export default function ResumeUploader({
  onFileSelect,
  onTextChange,
  selectedFile,
  textInput,
}: ResumeUploaderProps) {
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    } else if (file) {
      alert('Please select a PDF file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    } else {
      alert('Please drop a PDF file');
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Upload Resume</h2>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setUploadMode('file')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadMode === 'file'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            PDF File
          </button>
          <button
            onClick={() => setUploadMode('text')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadMode === 'text'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Text Input
          </button>
        </div>
      </div>

      {uploadMode === 'file' ? (
        <div>
          {/* File Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
            onClick={handleBrowseClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="mt-4">
              {selectedFile ? (
                <div className="text-primary-600 font-medium">
                  ✓ {selectedFile.name}
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-primary-600">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF files only (Max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {selectedFile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
              }}
              className="mt-2 text-sm text-red-600 hover:text-red-700"
            >
              Remove file
            </button>
          )}
        </div>
      ) : (
        <div>
          {/* Text Input Area */}
          <textarea
            value={textInput}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Paste your resume text here...&#10;&#10;Example:&#10;John Doe&#10;Software Engineer&#10;&#10;Skills: JavaScript, React, Node.js&#10;&#10;Experience:&#10;Senior Developer at Google&#10;2020-2023"
            className="w-full h-64 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none font-mono text-sm"
          />
          <p className="mt-2 text-xs text-gray-500">
            {textInput.length} characters
          </p>
        </div>
      )}
    </div>
  );
}
