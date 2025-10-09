import { NextRequest, NextResponse } from 'next/server';
import { CVData } from '@/lib/types';
import { polishCV } from '@/lib/polish';
import { generateLatex } from '@/lib/latex';
import { checkRateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs'; // Use Node.js runtime for Gemini SDK

/**
 * POST /api/polish - Generate polished CV LaTeX file
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

    // Polish the CV content
    const polishedData = await polishCV(data);

    // Generate LaTeX
    const latexContent = generateLatex(polishedData);

    // Generate filename
    const safeName = data.contact.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `CV_${safeName}_${data.style}_${data.language}.tex`;

    console.log(`[API] Generated ${latexContent.length} bytes, filename: ${filename}`);

    // Return LaTeX file
    return new NextResponse(latexContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-tex',
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
        error: 'Failed to process CV. Please check your data and try again.',
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
