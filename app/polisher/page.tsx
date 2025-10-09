'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CVData, Language, CVStyle } from '@/lib/types';
import ExperienceFields from '@/components/ExperienceFields';
import EducationFields from '@/components/EducationFields';

const STEPS = [
  'Contact',
  'Summary',
  'Experience',
  'Education',
  'Skills',
  'Options',
  'Generate',
];

export default function PolisherPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewLatex, setPreviewLatex] = useState<string>('');

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
        extra: '',
      },
    ],
    skills: {
      hard: [],
      soft: [],
      tools: [],
    },
    certifications: [],
    languages_extra: [],
    language: 'EN',
    style: 'HARVARD',
  });

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
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
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // Get filename from header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'CV_Polished.tex';

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Show preview
      const text = await blob.text();
      setPreviewLatex(text);

      // Show success toast
      showToast('CV generated successfully!', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate CV';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 5000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Contact
        return (
          <div className="space-y-4">
            <div>
              <label className="label">Full Name *</label>
              <input
                type="text"
                className="input"
                value={formData.contact.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, name: e.target.value },
                  })
                }
                placeholder="e.g., John Smith"
                required
              />
            </div>

            <div>
              <label className="label">Email *</label>
              <input
                type="email"
                className="input"
                value={formData.contact.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value },
                  })
                }
                placeholder="e.g., john.smith@email.com"
                required
              />
            </div>

            <div>
              <label className="label">Phone</label>
              <input
                type="tel"
                className="input"
                value={formData.contact.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value },
                  })
                }
                placeholder="e.g., +44 7XXX XXXXXX"
              />
            </div>

            <div>
              <label className="label">Location</label>
              <input
                type="text"
                className="input"
                value={formData.contact.location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, location: e.target.value },
                  })
                }
                placeholder="e.g., London, UK"
              />
            </div>

            <div>
              <label className="label">Links (comma-separated)</label>
              <input
                type="text"
                className="input"
                value={formData.contact.links}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, links: e.target.value },
                  })
                }
                placeholder="e.g., linkedin.com/in/yourprofile, github.com/yourusername"
              />
              <p className="text-xs text-text-muted mt-1">
                Separate multiple links with commas
              </p>
            </div>
          </div>
        );

      case 1: // Summary
        return (
          <div className="space-y-4">
            <div>
              <label className="label">Professional Summary</label>
              <textarea
                className="textarea"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Write a brief professional summary (2-4 sentences) highlighting your expertise and career goals..."
                rows={6}
              />
              <p className="text-xs text-text-muted mt-1">
                This will be polished to be more ATS-friendly and professional
              </p>
            </div>
          </div>
        );

      case 2: // Experience
        return (
          <div className="space-y-4">
            <p className="text-text-secondary">
              Add your work experience. The AI will polish your bullet points to be more impactful.
            </p>
            <ExperienceFields
              experience={formData.experience}
              onChange={(experience) => setFormData({ ...formData, experience })}
            />
          </div>
        );

      case 3: // Education
        return (
          <div className="space-y-4">
            <p className="text-text-secondary">
              Add your educational background
            </p>
            <EducationFields
              education={formData.education}
              onChange={(education) => setFormData({ ...formData, education })}
            />
          </div>
        );

      case 4: // Skills
        return (
          <div className="space-y-4">
            <div>
              <label className="label">Technical Skills</label>
              <input
                type="text"
                className="input"
                value={formData.skills.hard.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: {
                      ...formData.skills,
                      hard: e.target.value.split(',').map((s) => s.trim()).filter((s) => s),
                    },
                  })
                }
                placeholder="e.g., Python, R, SQL, Machine Learning"
              />
            </div>

            <div>
              <label className="label">Tools & Technologies</label>
              <input
                type="text"
                className="input"
                value={formData.skills.tools.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: {
                      ...formData.skills,
                      tools: e.target.value.split(',').map((s) => s.trim()).filter((s) => s),
                    },
                  })
                }
                placeholder="e.g., Git, Docker, AWS, Tableau"
              />
            </div>

            <div>
              <label className="label">Soft Skills</label>
              <input
                type="text"
                className="input"
                value={formData.skills.soft.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: {
                      ...formData.skills,
                      soft: e.target.value.split(',').map((s) => s.trim()).filter((s) => s),
                    },
                  })
                }
                placeholder="e.g., Leadership, Communication, Problem Solving"
              />
            </div>

            <div>
              <label className="label">Certifications (comma-separated)</label>
              <textarea
                className="textarea"
                value={formData.certifications.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    certifications: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter((s) => s),
                  })
                }
                placeholder="e.g., AWS Certified Solutions Architect, PMP"
                rows={3}
              />
            </div>

            <div>
              <label className="label">Languages (with proficiency)</label>
              <input
                type="text"
                className="input"
                value={formData.languages_extra.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    languages_extra: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter((s) => s),
                  })
                }
                placeholder="e.g., English (Native), Spanish (C1), French (B2)"
              />
            </div>
          </div>
        );

      case 5: // Options
        return (
          <div className="space-y-6">
            <div>
              <label className="label">CV Language</label>
              <div className="grid grid-cols-3 gap-4">
                {(['EN', 'RU', 'UZ'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setFormData({ ...formData, language: lang })}
                    className={`card text-center py-4 cursor-pointer transition-all ${
                      formData.language === lang
                        ? 'border-primary ring-2 ring-primary'
                        : 'hover:border-primary-dark'
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {lang === 'EN' ? '🇬🇧' : lang === 'RU' ? '🇷🇺' : '🇺🇿'}
                    </div>
                    <div className="font-semibold">
                      {lang === 'EN' ? 'English' : lang === 'RU' ? 'Russian' : 'Uzbek'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">CV Style</label>
              <div className="grid grid-cols-2 gap-4">
                {(['HARVARD', 'PRO'] as CVStyle[]).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setFormData({ ...formData, style })}
                    className={`card text-left p-4 cursor-pointer transition-all ${
                      formData.style === style
                        ? 'border-primary ring-2 ring-primary'
                        : 'hover:border-primary-dark'
                    }`}
                  >
                    <div className="font-semibold text-lg mb-2">{style}</div>
                    <p className="text-sm text-text-muted">
                      {style === 'HARVARD'
                        ? 'Classic single-column layout with small caps section headers'
                        : 'Modern professional layout with subtle rule lines'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6: // Generate
        return (
          <div className="space-y-6">
            <div className="card bg-background-tertiary">
              <h3 className="text-xl font-semibold mb-4 text-primary">Ready to Generate!</h3>
              <p className="text-text-secondary mb-4">
                Click the button below to generate your polished LaTeX CV. The file will download
                automatically.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-primary">Name:</strong> {formData.contact.name}
                </div>
                <div>
                  <strong className="text-primary">Language:</strong> {formData.language}
                </div>
                <div>
                  <strong className="text-primary">Style:</strong> {formData.style}
                </div>
                <div>
                  <strong className="text-primary">Experience Entries:</strong>{' '}
                  {formData.experience.length}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn btn-primary w-full text-lg py-4"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
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
                  Generating...
                </>
              ) : (
                '🚀 Generate My Polished CV'
              )}
            </button>

            {error && (
              <div className="card bg-red-900/20 border-red-500">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {previewLatex && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-2 text-primary">LaTeX Preview</h3>
                <p className="text-sm text-text-muted mb-3">
                  Upload this to Overleaf and compile with XeLaTeX
                </p>
                <pre className="bg-background-primary p-4 rounded overflow-x-auto text-xs">
                  <code>{previewLatex.substring(0, 1000)}...</code>
                </pre>
                <div className="mt-4 card bg-background-tertiary">
                  <h4 className="font-semibold mb-2">📝 How to Compile:</h4>
                  <ol className="text-sm space-y-1 list-decimal list-inside text-text-secondary">
                    <li>Go to Overleaf.com and create a free account</li>
                    <li>Create a new blank project</li>
                    <li>Upload your downloaded .tex file</li>
                    <li>
                      Click Menu → Compiler → Select <strong>XeLaTeX</strong>
                    </li>
                    <li>Click "Recompile" to generate your PDF</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>100% Private</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card">
          <div className="flex justify-between mb-4">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className={`flex-1 text-center ${
                  index === currentStep
                    ? 'text-primary font-semibold'
                    : index < currentStep
                    ? 'text-text-secondary'
                    : 'text-text-muted'
                }`}
              >
                <div className="text-sm mb-2">
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <div className="text-xs">{step}</div>
              </div>
            ))}
          </div>
          <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <h2 className="section-title">{STEPS[currentStep]}</h2>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="btn btn-secondary"
          >
            ← Previous
          </button>
          {currentStep < STEPS.length - 1 && (
            <button type="button" onClick={nextStep} className="btn btn-primary">
              Next →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
