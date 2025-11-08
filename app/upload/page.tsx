'use client';

import { useState } from 'react';
import Link from 'next/link';
import { extractTextFromDocument, cleanExtractedText, validateAndTruncateText } from '@/lib/documentParser';

export default function QuickUploadPage() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState<string>('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [language, setLanguage] = useState<'EN' | 'RU' | 'UZ'>('EN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'job' | 'options'>('upload');

  // Handle CV file upload
  const handleCVUpload = async (file: File) => {
    setError(null);
    setLoading(true);

    try {
      console.log('[Quick Upload] Processing CV file:', file.name);

      const extractedText = await extractTextFromDocument(file);
      const cleanedText = cleanExtractedText(extractedText);

      if (!cleanedText || cleanedText.length < 100) {
        throw new Error('Could not extract enough text from CV. Please check your file.');
      }

      const finalText = validateAndTruncateText(cleanedText, 20000);

      setCvFile(file);
      setCvText(finalText);
      setStep('job');

      console.log('[Quick Upload] Successfully extracted', finalText.length, 'characters');
    } catch (err: any) {
      console.error('[Quick Upload] Error:', err);
      setError(err.message || 'Failed to process CV file');
    } finally {
      setLoading(false);
    }
  };

  // Handle generate
  const handleGenerate = async () => {
    setError(null);
    setLoading(true);

    try {
      console.log('[Quick Upload] Generating CV and Cover Letter...');

      // Call API with upload-only mode
      const response = await fetch('/api/polish-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv_text: cvText,
          job_description: jobDescription ? {
            job_title: jobTitle,
            company_name: companyName,
            full_description: jobDescription,
          } : undefined,
          language,
        }),
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
      a.download = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'CV_and_CoverLetter.txt';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('[Quick Upload] Successfully generated and downloaded');

      // Reset form
      setCvFile(null);
      setCvText('');
      setJobTitle('');
      setCompanyName('');
      setJobDescription('');
      setStep('upload');

    } catch (err: any) {
      console.error('[Quick Upload] Error generating:', err);
      setError(err.message || 'Failed to generate CV and cover letter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-background-primary to-background-secondary">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link href="/" className="text-primary hover:underline font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <Link href="/create" className="text-text-muted hover:text-primary text-sm flex items-center gap-2">
            Or use the detailed form
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Hero */}
        <div className="card bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            ⚡ Quick Upload & Polish
          </h1>
          <p className="text-text-secondary">
            Skip the form! Just upload your CV and paste a job description. Get a tailored CV + cover letter in seconds.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className={`px-4 py-2 rounded ${step === 'upload' ? 'bg-primary text-white' : 'bg-surface text-text-muted'}`}>
            1. Upload CV
          </div>
          <div className="text-text-muted">→</div>
          <div className={`px-4 py-2 rounded ${step === 'job' ? 'bg-primary text-white' : 'bg-surface text-text-muted'}`}>
            2. Job (Optional)
          </div>
          <div className="text-text-muted">→</div>
          <div className={`px-4 py-2 rounded ${step === 'options' ? 'bg-primary text-white' : 'bg-surface text-text-muted'}`}>
            3. Generate
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="card bg-red-500/10 border-red-500/50">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Step 1: Upload CV */}
        {step === 'upload' && (
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold text-primary">📄 Upload Your Existing CV</h2>
            <p className="text-text-muted text-sm">
              Upload your CV in PDF, DOCX, or TXT format. We'll extract all the information automatically.
            </p>

            <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                id="cv-upload"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCVUpload(file);
                }}
                className="hidden"
                disabled={loading}
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                <div className="text-5xl mb-4">📎</div>
                <div className="text-lg font-medium text-primary mb-2">
                  {loading ? 'Processing...' : 'Click to Upload CV'}
                </div>
                <div className="text-sm text-text-muted">
                  Supports PDF, DOCX, DOC, TXT (max 5MB)
                </div>
              </label>
            </div>

            {cvFile && (
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded">
                <div className="text-2xl">✅</div>
                <div className="flex-1">
                  <div className="font-medium text-primary">{cvFile.name}</div>
                  <div className="text-sm text-text-muted">{cvText.length} characters extracted</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Job Description */}
        {step === 'job' && (
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold text-primary">🎯 Target Job (Optional)</h2>
            <p className="text-text-muted text-sm">
              Add the job posting you're applying for. We'll tailor your CV and cover letter to match.
              <strong> You can skip this for a generic CV.</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior Data Scientist"
                  className="w-full px-4 py-2 bg-surface border border-border rounded focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Google"
                  className="w-full px-4 py-2 bg-surface border border-border rounded focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Full Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job posting here..."
                  rows={8}
                  className="w-full px-4 py-2 bg-surface border border-border rounded focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('upload')}
                className="btn btn-secondary flex-1"
                disabled={loading}
              >
                ← Back
              </button>
              <button
                onClick={() => setStep('options')}
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Options & Generate */}
        {step === 'options' && (
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold text-primary">⚙️ Final Options</h2>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'EN' | 'RU' | 'UZ')}
                className="w-full px-4 py-2 bg-surface border border-border rounded focus:border-primary focus:outline-none"
              >
                <option value="EN">English</option>
                <option value="RU">Russian (Русский)</option>
                <option value="UZ">Uzbek (O'zbek)</option>
              </select>
            </div>

            {/* Summary */}
            <div className="p-4 bg-primary/5 rounded space-y-2">
              <div className="font-medium text-primary">Ready to Generate:</div>
              <div className="text-sm space-y-1 text-text-secondary">
                <div>✅ CV uploaded: {cvFile?.name}</div>
                <div>{jobDescription ? `✅ Job: ${jobTitle || 'Provided'}` : '⚠️ No job (generic CV)'}</div>
                <div>✅ Language: {language === 'EN' ? 'English' : language === 'RU' ? 'Russian' : 'Uzbek'}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('job')}
                className="btn btn-secondary flex-1"
                disabled={loading}
              >
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Generating...' : '✨ Generate CV & Cover Letter'}
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="card bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <h3 className="font-semibold text-primary mb-2">How It Works:</h3>
          <ol className="text-sm text-text-secondary space-y-1 list-decimal list-inside">
            <li>AI extracts all information from your uploaded CV</li>
            <li>Optionally tailors content to match job description</li>
            <li>Generates professional Harvard-style CV</li>
            <li>Creates matching cover letter (3-5 paragraphs)</li>
            <li>Downloads both as LaTeX file (compile on Overleaf)</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
