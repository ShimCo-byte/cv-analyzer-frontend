/**
 * API Client pre komunikáciu s backendom
 */

import { ApiResponse, Resume, JobFitAnalysis, StudyProgram } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Upload resume (PDF alebo text)
 */
export async function uploadResume(file?: File, text?: string): Promise<Resume> {
  try {
    let response: Response;

    if (file) {
      // Upload PDF
      const formData = new FormData();
      formData.append('file', file);

      response = await fetch(`${API_URL}/upload-resume`, {
        method: 'POST',
        body: formData,
      });
    } else if (text) {
      // Upload text
      response = await fetch(`${API_URL}/upload-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
    } else {
      throw new Error('Either file or text must be provided');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Resume> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to upload resume');
    }

    return result.data;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
}

/**
 * Analyze job fit
 */
export async function analyzeJobFit(
  resumeData: Resume,
  options: {
    jobDescription?: string;
    studyProgram?: string;
    selectedSchool?: string;
  }
): Promise<JobFitAnalysis> {
  try {
    const response = await fetch(`${API_URL}/analyze-job-fit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData,
        ...options,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<JobFitAnalysis> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to analyze job fit');
    }

    return result.data;
  } catch (error) {
    console.error('Error analyzing job fit:', error);
    throw error;
  }
}

/**
 * Get available study programs
 */
export async function getStudyPrograms(): Promise<StudyProgram[]> {
  try {
    const response = await fetch(`${API_URL}/study-programs`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<StudyProgram[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch study programs');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching study programs:', error);
    throw error;
  }
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}

/**
 * Get job offers
 */
export async function getJobOffers(filters?: {
  type?: string;
  experienceLevel?: string;
  company?: string;
  search?: string;
  category?: string;
  location?: string;
}) {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const url = `${API_URL}/job-offers${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch job offers');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching job offers:', error);
    throw error;
  }
}

/**
 * Get job offers statistics
 */
export async function getJobStats() {
  try {
    const response = await fetch(`${API_URL}/job-offers/stats`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch job stats');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching job stats:', error);
    throw error;
  }
}

/**
 * Get matched jobs for user profile
 */
export async function getMatchedJobsForProfile(userProfile: any, options?: {
  minScore?: number;
  maxResults?: number;
  sortBy?: string;
}) {
  try {
    const response = await fetch(`${API_URL}/job-offers/matched`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile,
        ...options
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to get matched jobs');
    }

    return result.data;
  } catch (error) {
    console.error('Error getting matched jobs:', error);
    throw error;
  }
}

/**
 * Authentication functions
 */

export async function signUp(email: string, password: string, profile?: any) {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, profile }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Signup failed');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Signup failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Invalid credentials');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Signin failed');
    }

    return result.data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut(sessionId: string) {
  try {
    const response = await fetch(`${API_URL}/auth/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      throw new Error('Signout failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getCurrentUser(sessionId: string) {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'X-Session-ID': sessionId,
      },
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    if (!result.success) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function updateUserProfile(sessionId: string, profile: any) {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify({ profile }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Failed to update profile');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to update profile');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

/**
 * Get personalized resume for a specific job
 */
export async function getPersonalizedResume(userProfile: any, jobId: string, language?: string) {
  try {
    const response = await fetch(`${API_URL}/job-offers/personalized-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProfile,
        jobId,
        language
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to generate personalized resume');
    }

    return result.data;
  } catch (error) {
    console.error('Error generating personalized resume:', error);
    throw error;
  }
}
