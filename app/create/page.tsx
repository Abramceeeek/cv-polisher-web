'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CVData, Language, CVStyle } from '@/lib/types';
import ExperienceFields from '@/components/ExperienceFields';
import EducationFields from '@/components/EducationFields';
import { extractTextFromDocument, validateAndTruncateText, cleanExtractedText } from '@/lib/documentParser';

const STEPS = [
  { id: 'contact', title: 'Contact Info', icon: '👤' },
  { id: 'summary', title: 'Summary', icon: '📝' },
  { id: 'experience', title: 'Experience', icon: '💼' },
  { id: 'education', title: 'Education', icon: '🎓' },
  { id: 'skills', title: 'Skills & Extras', icon: '⚡' },
  { id: 'uploads', title: 'Upload Documents', icon: '📄' },
  { id: 'job', title: 'Job Description', icon: '🎯' },
  { id: 'review', title: 'Review & Generate', icon: '✨' },
];

export default function CreateCVPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CVData>({
    contact: {
      name: '',
      email: '',
      phone: '',
      location: '',
      links: '',
    },
    summary: '',
    experience: [
      {
        company: '',
        title: '',
        location: '',
        start: '',
        end: '',
        bullets: [''],
      },
    ],
    education: [
      {
        school: '',
        degree: '',
        dates: '',
        location: '',
        modules: '',
        achievements: '',
        extra: '',
      },
    ],
    skills: {
      hard: [],
      soft: [],
      tools: [],
    },
    certifications: [],
    projects: [],
    languages_extra: [],
    language: 'EN',
    style: 'HARVARD',
    job_description: {
      job_title: '',
      company_name: '',
      full_description: '',
    },
    uploaded_documents: {
      existing_cv_text: '',
      existing_cover_letter_text: '',
    },
  });

  // File upload states
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle file upload and text extraction with proper PDF/DOCX parsing
  const handleFileUpload = async (file: File, type: 'cv' | 'coverLetter') => {
    setError(null);

    try {
      console.log(`[Upload] Processing ${type} file:`, file.name, file.type, file.size);

      // Extract text using proper parser
      const extractedText = await extractTextFromDocument(file);

      // Clean and validate text
      const cleanedText = cleanExtractedText(extractedText);

      if (!cleanedText || cleanedText.length < 50) {
        throw new Error('Extracted text is too short or empty. Please check your file content.');
      }

      console.log(`[Upload] Successfully extracted ${cleanedText.length} characters from ${file.name}`);

      // Truncate to reasonable length and update form data
      if (type === 'cv') {
        const finalText = validateAndTruncateText(cleanedText, 15000);
        setCvFile(file);
        setFormData({
          ...formData,
          uploaded_documents: {
            ...formData.uploaded_documents,
            existing_cv_text: finalText,
          },
        });

        // Show success message
        console.log(`[Upload] CV uploaded: ${file.name} (${finalText.length} chars)`);
      } else {
        const finalText = validateAndTruncateText(cleanedText, 10000);
        setCoverLetterFile(file);
        setFormData({
          ...formData,
          uploaded_documents: {
            ...formData.uploaded_documents,
            existing_cover_letter_text: finalText,
          },
        });

        // Show success message
        console.log(`[Upload] Cover Letter uploaded: ${file.name} (${finalText.length} chars)`);
      }
    } catch (err: any) {
      console.error('[Upload] Error processing file:', err);
      setError(err.message || 'Failed to process file. Please try a different file or format.');

      // Clear file on error
      if (type === 'cv') {
        setCvFile(null);
      } else {
        setCoverLetterFile(null);
      }
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Validate
      if (!formData.contact.name.trim()) {
        throw new Error('Name is required');
      }

      if (!formData.summary.trim() && formData.experience.every(e => !e.company.trim())) {
        throw new Error('At least a summary or one experience is required');
      }

      // Call API
      const response = await fetch('/api/polish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate CV');
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_and_CoverLetter_${formData.contact.name.replace(/[^a-zA-Z0-9]/g, '_')}_${formData.style}_${formData.language}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Success message
      alert('✅ CV and Cover Letter generated successfully! Check your downloads.');
    } catch (err: any) {
      setError(err.message || 'Failed to generate CV. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    const step = STEPS[currentStep];

    switch (step.id) {
      case 'contact':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mb-4">📇 Contact Information</h2>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input"
                value={formData.contact.name}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, name: e.target.value }
                })}
                placeholder="Abdurakhmonbek Fayzullaev"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="input"
                  value={formData.contact.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value }
                  })}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="input"
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value }
                  })}
                  placeholder="+44 1234 567890"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input"
                value={formData.contact.location}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, location: e.target.value }
                })}
                placeholder="London, UK"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Links (comma-separated)
              </label>
              <input
                type="text"
                className="input"
                value={formData.contact.links}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, links: e.target.value }
                })}
                placeholder="linkedin.com/in/yourname, github.com/yourname, yourwebsite.com"
              />
              <p className="text-xs text-text-muted mt-1">
                Add your LinkedIn, GitHub, portfolio, or website URLs
              </p>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mb-4">📝 Professional Summary</h2>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Professional Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                className="input min-h-32"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Write 3-5 sentences about your professional background, key skills, and career goals..."
                rows={6}
                required
              />
              <p className="text-xs text-text-muted mt-1">
                💡 Tip: Highlight your most relevant experience, key strengths, and what makes you unique
              </p>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mb-4">💼 Professional Experience</h2>
            <ExperienceFields
              experience={formData.experience}
              onChange={(exp) => setFormData({ ...formData, experience: exp })}
            />
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mb-4">🎓 Education</h2>
            <EducationFields
              education={formData.education}
              onChange={(edu) => setFormData({ ...formData, education: edu })}
            />
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary mb-4">⚡ Skills & Additional Information</h2>

            {/* Technical Skills */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Technical Skills (comma-separated)
              </label>
              <input
                type="text"
                className="input"
                value={formData.skills.hard.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  skills: {
                    ...formData.skills,
                    hard: e.target.value.split(',').map(s => s.trim()).filter(s => s),
                  }
                })}
                placeholder="Python, SQL, Machine Learning, Data Analysis"
              />
            </div>

            {/* Tools & Technologies */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Tools & Technologies (comma-separated)
              </label>
              <input
                type="text"
                className="input"
                value={formData.skills.tools.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  skills: {
                    ...formData.skills,
                    tools: e.target.value.split(',').map(s => s.trim()).filter(s => s),
                  }
                })}
                placeholder="Excel, Tableau, Git, AWS, Docker"
              />
            </div>

            {/* Soft Skills */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Soft Skills / Core Competencies (comma-separated)
              </label>
              <input
                type="text"
                className="input"
                value={formData.skills.soft.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  skills: {
                    ...formData.skills,
                    soft: e.target.value.split(',').map(s => s.trim()).filter(s => s),
                  }
                })}
                placeholder="Leadership, Communication, Problem Solving, Team Management"
              />
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Languages (comma-separated with proficiency)
              </label>
              <input
                type="text"
                className="input"
                value={formData.languages_extra.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  languages_extra: e.target.value.split(',').map(s => s.trim()).filter(s => s),
                })}
                placeholder="English (Native), Russian (C1), Spanish (B2)"
              />
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Certifications (comma-separated)
              </label>
              <input
                type="text"
                className="input"
                value={formData.certifications?.join(', ') || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  certifications: e.target.value.split(',').map(s => s.trim()).filter(s => s),
                })}
                placeholder="AWS Certified, PMP, CFA Level 1"
              />
            </div>

            {/* Projects */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Projects / Publications / Activities (comma-separated)
              </label>
              <input
                type="text"
                className="input"
                value={formData.projects?.join(', ') || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  projects: e.target.value.split(',').map(s => s.trim()).filter(s => s),
                })}
                placeholder="Bloomberg Trading Challenge, Published research paper, Volunteering"
              />
            </div>
          </div>
        );

      case 'uploads':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary mb-4">📄 Upload Existing Documents (Optional)</h2>
            <p className="text-text-secondary mb-6">
              Upload your existing CV or cover letter to extract additional details and strengthen your new documents.
              The AI will use these for context without directly copying.
            </p>

            {/* CV Upload */}
            <div className="card bg-background-secondary border-2 border-dashed border-border-muted">
              <label className="block text-sm font-medium text-text-primary mb-2">
                📋 Existing CV (Optional)
              </label>
              <input
                type="file"
                accept=".doc,.docx,.pdf,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'cv');
                }}
                className="block w-full text-sm text-text-secondary
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary-dark
                  cursor-pointer"
              />
              {cvFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✅ Uploaded: {cvFile.name}
                </p>
              )}
              <p className="text-xs text-text-muted mt-2">
                Supported formats: DOC, DOCX, PDF, TXT (max 5MB)
              </p>
            </div>

            {/* Cover Letter Upload */}
            <div className="card bg-background-secondary border-2 border-dashed border-border-muted">
              <label className="block text-sm font-medium text-text-primary mb-2">
                💌 Existing Cover Letter (Optional)
              </label>
              <input
                type="file"
                accept=".doc,.docx,.pdf,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'coverLetter');
                }}
                className="block w-full text-sm text-text-secondary
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary-dark
                  cursor-pointer"
              />
              {coverLetterFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✅ Uploaded: {coverLetterFile.name}
                </p>
              )}
              <p className="text-xs text-text-muted mt-2">
                Supported formats: DOC, DOCX, PDF, TXT (max 5MB)
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Why upload documents?</strong><br/>
                The AI will analyze your existing documents to:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Extract details you might have forgotten</li>
                  <li>Understand your writing style and tone</li>
                  <li>Identify additional achievements and skills</li>
                  <li>Strengthen bullet points with more context</li>
                </ul>
              </p>
            </div>
          </div>
        );

      case 'job':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary mb-4">🎯 Target Job Description</h2>
            <p className="text-text-secondary mb-6">
              Add the job description you're applying for. The AI will tailor your CV and cover letter to match the requirements.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.job_description?.job_title || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    job_description: {
                      ...formData.job_description!,
                      job_title: e.target.value,
                    }
                  })}
                  placeholder="Senior Data Analyst"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.job_description?.company_name || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    job_description: {
                      ...formData.job_description!,
                      company_name: e.target.value,
                    }
                  })}
                  placeholder="TechCorp Inc"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Full Job Description
              </label>
              <textarea
                className="input min-h-64"
                value={formData.job_description?.full_description || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  job_description: {
                    ...formData.job_description!,
                    full_description: e.target.value,
                  }
                })}
                placeholder="Paste the complete job description here, including requirements, responsibilities, and qualifications..."
                rows={12}
              />
              <p className="text-xs text-text-muted mt-1">
                💡 Tip: Include the full job posting for best results. The AI will identify keywords and requirements to emphasize in your CV.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>✨ Job Targeting Benefits:</strong><br/>
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Automatically emphasize relevant skills and experiences</li>
                  <li>Integrate keywords naturally for ATS optimization</li>
                  <li>Create a cover letter specifically for this role</li>
                  <li>Highlight matching qualifications and achievements</li>
                </ul>
              </p>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary mb-4">✨ Review & Generate</h2>

            {/* Configuration Options */}
            <div className="card bg-background-secondary">
              <h3 className="text-lg font-semibold text-primary mb-4">Output Configuration</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Language
                  </label>
                  <select
                    className="input"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
                  >
                    <option value="EN">English</option>
                    <option value="RU">Russian</option>
                    <option value="UZ">Uzbek</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Style
                  </label>
                  <select
                    className="input"
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value as CVStyle })}
                  >
                    <option value="HARVARD">Harvard (Classic)</option>
                    <option value="PRO">Pro (Modern)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="card">
              <h3 className="text-lg font-semibold text-primary mb-4">📊 Your Information Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-text-muted">Contact Info:</span>
                  <span className="font-medium text-text-primary">✅ Complete</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-text-muted">Professional Summary:</span>
                  <span className="font-medium text-text-primary">
                    {formData.summary.trim() ? '✅ Added' : '⚠️ Missing'}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-text-muted">Experience Entries:</span>
                  <span className="font-medium text-text-primary">
                    {formData.experience.filter(e => e.company.trim()).length} entries
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-text-muted">Education Entries:</span>
                  <span className="font-medium text-text-primary">
                    {formData.education.filter(e => e.school.trim()).length} entries
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-text-muted">Skills:</span>
                  <span className="font-medium text-text-primary">
                    {formData.skills.hard.length + formData.skills.tools.length + formData.skills.soft.length} items
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-text-muted">Uploaded CV:</span>
                  <span className="font-medium text-text-primary">
                    {cvFile ? `✅ ${cvFile.name}` : '➖ None'}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-text-muted">Uploaded Cover Letter:</span>
                  <span className="font-medium text-text-primary">
                    {coverLetterFile ? `✅ ${coverLetterFile.name}` : '➖ None'}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-text-muted">Job Description:</span>
                  <span className="font-medium text-text-primary">
                    {formData.job_description?.full_description.trim()
                      ? `✅ ${formData.job_description.job_title || 'Added'}`
                      : '➖ None (generic CV)'}
                  </span>
                </div>
              </div>
            </div>

            {/* What You'll Get */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary mb-3">📦 What You'll Receive:</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✅</span>
                  <span><strong>Professional CV</strong> - Harvard-style, ATS-optimized, 1-2 pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✅</span>
                  <span><strong>Tailored Cover Letter</strong> - 3-5 paragraphs, job-specific</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✅</span>
                  <span><strong>LaTeX Format</strong> - Compile on Overleaf for PDF (free)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✅</span>
                  <span><strong>AI-Enhanced Content</strong> - Improved bullets and keywords</span>
                </li>
              </ul>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <strong>❌ Error:</strong> {error}
                </p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Generating Your CV & Cover Letter...
                </span>
              ) : (
                '✨ Generate CV & Cover Letter'
              )}
            </button>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-background-primary to-background-secondary">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline font-medium flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Create Your Professional CV & Cover Letter
          </h1>
          <p className="text-text-secondary">
            Complete the steps below to generate a tailored, ATS-optimized CV and cover letter
          </p>
        </div>

        {/* Progress Bar */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                  index === currentStep
                    ? 'bg-primary text-white'
                    : index < currentStep
                    ? 'bg-primary/20 text-primary cursor-pointer hover:bg-primary/30'
                    : 'bg-background-secondary text-text-muted cursor-not-allowed'
                }`}
                disabled={index > currentStep}
              >
                <span className="text-2xl">{step.icon}</span>
                <span className="text-xs font-medium text-center hidden md:block">{step.title}</span>
                <span className="text-xs font-medium md:hidden">{index + 1}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full h-2 bg-background-secondary rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>

          <p className="text-center text-sm text-text-muted mt-2">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
          </p>
        </div>

        {/* Step Content */}
        <div className="card mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="btn-secondary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {currentStep < STEPS.length - 1 && (
            <button
              onClick={nextStep}
              className="btn-primary px-6 py-3"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
