import CVPolisherForm from '@/components/CVPolisherForm';
import Link from 'next/link';

export default function UploadPage() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-background-primary to-background-secondary">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link href="/" className="text-primary hover:underline font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <Link href="/polisher" className="text-text-muted hover:text-primary text-sm flex items-center gap-2">
            Or try the step-by-step form
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="card bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Quick CV Upload & Polish
          </h1>
          <p className="text-text-secondary">
            Upload your existing CV, add a job description, and get a tailored, ATS-optimized version in seconds.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-primary">Fast</h3>
            <p className="text-sm text-text-muted">Upload and generate in under 1 minute</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-primary">Tailored</h3>
            <p className="text-sm text-text-muted">Match job descriptions automatically</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">🆓</div>
            <h3 className="font-semibold text-primary">Free Mode</h3>
            <p className="text-sm text-text-muted">$0 cost with keyword-based ranking</p>
          </div>
        </div>

        <CVPolisherForm />
      </div>
    </main>
  );
}
