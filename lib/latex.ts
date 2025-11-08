import { CVData, Language, CoverLetterData } from './types';

/**
 * Escape LaTeX special characters in user-provided text
 */
export function latexEscape(text: string): string {
  if (!text) return '';

  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[{}]/g, (char) => `\\${char}`)
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/%/g, '\\%')
    .replace(/&/g, '\\&')
    .replace(/_/g, '\\_')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/~/g, '\\textasciitilde{}');
}

/**
 * Map language code to Polyglossia language name
 */
function getPolyglossiaLanguage(lang: Language): string {
  switch (lang) {
    case 'EN':
      return 'english';
    case 'RU':
      return 'russian';
    case 'UZ':
      return 'english'; // Uzbek uses Latin script, use English rules
    default:
      return 'english';
  }
}

/**
 * Generate LaTeX preamble with appropriate fonts and language support
 */
function generatePreamble(lang: Language): string {
  const polyLang = getPolyglossiaLanguage(lang);

  // For Cyrillic languages, set up font family
  const cyrillicSetup = (lang === 'RU' || lang === 'UZ')
    ? `\\newfontfamily\\cyrillicfont{DejaVu Serif}\n`
    : '';

  return `\\documentclass[11pt]{article}
\\usepackage[a4paper,margin=1in]{geometry}
\\usepackage{fontspec}
\\usepackage{polyglossia}
\\setdefaultlanguage{${polyLang}}

% Use DejaVu Serif for Unicode/Cyrillic support
\\setmainfont{DejaVu Serif}
${cyrillicSetup}

\\usepackage{enumitem}
\\setlist[itemize]{noitemsep,topsep=0pt,leftmargin=1.5em}
\\usepackage{titlesec}
\\usepackage{hyperref}

% Customize hyperlinks
\\hypersetup{
  colorlinks=true,
  linkcolor=black,
  urlcolor=blue,
  pdfauthor={CV},
  pdftitle={CV}
}

% Section formatting
\\titleformat{\\section}{\\bfseries\\scshape\\large}{}{0pt}{}
\\titlespacing*{\\section}{0pt}{12pt}{6pt}

% Remove page numbering
\\pagestyle{empty}

% Custom bullet
\\renewcommand\\labelitemi{--}

\\begin{document}
`;
}

/**
 * Generate HARVARD style LaTeX document matching Abdurakhmonbek's CV style
 */
export function toHarvardTex(data: CVData): string {
  const { contact, summary, experience, education, skills, certifications, languages_extra } = data;

  let tex = generatePreamble(data.language);

  // Name (large, bold, centered, uppercase)
  tex += `\\begin{center}\n`;
  tex += `{\\Large \\textbf{${latexEscape(contact.name.toUpperCase())}}}\n\n`;

  // Location
  if (contact.location) {
    tex += `${latexEscape(contact.location)}\\\\\n`;
  }

  // Contact line with bullet separators
  const contactParts: string[] = [];
  if (contact.email) contactParts.push(latexEscape(contact.email));
  if (contact.phone) contactParts.push(latexEscape(contact.phone));
  if (contact.links) {
    const links = contact.links.split(',').map(l => l.trim()).filter(l => l);
    contactParts.push(...links.map(l => latexEscape(l)));
  }

  if (contactParts.length > 0) {
    tex += contactParts.join(' $\\cdot$ ');
  }

  tex += `\n\\end{center}\n\n`;
  tex += `\\vspace{8pt}\n\n`;

  // Professional Summary with underlined header
  if (summary && summary.trim()) {
    tex += `\\noindent\\textbf{PROFESSIONAL SUMMARY}\\\\\n`;
    tex += `\\rule{\\textwidth}{0.4pt}\n\n`;
    tex += `${latexEscape(summary)}\n\n`;
    tex += `\\vspace{8pt}\n\n`;
  }

  // Education with underlined header
  if (education && education.length > 0) {
    tex += `\\noindent\\textbf{EDUCATION}\\\\\n`;
    tex += `\\rule{\\textwidth}{0.4pt}\n\n`;

    education.forEach((edu, idx) => {
      // University name and dates on same line
      tex += `\\noindent\\textbf{${latexEscape(edu.school)}}`;
      if (edu.dates) {
        tex += `\\hfill ${latexEscape(edu.dates)}`;
      }
      tex += `\\\\\n`;

      // Degree in italic
      tex += `\\textit{${latexEscape(edu.degree)}}\\\\\n`;

      // Modules as bullet points
      if (edu.modules || edu.achievements || edu.extra) {
        tex += `\\begin{itemize}\n`;
        if (edu.modules) {
          tex += `  \\item Key Modules: ${latexEscape(edu.modules)}\n`;
        }
        if (edu.achievements) {
          tex += `  \\item ${latexEscape(edu.achievements)}\n`;
        }
        if (edu.extra && !edu.modules && !edu.achievements) {
          tex += `  \\item ${latexEscape(edu.extra)}\n`;
        }
        tex += `\\end{itemize}\n`;
      }

      if (idx < education.length - 1) {
        tex += `\\vspace{4pt}\n`;
      }
    });
    tex += `\\vspace{8pt}\n\n`;
  }

  // Professional Experience with underlined header
  if (experience && experience.length > 0) {
    tex += `\\noindent\\textbf{PROFESSIONAL EXPERIENCE}\\\\\n`;
    tex += `\\rule{\\textwidth}{0.4pt}\n\n`;

    experience.forEach((exp, idx) => {
      // Job title and dates on same line
      tex += `\\noindent\\textbf{${latexEscape(exp.title)}}`;
      if (exp.start || exp.end) {
        tex += `\\hfill \\textit{${latexEscape(exp.start)} -- ${latexEscape(exp.end)}}`;
      }
      tex += `\\\\\n`;

      // Company in italic
      tex += `\\textit{${latexEscape(exp.company)}}`;
      if (exp.location) {
        tex += ` $\\cdot$ ${latexEscape(exp.location)}`;
      }
      tex += `\\\\\n`;

      // Bullet points
      if (exp.bullets && exp.bullets.length > 0) {
        tex += `\\begin{itemize}\n`;
        exp.bullets.forEach(bullet => {
          if (bullet && bullet.trim()) {
            tex += `  \\item ${latexEscape(bullet)}\n`;
          }
        });
        tex += `\\end{itemize}\n`;
      }

      if (idx < experience.length - 1) {
        tex += `\\vspace{4pt}\n`;
      }
    });
    tex += `\\vspace{8pt}\n\n`;
  }

  // Technical Skills with underlined header and definition list style
  if (skills && (skills.hard.length > 0 || skills.soft.length > 0 || skills.tools.length > 0)) {
    tex += `\\noindent\\textbf{TECHNICAL SKILLS}\\\\\n`;
    tex += `\\rule{\\textwidth}{0.4pt}\n\n`;

    // Use definition-list style like your CV
    if (skills.hard.length > 0) {
      tex += `\\noindent\\textbf{Programming:} ${skills.hard.map(latexEscape).join(', ')}\\\\\n`;
    }
    if (skills.tools.length > 0) {
      tex += `\\noindent\\textbf{Tools \\& Technologies:} ${skills.tools.map(latexEscape).join(', ')}\\\\\n`;
    }
    if (skills.soft.length > 0) {
      tex += `\\noindent\\textbf{Core Competencies:} ${skills.soft.map(latexEscape).join(', ')}\\\\\n`;
    }
    tex += `\\vspace{8pt}\n\n`;
  }

  // Leadership & Activities (Projects)
  if (data.projects && data.projects.length > 0) {
    tex += `\\noindent\\textbf{LEADERSHIP \\& ACTIVITIES}\\\\\n`;
    tex += `\\rule{\\textwidth}{0.4pt}\n\n`;
    tex += `\\begin{itemize}\n`;
    data.projects.forEach(project => {
      if (project && project.trim()) {
        tex += `  \\item ${latexEscape(project)}\n`;
      }
    });
    tex += `\\end{itemize}\n`;
    tex += `\\vspace{8pt}\n\n`;
  }

  // Courses & Certifications
  if (certifications && certifications.length > 0) {
    tex += `\\noindent\\textbf{COURSES \\& CERTIFICATIONS}\\\\\n`;
    tex += `\\rule{\\textwidth}{0.4pt}\n\n`;
    tex += `\\begin{itemize}\n`;
    certifications.forEach(cert => {
      if (cert && cert.trim()) {
        tex += `  \\item ${latexEscape(cert)}\n`;
      }
    });
    tex += `\\end{itemize}\n`;
    tex += `\\vspace{8pt}\n\n`;
  }

  // Languages & Soft Skills
  if (languages_extra && languages_extra.length > 0) {
    tex += `\\noindent\\textbf{LANGUAGES \\& SOFT SKILLS}\\\\\n`;
    tex += `\\rule{\\textwidth}{0.4pt}\n\n`;
    tex += `\\noindent\\textbf{Languages:} ${languages_extra.map(latexEscape).join(', ')}\\\\\n`;
    if (skills && skills.soft.length > 0) {
      tex += `\\noindent\\textbf{Core Competencies:} ${skills.soft.map(latexEscape).join(', ')}\\\\\n`;
    }
    tex += '\n';
  }

  tex += `\\end{document}\n`;

  return tex;
}

/**
 * Generate PRO style LaTeX document
 */
export function toProTex(data: CVData): string {
  const { contact, summary, experience, education, skills, certifications, languages_extra } = data;

  let tex = generatePreamble(data.language);

  // Name with rule
  tex += `{\\LARGE \\textbf{${latexEscape(contact.name)}}}\n\n`;
  tex += `\\vspace{2pt}\n`;
  tex += `\\hrule\n`;
  tex += `\\vspace{8pt}\n\n`;

  // Contact info (horizontal layout)
  const contactParts: string[] = [];
  if (contact.email) contactParts.push(latexEscape(contact.email));
  if (contact.phone) contactParts.push(latexEscape(contact.phone));
  if (contact.location) contactParts.push(latexEscape(contact.location));
  if (contact.links) {
    const links = contact.links.split(',').map(l => l.trim()).filter(l => l);
    contactParts.push(...links.map(l => latexEscape(l)));
  }

  tex += contactParts.join(' $\\bullet$ ');
  tex += '\n\n';
  tex += `\\vspace{10pt}\n\n`;

  // Summary
  if (summary && summary.trim()) {
    tex += `\\section*{PROFESSIONAL SUMMARY}\n`;
    tex += `\\vspace{-6pt}\n`;
    tex += `\\hrule\n`;
    tex += `\\vspace{6pt}\n`;
    tex += `${latexEscape(summary)}\n\n`;
  }

  // Experience
  if (experience && experience.length > 0) {
    tex += `\\section*{PROFESSIONAL EXPERIENCE}\n`;
    tex += `\\vspace{-6pt}\n`;
    tex += `\\hrule\n`;
    tex += `\\vspace{6pt}\n\n`;

    experience.forEach((exp, idx) => {
      tex += `\\textbf{${latexEscape(exp.title)}} -- ${latexEscape(exp.company)}\\\\\n`;
      tex += `{\\small \\itshape ${latexEscape(exp.location)} $\\bullet$ ${latexEscape(exp.start)} -- ${latexEscape(exp.end)}}\n\n`;

      if (exp.bullets && exp.bullets.length > 0) {
        tex += `\\begin{itemize}\n`;
        exp.bullets.forEach(bullet => {
          if (bullet && bullet.trim()) {
            tex += `  \\item ${latexEscape(bullet)}\n`;
          }
        });
        tex += `\\end{itemize}\n`;
      }

      if (idx < experience.length - 1) {
        tex += `\\vspace{6pt}\n\n`;
      }
    });
    tex += '\n';
  }

  // Education
  if (education && education.length > 0) {
    tex += `\\section*{EDUCATION}\n`;
    tex += `\\vspace{-6pt}\n`;
    tex += `\\hrule\n`;
    tex += `\\vspace{6pt}\n\n`;

    education.forEach((edu, idx) => {
      tex += `\\textbf{${latexEscape(edu.school)}}\\\\\n`;
      tex += `{\\itshape ${latexEscape(edu.degree)}} -- ${latexEscape(edu.dates)}\n`;

      if (edu.extra && edu.extra.trim()) {
        tex += `\\\\\n{\\small ${latexEscape(edu.extra)}}\n`;
      }

      if (idx < education.length - 1) {
        tex += `\\vspace{4pt}\n\n`;
      }
    });
    tex += '\n';
  }

  // Skills
  if (skills && (skills.hard.length > 0 || skills.soft.length > 0 || skills.tools.length > 0)) {
    tex += `\\section*{SKILLS}\n`;
    tex += `\\vspace{-6pt}\n`;
    tex += `\\hrule\n`;
    tex += `\\vspace{6pt}\n\n`;

    if (skills.hard.length > 0) {
      tex += `\\textbf{Technical:} ${skills.hard.map(latexEscape).join(', ')}\\\\\n`;
    }
    if (skills.tools.length > 0) {
      tex += `\\textbf{Tools:} ${skills.tools.map(latexEscape).join(', ')}\\\\\n`;
    }
    if (skills.soft.length > 0) {
      tex += `\\textbf{Soft Skills:} ${skills.soft.map(latexEscape).join(', ')}\\\\\n`;
    }
    tex += '\n';
  }

  // Projects/Publications/Achievements
  if (data.projects && data.projects.length > 0) {
    tex += `\\section*{PROJECTS \\& ACHIEVEMENTS}\n`;
    tex += `\\vspace{-6pt}\n`;
    tex += `\\hrule\n`;
    tex += `\\vspace{6pt}\n\n`;
    tex += `\\begin{itemize}\n`;
    data.projects.forEach(project => {
      if (project && project.trim()) {
        tex += `  \\item ${latexEscape(project)}\n`;
      }
    });
    tex += `\\end{itemize}\n\n`;
  }

  // Certifications
  if (certifications && certifications.length > 0) {
    tex += `\\section*{CERTIFICATIONS}\n`;
    tex += `\\vspace{-6pt}\n`;
    tex += `\\hrule\n`;
    tex += `\\vspace{6pt}\n\n`;
    tex += `\\begin{itemize}\n`;
    certifications.forEach(cert => {
      if (cert && cert.trim()) {
        tex += `  \\item ${latexEscape(cert)}\n`;
      }
    });
    tex += `\\end{itemize}\n\n`;
  }

  // Languages
  if (languages_extra && languages_extra.length > 0) {
    tex += `\\section*{LANGUAGES}\n`;
    tex += `\\vspace{-6pt}\n`;
    tex += `\\hrule\n`;
    tex += `\\vspace{6pt}\n\n`;
    tex += languages_extra.map(latexEscape).join(' $\\bullet$ ');
    tex += '\n\n';
  }

  tex += `\\end{document}\n`;

  return tex;
}

/**
 * Generate Cover Letter LaTeX document matching CV style
 */
export function generateCoverLetterLatex(data: CoverLetterData): string {
  const { contact, company_name, job_title, hiring_manager, paragraphs, language } = data;

  const polyLang = getPolyglossiaLanguage(language);
  const cyrillicSetup = (language === 'RU' || language === 'UZ')
    ? `\\newfontfamily\\cyrillicfont{DejaVu Serif}\n`
    : '';

  let tex = `\\documentclass[11pt]{article}
\\usepackage[a4paper,margin=1in]{geometry}
\\usepackage{fontspec}
\\usepackage{polyglossia}
\\setdefaultlanguage{${polyLang}}

\\setmainfont{DejaVu Serif}
${cyrillicSetup}
\\usepackage{hyperref}

\\hypersetup{
  colorlinks=true,
  linkcolor=black,
  urlcolor=blue
}

\\pagestyle{empty}

\\begin{document}

\\begin{center}
{\\Large \\textbf{${latexEscape(contact.name.toUpperCase())}}}

${contact.location ? latexEscape(contact.location) + '\\\\' : ''}
`;

  // Contact info centered with bullets
  const contactParts: string[] = [];
  if (contact.email) contactParts.push(latexEscape(contact.email));
  if (contact.phone) contactParts.push(latexEscape(contact.phone));

  if (contactParts.length > 0) {
    tex += contactParts.join(' $\\cdot$ ');
  }

  tex += `
\\end{center}

\\vspace{12pt}

\\noindent
\\today

\\vspace{12pt}

\\noindent
${hiring_manager ? latexEscape(hiring_manager) : 'Hiring Manager'}\\\\
${company_name ? latexEscape(company_name) + '\\\\' : ''}

\\vspace{12pt}

\\noindent
Dear ${hiring_manager ? latexEscape(hiring_manager) : 'Hiring Manager'},

\\vspace{12pt}

`;

  // Add each paragraph
  paragraphs.forEach((para, idx) => {
    if (para && para.trim()) {
      tex += `\\noindent\n${latexEscape(para)}\n\n`;
      if (idx < paragraphs.length - 1) {
        tex += `\\vspace{10pt}\n\n`;
      }
    }
  });

  // Closing
  tex += `\\vspace{12pt}

\\noindent
Sincerely,

\\vspace{24pt}

\\noindent
${latexEscape(contact.name)}

\\end{document}
`;

  return tex;
}

/**
 * Generate LaTeX based on selected style
 */
export function generateLatex(data: CVData): string {
  if (data.style === 'HARVARD') {
    return toHarvardTex(data);
  } else {
    return toProTex(data);
  }
}
