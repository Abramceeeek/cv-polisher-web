'use client';

import { useState } from 'react';

export default function CVPolisherForm() {
  const [file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [role, setRole] = useState('');
  const [lang, setLang] = useState('EN');
  const [ai, setAi] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'tex'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const API = (process.env.NEXT_PUBLIC_POLISHER_API || 'https://cv-polisher.onrender.com') + '/polish-latex';

  const submit = async () => {
    setError(null);
    setSuccess(false);
    setIsGenerating(true);

    try {
      // Validation
      if (!file && !cvText.trim()) {
        throw new Error('Please upload a file or paste your CV text');
      }
      if (!role.trim()) {
        throw new Error('Please enter a target role');
      }

      const fd = new FormData();
      if (file) fd.append('file', file);
      if (!file && cvText) fd.append('cv_text', cvText);
      fd.append('jd_text', jdText);
      fd.append('target_role', role);
      fd.append('language', lang);
      fd.append('ai', String(ai));
      fd.append('format', format);
      fd.append('template', 'harvard');

      const res = await fetch(API, { method: 'POST', body: fd });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const filename = format === 'pdf' ? `CV_${lang}.pdf` : `CV_${lang}.tex`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      a.click();
      URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate CV';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">🚀 Quick CV Polish</h2>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>100% Private</span>
          </div>
        </div>

        {/* Section A: CV Input */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-primary">📄</span>
            Section A – Your Current CV
          </h3>
          <div className="space-y-3">
            <div>
              <label className="label">Upload PDF or DOCX</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] ?? null);
                    if (e.target.files?.[0]) setCvText(''); // Clear text if file uploaded
                  }}
                  className="w-full border border-border rounded p-3 cursor-pointer hover:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                />
              </div>
              {file && (
                <p className="text-sm text-primary mt-1">
                  ✓ Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
            <div className="text-center text-text-muted font-semibold">— OR —</div>
            <div>
              <label className="label">Paste CV Text</label>
              <textarea
                value={cvText}
                onChange={(e) => {
                  setCvText(e.target.value);
                  if (e.target.value.trim()) setFile(null); // Clear file if text pasted
                }}
                rows={8}
                className="textarea w-full"
                placeholder="Paste your CV content here... (at least 100 characters)"
              />
              {cvText && (
                <p className="text-sm text-text-muted mt-1">
                  {cvText.length} characters
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section B: Targeting */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-primary">🎯</span>
            Section B – Targeting
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label">Target Role (required) *</label>
              <input
                className="input w-full"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Data Analyst, Software Engineer, Marketing Manager"
                required
              />
            </div>
            <div>
              <label className="label">Job Description (optional - highly recommended for tailoring)</label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={8}
                className="textarea w-full"
                placeholder="Paste the job description here to tailor your CV to match the role's requirements..."
              />
              {jdText && (
                <p className="text-sm text-primary mt-1">
                  ✓ {jdText.split(/\s+/).length} words - CV will be tailored to this JD
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Language</label>
                <select
                  className="input w-full"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  <option value="EN">🇬🇧 English</option>
                  <option value="RU">🇷🇺 Russian</option>
                  <option value="UZ">🇺🇿 Uzbek</option>
                </select>
              </div>
              <div>
                <label className="label">Output Format</label>
                <select
                  className="input w-full"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as 'pdf' | 'tex')}
                >
                  <option value="pdf">📄 PDF (ready to use)</option>
                  <option value="tex">📝 LaTeX (.tex for Overleaf)</option>
                </select>
              </div>
            </div>
            <div className="card bg-background-tertiary p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="ai-toggle"
                  checked={ai}
                  onChange={(e) => setAi(e.target.checked)}
                  className="w-5 h-5 mt-0.5 cursor-pointer"
                />
                <label htmlFor="ai-toggle" className="text-sm cursor-pointer flex-1">
                  <span className="font-semibold">Use AI (Gemini)</span>
                  <p className="text-text-muted mt-1">
                    {ai ? '✓ AI-powered tailoring enabled (uses Gemini API quota)' : '✗ Free mode: keyword-based ranking only ($0 cost)'}
                  </p>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={submit}
          disabled={isGenerating || (!file && !cvText.trim()) || !role.trim()}
          className="btn btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {ai ? 'Tailoring with AI...' : 'Processing...'}
            </>
          ) : (
            <>🚀 Generate My Polished CV</>
          )}
        </button>

        {/* Success Message */}
        {success && (
          <div className="mt-4 p-4 bg-green-900/20 border border-green-500 rounded animate-fade-in">
            <p className="text-green-400 font-semibold">✓ CV generated successfully!</p>
            <p className="text-sm text-green-300 mt-1">
              {format === 'pdf'
                ? 'Your PDF has been downloaded. Check your downloads folder.'
                : 'Your LaTeX file has been downloaded. Upload it to Overleaf to compile.'}
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded animate-fade-in">
            <p className="text-red-400 font-semibold">✗ Error</p>
            <p className="text-sm text-red-300 mt-1">{error}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 card bg-background-tertiary">
          <h4 className="font-semibold mb-3 text-primary">💡 How it works:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-text-secondary">
            <li><strong>Upload or Paste:</strong> Provide your existing CV (PDF, DOCX, or text)</li>
            <li><strong>Target Role:</strong> Specify the job title you're applying for</li>
            <li><strong>Job Description (optional):</strong> Paste the JD to tailor your CV with relevant keywords</li>
            <li><strong>AI Mode:</strong> Toggle on for intelligent tailoring (uses API) or off for free keyword ranking</li>
            <li><strong>Output:</strong> Get a ready-to-use PDF or editable LaTeX file</li>
          </ul>
        </div>

        {/* Free Mode Explanation */}
        {!ai && (
          <div className="mt-4 card bg-blue-900/10 border-blue-500/30">
            <h4 className="font-semibold mb-2 text-blue-400">🆓 Free Mode Active</h4>
            <p className="text-sm text-blue-300">
              Your CV will be tailored using keyword matching against the job description.
              The most relevant bullet points will be prioritized. No AI API calls = $0 cost!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
