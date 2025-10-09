// Core CV data types

export type Language = 'EN' | 'RU' | 'UZ';
export type CVStyle = 'HARVARD' | 'PRO';

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  links: string; // comma-separated
}

export interface ExperienceEntry {
  company: string;
  title: string;
  location: string;
  start: string; // MMM YYYY
  end: string; // MMM YYYY or "Present"
  bullets: string[]; // array of bullet points
}

export interface EducationEntry {
  school: string;
  degree: string;
  dates: string; // YYYY–YYYY
  extra?: string;
}

export interface Skills {
  hard: string[]; // comma-separated technical skills
  soft: string[]; // comma-separated soft skills
  tools: string[]; // comma-separated tools
}

export interface CVData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: Skills;
  certifications: string[];
  languages_extra: string[]; // e.g., "English (C1)", "Russian (Native)"
  language: Language;
  style: CVStyle;
}

export interface PolishedCVData extends CVData {
  // Same structure but with polished content
}
