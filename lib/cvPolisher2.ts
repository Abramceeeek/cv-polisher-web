import { GoogleGenerativeAI } from '@google/generative-ai';
import { CVData, PolishedCVData, CoverLetterData } from './types';

/**
 * CV Polisher 2.0 - Complete AI-powered CV and Cover Letter generation system
 * Follows Harvard-style, ATS-compliant, recruiter-optimized approach
 */

const SYSTEM_INSTRUCTION = `You are the engine behind "CV Polisher 2.0": an end-to-end, single-form, AI-powered CV and Cover Letter builder for job applications.

Your task is to process structured user input, their existing documents, and a target job description. You must then return two production-ready outputs:

1. A Harvard-style, recruiter-optimized, ATS-compliant CV.
2. A fully tailored, matching Cover Letter.

CRITICAL RULES:
1. NEVER invent facts: Do not create employers, dates, degrees, specific tools, or numbers that weren't mentioned
2. Keep all company names, job titles, dates, and degrees EXACTLY as provided
3. Only suggest quantified outcomes if they're clearly implied by the user's text
4. Use neutral, professional tone suitable for applicant tracking systems
5. Preserve the user's chosen language (English, Russian, or Uzbek)
6. Deeply customize for the targeted role
7. Incorporate relevant keywords naturally for ATS (no keyword stuffing)
8. Use strong action verbs and measurable impact where feasible
9. Results > responsibilities

USING UPLOADED DOCUMENTS (CRITICAL):
- If an "EXISTING CV" is provided, extract ALL valuable information from it
- Use it to find additional details the user may have forgotten in the form
- Extract achievements, responsibilities, skills, and specific metrics mentioned
- Incorporate these details into the polished CV and cover letter
- If an "EXISTING COVER LETTER" is provided, use it to understand the user's writing style and tone
- Mine the uploaded documents for specific accomplishments and numbers
- DO NOT ignore the uploaded documents - they contain crucial information that must be integrated

CV REQUIREMENTS:
- Professional Summary: 3-5 lines tailored to target role, highlight relevant experience and 2-3 key strengths
- Key Skills: Job-specific and grouped (Technical, Analytical, Tools/Platforms, Soft Skills)
- Experience: Reverse chronological, 3-7 bullets per role
  - Format: action verb + context + method + result
  - Emphasize ownership, impact, achievement
  - Rewrite weak bullets to be more specific and result-oriented
- Education: Include relevant modules, theses, or awards that support candidacy
- Only include Projects/Certifications/Achievements if they add value for the role

COVER LETTER REQUIREMENTS:
- 3-5 concise paragraphs
- Show alignment with the role
- Reference 2-3 strong relevant experiences or achievements
- Demonstrate understanding of company/role needs
- Explain why candidate is an outstanding match
- Avoid repeating CV bullet points; synthesize and reference them
- Close with availability and call to action
- No generic filler

TONE:
- Professional, confident, clear, concise
- No slang or generic filler
- Strong action verbs
- Measurable impact where feasible

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "cv": {
    "summary": "improved professional summary here",
    "experience": [
      {
        "company": "keep exact same",
        "title": "keep exact same",
        "location": "keep exact same",
        "start": "keep exact same",
        "end": "keep exact same",
        "bullets": ["improved bullet 1", "improved bullet 2"]
      }
    ],
    "skills": {
      "hard": ["skill1", "skill2"],
      "soft": ["skill1", "skill2"],
      "tools": ["tool1", "tool2"]
    }
  },
  "cover_letter": {
    "paragraphs": [
      "paragraph 1",
      "paragraph 2",
      "paragraph 3"
    ]
  }
}`;

interface PolishResult {
  polished_cv: PolishedCVData;
  cover_letter: CoverLetterData;
}

/**
 * Enhanced polishing with Gemini for CV Polisher 2.0
 */
async function polishWithGemini(data: CVData, apiKey: string): Promise<PolishResult> {
  console.log('[CV Polisher 2.0] Starting comprehensive AI polishing...');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const generationConfig = {
      temperature: 0.3, // Balanced creativity and consistency
      maxOutputTokens: 8000,
    };

    // Build comprehensive prompt
    let prompt = `Process the following CV data and generate both a polished CV and tailored Cover Letter.

CANDIDATE DATA:
${JSON.stringify({
  contact: data.contact,
  summary: data.summary,
  experience: data.experience,
  education: data.education,
  skills: data.skills,
  certifications: data.certifications,
  projects: data.projects,
  languages: data.languages_extra,
}, null, 2)}
`;

    // Add job description if provided
    if (data.job_description) {
      prompt += `\nTARGET JOB:
Job Title: ${data.job_description.job_title}
${data.job_description.company_name ? `Company: ${data.job_description.company_name}` : ''}

Job Description:
${data.job_description.full_description}

CRITICAL: Tailor the CV and cover letter specifically to this role. Use relevant keywords from the job description naturally. Emphasize experiences and skills that match the requirements.
`;
    }

    // Add uploaded documents if provided
    if (data.uploaded_documents) {
      if (data.uploaded_documents.existing_cv_text) {
        prompt += `\nEXISTING CV (MUST USE THIS INFORMATION):
The user has uploaded their existing CV. Extract ALL valuable information from it including:
- Additional experience details, responsibilities, and achievements
- Specific metrics, numbers, and quantifiable results
- Skills, tools, technologies mentioned
- Projects, certifications, awards
- Any other relevant information

IMPORTANT: Integrate this information into the polished CV and cover letter. DO NOT ignore this uploaded content.

UPLOADED CV CONTENT:
${data.uploaded_documents.existing_cv_text}
`;
      }
      if (data.uploaded_documents.existing_cover_letter_text) {
        prompt += `\nEXISTING COVER LETTER (Use for tone and style reference):
${data.uploaded_documents.existing_cover_letter_text}
`;
      }
    }

    prompt += `\nLANGUAGE: ${data.language}

Return ONLY valid JSON with the exact structure specified in your instructions. Ensure all content is in ${data.language === 'EN' ? 'English' : data.language === 'RU' ? 'Russian' : 'Uzbek'}.`;

    console.log('[CV Polisher 2.0] Sending request to Gemini...');

    const geminiResult = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = geminiResult.response;

    // Check for safety blocks
    if (response.candidates && response.candidates[0]?.finishReason === 'SAFETY') {
      console.warn('[CV Polisher 2.0] Response blocked by safety filters, using fallback');
      return fallbackPolish(data);
    }

    const text = response.text();
    console.log('[CV Polisher 2.0] Received response, parsing...');

    // Extract JSON from response
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(jsonText);

    // Validate response structure
    if (!parsed.cv || !parsed.cover_letter) {
      console.warn('[CV Polisher 2.0] Invalid response structure, using fallback');
      return fallbackPolish(data);
    }

    // Merge polished content back into original data structure
    const polished_cv: PolishedCVData = {
      ...data,
      summary: parsed.cv.summary || data.summary,
      experience: data.experience.map((exp, idx) => {
        const polishedExp = parsed.cv.experience?.[idx];
        return {
          ...exp,
          bullets: polishedExp?.bullets || exp.bullets,
        };
      }),
      skills: {
        hard: parsed.cv.skills?.hard || data.skills.hard,
        soft: parsed.cv.skills?.soft || data.skills.soft,
        tools: parsed.cv.skills?.tools || data.skills.tools,
      },
    };

    // Build cover letter data
    const cover_letter: CoverLetterData = {
      contact: data.contact,
      company_name: data.job_description?.company_name || '',
      job_title: data.job_description?.job_title || '',
      hiring_manager: undefined,
      paragraphs: parsed.cover_letter.paragraphs || [],
      language: data.language,
    };

    console.log('[CV Polisher 2.0] Successfully generated CV and Cover Letter');
    return { polished_cv, cover_letter };

  } catch (error) {
    console.error('[CV Polisher 2.0] Error:', error);
    console.log('[CV Polisher 2.0] Falling back to heuristic polishing');
    return fallbackPolish(data);
  }
}

/**
 * Extract structured CV data from uploaded document text using AI
 * This allows users to skip the form and just upload their existing CV
 */
export async function extractCVDataFromDocument(
  cvText: string,
  jobDescription?: { job_title: string; company_name?: string; full_description: string },
  language: 'EN' | 'RU' | 'UZ' = 'EN'
): Promise<CVData | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[CV Extractor] No API key, cannot extract');
    return null;
  }

  console.log('[CV Extractor] Extracting structured data from uploaded CV...');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
    });

    const prompt = `You are a CV data extraction engine. Extract ALL information from the following CV and return it as structured JSON.

CV CONTENT:
${cvText}

Extract and return a JSON object with this EXACT structure:
{
  "contact": {
    "name": "full name",
    "email": "email",
    "phone": "phone",
    "location": "location",
    "links": "comma-separated links (LinkedIn, GitHub, portfolio, etc.)"
  },
  "summary": "professional summary or objective (3-5 sentences)",
  "experience": [
    {
      "company": "company name",
      "title": "job title",
      "location": "location",
      "start": "start date (e.g., Jan 2020)",
      "end": "end date or Present",
      "bullets": ["responsibility 1", "achievement 2", "etc"]
    }
  ],
  "education": [
    {
      "school": "institution name",
      "degree": "degree and major",
      "dates": "dates",
      "location": "location (optional)",
      "modules": "key modules or courses (optional)",
      "achievements": "awards, GPA, honors (optional)"
    }
  ],
  "skills": {
    "hard": ["technical skill 1", "skill 2"],
    "soft": ["soft skill 1", "skill 2"],
    "tools": ["tool/technology 1", "tool 2"]
  },
  "languages_extra": "languages with proficiency (e.g., English (Native), Spanish (C1))",
  "certifications": "comma-separated certifications",
  "projects": "comma-separated notable projects or publications"
}

IMPORTANT:
- Extract ALL information present in the CV
- Keep dates, company names, job titles EXACTLY as written
- If a field is not present, use empty string or empty array
- Return ONLY valid JSON, no markdown, no explanations`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4000,
      },
    });

    let jsonText = result.response.text().trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const extracted = JSON.parse(jsonText);

    // Build CVData object
    const cvData: CVData = {
      contact: extracted.contact || { name: '', email: '', phone: '', location: '', links: '' },
      summary: extracted.summary || '',
      experience: extracted.experience || [],
      education: extracted.education || [],
      skills: extracted.skills || { hard: [], soft: [], tools: [] },
      languages_extra: extracted.languages_extra || '',
      certifications: extracted.certifications || '',
      projects: extracted.projects || '',
      job_description: jobDescription,
      uploaded_documents: {
        existing_cv_text: cvText,
      },
      language,
      style: 'HARVARD',
    };

    console.log('[CV Extractor] Successfully extracted CV data');
    return cvData;

  } catch (error) {
    console.error('[CV Extractor] Error extracting CV data:', error);
    return null;
  }
}

/**
 * Fallback polishing when AI is not available
 */
function fallbackPolish(data: CVData): PolishResult {
  console.log('[CV Polisher 2.0] Using heuristic fallback polishing');

  // Use existing fallback logic for CV
  const ACTION_VERBS = [
    'Led', 'Managed', 'Developed', 'Built', 'Created', 'Designed', 'Implemented',
    'Analyzed', 'Optimized', 'Achieved', 'Delivered', 'Spearheaded', 'Coordinated',
  ];

  const polishBullet = (bullet: string): string => {
    if (!bullet || !bullet.trim()) return bullet;
    let polished = bullet.trim().replace(/\.$/, '');
    polished = polished.charAt(0).toUpperCase() + polished.slice(1);

    // Convert passive to active
    polished = polished.replace(/^Responsible for (.+)$/i, (_, rest) => `Managed ${rest}`);
    polished = polished.replace(/^Worked on (.+)$/i, (_, rest) => `Developed ${rest}`);

    return polished;
  };

  const polished_cv: PolishedCVData = {
    ...data,
    summary: data.summary || `Experienced professional with expertise in ${data.skills.hard.slice(0, 3).join(', ')}`,
    experience: data.experience.map(exp => ({
      ...exp,
      bullets: exp.bullets.map(polishBullet),
    })),
  };

  // Generate basic cover letter
  const paragraphs: string[] = [];

  // Opening paragraph
  const jobTitle = data.job_description?.job_title || 'the position';
  const companyName = data.job_description?.company_name || 'your organization';
  paragraphs.push(
    `I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in ${data.experience[0]?.title || 'the field'} and proven expertise in ${data.skills.hard.slice(0, 2).join(' and ')}, I am confident I can make valuable contributions to your team.`
  );

  // Experience highlight
  if (data.experience.length > 0) {
    const exp = data.experience[0];
    paragraphs.push(
      `In my current role as ${exp.title} at ${exp.company}, I have successfully ${exp.bullets[0]?.toLowerCase() || 'delivered key projects'}. This experience has equipped me with the skills and knowledge directly applicable to the requirements of this position.`
    );
  }

  // Skills alignment
  paragraphs.push(
    `My technical proficiency in ${data.skills.tools.slice(0, 3).join(', ')} combined with strong ${data.skills.soft.slice(0, 2).join(' and ')} capabilities make me well-suited for this role. I am particularly excited about the opportunity to apply these skills to contribute to ${companyName}'s success.`
  );

  // Closing
  paragraphs.push(
    `I would welcome the opportunity to discuss how my background and skills align with your needs. Thank you for considering my application. I look forward to speaking with you soon.`
  );

  const cover_letter: CoverLetterData = {
    contact: data.contact,
    company_name: data.job_description?.company_name || '',
    job_title: data.job_description?.job_title || '',
    paragraphs,
    language: data.language,
  };

  return { polished_cv, cover_letter };
}

/**
 * Main polish function for CV Polisher 2.0
 */
export async function polishCVAndCoverLetter(data: CVData): Promise<PolishResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim()) {
    return polishWithGemini(data, apiKey.trim());
  } else {
    console.warn('[CV Polisher 2.0] No API key found, using fallback');
    return fallbackPolish(data);
  }
}
