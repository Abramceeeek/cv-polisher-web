# CV Polisher 2.0 - Complete Documentation

## Overview

CV Polisher 2.0 is an AI-powered, end-to-end CV and Cover Letter generation system that produces Harvard-style, recruiter-optimized, ATS-compliant documents.

## What's New in 2.0

### Core Features

1. **Dual Output Generation**
   - Generates both CV and Cover Letter in a single request
   - Output format: LaTeX files with separator `%%% COVER LETTER %%%`
   - Both documents are tailored to the target job description

2. **Enhanced Job Targeting**
   - Input field for job description with job title and company name
   - AI analyzes requirements and tailors content accordingly
   - Natural keyword integration for ATS optimization

3. **Document Upload Support**
   - Upload existing CV (DOCX/PDF) for context and additional details
   - Upload existing cover letter for tone and content reference
   - AI extracts information to strengthen new documents

4. **Expanded Data Structure**
   - Education: Now includes location, key modules, and achievements
   - Projects: New section for publications, hackathons, volunteering
   - Skills: Better categorization (Technical, Soft Skills, Tools)

5. **Harvard-Style Optimization**
   - Professional summary tailored to target role (3-5 lines)
   - Experience bullets follow: Action Verb + Context + Method + Result
   - Emphasis on ownership, impact, and measurable achievements
   - 1-2 pages optimal formatting

6. **Cover Letter Excellence**
   - 3-5 concise paragraphs
   - Shows role alignment and company understanding
   - References 2-3 strong experiences from CV
   - Professional closing with call to action
   - No generic filler phrases

## System Architecture

### Input Structure

```typescript
interface CVData {
  // Contact Information
  contact: {
    name: string;
    email: string;
    phone: string;
    location: string;
    links: string; // LinkedIn, portfolio, GitHub
  };

  // Professional Summary
  summary: string;

  // Work Experience
  experience: Array<{
    company: string;
    title: string;
    location: string;
    start: string; // "Jan 2020"
    end: string; // "Dec 2023" or "Present"
    bullets: string[];
  }>;

  // Education
  education: Array<{
    school: string;
    degree: string;
    dates: string;
    location?: string;
    modules?: string; // Key courses
    achievements?: string; // Awards, dissertation
  }>;

  // Skills
  skills: {
    hard: string[]; // Python, SQL, Excel
    soft: string[]; // Leadership, Communication
    tools: string[]; // Power BI, Git, AWS
  };

  // Optional Sections
  certifications: string[];
  projects?: string[]; // Projects, publications, hackathons
  languages_extra: string[]; // "English (C1)", "Russian (Native)"

  // Configuration
  language: 'EN' | 'RU' | 'UZ';
  style: 'HARVARD' | 'PRO';

  // NEW: Job Targeting
  job_description?: {
    job_title: string;
    company_name?: string;
    full_description: string;
  };

  // NEW: Uploaded Documents
  uploaded_documents?: {
    existing_cv_text?: string;
    existing_cover_letter_text?: string;
  };
}
```

### Output Format

The API returns a single text file containing both documents:

```
% IMPORTANT: Compile with XeLaTeX
\documentclass[11pt]{article}
...
[Complete Harvard CV LaTeX code]
...
\end{document}
%%% COVER LETTER %%%
% IMPORTANT: Compile with XeLaTeX
\documentclass[11pt]{article}
...
[Complete Cover Letter LaTeX code]
...
\end{document}
```

## AI Processing Pipeline

### Step 1: Data Collection
- Structured form input
- Job description analysis
- Uploaded document parsing

### Step 2: AI Enhancement (Gemini 2.0 Flash)
- Analyzes all inputs comprehensively
- Identifies job requirements and keywords
- Strengthens weak bullet points
- Quantifies achievements where implied
- Ensures ATS compatibility
- Maintains factual accuracy (no fabrication)

### Step 3: CV Generation
- Professional summary tailored to role
- Experience bullets optimized (Action + Context + Result)
- Skills grouped and prioritized by relevance
- Education highlights relevant modules/awards
- Optional sections (projects, certifications) added if valuable

### Step 4: Cover Letter Generation
- Opening: Express interest in specific role and company
- Body (2-3 paragraphs): Highlight relevant experiences, show role alignment
- Closing: Call to action and availability statement
- Tone matches CV and company culture

### Step 5: LaTeX Compilation
- Harvard-style formatting
- Professional typography
- ATS-friendly structure
- Multi-language support (EN, RU, UZ)

## Key Principles

### What the AI Does
✅ Rewrites weak bullets into strong, action-oriented statements
✅ Adds quantification when clearly implied by context
✅ Tailors content to match job description keywords naturally
✅ Improves professional summary for role alignment
✅ Groups and prioritizes skills by relevance
✅ Synthesizes experiences into compelling cover letter narratives
✅ Maintains consistent, professional tone

### What the AI Does NOT Do
❌ Invent employers, job titles, or dates
❌ Fabricate degrees, certifications, or awards
❌ Create specific numbers not implied by source
❌ Add technical skills not mentioned
❌ Include dishonest claims or exaggerations
❌ Use generic templates or filler content

## Usage Guide

### Basic Usage

1. **Fill Required Fields**
   - Contact information
   - Professional summary or at least one experience
   - Select language (EN, RU, UZ)
   - Choose style (HARVARD or PRO)

2. **Add Experience**
   - Company, title, location, dates
   - 3-7 bullet points per role
   - Focus on achievements, not just responsibilities

3. **Include Education**
   - School name, degree, dates
   - Optional: relevant courses, awards, thesis

4. **List Skills**
   - Technical skills (programming languages, tools)
   - Soft skills (leadership, communication)
   - Tools & platforms (Excel, Power BI, Git)

### Advanced Features

#### Job Description Targeting
```json
{
  "job_description": {
    "job_title": "Senior Data Analyst",
    "company_name": "Tech Corp",
    "full_description": "We are seeking a data analyst with 5+ years experience in Python, SQL, and data visualization. The ideal candidate will have experience with stakeholder management and presenting insights to executives..."
  }
}
```

**Result**: CV and cover letter will emphasize Python, SQL, visualization skills, stakeholder management experience, and executive communication.

#### Document Upload
Upload existing CV/cover letter as DOCX or PDF. The system will:
- Extract text content
- Use it for context and additional details
- Strengthen new documents with overlooked information
- Maintain consistent career narrative

### API Endpoint

**POST** `/api/polish`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**: CVData JSON object (see structure above)

**Response**:
- Success (200): Text file with combined LaTeX code
- Rate limit (429): Try again after specified seconds
- Error (400): Validation error details
- Error (500): Processing error details

**Rate Limiting**: 5 requests per 5 minutes per IP

## Output Files

### File Structure
```
CV_and_CoverLetter_John_Doe_HARVARD_EN.txt
├── Section 1: Harvard_CV.tex (complete LaTeX document)
├── Separator: %%% COVER LETTER %%%
└── Section 2: Harvard_Cover_Letter.tex (complete LaTeX document)
```

### How to Compile

1. **Split the file** (or use entire file in Overleaf):
   - Everything before `%%% COVER LETTER %%%` → `Harvard_CV.tex`
   - Everything after `%%% COVER LETTER %%%` → `Harvard_Cover_Letter.tex`

2. **Upload to Overleaf** (free LaTeX editor):
   - Go to https://overleaf.com
   - Create new project → Upload Project
   - Upload `.tex` file(s)

3. **Set Compiler to XeLaTeX**:
   - Menu → Compiler → XeLaTeX (NOT pdfLaTeX)
   - This is required for Unicode/Cyrillic support

4. **Click Recompile**:
   - CV compiles to professional PDF
   - Cover letter compiles separately
   - Download both PDFs

## Customization

### Modifying LaTeX Templates

Edit `lib/latex.ts`:
- `toHarvardTex()`: Classic Harvard style
- `toProTex()`: Modern professional style
- `generateCoverLetterLatex()`: Cover letter template

### Adjusting AI Behavior

Edit `lib/cvPolisher2.ts`:
- `SYSTEM_INSTRUCTION`: Core AI guidelines
- `temperature`: 0.2-0.4 for consistency
- `maxOutputTokens`: Increase for longer outputs

### Changing Rate Limits

Edit `lib/rateLimit.ts`:
- `MAX_REQUESTS`: Requests per window
- `WINDOW_MS`: Time window in milliseconds

## Fallback Mode

If Gemini API is unavailable or API key is missing, the system automatically uses heuristic fallback:

**Fallback CV Enhancement**:
- Converts passive voice to active
- Adds strong action verbs
- Improves bullet point formatting
- Basic keyword matching

**Fallback Cover Letter**:
- Generic but professional template
- Uses experience and skills from CV
- Maintains proper structure
- Suitable for quick applications

## Security & Privacy

✅ **No Data Storage**: All processing is stateless
✅ **No Tracking**: No analytics or user tracking
✅ **No Database**: Data never persisted
✅ **CORS Protection**: Configurable origin restrictions
✅ **Rate Limiting**: Prevents abuse
✅ **Input Validation**: All inputs sanitized
✅ **LaTeX Escaping**: Prevents injection attacks

## Environment Variables

```bash
# Required for AI features (optional - works without it)
GEMINI_API_KEY=your_gemini_api_key_here

# CORS configuration (optional)
FRONTEND_ORIGIN=https://yourdomain.com

# For iframe embedding (optional)
FRAME_ANCESTORS=https://yourdomain.com
```

## Troubleshooting

### Issue: White page after deployment
**Solution**: Check Vercel deployment logs, ensure all dependencies installed

### Issue: LaTeX won't compile
**Solution**: Make sure you're using XeLaTeX compiler, not pdfLaTeX

### Issue: Cover letter is generic
**Solution**: Provide detailed job description with specific requirements

### Issue: CV too long (>2 pages)
**Solution**: Reduce experience bullets, remove less relevant positions

### Issue: Missing information in output
**Solution**: Upload existing CV for additional context extraction

### Issue: Rate limit exceeded
**Solution**: Wait 5 minutes or deploy your own instance

## Best Practices

### For Best CV Results
1. Provide detailed experience bullets with context
2. Include quantifiable achievements where possible
3. Upload existing CV for comprehensive detail extraction
4. Specify target job description for tailored output
5. Review and adjust AI-generated content before submission

### For Best Cover Letter Results
1. Provide complete job description with requirements
2. Include company name for personalization
3. Ensure CV experience section is detailed
4. Upload existing cover letter for tone matching
5. Specify soft skills that match company culture

## Deployment

### Vercel (Recommended)
```bash
cd cv-polisher-web
npm install
npm run build
vercel --prod
```

### Environment Setup
```bash
# .env.local
GEMINI_API_KEY=your_key_here
FRONTEND_ORIGIN=https://your-domain.vercel.app
```

### Post-Deployment
1. Test with sample data
2. Verify LaTeX output compiles
3. Check rate limiting works
4. Test CORS if using iframe

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Runtime**: Node.js 20+
- **AI**: Google Gemini 2.0 Flash
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Output Format**: LaTeX (XeLaTeX)
- **Deployment**: Vercel (serverless)

## File Structure

```
cv-polisher-web/
├── app/
│   ├── api/polish/route.ts      # Main API endpoint
│   ├── polisher/                # Multi-step form wizard
│   └── page.tsx                 # Landing page
├── lib/
│   ├── cvPolisher2.ts           # AI polishing engine (NEW)
│   ├── types.ts                 # TypeScript interfaces (UPDATED)
│   ├── latex.ts                 # LaTeX generation (UPDATED)
│   ├── polish.ts                # Legacy polishing (kept for compat)
│   └── rateLimit.ts             # Rate limiting
├── components/                  # React components
└── CV_POLISHER_2.0_README.md   # This file
```

## Support

For issues, questions, or contributions:
- GitHub: [Your Repository]
- Documentation: This README
- Example Data: See `__fixtures__/` directory

## License

[Your License Here]

---

**CV Polisher 2.0** - Professional CV and Cover Letter Generation, Powered by AI
