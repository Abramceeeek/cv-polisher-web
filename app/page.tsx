import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold">
            <span className="text-primary">CV Polisher</span>
          </h1>
          <p className="text-2xl md:text-3xl text-text-secondary">
            Transform Your Resume into a Professional LaTeX CV
          </p>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Create ATS-friendly, beautifully formatted CVs in multiple languages.
            AI-powered content optimization with complete privacy.
          </p>
        </div>

        {/* Privacy Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>100% Private - No data stored, all processing is ephemeral</span>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 py-8">
          <div className="card text-center space-y-3">
            <div className="text-4xl">🤖</div>
            <h3 className="text-xl font-semibold text-primary">AI-Powered</h3>
            <p className="text-text-muted">
              Enhance your content with Google Gemini or use smart fallback polishing
            </p>
          </div>

          <div className="card text-center space-y-3">
            <div className="text-4xl">🌍</div>
            <h3 className="text-xl font-semibold text-primary">Multi-Language</h3>
            <p className="text-text-muted">
              Support for English, Russian, and Uzbek with proper Unicode rendering
            </p>
          </div>

          <div className="card text-center space-y-3">
            <div className="text-4xl">🎨</div>
            <h3 className="text-xl font-semibold text-primary">Two Styles</h3>
            <p className="text-text-muted">
              Choose between HARVARD (classic) or PRO (modern) LaTeX templates
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/polisher" className="btn btn-primary text-center text-lg">
            Start Polishing Your CV
          </Link>
          <Link href="/help" className="btn btn-secondary text-center text-lg">
            Learn More
          </Link>
        </div>

        {/* How It Works */}
        <div className="card space-y-4 mt-12">
          <h2 className="section-title text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">1</div>
              <p className="text-text-secondary">Fill in your CV details through our multi-step form</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">2</div>
              <p className="text-text-secondary">Choose your preferred style and language</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">3</div>
              <p className="text-text-secondary">AI polishes your content for ATS optimization</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">4</div>
              <p className="text-text-secondary">Download your .tex file and compile in Overleaf</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-text-muted pt-8">
          <p>No database • No tracking • No payment required</p>
          <p className="mt-2">
            Built by{' '}
            <a
              href="https://abdurakhmonbek.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Abdurakhmonbek Fayzullaev
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
