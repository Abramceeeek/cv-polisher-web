import CVPolisherForm from '@/components/CVPolisherForm';
import Link from 'next/link';

export default function UploadPage() {
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

        <CVPolisherForm />
      </div>
    </main>
  );
}
