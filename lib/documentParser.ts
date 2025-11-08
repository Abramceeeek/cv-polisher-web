/**
 * Document Parser Utility
 * Extracts text from PDF, DOCX, and TXT files
 * IMPORTANT: Only use in client-side components
 */

import mammoth from 'mammoth';

/**
 * Extract text from PDF file
 */
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Dynamic import to avoid server-side issues
    const pdfjsLib = await import('pdfjs-dist');

    // Configure worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF. Please try a different file or format.');
  }
}

/**
 * Extract text from DOCX file
 */
async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (result.messages.length > 0) {
      console.warn('DOCX parsing warnings:', result.messages);
    }

    return result.value.trim();
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX. Please try a different file or format.');
  }
}

/**
 * Extract text from TXT file
 */
async function extractTextFromTXT(file: File): Promise<string> {
  try {
    const text = await file.text();
    return text.trim();
  } catch (error) {
    console.error('Error reading TXT file:', error);
    throw new Error('Failed to read TXT file.');
  }
}

/**
 * Main function to extract text from any supported file type
 */
export async function extractTextFromDocument(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const fileSize = file.size;
  const maxSize = 5 * 1024 * 1024; // 5MB

  // Check file size
  if (fileSize > maxSize) {
    throw new Error('File size exceeds 5MB limit. Please upload a smaller file.');
  }

  // Determine file type and extract accordingly
  if (fileName.endsWith('.pdf')) {
    console.log('[Document Parser] Extracting text from PDF:', file.name);
    return await extractTextFromPDF(file);
  } else if (fileName.endsWith('.docx')) {
    console.log('[Document Parser] Extracting text from DOCX:', file.name);
    return await extractTextFromDOCX(file);
  } else if (fileName.endsWith('.doc')) {
    // .doc (old Word format) - try DOCX parser, might work for some files
    console.log('[Document Parser] Attempting to extract text from DOC:', file.name);
    try {
      return await extractTextFromDOCX(file);
    } catch (error) {
      throw new Error('Old .doc format not fully supported. Please save as .docx or PDF.');
    }
  } else if (fileName.endsWith('.txt')) {
    console.log('[Document Parser] Extracting text from TXT:', file.name);
    return await extractTextFromTXT(file);
  } else {
    throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT files.');
  }
}

/**
 * Validate and truncate text to reasonable length
 */
export function validateAndTruncateText(text: string, maxLength: number): string {
  if (!text || text.trim().length === 0) {
    throw new Error('Extracted text is empty. Please check your file.');
  }

  const trimmed = text.trim();

  if (trimmed.length > maxLength) {
    console.warn(`[Document Parser] Text truncated from ${trimmed.length} to ${maxLength} characters`);
    return trimmed.substring(0, maxLength);
  }

  return trimmed;
}

/**
 * Extract meaningful content from CV text
 * Removes excessive whitespace and formats for better AI processing
 */
export function cleanExtractedText(text: string): string {
  return text
    // Remove multiple consecutive spaces
    .replace(/\s+/g, ' ')
    // Remove multiple consecutive newlines (keep max 2)
    .replace(/\n{3,}/g, '\n\n')
    // Trim each line
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
    .trim();
}
