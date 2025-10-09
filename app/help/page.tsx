import Link from 'next/link';

export default function HelpPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Link href="/" className="text-primary hover:underline inline-block">
          ← Back to Home
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-primary">Help & Guide</h1>
          <p className="text-xl text-text-secondary">
            Everything you need to know about using CV Polisher
          </p>
        </div>

        {/* Compiling LaTeX */}
        <div className="card">
          <h2 className="section-title">📄 How to Compile Your LaTeX CV</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary">
                Option 1: Overleaf (Recommended)
              </h3>
              <ol className="space-y-2 list-decimal list-inside text-text-secondary">
                <li>Go to <a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Overleaf.com</a> and create a free account</li>
                <li>Click "New Project" → "Blank Project"</li>
                <li>Delete the default content in main.tex</li>
                <li>Upload your downloaded .tex file or copy-paste the content</li>
                <li>
                  <strong>Important:</strong> Click "Menu" (top left) → Compiler → Select{' '}
                  <span className="text-primary font-mono">XeLaTeX</span>
                </li>
                <li>Click "Recompile" to generate your PDF</li>
                <li>Download the PDF using the download button</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary">
                Option 2: Local LaTeX Installation
              </h3>
              <p className="text-text-secondary mb-3">
                If you have LaTeX installed locally (TeX Live, MiKTeX, or MacTeX):
              </p>
              <pre className="bg-background-primary p-4 rounded-lg text-primary">
                <code>xelatex your_cv.tex</code>
              </pre>
              <p className="text-sm text-text-muted mt-2">
                Make sure you have XeLaTeX installed (it's included in all major LaTeX distributions)
              </p>
            </div>

            <div className="card bg-background-tertiary">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <span>Why XeLaTeX?</span>
              </h4>
              <p className="text-sm text-text-secondary">
                XeLaTeX is required because it properly handles Unicode characters (essential for
                Russian and Uzbek), supports modern fonts like DejaVu Serif, and provides better
                typography. Regular pdflatex won't work with our templates.
              </p>
            </div>
          </div>
        </div>

        {/* Fonts */}
        <div className="card">
          <h2 className="section-title">🎨 Fonts & Formatting</h2>
          <div className="space-y-4">
            <p className="text-text-secondary">
              Our LaTeX templates use <strong className="text-primary">DejaVu Serif</strong>, a
              professional font that supports:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
              <li>Latin characters (English, Uzbek)</li>
              <li>Cyrillic characters (Russian)</li>
              <li>Professional typography with proper ligatures</li>
              <li>Cross-platform compatibility</li>
            </ul>
            <div className="card bg-background-tertiary">
              <p className="text-sm text-text-secondary">
                <strong>Note:</strong> Overleaf has DejaVu Serif pre-installed. If compiling
                locally, make sure the font is installed on your system.
              </p>
            </div>
          </div>
        </div>

        {/* Styles */}
        <div className="card">
          <h2 className="section-title">🎯 CV Styles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card bg-background-tertiary">
              <h3 className="text-lg font-semibold mb-3 text-primary">HARVARD</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>✓ Classic single-column layout</li>
                <li>✓ Small caps section headers</li>
                <li>✓ Clean, traditional appearance</li>
                <li>✓ Ideal for academic and research positions</li>
                <li>✓ High readability</li>
              </ul>
            </div>

            <div className="card bg-background-tertiary">
              <h3 className="text-lg font-semibold mb-3 text-primary">PRO</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>✓ Modern professional layout</li>
                <li>✓ Subtle horizontal rules</li>
                <li>✓ Tighter vertical spacing</li>
                <li>✓ Perfect for corporate roles</li>
                <li>✓ Contemporary aesthetic</li>
              </ul>
            </div>
          </div>
        </div>

        {/* AI Polishing */}
        <div className="card">
          <h2 className="section-title">🤖 How AI Polishing Works</h2>
          <div className="space-y-4">
            <p className="text-text-secondary">
              CV Polisher uses Google Gemini AI to enhance your CV content:
            </p>

            <div className="space-y-3">
              <div className="card bg-background-tertiary">
                <h4 className="font-semibold mb-2">✨ What It Does</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary ml-4">
                  <li>Rewrites bullet points with strong action verbs</li>
                  <li>Optimizes for ATS (Applicant Tracking Systems)</li>
                  <li>Improves clarity and professional tone</li>
                  <li>Suggests measurable outcomes where appropriate</li>
                </ul>
              </div>

              <div className="card bg-background-tertiary">
                <h4 className="font-semibold mb-2">🔒 What It Doesn't Do</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary ml-4">
                  <li>Never invents facts, numbers, or qualifications</li>
                  <li>Keeps all dates, company names, and titles exactly as provided</li>
                  <li>Doesn't add tools or skills you didn't mention</li>
                  <li>Preserves your chosen language (EN/RU/UZ)</li>
                </ul>
              </div>

              <div className="card bg-background-tertiary">
                <h4 className="font-semibold mb-2">🔄 Fallback Mode</h4>
                <p className="text-sm text-text-secondary">
                  If AI is unavailable, CV Polisher uses smart heuristics to improve your content:
                  converting passive voice to active, adding strong verbs, and normalizing
                  formatting.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="card bg-background-tertiary">
          <h2 className="section-title">🔒 Privacy & Security</h2>
          <ul className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span>
                <strong>No Database:</strong> We don't store any of your CV data. Everything is
                processed in memory and discarded immediately.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span>
                <strong>No Tracking:</strong> We don't use analytics, cookies, or any tracking
                mechanisms.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span>
                <strong>No Account Required:</strong> Use the tool anonymously without creating an
                account.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">✓</span>
              <span>
                <strong>Ephemeral Processing:</strong> Files are generated on-the-fly and
                downloaded directly to your computer.
              </span>
            </li>
          </ul>
        </div>

        {/* Tips */}
        <div className="card">
          <h2 className="section-title">💡 Tips for Best Results</h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-primary">Writing Bullet Points</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary ml-4">
                <li>Start with action verbs (Led, Developed, Managed, etc.)</li>
                <li>Include metrics when possible (increased by 20%, managed team of 5)</li>
                <li>Focus on outcomes and achievements, not just responsibilities</li>
                <li>Keep each bullet to 1-2 lines</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-primary">Professional Summary</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary ml-4">
                <li>Keep it to 2-4 sentences</li>
                <li>Highlight your most relevant experience and skills</li>
                <li>Mention your career goals or what you're seeking</li>
                <li>Use industry-specific keywords</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-primary">Skills Section</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary ml-4">
                <li>List most relevant skills first</li>
                <li>Include proficiency levels for languages</li>
                <li>Separate technical skills from soft skills</li>
                <li>Be honest - don't list skills you're not comfortable with</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="card">
          <h2 className="section-title">🔧 Troubleshooting</h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-text-secondary">
                LaTeX compilation errors in Overleaf
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-text-muted ml-4">
                <li>Make sure you selected XeLaTeX compiler (not pdfLaTeX)</li>
                <li>Check that your text doesn't have special LaTeX characters</li>
                <li>Ensure DejaVu Serif font is available</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-text-secondary">
                Cyrillic text not showing correctly
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-text-muted ml-4">
                <li>Confirm you selected XeLaTeX (required for Unicode)</li>
                <li>Check that the language is set to RU in your options</li>
                <li>Verify the font supports Cyrillic (DejaVu Serif does)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-text-secondary">
                CV generation fails or times out
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-text-muted ml-4">
                <li>Check that you've filled in required fields (name, at least one experience)</li>
                <li>Try reducing the length of your bullet points</li>
                <li>Wait a minute and try again (rate limiting)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link href="/polisher" className="btn btn-primary text-lg">
            Start Creating Your CV →
          </Link>
        </div>
      </div>
    </main>
  );
}
