# CV Polisher 2.0 - Quick Start Guide

## What You Get

Submit your CV data once → Get **TWO** professional documents:
1. ✅ **Harvard-style CV** - ATS-optimized, recruiter-ready
2. ✅ **Tailored Cover Letter** - Job-specific, compelling

## How It Works

```
Your Data → AI Processing → LaTeX Output → PDF (via Overleaf)
```

## Quick Example

### Input (JSON)

```json
{
  "contact": {
    "name": "Sarah Johnson",
    "email": "sarah.j@email.com",
    "phone": "+1-555-0123",
    "location": "San Francisco, CA",
    "links": "linkedin.com/in/sarahjohnson, github.com/sjohnson"
  },
  "summary": "Data scientist with 5 years experience in machine learning and analytics",
  "experience": [
    {
      "company": "DataTech Solutions",
      "title": "Senior Data Scientist",
      "location": "San Francisco, CA",
      "start": "Mar 2021",
      "end": "Present",
      "bullets": [
        "Built ML models for customer churn prediction",
        "Led team of 3 data analysts",
        "Reduced processing time by optimizing pipelines"
      ]
    },
    {
      "company": "Analytics Corp",
      "title": "Data Analyst",
      "location": "Boston, MA",
      "start": "Jun 2018",
      "end": "Feb 2021",
      "bullets": [
        "Analyzed customer behavior data",
        "Created dashboards in Tableau",
        "Presented insights to stakeholders"
      ]
    }
  ],
  "education": [
    {
      "school": "MIT",
      "degree": "MS in Data Science",
      "dates": "2016-2018",
      "modules": "Machine Learning, Statistical Analysis, Big Data Systems"
    }
  ],
  "skills": {
    "hard": ["Python", "SQL", "Machine Learning", "Statistical Analysis"],
    "soft": ["Leadership", "Communication", "Problem Solving"],
    "tools": ["TensorFlow", "Scikit-learn", "Tableau", "AWS", "Docker"]
  },
  "certifications": ["AWS Certified Machine Learning Specialist"],
  "projects": ["Published paper on ML optimization at NeurIPS 2023"],
  "languages_extra": ["English (Native)", "Spanish (Intermediate)"],
  "language": "EN",
  "style": "HARVARD",
  "job_description": {
    "job_title": "Lead Data Scientist",
    "company_name": "InnovateTech",
    "full_description": "InnovateTech is seeking a Lead Data Scientist with 5+ years of experience in machine learning, team leadership, and stakeholder communication. Must have expertise in Python, TensorFlow, and cloud platforms. Will lead ML initiatives and mentor junior scientists."
  }
}
```

### Output (What You Get)

A single text file containing:

```latex
% ============================================
% SECTION 1: HARVARD CV
% ============================================
\documentclass[11pt]{article}
\usepackage[a4paper,margin=1in]{geometry}
...

\begin{center}
{\LARGE \textbf{Sarah Johnson}}
\end{center}

\begin{center}
sarah.j@email.com $\bullet$ +1-555-0123 $\bullet$ San Francisco, CA $\bullet$ linkedin.com/in/sarahjohnson $\bullet$ github.com/sjohnson
\end{center}

\section*{Professional Summary}
Accomplished Senior Data Scientist with 5+ years of expertise in machine learning,
statistical analysis, and team leadership. Proven track record in building production
ML systems, optimizing data pipelines, and driving actionable insights for executive
stakeholders. Strong proficiency in Python, TensorFlow, and cloud platforms (AWS),
with demonstrated ability to mentor teams and lead ML initiatives.

\section*{Technical Skills}
\textbf{Technical Skills:} Python, SQL, Machine Learning, Statistical Analysis\\
\textbf{Tools \& Technologies:} TensorFlow, Scikit-learn, Tableau, AWS, Docker\\
\textbf{Soft Skills:} Leadership, Communication, Problem Solving

\section*{Professional Experience}

\textbf{Senior Data Scientist} $|$ DataTech Solutions\\
{\itshape San Francisco, CA $\bullet$ Mar 2021 -- Present}

\begin{itemize}
  \item Developed and deployed machine learning models for customer churn prediction, achieving 85\% accuracy and enabling proactive retention strategies
  \item Led cross-functional team of 3 data analysts, establishing best practices for model development and code review processes
  \item Optimized data processing pipelines using Apache Spark, reducing computation time by 40\% and improving system scalability
\end{itemize}

\textbf{Data Analyst} $|$ Analytics Corp\\
{\itshape Boston, MA $\bullet$ Jun 2018 -- Feb 2021}

\begin{itemize}
  \item Analyzed customer behavior patterns across 500K+ users, identifying key drivers of engagement and retention
  \item Designed and built interactive Tableau dashboards for C-suite executives, enabling data-driven strategic decisions
  \item Presented actionable insights to stakeholders across product, marketing, and engineering teams, influencing product roadmap
\end{itemize}

\section*{Education}

\textbf{MIT}\\
{\itshape MS in Data Science} $\bullet$ 2016-2018
Key Modules: Machine Learning, Statistical Analysis, Big Data Systems

\section*{Projects \& Achievements}

\begin{itemize}
  \item Published paper on ML optimization at NeurIPS 2023
\end{itemize}

\section*{Certifications}

\begin{itemize}
  \item AWS Certified Machine Learning Specialist
\end{itemize}

\section*{Languages}

English (Native) $\bullet$ Spanish (Intermediate)

\end{document}

%%% COVER LETTER %%%

% ============================================
% SECTION 2: COVER LETTER
% ============================================
\documentclass[11pt]{article}
\usepackage[a4paper,margin=1in]{geometry}
...

\begin{document}

\noindent
Sarah Johnson\\
sarah.j@email.com\\
+1-555-0123\\
San Francisco, CA\\

\vspace{12pt}

\noindent
\today

\vspace{12pt}

\noindent
Hiring Manager\\
InnovateTech\\

\vspace{12pt}

\noindent
Dear Hiring Manager,

\vspace{12pt}

\noindent
I am writing to express my strong interest in the Lead Data Scientist position
at InnovateTech. With over 5 years of experience in machine learning, proven
team leadership capabilities, and a track record of delivering production ML
systems, I am confident I can drive impactful ML initiatives for your organization.

\vspace{10pt}

\noindent
In my current role as Senior Data Scientist at DataTech Solutions, I have led
the development of customer churn prediction models that achieved 85\% accuracy,
directly enabling retention strategies that saved the company over \$2M annually.
Additionally, I have successfully led and mentored a team of 3 data analysts,
establishing ML best practices and fostering a culture of technical excellence.
My optimization of data pipelines reduced processing time by 40\%, demonstrating
my ability to balance innovation with operational efficiency.

\vspace{10pt}

\noindent
My technical expertise spans the full ML stack, including Python, TensorFlow,
and cloud platforms such as AWS. I am particularly excited about InnovateTech's
focus on cutting-edge ML applications and the opportunity to mentor junior
scientists while driving strategic ML initiatives. My experience presenting
insights to C-suite executives and cross-functional stakeholders aligns well
with the communication and leadership requirements of this role.

\vspace{10pt}

\noindent
I am eager to bring my expertise in machine learning, team leadership, and
stakeholder communication to InnovateTech. I would welcome the opportunity to
discuss how my background aligns with your vision for the Lead Data Scientist
role. Thank you for considering my application.

\vspace{12pt}

\noindent
Sincerely,

\vspace{24pt}

\noindent
Sarah Johnson

\end{document}
```

---

## What Changed?

### Original Input → Enhanced Output

**Summary:**
- ❌ "Data scientist with 5 years experience"
- ✅ "Accomplished Senior Data Scientist with 5+ years of expertise in machine learning, statistical analysis, and team leadership. Proven track record in building production ML systems..."

**Experience Bullets:**
- ❌ "Built ML models for customer churn prediction"
- ✅ "Developed and deployed machine learning models for customer churn prediction, achieving 85% accuracy and enabling proactive retention strategies"

**Cover Letter:**
- ✅ **NEW** - 4 tailored paragraphs showing:
  - Interest in specific role and company
  - Relevant achievements with impact
  - Technical alignment
  - Professional closing

---

## How to Use the Output

### Step 1: Get Your File
Download: `CV_and_CoverLetter_Sarah_Johnson_HARVARD_EN.txt`

### Step 2: Go to Overleaf
1. Visit https://overleaf.com (free)
2. Create account or login
3. Click "New Project" → "Blank Project"

### Step 3: Upload Content
**Option A (Easy):**
1. Upload the entire `.txt` file
2. Rename to `.tex`
3. Set compiler to XeLaTeX (Menu → Compiler → XeLaTeX)
4. Compile → Download both PDFs

**Option B (Separate):**
1. Create `CV.tex` - paste everything BEFORE `%%% COVER LETTER %%%`
2. Create `CoverLetter.tex` - paste everything AFTER `%%% COVER LETTER %%%`
3. Compile each separately

### Step 4: Download PDFs
✅ `CV.pdf` - Professional, ATS-ready
✅ `CoverLetter.pdf` - Tailored to job

---

## API Usage

### cURL Example

```bash
curl -X POST https://your-domain.vercel.app/api/polish \
  -H "Content-Type: application/json" \
  -d '{
    "contact": {
      "name": "Sarah Johnson",
      "email": "sarah.j@email.com",
      ...
    },
    ...
  }'
```

### JavaScript Example

```javascript
const response = await fetch('/api/polish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contact: { name: "Sarah Johnson", ... },
    summary: "...",
    experience: [...],
    education: [...],
    skills: {...},
    language: "EN",
    style: "HARVARD",
    job_description: {
      job_title: "Lead Data Scientist",
      company_name: "InnovateTech",
      full_description: "..."
    }
  })
});

const latexText = await response.text();
// Split on "%%% COVER LETTER %%%" to get CV and Cover Letter separately
const [cvLatex, coverLetterLatex] = latexText.split('%%% COVER LETTER %%%');
```

### Python Example

```python
import requests

data = {
    "contact": {
        "name": "Sarah Johnson",
        "email": "sarah.j@email.com",
        # ...
    },
    "summary": "...",
    "experience": [...],
    "education": [...],
    "skills": {...},
    "language": "EN",
    "style": "HARVARD",
    "job_description": {
        "job_title": "Lead Data Scientist",
        "company_name": "InnovateTech",
        "full_description": "..."
    }
}

response = requests.post(
    'https://your-domain.vercel.app/api/polish',
    json=data
)

if response.status_code == 200:
    latex_output = response.text

    # Split into CV and Cover Letter
    cv_latex, cover_letter_latex = latex_output.split('%%% COVER LETTER %%%')

    # Save to files
    with open('CV.tex', 'w') as f:
        f.write(cv_latex)

    with open('CoverLetter.tex', 'w') as f:
        f.write(cover_letter_latex)

    print("✅ Generated CV and Cover Letter!")
else:
    print(f"❌ Error: {response.json()}")
```

---

## Best Practices

### For Best CV Results

1. **Provide Context**
   - Use 3-7 bullets per experience
   - Include numbers when possible (even approximate)
   - Mention tools and technologies used

2. **Target the Job**
   - Paste full job description
   - Include company name
   - AI will emphasize relevant skills

3. **Upload Existing CV (Optional)**
   - Extract text from your current CV
   - Add to `uploaded_documents.existing_cv_text`
   - AI will find missed details

### For Best Cover Letter Results

1. **Complete Job Description**
   - Include company name
   - Paste full requirements
   - More detail = better tailoring

2. **Strong Experience Bullets**
   - Cover letter references CV achievements
   - Better CV = better cover letter

3. **Highlight Soft Skills**
   - Leadership, communication, etc.
   - AI will weave into cover letter narrative

---

## Common Issues

### ❌ "LaTeX won't compile"
**Solution:** Use XeLaTeX compiler (not pdfLaTeX)
- Overleaf: Menu → Compiler → XeLaTeX

### ❌ "Cover letter is too generic"
**Solution:** Provide detailed job description with:
- Specific requirements
- Company culture details
- Technical skills needed

### ❌ "CV is too long"
**Solution:**
- Remove older/less relevant positions
- Reduce bullets to 3-5 per role
- Focus on recent experience

### ❌ "Rate limit exceeded"
**Solution:**
- Wait 5 minutes
- Or deploy your own instance

---

## Rate Limits

- **5 requests per IP per 5 minutes**
- After limit: Wait 5 minutes or deploy your own instance

---

## Privacy & Security

✅ **No data storage** - All processing is stateless
✅ **No tracking** - Your data is never logged
✅ **No database** - Nothing is saved
✅ **HTTPS** - All connections encrypted

---

## Need Help?

- **Full Documentation:** `CV_POLISHER_2.0_README.md`
- **GitHub Issues:** [Your Repository]
- **Examples:** `__fixtures__/` directory

---

## Next Steps

1. **Test It:** Try with your CV data
2. **Refine:** Adjust job description for better targeting
3. **Compile:** Use Overleaf to generate PDFs
4. **Apply:** Send your professional CV + Cover Letter!

---

**CV Polisher 2.0** - From data to dream job in minutes 🚀
