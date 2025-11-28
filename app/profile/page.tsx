'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentUser, updateUserProfile } from '@/lib/api';
import Header from '../components/Header';

interface UserProfile {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;

  // Location & Work Preferences
  country: string;
  currentLocation: string;
  preferredLocations: string[];
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  willingToRelocate: boolean;
  maxCommuteDistance?: number; // in km

  // Experience
  yearsOfExperience: number;
  currentPosition?: string;
  desiredPosition: string;
  experienceLevel: 'junior' | 'mid' | 'senior' | 'lead';

  // Skills
  primarySkills: string[];
  secondarySkills: string[];
  languages: { language: string; level: string }[];

  // Work Experience
  workExperience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
    isRemote: boolean;
  }[];

  // Education
  highSchool?: {
    name: string;
    graduationYear: string;
    fieldOfStudy?: string;
  };
  university?: {
    name: string;
    degree: string;
    field: string;
    graduationYear: string;
  };
  education: {
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
  }[];

  // Job Preferences
  expectedSalary?: {
    min: number;
    max: number;
    currency: string;
  };
  jobTypes: string[]; // Frontend, Backend, Full Stack, etc.
  availability: 'immediate' | '2weeks' | '1month' | '3months';
  employmentType: string[]; // Full-time, Part-time, Contract, Freelance

  // Additional
  certifications?: string[];
  projects?: {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);

  const [profile, setProfile] = useState<Partial<UserProfile>>({
    country: '',
    preferredLocations: [],
    remotePreference: 'flexible',
    willingToRelocate: false,
    primarySkills: [],
    secondarySkills: [],
    languages: [],
    workExperience: [],
    education: [],
    jobTypes: [],
    employmentType: ['Full-time'],
    expectedSalary: { min: 2000, max: 5000, currency: 'EUR' },
    availability: 'immediate',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  // Auto-save function with debounce
  const saveProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    const sessionId = localStorage.getItem('sessionId');

    // Always save to localStorage immediately
    localStorage.setItem('userProfile', JSON.stringify(profileData));

    // If authenticated, also save to Supabase
    if (sessionId) {
      setSaving(true);
      try {
        await updateUserProfile(sessionId, profileData);
        setLastSaved(new Date());
        console.log('Profile saved to Supabase');
      } catch (error) {
        console.error('Error auto-saving to backend:', error);
        // Still mark as saved since localStorage worked
        setLastSaved(new Date());
      } finally {
        setSaving(false);
      }
    } else {
      // Not authenticated but still show saved indicator for localStorage
      setLastSaved(new Date());
    }
  }, []);

  // Auto-save when profile changes (with debounce)
  useEffect(() => {
    // Skip auto-save on initial load
    if (isInitialLoad.current) {
      return;
    }

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save (1 second debounce)
    saveTimeoutRef.current = setTimeout(() => {
      saveProfile(profile);
    }, 1000);

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [profile, saveProfile]);

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      const sessionId = localStorage.getItem('sessionId');
      const savedLocalProfile = localStorage.getItem('userProfile');
      let localProfile = null;

      // Try to parse local profile
      if (savedLocalProfile) {
        try {
          localProfile = JSON.parse(savedLocalProfile);
        } catch (error) {
          console.error('Error parsing local profile:', error);
        }
      }

      if (sessionId) {
        // User is authenticated, try to load their profile from backend
        try {
          const user = await getCurrentUser(sessionId);
          setIsAuthenticated(true);

          if (user && user.profile && Object.keys(user.profile).length > 0) {
            // Backend has profile data - use it
            setProfile(prev => ({ ...prev, ...user.profile }));
            // Also update localStorage
            localStorage.setItem('userProfile', JSON.stringify(user.profile));
          } else if (localProfile && Object.keys(localProfile).length > 0) {
            // No backend profile but we have local profile - use local and sync to backend
            setProfile(prev => ({ ...prev, ...localProfile }));
            // Auto-sync local profile to backend
            try {
              await updateUserProfile(sessionId, localProfile);
              console.log('Local profile synced to backend');
            } catch (syncError) {
              console.error('Error syncing local profile to backend:', syncError);
            }
          }
        } catch (error) {
          console.error('Error loading user from backend:', error);
          // Fallback to local profile
          if (localProfile) {
            setProfile(prev => ({ ...prev, ...localProfile }));
          }
        }
      } else if (localProfile) {
        // Not authenticated - use local profile
        setProfile(prev => ({ ...prev, ...localProfile }));
      }

      setLoading(false);
      // Mark initial load as complete after a short delay
      setTimeout(() => {
        isInitialLoad.current = false;
      }, 100);
    };

    loadProfile();
  }, []);

  // Check if profile has minimum required fields filled
  const isProfileComplete = (p: Partial<UserProfile>) => {
    return !!(
      p.firstName &&
      p.lastName &&
      p.country &&
      p.currentLocation &&
      p.primarySkills?.length &&
      p.primarySkills.length >= 1
    );
  };

  // Set hasExistingProfile when profile loads
  useEffect(() => {
    if (!loading) {
      const complete = isProfileComplete(profile);
      setHasExistingProfile(complete);
    }
  }, [loading, profile.firstName, profile.lastName, profile.country, profile.currentLocation, profile.primarySkills]);

  // Countries and cities
  const countries = [
    'Slovakia',
    'Czech Republic',
    'Germany',
    'Austria',
    'Poland',
    'Hungary',
    'United Kingdom',
    'United States',
    'Canada',
    'Netherlands',
    'Switzerland',
    'Other'
  ];

  const citiesByCountry: Record<string, string[]> = {
    'Slovakia': ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Banská Bystrica', 'Nitra', 'Trnava', 'Martin', 'Trenčín', 'Poprad'],
    'Czech Republic': ['Prague', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf'],
    'Austria': ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck'],
    'Poland': ['Warsaw', 'Kraków', 'Wrocław', 'Gdańsk', 'Poznań', 'Łódź'],
    'Hungary': ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Bristol'],
    'United States': ['New York', 'San Francisco', 'Los Angeles', 'Seattle', 'Austin', 'Boston', 'Chicago'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
    'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
    'Switzerland': ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne'],
    'Other': []
  };

  // Get cities based on selected country
  const availableCities = profile.country ? citiesByCountry[profile.country] || [] : [];

  // Slovak cities for backward compatibility
  const slovakCities = citiesByCountry['Slovakia'];

  // Auto-add Slovak language if location is in Slovakia
  useEffect(() => {
    if (profile.currentLocation) {
      const location = profile.currentLocation.toLowerCase();
      const isSlovakia = location.includes('slovakia') || location.includes('slovensko') ||
                        location.includes('bratislava') || location.includes('košice') ||
                        slovakCities.some(city => location.includes(city.toLowerCase()));

      // Check if Slovak is already in languages
      const hasSlovak = profile.languages?.some(l =>
        l.language.toLowerCase().includes('slovak') ||
        l.language.toLowerCase().includes('slovenč')
      );

      if (isSlovakia && !hasSlovak) {
        // Auto-add Slovak as native language
        const updatedLanguages = [
          { language: 'Slovenčina (Slovak)', level: 'Native' },
          ...(profile.languages || [])
        ];
        updateProfile({ languages: updatedLanguages });
      }
    }
  }, [profile.currentLocation]);

  // Available skills
  const availableSkills = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Next.js',
    'Node.js', 'Express', 'NestJS', 'Python', 'Django', 'FastAPI',
    'Java', 'Spring', 'PHP', 'Laravel', 'C#', '.NET', 'Go', 'Rust',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'Google Cloud', 'Git', 'CI/CD', 'Agile', 'Scrum'
  ];

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile({ ...profile, ...updates });
  };

  const toggleArrayItem = (field: keyof UserProfile, item: string) => {
    const currentArray = (profile[field] as string[]) || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateProfile({ [field]: newArray } as any);
  };

  const addWorkExperience = () => {
    const newExp = {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      location: '',
      description: '',
      isRemote: false,
    };
    updateProfile({
      workExperience: [...(profile.workExperience || []), newExp],
    });
  };

  const updateWorkExperience = (index: number, updates: any) => {
    const newWorkExp = [...(profile.workExperience || [])];
    newWorkExp[index] = { ...newWorkExp[index], ...updates };
    updateProfile({ workExperience: newWorkExp });
  };

  const removeWorkExperience = (index: number) => {
    updateProfile({
      workExperience: profile.workExperience?.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    const newEdu = {
      institution: '',
      degree: '',
      field: '',
      graduationYear: '',
    };
    updateProfile({
      education: [...(profile.education || []), newEdu],
    });
  };

  const updateEducation = (index: number, updates: any) => {
    const newEdu = [...(profile.education || [])];
    newEdu[index] = { ...newEdu[index], ...updates };
    updateProfile({ education: newEdu });
  };

  const removeEducation = (index: number) => {
    updateProfile({
      education: profile.education?.filter((_, i) => i !== index),
    });
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!profile.firstName) newErrors.firstName = 'First name is required';
      if (!profile.lastName) newErrors.lastName = 'Last name is required';
      if (!profile.email) newErrors.email = 'Email is required';
      if (!profile.phone) newErrors.phone = 'Phone is required';
    }

    if (stepNumber === 2) {
      if (!profile.country) newErrors.country = 'Country is required';
      if (!profile.currentLocation) newErrors.currentLocation = 'Current city is required';
    }

    if (stepNumber === 3) {
      if (!profile.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
      if (!profile.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
      if (!profile.desiredPosition) newErrors.desiredPosition = 'Desired position is required';
    }

    if (stepNumber === 4) {
      if (!profile.primarySkills?.length) newErrors.primarySkills = 'Select at least 3 primary skills';
      if (!profile.jobTypes?.length) newErrors.jobTypes = 'Select at least one job type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < totalSteps) setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    try {
      // Save profile to localStorage
      localStorage.setItem('userProfile', JSON.stringify(profile));

      // If authenticated, also save to backend
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        try {
          await updateUserProfile(sessionId, profile);
        } catch (error) {
          console.error('Error saving to backend:', error);
          // Continue anyway - localStorage saved
        }
      }

      // Redirect to matched jobs
      router.push('/jobs?fromProfile=true');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  // Profile Summary Component (shown when profile exists and not editing)
  const ProfileSummary = () => (
    <div className="bg-white rounded-xl shadow-sm p-8">
      {/* Profile Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-gray-600">{profile.desiredPosition || profile.currentPosition}</p>
            <p className="text-sm text-gray-500">{profile.currentLocation}, {profile.country}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Edit Profile
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{profile.yearsOfExperience || 0}</p>
          <p className="text-sm text-gray-600">Years Exp.</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{profile.primarySkills?.length || 0}</p>
          <p className="text-sm text-gray-600">Skills</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600 capitalize">{profile.experienceLevel}</p>
          <p className="text-sm text-gray-600">Level</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-600 capitalize">{profile.remotePreference}</p>
          <p className="text-sm text-gray-600">Work Style</p>
        </div>
      </div>

      {/* Skills */}
      {profile.primarySkills && profile.primarySkills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.primarySkills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {skill}
              </span>
            ))}
            {profile.secondarySkills?.map((skill, idx) => (
              <span key={`s-${idx}`} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Job Types */}
      {profile.jobTypes && profile.jobTypes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Looking for</h3>
          <div className="flex flex-wrap gap-2">
            {profile.jobTypes.map((type, idx) => (
              <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {type}
              </span>
            ))}
            {profile.employmentType?.map((type, idx) => (
              <span key={`e-${idx}`} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => router.push('/jobs?fromProfile=true')}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all font-medium text-lg"
        >
          View Matching Jobs
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Update Profile
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Global Header */}
      <Header />

      <div className="container mx-auto px-4 max-w-4xl py-8">
        {/* Show Profile Summary if profile exists and not editing */}
        {hasExistingProfile && !isEditing ? (
          <ProfileSummary />
        ) : (
        <>
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create Your Profile
              </h1>
              <p className="text-gray-600">
                Tell us about yourself and we'll find the perfect job matches for you
              </p>
              {/* Auto-save indicator */}
              {saving && (
                <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </p>
              )}
              {!saving && lastSaved && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Auto-saved
                </p>
              )}
            </div>
            <button
              onClick={() => router.push('/quick-match')}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Skip with resume
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((step / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-4 text-xs text-gray-600">
            <span className={step >= 1 ? 'text-blue-600 font-medium' : ''}>Personal</span>
            <span className={step >= 2 ? 'text-blue-600 font-medium' : ''}>Location</span>
            <span className={step >= 3 ? 'text-blue-600 font-medium' : ''}>Experience</span>
            <span className={step >= 4 ? 'text-blue-600 font-medium' : ''}>Skills</span>
            <span className={step >= 5 ? 'text-blue-600 font-medium' : ''}>Details</span>
            <span className={step >= 6 ? 'text-blue-600 font-medium' : ''}>Preferences</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={profile.firstName || ''}
                    onChange={(e) => updateProfile({ firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={profile.lastName || ''}
                    onChange={(e) => updateProfile({ lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={profile.email || ''}
                    onChange={(e) => updateProfile({ email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => updateProfile({ phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+421 900 123 456"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={profile.linkedin || ''}
                    onChange={(e) => updateProfile({ linkedin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    value={profile.github || ''}
                    onChange={(e) => updateProfile({ github: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/johndoe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  value={profile.portfolio || ''}
                  onChange={(e) => updateProfile({ portfolio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://johndoe.com"
                />
              </div>
            </div>
          )}

          {/* Step 2: Location & Work Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Location & Work Preferences</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  value={profile.country || ''}
                  onChange={(e) => {
                    updateProfile({
                      country: e.target.value,
                      currentLocation: '',
                      preferredLocations: []
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>

              {profile.country && profile.country !== 'Other' && availableCities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current City *
                  </label>
                  <select
                    value={profile.currentLocation || ''}
                    onChange={(e) => updateProfile({ currentLocation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your current city</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.currentLocation && <p className="text-red-500 text-sm mt-1">{errors.currentLocation}</p>}
                </div>
              )}

              {profile.country === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current City *
                  </label>
                  <input
                    type="text"
                    value={profile.currentLocation || ''}
                    onChange={(e) => updateProfile({ currentLocation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your city"
                  />
                  {errors.currentLocation && <p className="text-red-500 text-sm mt-1">{errors.currentLocation}</p>}
                </div>
              )}

              {profile.country && profile.country !== 'Other' && availableCities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Work Locations (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableCities.map(city => (
                      <label key={city} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.preferredLocations?.includes(city) || false}
                          onChange={() => toggleArrayItem('preferredLocations', city)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{city}</span>
                      </label>
                    ))}
                  </div>
                  {errors.preferredLocations && <p className="text-red-500 text-sm mt-1">{errors.preferredLocations}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remote Work Preference *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'remote', label: 'Fully Remote', icon: '🏠' },
                    { value: 'hybrid', label: 'Hybrid', icon: '🔄' },
                    { value: 'onsite', label: 'On-site', icon: '🏢' },
                    { value: 'flexible', label: 'Flexible', icon: '✨' },
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateProfile({ remotePreference: option.value as any })}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        profile.remotePreference === option.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="relocate"
                  checked={profile.willingToRelocate || false}
                  onChange={(e) => updateProfile({ willingToRelocate: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="relocate" className="text-sm font-medium text-gray-700">
                  I am willing to relocate for the right opportunity
                </label>
              </div>

              {profile.remotePreference !== 'remote' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Commute Distance (km)
                  </label>
                  <input
                    type="number"
                    value={profile.maxCommuteDistance || ''}
                    onChange={(e) => updateProfile({ maxCommuteDistance: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30"
                    min="0"
                    max="200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty if distance doesn't matter
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Experience */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Experience</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    value={profile.yearsOfExperience || ''}
                    onChange={(e) => updateProfile({ yearsOfExperience: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3"
                    min="0"
                    max="50"
                  />
                  {errors.yearsOfExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level *
                  </label>
                  <select
                    value={profile.experienceLevel || ''}
                    onChange={(e) => updateProfile({ experienceLevel: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select level</option>
                    <option value="junior">Junior (0-2 years)</option>
                    <option value="mid">Mid-level (2-5 years)</option>
                    <option value="senior">Senior (5+ years)</option>
                    <option value="lead">Lead/Principal (8+ years)</option>
                  </select>
                  {errors.experienceLevel && <p className="text-red-500 text-sm mt-1">{errors.experienceLevel}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Position
                </label>
                <select
                  value={[
                    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
                    'Software Engineer', 'DevOps Engineer', 'Data Analyst',
                    'UX/UI Designer', 'Product Manager', 'QA Engineer',
                    'Mobile Developer', 'Student'
                  ].includes(profile.currentPosition || '') ? profile.currentPosition : 'different'}
                  onChange={(e) => {
                    if (e.target.value === 'different') {
                      updateProfile({ currentPosition: '' });
                    } else {
                      updateProfile({ currentPosition: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your current position</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="UX/UI Designer">UX/UI Designer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="QA Engineer">QA Engineer</option>
                  <option value="Mobile Developer">Mobile Developer</option>
                  <option value="Student">Student</option>
                  <option value="different">Different (specify below)</option>
                </select>
                {(profile.currentPosition !== undefined && ![
                  '', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
                  'Software Engineer', 'DevOps Engineer', 'Data Analyst',
                  'UX/UI Designer', 'Product Manager', 'QA Engineer',
                  'Mobile Developer', 'Student'
                ].includes(profile.currentPosition || '')) && (
                  <input
                    type="text"
                    value={profile.currentPosition || ''}
                    onChange={(e) => updateProfile({ currentPosition: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your current position"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Position *
                </label>
                <select
                  value={[
                    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
                    'Software Engineer', 'Senior Developer', 'Tech Lead',
                    'DevOps Engineer', 'Data Scientist', 'UX/UI Designer',
                    'Product Manager', 'Engineering Manager'
                  ].includes(profile.desiredPosition || '') ? profile.desiredPosition : 'different'}
                  onChange={(e) => {
                    if (e.target.value === 'different') {
                      updateProfile({ desiredPosition: '' });
                    } else {
                      updateProfile({ desiredPosition: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your desired position</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Senior Developer">Senior Developer</option>
                  <option value="Tech Lead">Tech Lead</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="UX/UI Designer">UX/UI Designer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Engineering Manager">Engineering Manager</option>
                  <option value="different">Different (specify below)</option>
                </select>
                {(profile.desiredPosition !== undefined && ![
                  '', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
                  'Software Engineer', 'Senior Developer', 'Tech Lead',
                  'DevOps Engineer', 'Data Scientist', 'UX/UI Designer',
                  'Product Manager', 'Engineering Manager'
                ].includes(profile.desiredPosition || '')) && (
                  <input
                    type="text"
                    value={profile.desiredPosition || ''}
                    onChange={(e) => updateProfile({ desiredPosition: e.target.value })}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your desired position"
                  />
                )}
                {errors.desiredPosition && <p className="text-red-500 text-sm mt-1">{errors.desiredPosition}</p>}
              </div>

              {/* Work Experience Entries */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Work Experience (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={addWorkExperience}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add Experience
                  </button>
                </div>

                {profile.workExperience?.map((exp, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900">Position {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeWorkExperience(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateWorkExperience(index, { company: e.target.value })}
                        placeholder="Company name"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateWorkExperience(index, { position: e.target.value })}
                        placeholder="Position"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateWorkExperience(index, { startDate: e.target.value })}
                        placeholder="Start date (e.g., 2020-01)"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateWorkExperience(index, { endDate: e.target.value })}
                        placeholder="End date (or 'Present')"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateWorkExperience(index, { location: e.target.value })}
                        placeholder="Location"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exp.isRemote}
                          onChange={(e) => updateWorkExperience(index, { isRemote: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Remote position</span>
                      </label>
                    </div>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateWorkExperience(index, { description: e.target.value })}
                      placeholder="Brief description of responsibilities and achievements"
                      className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Skills & Job Types */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Expertise</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Primary Skills * (Select at least 3)
                </label>
                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {availableSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleArrayItem('primarySkills', skill)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        profile.primarySkills?.includes(skill)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {profile.primarySkills?.length || 0} skills
                </p>
                {errors.primarySkills && <p className="text-red-500 text-sm mt-1">{errors.primarySkills}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Secondary Skills (Optional)
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {availableSkills.filter(s => !profile.primarySkills?.includes(s)).map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleArrayItem('secondarySkills', skill)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        profile.secondarySkills?.includes(skill)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border-2 border-indigo-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-1">
                      Jazykové znalosti / Language Skills *
                    </label>
                    <p className="text-sm text-gray-600">Prosím uveďte všetky jazyky, ktorými hovoríte</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newLanguages = [...(profile.languages || []), { language: '', level: 'Intermediate' }];
                      updateProfile({ languages: newLanguages });
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                  >
                    + Pridať jazyk
                  </button>
                </div>

                {profile.languages && profile.languages.length > 0 ? (
                  <div className="space-y-3">
                    {profile.languages.map((lang, index) => (
                      <div key={index} className="flex gap-3 items-start bg-white p-4 rounded-lg">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={lang.language}
                            onChange={(e) => {
                              const newLanguages = [...(profile.languages || [])];
                              newLanguages[index] = { ...newLanguages[index], language: e.target.value };
                              updateProfile({ languages: newLanguages });
                            }}
                            placeholder="napr. Slovenčina, English, Deutsch"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <select
                            value={lang.level}
                            onChange={(e) => {
                              const newLanguages = [...(profile.languages || [])];
                              newLanguages[index] = { ...newLanguages[index], level: e.target.value };
                              updateProfile({ languages: newLanguages });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="Native">Rodný jazyk / Native</option>
                            <option value="Fluent">Plynule / Fluent</option>
                            <option value="Advanced">Pokročilý / Advanced</option>
                            <option value="Intermediate">Stredný / Intermediate</option>
                            <option value="Basic">Základný / Basic</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newLanguages = (profile.languages || []).filter((_, i) => i !== index);
                            updateProfile({ languages: newLanguages });
                          }}
                          className="px-3 py-2 text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Odstrániť
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>Zatiaľ ste nepridali žiadne jazyky. Kliknite na "Pridať jazyk" vyššie.</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Job Types * (What are you looking for?)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Data', 'Mobile'].map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={profile.jobTypes?.includes(type) || false}
                        onChange={() => toggleArrayItem('jobTypes', type)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.jobTypes && <p className="text-red-500 text-sm mt-1">{errors.jobTypes}</p>}
              </div>
            </div>
          )}

          {/* Step 5: Education & Additional Details */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Education & Additional Details</h2>

              {/* High School */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stredná škola (High School)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={profile.highSchool?.name || ''}
                    onChange={(e) => updateProfile({
                      highSchool: { ...profile.highSchool!, name: e.target.value }
                    })}
                    placeholder="Názov strednej školy"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={profile.highSchool?.graduationYear || ''}
                    onChange={(e) => updateProfile({
                      highSchool: { ...profile.highSchool!, graduationYear: e.target.value }
                    })}
                    placeholder="Rok maturity (napr. 2020)"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={profile.highSchool?.fieldOfStudy || ''}
                    onChange={(e) => updateProfile({
                      highSchool: { ...profile.highSchool!, fieldOfStudy: e.target.value }
                    })}
                    placeholder="Zameranie (napr. Informatika)"
                    className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* University */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vysoká škola (University)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={profile.university?.name || ''}
                    onChange={(e) => updateProfile({
                      university: { ...profile.university!, name: e.target.value }
                    })}
                    placeholder="Názov univerzity"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={profile.university?.degree || ''}
                    onChange={(e) => updateProfile({
                      university: { ...profile.university!, degree: e.target.value }
                    })}
                    placeholder="Titul (napr. Bc., Mgr., Ing.)"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={profile.university?.field || ''}
                    onChange={(e) => updateProfile({
                      university: { ...profile.university!, field: e.target.value }
                    })}
                    placeholder="Odbor (napr. Informačné technológie)"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={profile.university?.graduationYear || ''}
                    onChange={(e) => updateProfile({
                      university: { ...profile.university!, graduationYear: e.target.value }
                    })}
                    placeholder="Rok promócie (napr. 2024)"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Education
                  </label>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add Education
                  </button>
                </div>

                {profile.education?.map((edu, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, { institution: e.target.value })}
                        placeholder="Institution name"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, { degree: e.target.value })}
                        placeholder="Degree (e.g., Bachelor's)"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, { field: e.target.value })}
                        placeholder="Field of study"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={edu.graduationYear}
                        onChange={(e) => updateEducation(index, { graduationYear: e.target.value })}
                        placeholder="Graduation year"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications (comma-separated)
                </label>
                <textarea
                  value={profile.certifications?.join(', ') || ''}
                  onChange={(e) => updateProfile({
                    certifications: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="AWS Certified Solutions Architect, Google Cloud Professional, Azure DevOps Engineer"
                />
              </div>
            </div>
          )}

          {/* Step 6: Job Preferences */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Preferences</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Expected Salary Range (Monthly, Gross)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    value={profile.expectedSalary?.min || ''}
                    onChange={(e) => updateProfile({
                      expectedSalary: { ...profile.expectedSalary!, min: parseInt(e.target.value) }
                    })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="2000"
                  />
                  <input
                    type="number"
                    value={profile.expectedSalary?.max || ''}
                    onChange={(e) => updateProfile({
                      expectedSalary: { ...profile.expectedSalary!, max: parseInt(e.target.value) }
                    })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="5000"
                  />
                  <select
                    value={profile.expectedSalary?.currency || 'EUR'}
                    onChange={(e) => updateProfile({
                      expectedSalary: { ...profile.expectedSalary!, currency: e.target.value }
                    })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Employment Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Full-time', 'Part-time', 'Contract', 'Freelance'].map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={profile.employmentType?.includes(type) || false}
                        onChange={() => toggleArrayItem('employmentType', type)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={profile.availability || 'immediate'}
                  onChange={(e) => updateProfile({ availability: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="immediate">Immediately</option>
                  <option value="2weeks">In 2 weeks</option>
                  <option value="1month">In 1 month</option>
                  <option value="3months">In 3 months</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {hasExistingProfile && isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Find Matching Jobs →
              </button>
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
