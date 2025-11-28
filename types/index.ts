/**
 * TypeScript Types pre CV Analyzer Frontend
 */

export interface Resume {
  id: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  certifications: Certification[];
  keywords: string[];
  contactInfo: ContactInfo;
  createdAt: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string | null;
  endDate: string | null;
  gpa?: number | null;
}

export interface Experience {
  company: string;
  position: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  technologies: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string | null;
  expiryDate: string | null;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
}

export interface JobFitAnalysis {
  fitScore: number;
  explanation: string;
  missingSkills: string[];
  matchedSkills: string[];
  suggestionsToImprove: string[];
  recommendedResources: RecommendedResource[];
  analyzedAt: string;
}

export interface RecommendedResource {
  type: 'course' | 'project' | 'book' | 'certification';
  title: string;
  provider: string;
  url: string;
  relevance: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface StudyProgram {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
