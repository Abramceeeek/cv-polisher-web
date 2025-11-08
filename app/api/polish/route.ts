import { NextRequest, NextResponse } from 'next/server';
import { CVData } from '@/lib/types';
import { polishCVAndCoverLetter } from '@/lib/cvPolisher2';
import { generateLatex, generateCoverLetterLatex } from '@/lib/latex';
import { checkRateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs'; // Use Node.js runtime for Gemini SDK

/**
 * POST /api/polish - Generate polished CV and Cover Letter LaTeX files
 *
 * Returns both documents in a single response with separator:
 * 1. Harvard_CV.tex
 * 2. %%% COVER LETTER %%%
 * 3. Harvard_Cover_Letter.tex
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown';

    const rateLimitResult = checkRateLimit(identifier);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter || 60),
            'Access-Control-Allow-Origin': process.env.FRONTEND_ORIGIN || '*',
          }
        }
      );
    }

    // Parse request body
    const data: CVData = await request.json();

    // Basic validation
    if (!data.contact?.name) {
      return NextResponse.json(
        { error: 'Contact name is required' },
        { status: 400 }
      );
    }

    if (!data.summary && (!data.experience || data.experience.length === 0)) {
      return NextResponse.json(
        { error: 'At least a summary or one experience entry is required' },
        { status: 400 }
      );
    }

    if (!data.language || !['EN', 'RU', 'UZ'].includes(data.language)) {
      return NextResponse.json(
        { error: 'Valid language (EN, RU, UZ) is required' },
        { status: 400 }
      );
    }

    if (!data.style || !['HARVARD', 'PRO'].includes(data.style)) {
      return NextResponse.json(
        { error: 'Valid style (HARVARD, PRO) is required' },
        { status: 400 }
      );
    }

    console.log(`[API] Processing CV for: ${data.contact.name}, lang: ${data.language}, style: ${data.style}`);
    if (data.job_description) {
      console.log(`[API] Tailoring to job: ${data.job_description.job_title} at ${data.job_description.company_name || 'company'}`);
    }
    if (data.uploaded_documents) {
      if (data.uploaded_documents.existing_cv_text) {
        console.log(`[API] Uploaded CV text: ${data.uploaded_documents.existing_cv_text.length} characters`);
      }
      if (data.uploaded_documents.existing_cover_letter_text) {
        console.log(`[API] Uploaded cover letter text: ${data.uploaded_documents.existing_cover_letter_text.length} characters`);
      }
    }

    // Polish the CV and generate Cover Letter using Gemini
    const { polished_cv, cover_letter } = await polishCVAndCoverLetter(data);

    console.log(`[API] CV and Cover Letter polished, generating LaTeX...`);

    // Generate LaTeX for CV
    const cvLatex = generateLatex(polished_cv);

    // Generate LaTeX for Cover Letter
    const coverLetterLatex = generateCoverLetterLatex(cover_letter);

    // Combine both documents with separator
    const combinedOutput = `${cvLatex}
%%% COVER LETTER %%%
${coverLetterLatex}`;

    console.log(`[API] Generated combined LaTeX output (${combinedOutput.length} bytes)`);

    // Generate filename
    const safeName = data.contact.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `CV_and_CoverLetter_${safeName}_${data.style}_${data.language}.txt`;

    // Return combined LaTeX as text file
    return new NextResponse(combinedOutput, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': process.env.FRONTEND_ORIGIN || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('[API] Error processing CV:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate CV and Cover Letter. Please check your data and try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': process.env.FRONTEND_ORIGIN || '*',
        }
      }
    );
  }
}

/**
 * OPTIONS - CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.FRONTEND_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
