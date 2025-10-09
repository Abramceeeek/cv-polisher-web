import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CV Polisher - Professional Resume Optimization',
  description: 'Transform your resume with AI-powered CV polishing. Generate ATS-friendly LaTeX CVs with professional formatting.',
  keywords: 'CV, resume, LaTeX, ATS, job application, career',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
