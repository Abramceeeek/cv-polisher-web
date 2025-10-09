import { GoogleGenerativeAI } from '@google/generative-ai';
import { CVData, PolishedCVData } from './types';

// Strong action verbs for fallback polishing
const ACTION_VERBS = [
  'Led', 'Managed', 'Developed', 'Built', 'Created', 'Designed', 'Implemented',
  'Analyzed', 'Optimized', 'Achieved', 'Delivered', 'Spearheaded', 'Coordinated',
  'Established', 'Enhanced', 'Streamlined', 'Reduced', 'Increased', 'Improved',
  'Collaborated', 'Directed', 'Executed', 'Facilitated', 'Generated', 'Initiated',
];

/**
 * Deterministic fallback polishing when no LLM is available
 */
function fallbackPolish(data: CVData): PolishedCVData {
  console.log('[Fallback Polish] Using heuristic polishing (no API key)');

  // Polish summary
  const polishedSummary = polishText(data.summary);

  // Polish experience bullets
  const polishedExperience = data.experience.map(exp => ({
    ...exp,
    bullets: exp.bullets.map(bullet => polishBullet(bullet)),
  }));

  return {
    ...data,
    summary: polishedSummary,
    experience: polishedExperience,
  };
}

/**
 * Polish a single bullet point using heuristics
 */
function polishBullet(bullet: string): string {
  if (!bullet || !bullet.trim()) return bullet;

  let polished = bullet.trim();

  // Remove trailing periods
  polished = polished.replace(/\.$/, '');

  // Capitalize first letter
  polished = polished.charAt(0).toUpperCase() + polished.slice(1);

  // Convert passive voice patterns to active
  polished = polished.replace(/^Responsible for (.+)$/i, (match, rest) => {
    const verb = pickRandomVerb(['Managed', 'Led', 'Oversaw']);
    return `${verb} ${rest}`;
  });

  polished = polished.replace(/^Was responsible for (.+)$/i, (match, rest) => {
    return `Led ${rest}`;
  });

  polished = polished.replace(/^Helped to (.+)$/i, (match, rest) => {
    return `Assisted in ${rest}`;
  });

  polished = polished.replace(/^Worked on (.+)$/i, (match, rest) => {
    const verb = pickRandomVerb(['Developed', 'Built', 'Created']);
    return `${verb} ${rest}`;
  });

  // If bullet doesn't start with a verb, try to add one
  const startsWithVerb = /^[A-Z][a-z]+(ed|ing|d)\s/i.test(polished);
  if (!startsWithVerb && !/^[A-Z][a-z]+\s/.test(polished)) {
    // Looks like it starts with a noun, prepend a verb
    const verb = pickRandomVerb(ACTION_VERBS);
    polished = `${verb} ${polished.charAt(0).toLowerCase()}${polished.slice(1)}`;
  }

  return polished;
}

/**
 * Polish generic text (summary, etc.)
 */
function polishText(text: string): string {
  if (!text || !text.trim()) return text;

  let polished = text.trim();

  // Basic cleanup
  polished = polished.replace(/\s+/g, ' '); // normalize whitespace
  polished = polished.charAt(0).toUpperCase() + polished.slice(1); // capitalize

  // Remove weak phrases
  polished = polished.replace(/I am /gi, '');
  polished = polished.replace(/^I have /gi, '');

  return polished;
}

/**
 * Pick a random verb from the list
 */
function pickRandomVerb(verbs: string[]): string {
  return verbs[Math.floor(Math.random() * verbs.length)];
}

/**
 * Polish CV data using Google Gemini (if API key available)
 */
async function polishWithGemini(data: CVData, apiKey: string): Promise<PolishedCVData> {
  console.log('[Gemini Polish] Starting AI polishing...');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: `You are an ATS CV rewriting engine. Your job is to improve the professional summary and bullet points to be more ATS-friendly, use strong action verbs, and include measurable outcomes where implied by the user's text.

CRITICAL RULES:
1. NEVER invent facts: Do not create employers, dates, degrees, specific tools, or numbers that weren't mentioned
2. Keep all company names, job titles, dates, and degrees EXACTLY as provided
3. Only suggest quantified outcomes if they're clearly implied by the user's text
4. Use neutral, professional tone suitable for applicant tracking systems
5. Return the EXACT SAME JSON structure you receive
6. Preserve the user's chosen language (English, Russian, or Uzbek)

Transform weak bullets like "Responsible for managing team" into stronger ones like "Led cross-functional team of X professionals" ONLY if team size was implied. Otherwise just "Led team operations".`,
    });

    const generationConfig = {
      temperature: 0.2,
      maxOutputTokens: 4000,
    };

    const prompt = `Polish this CV data. Return the same JSON structure with improved summary and experience bullets. Do not invent any facts.

Input data:
${JSON.stringify({
      summary: data.summary,
      experience: data.experience.map(exp => ({
        company: exp.company,
        title: exp.title,
        location: exp.location,
        start: exp.start,
        end: exp.end,
        bullets: exp.bullets,
      })),
    }, null, 2)}

Return ONLY valid JSON with this exact structure:
{
  "summary": "improved summary here",
  "experience": [
    {
      "company": "keep exact same",
      "title": "keep exact same",
      "location": "keep exact same",
      "start": "keep exact same",
      "end": "keep exact same",
      "bullets": ["improved bullet 1", "improved bullet 2"]
    }
  ]
}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;

    // Check for safety blocks
    if (response.candidates && response.candidates[0]?.finishReason === 'SAFETY') {
      console.warn('[Gemini Polish] Response blocked by safety filters, using fallback');
      return fallbackPolish(data);
    }

    const text = response.text();
    console.log('[Gemini Polish] Raw response:', text.substring(0, 200));

    // Extract JSON from response (may be wrapped in markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const polished = JSON.parse(jsonText);

    // Validate response structure
    if (!polished.summary || !Array.isArray(polished.experience)) {
      console.warn('[Gemini Polish] Invalid response structure, using fallback');
      return fallbackPolish(data);
    }

    // Merge polished content back into original data structure
    const result: PolishedCVData = {
      ...data,
      summary: polished.summary || data.summary,
      experience: data.experience.map((exp, idx) => {
        const polishedExp = polished.experience[idx];
        return {
          ...exp,
          bullets: polishedExp?.bullets || exp.bullets,
        };
      }),
    };

    console.log('[Gemini Polish] Successfully polished CV');
    return result;
  } catch (error) {
    console.error('[Gemini Polish] Error:', error);
    console.log('[Gemini Polish] Falling back to heuristic polishing');
    return fallbackPolish(data);
  }
}

/**
 * Main polish function - tries Gemini first, falls back to heuristics
 */
export async function polishCV(data: CVData): Promise<PolishedCVData> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim()) {
    return polishWithGemini(data, apiKey.trim());
  } else {
    return fallbackPolish(data);
  }
}
