// Core CV data types

export type Language = 'EN' | 'RU' | 'UZ';
export type CVStyle = 'HARVARD' | 'PRO';

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  links: string; // comma-separated (LinkedIn, portfolio, GitHub)
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
  location?: string;
  modules?: string; // key modules/focus areas
  achievements?: string; // awards/dissertation/key achievements
  extra?: string;
}

export interface Skills {
  hard: string[]; // technical skills (e.g., Python, SQL, Excel)
  soft: string[]; // soft skills (e.g., communication, leadership)
  tools: string[]; // tools & platforms (e.g., Power BI, Git)
}

export interface JobDescription {
  job_title: string;
  company_name?: string;
  full_description: string;
}

export interface UploadedDocuments {
  existing_cv_text?: string; // extracted text from uploaded CV
  existing_cover_letter_text?: string; // extracted text from uploaded cover letter
}

export interface CVData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: Skills;
  certifications: string[];
  projects?: string[]; // publications/projects/hackathons/volunteering
  languages_extra: string[]; // e.g., "English (C1)", "Russian (Native)"
  language: Language;
  style: CVStyle;
  job_description?: JobDescription; // target job for tailoring
  uploaded_documents?: UploadedDocuments; // existing CV/cover letter
}

export interface PolishedCVData extends CVData {
  // Same structure but with polished content
}

export interface CoverLetterData {
  contact: ContactInfo;
  company_name: string;
  job_title: string;
  hiring_manager?: string; // optional, defaults to "Hiring Manager"
  paragraphs: string[]; // 3-5 concise paragraphs
  language: Language;
}
