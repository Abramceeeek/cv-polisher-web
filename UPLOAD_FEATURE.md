# Upload Feature - Quick CV Polish

## What's New

Added a new **Quick Upload & Polish** feature that allows users to:
- Upload existing CV (PDF/DOCX) or paste text directly
- Add job description for intelligent tailoring
- Choose between AI-powered or free keyword-based optimization
- Get PDF or LaTeX output instantly

## Files Added/Modified

### New Files
- `components/CVPolisherForm.tsx` - Upload form component
- `app/upload/page.tsx` - Upload page

### Modified Files
- `app/page.tsx` - Updated homepage with new CTA buttons and feature comparison

## Features

### 1. Dual Input Methods
- **File Upload**: Accepts PDF or DOCX files (up to 5MB)
- **Text Paste**: Direct text input as alternative

### 2. Job Description Tailoring
- Optional JD input field
- Keyword extraction and matching
- Bullet point ranking by relevance

### 3. Two Modes

**Free Mode (AI Off - $0)**
- Keyword-based ranking algorithm
- Extracts keywords from job description
- Scores CV bullets by keyword overlap
- Reorders bullets by relevance
- No API calls, completely free

**AI Mode (AI On)**
- Powered by Google Gemini
- Intelligent content tailoring
- Preserves factual accuracy
- Surfaces relevant skills from JD
- Uses API quota

### 4. Output Options
- **PDF**: Ready-to-use, compiled with Tectonic
- **LaTeX (.tex)**: Editable in Overleaf

### 5. Multi-Language Support
- English (EN)
- Russian (RU)
- Uzbek (UZ)

## How It Works

### User Flow

1. **Visit `/upload` page**
2. **Upload CV or paste text**
3. **Enter target role** (required)
4. **Paste job description** (optional but recommended)
5. **Select language and output format**
6. **Toggle AI mode** (on/off)
7. **Click "Generate My Polished CV"**
8. **Download PDF or .tex file**

### Backend Flow

```
User Input → /polish-latex endpoint
         ↓
   Extract CV text (from file or paste)
         ↓
   Choose mode: AI or Free
         ↓
   [AI Mode]                [Free Mode]
   call_gemini_with_jd()    heuristic_tailor()
   - Gemini tailoring       - Keyword extraction
   - Preserves facts        - Bullet scoring
   - JD context            - Top 8 bullets
         ↓                          ↓
   Build LaTeX document
         ↓
   [format=pdf]            [format=tex]
   compile_latex_to_pdf()   Return raw .tex
         ↓                          ↓
   Return PDF              Return LaTeX
```

## API Endpoint

### `POST /polish-latex`

**Request (multipart/form-data):**
```
file: File (optional) - PDF or DOCX
cv_text: string (optional) - Pasted CV text
jd_text: string (optional) - Job description
target_role: string (required) - Job title
language: "EN"|"RU"|"UZ" (required)
ai: boolean (optional) - Defaults to AI_ENABLED env var
format: "pdf"|"tex" (optional) - Defaults to "pdf"
template: "harvard" (optional)
```

**Response:**
- `200` → application/pdf or text/x-tex
- `400` → Validation error
- `422` → PDF non-selectable or text too short
- `500` → Compilation error (includes details)

## UI Components

### CVPolisherForm Component

**Features:**
- File upload with size display
- Character counter for pasted text
- Word counter for job description
- Real-time validation feedback
- Success/error messages
- Disabled state during generation
- Free mode indicator

**Styling:**
- Emoji icons for visual appeal
- Color-coded sections
- Hover effects on inputs
- Loading spinner
- Green success banner
- Red error banner
- Blue info card for free mode

### Upload Page

**Layout:**
- Hero section with gradient
- Feature cards (Fast, Tailored, Free)
- Navigation links (Home, Step-by-step form)
- Responsive design

## Advantages Over Step-by-Step Form

| Feature | Upload (New) | Step-by-Step (Original) |
|---------|-------------|-------------------------|
| Speed | ⚡ 1-2 minutes | 📝 5-10 minutes |
| Input | Upload or paste | Manual form filling |
| JD Tailoring | ✓ Yes | ✗ No |
| Free Mode | ✓ Yes ($0) | ✗ AI only |
| PDF Output | ✓ Yes | ✗ LaTeX only |
| Ease of Use | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

## Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_POLISHER_API=https://cv-polisher.onrender.com

# Backend (Render)
AI_ENABLED=false  # Default to free mode
GEMINI_API_KEY=your_key_here
FRONTEND_ORIGIN=https://www.abdurakhmonbek.com
```

## Testing

### Test Free Mode
1. Go to `/upload`
2. Paste CV text
3. Paste job description with keywords (e.g., "Python", "SQL", "Data")
4. Keep AI toggle OFF
5. Click Generate
6. Check that PDF contains relevant bullet points

### Test AI Mode
1. Same steps as above
2. Turn AI toggle ON
3. Click Generate
4. Check that CV is intelligently tailored to JD

### Test Validation
- Try generating without CV text → Error
- Try generating without target role → Error
- Upload non-selectable PDF → Error message

## Deployment

### Frontend (Vercel)
```bash
cd cv-polisher-web
git add app/page.tsx app/upload/page.tsx components/CVPolisherForm.tsx
git commit -m "Add Quick Upload & Polish feature"
git push origin main
```

### Backend
No changes needed if Tectonic is already installed (see DEPLOY_NOW.md)

## Future Enhancements

- [ ] Drag-and-drop file upload
- [ ] Sample CVs for testing
- [ ] Multiple CV comparison
- [ ] Export to LinkedIn format
- [ ] Save/load drafts (local storage)
- [ ] Preview before download
- [ ] Multiple template options (PRO style)
- [ ] Batch processing for multiple jobs

## User Documentation

### For Users

**When to use Upload vs Step-by-Step:**

**Use Upload if:**
- You have an existing CV
- You want quick results
- You're applying to a specific job
- You want free mode ($0 cost)

**Use Step-by-Step if:**
- Creating CV from scratch
- Want fine-grained control
- Multiple experience entries
- Don't have JD available

## Troubleshooting

### "Failed to generate PDF"
- Check backend logs for Tectonic errors
- Try format=tex to get LaTeX file
- Verify Tectonic is installed (see DEPLOY_NOW.md)

### "Resume text is too short"
- Upload DOCX instead of PDF
- PDF might be scanned/non-selectable
- Paste text directly instead

### "Please enter a target role"
- Target role field is required
- Enter job title like "Data Analyst"

### No download happens
- Check browser download settings
- Try different browser
- Check console for errors

## Analytics (Optional)

Track usage:
- Upload vs Step-by-step form ratio
- AI mode vs Free mode usage
- PDF vs LaTeX output preference
- Most common target roles
- Average JD length

## Summary

The Upload feature provides a **faster, easier way** to polish existing CVs with **job description-based tailoring** and a **free mode option**. It complements the existing step-by-step form by offering:

✓ Speed (1-2 min vs 5-10 min)
✓ JD tailoring
✓ Free keyword-based mode
✓ PDF output
✓ Better UX

Perfect for users who already have a CV and want to quickly tailor it to a specific job posting!
