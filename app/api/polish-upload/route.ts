import { NextRequest, NextResponse } from 'next/server';
import { extractCVDataFromDocument, polishCVAndCoverLetter } from '@/lib/cvPolisher2';
import { generateLatex, generateCoverLetterLatex } from '@/lib/latex';
import { checkRateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

/**
 * POST /api/polish-upload - Quick upload mode
 * User uploads CV file, we extract data, polish, and generate
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

    // Parse request
    const body = await request.json();
    const { cv_text, job_description, language } = body;

    // Validate
    if (!cv_text || cv_text.length < 100) {
      return NextResponse.json(
        { error: 'CV text is required and must be at least 100 characters' },
        { status: 400 }
      );
    }

    if (!language || !['EN', 'RU', 'UZ'].includes(language)) {
      return NextResponse.json(
        { error: 'Valid language (EN, RU, UZ) is required' },
        { status: 400 }
      );
    }

    console.log('[API Upload] Processing uploaded CV (', cv_text.length, 'chars)');
    if (job_description) {
      console.log('[API Upload] Tailoring to:', job_description.job_title);
    }

    // Step 1: Extract structured CV data from uploaded text
    console.log('[API Upload] Extracting structured data from CV...');
    const extractedData = await extractCVDataFromDocument(
      cv_text,
      job_description,
      language
    );

    if (!extractedData) {
      return NextResponse.json(
        { error: 'Failed to extract CV data. Please ensure your CV has clear structure.' },
        { status: 500 }
      );
    }

    console.log('[API Upload] Successfully extracted CV data for:', extractedData.contact.name);

    // Step 2: Polish and generate cover letter
    const { polished_cv, cover_letter } = await polishCVAndCoverLetter(extractedData);

    console.log('[API Upload] CV and Cover Letter polished, generating LaTeX...');

    // Step 3: Generate LaTeX
    const cvLatex = generateLatex(polished_cv);
    const coverLetterLatex = generateCoverLetterLatex(cover_letter);

    // Combine both documents with separator
    const combinedOutput = `${cvLatex}
%%% COVER LETTER %%%
${coverLetterLatex}`;

    console.log('[API Upload] Generated combined LaTeX output (${combinedOutput.length} bytes)');

    // Generate filename
    const safeName = polished_cv.contact.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `CV_and_CoverLetter_${safeName}_HARVARD_${language}.txt`;

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
    console.error('[API Upload] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate CV and Cover Letter from upload.',
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
