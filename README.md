# CV Polisher Web

A production-ready, privacy-friendly web application that generates polished LaTeX CVs with optional AI-powered content optimization.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-38B2AC?logo=tailwind-css)

## ✨ Features

- **Multi-Step Form**: Intuitive wizard interface for filling CV details
- **AI-Powered Polishing**: Optional Google Gemini integration for content enhancement
- **Fallback Mode**: Works without AI using smart heuristics
- **Two Professional Styles**: HARVARD (classic) and PRO (modern) LaTeX templates
- **Multi-Language Support**: English, Russian, and Uzbek with proper Unicode rendering
- **Privacy-First**: No database, no tracking, no data storage
- **ATS-Friendly**: Optimized for Applicant Tracking Systems
- **XeLaTeX Output**: Professional LaTeX documents that compile perfectly

## 🚀 Quick Start

### Installation

```bash
# Install dependencies (using pnpm, npm, or yarn)
pnpm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local and add your Google Gemini API key (optional)
# If not provided, the app will use fallback polishing
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
pnpm build
pnpm start
```

### Run Tests

```bash
pnpm test
```

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: Google Gemini API key
# If not set, app will use fallback heuristic polishing
GEMINI_API_KEY=your_api_key_here

# Optional: Frontend origin for CORS
# Defaults to * if not set
FRONTEND_ORIGIN=https://www.abdurakhmonbek.com
```

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env.local` file

**Note**: The app works perfectly fine without an API key using fallback polishing!

## 📁 Project Structure

```
cv-polisher-web/
├── app/
│   ├── api/
│   │   └── polish/
│   │       └── route.ts          # API endpoint for CV generation
│   ├── polisher/
│   │   └── page.tsx               # Multi-step form page
│   ├── help/
│   │   └── page.tsx               # Help and documentation
│   ├── page.tsx                   # Landing page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── ExperienceFields.tsx       # Experience entry form
│   └── EducationFields.tsx        # Education entry form
├── lib/
│   ├── types.ts                   # TypeScript types
│   ├── latex.ts                   # LaTeX generation & escaping
│   ├── polish.ts                  # AI/fallback polishing logic
│   └── rateLimit.ts               # Rate limiting utility
├── __tests__/
│   └── latex.test.ts              # Unit tests
├── __fixtures__/
│   └── sample.json                # Sample CV data
└── README.md                      # This file
```

## 🎨 CV Styles

### HARVARD Style
- Classic single-column layout
- Small caps section headers
- Clean, professional appearance
- Ideal for academic and traditional roles

### PRO Style
- Modern professional layout
- Subtle horizontal rules
- Tighter vertical spacing
- Perfect for corporate and tech roles

## 🤖 How AI Polishing Works

When a Gemini API key is provided:

1. **Content Enhancement**: Rewrites bullet points with strong action verbs
2. **ATS Optimization**: Ensures content is friendly to Applicant Tracking Systems
3. **Professional Tone**: Improves clarity and professionalism
4. **Fact Preservation**: Never invents facts, keeps all dates/companies/titles exact

### Fallback Polishing (No API Key)

The app includes smart heuristics that:
- Convert passive voice to active voice
- Add strong action verbs
- Normalize formatting
- Capitalize appropriately
- Remove weak phrases

## 🔒 Privacy & Security

- **No Database**: All data is processed in memory
- **No Tracking**: No analytics, cookies, or tracking
- **No Storage**: Files are generated on-the-fly and downloaded immediately
- **Rate Limiting**: Simple in-memory rate limiting to prevent abuse
- **CORS Protection**: Configurable origin restrictions

## 📝 Compiling Your LaTeX CV

### Option 1: Overleaf (Recommended)

1. Go to [Overleaf.com](https://www.overleaf.com)
2. Create a new blank project
3. Upload your downloaded `.tex` file
4. **Important**: Menu → Compiler → Select **XeLaTeX**
5. Click "Recompile"
6. Download your PDF

### Option 2: Local Compilation

If you have LaTeX installed locally:

```bash
xelatex your_cv.tex
```

**Note**: XeLaTeX is required (not pdflatex) for proper Unicode and font support.

## 🌐 Deploying to Vercel

1. Push your code to GitHub/GitLab/Bitbucket

2. Import your repository in Vercel:
   ```bash
   # Or use Vercel CLI
   npm i -g vercel
   vercel
   ```

3. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY` (optional)
   - `FRONTEND_ORIGIN` (optional)

4. Deploy! Vercel will automatically:
   - Install dependencies
   - Build the project
   - Deploy to production

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

### Test Coverage

- ✅ LaTeX escaping for all special characters
- ✅ Multi-language support
- ✅ Both CV styles (HARVARD & PRO)
- ✅ API route integration

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **AI**: Google Generative AI (Gemini 2.0 Flash)
- **Runtime**: Node.js (for API routes)
- **Testing**: Jest

## 📋 API Reference

### POST /api/polish

Generates a polished LaTeX CV file.

**Request Body**:
```json
{
  "contact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "links": "string"
  },
  "summary": "string",
  "experience": [...],
  "education": [...],
  "skills": {...},
  "certifications": [...],
  "languages_extra": [...],
  "language": "EN" | "RU" | "UZ",
  "style": "HARVARD" | "PRO"
}
```

**Response**:
- Content-Type: `application/x-tex`
- Returns: `.tex` file download

**Rate Limiting**:
- 5 requests per IP per 5-minute window
- Returns 429 with `Retry-After` header when exceeded

## 🐛 Troubleshooting

### LaTeX compilation errors

- ✅ Make sure XeLaTeX compiler is selected (not pdflatex)
- ✅ Check that DejaVu Serif font is available
- ✅ Verify your text doesn't have unescaped LaTeX characters

### Cyrillic text not showing

- ✅ Confirm XeLaTeX compiler is used
- ✅ Check language is set to RU in options
- ✅ Ensure DejaVu Serif font supports Cyrillic (it does)

### API errors

- ✅ Check required fields are filled (name, at least one experience)
- ✅ Verify API key is valid (if using Gemini)
- ✅ Check rate limits (wait a minute and retry)

## 🤝 Contributing

This is a production tool. If you find bugs or have suggestions:

1. Open an issue with detailed description
2. Include steps to reproduce
3. Provide sample data if relevant

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 👤 Author

Built by [Abdurakhmonbek Fayzullaev](https://abdurakhmonbek.com)

- 🌐 Website: [abdurakhmonbek.com](https://abdurakhmonbek.com)
- 💼 LinkedIn: [linkedin.com/in/abdurakhmonbekf](https://linkedin.com/in/abdurakhmonbekf)
- 🐙 GitHub: [github.com/Abramceeeek](https://github.com/Abramceeeek)

## 🙏 Acknowledgments

- Google Gemini for AI polishing
- Next.js team for the excellent framework
- Overleaf for making LaTeX accessible
- DejaVu fonts for Unicode support

---

**No database • No tracking • No payment required**

Transform your resume today → [cv-polisher.vercel.app](https://cv-polisher.vercel.app)
