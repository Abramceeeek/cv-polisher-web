import { NextRequest, NextResponse } from 'next/server';
import { CVData } from '@/lib/types';
import { polishCV } from '@/lib/polish';
import { checkRateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs'; // Use Node.js runtime for Gemini SDK

// PDF generation backend URL (Python FastAPI on Render)
const PDF_BACKEND_URL = process.env.PDF_BACKEND_URL || 'https://cv-polisher.onrender.com';

/**
 * POST /api/polish - Generate polished CV PDF file
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

    // Polish the CV content using Gemini
    const polishedData = await polishCV(data);

    console.log(`[API] CV polished, calling PDF backend at ${PDF_BACKEND_URL}/generate-pdf`);

    // Call Python backend to generate PDF
    const pdfResponse = await fetch(`${PDF_BACKEND_URL}/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(polishedData),
    });

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.error(`[API] PDF backend error (${pdfResponse.status}): ${errorText}`);
      throw new Error(`PDF generation failed: ${pdfResponse.statusText}`);
    }

    // Get PDF data
    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Generate filename
    const safeName = data.contact.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `CV_${safeName}_${data.style}_${data.language}.pdf`;

    console.log(`[API] Generated PDF (${pdfBuffer.byteLength} bytes), filename: ${filename}`);

    // Return PDF file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
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
        error: 'Failed to generate PDF. Please check your data and try again.',
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
