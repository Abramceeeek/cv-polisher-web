'use client';

import { useState } from 'react';

export default function CVPolisherForm() {
  const [file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [role, setRole] = useState('Data Analyst');
  const [lang, setLang] = useState('EN');
  const [ai, setAi] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'tex'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API = (process.env.NEXT_PUBLIC_POLISHER_API || 'https://cv-polisher.onrender.com') + '/polish-latex';

  const submit = async () => {
    setError(null);
    setIsGenerating(true);

    try {
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
        throw new Error(`Error: ${msg}`);
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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate CV';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-primary">CV Polisher</h2>

        {/* Section A: CV Input */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Section A – Your Current CV</h3>
          <div className="space-y-3">
            <div>
              <label className="label">Upload PDF or DOCX</label>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="text-center text-text-muted">— OR —</div>
            <div>
              <label className="label">Paste CV Text</label>
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={8}
                className="textarea w-full"
                placeholder="Paste your CV content here..."
              />
            </div>
          </div>
        </div>

        {/* Section B: Targeting */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Section B – Targeting</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Target Role (short title)</label>
              <input
                className="input w-full"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Data Analyst"
              />
            </div>
            <div>
              <label className="label">Job Description (paste or upload text)</label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={8}
                className="textarea w-full"
                placeholder="Paste the job description here..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Language</label>
                <select
                  className="input w-full"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  <option value="EN">English</option>
                  <option value="RU">Russian</option>
                  <option value="UZ">Uzbek</option>
                </select>
              </div>
              <div>
                <label className="label">Output Format</label>
                <select
                  className="input w-full"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as 'pdf' | 'tex')}
                >
                  <option value="pdf">PDF</option>
                  <option value="tex">LaTeX (.tex)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ai-toggle"
                checked={ai}
                onChange={(e) => setAi(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="ai-toggle" className="text-sm">
                Use AI (uses Gemini, may consume quota)
              </label>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={submit}
          disabled={isGenerating || (!file && !cvText.trim())}
          className="btn btn-primary w-full text-lg py-3"
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
              Generating...
            </>
          ) : (
            'Generate'
          )}
        </button>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 p-4 bg-background-tertiary rounded text-sm text-text-muted">
          <p className="font-semibold mb-2">How it works:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Upload your CV or paste the text</li>
            <li>Paste the job description you're targeting (optional)</li>
            <li>Toggle AI on for smart tailoring, or keep it off for free keyword-based optimization</li>
            <li>Choose PDF for immediate use, or .tex to edit in Overleaf</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
