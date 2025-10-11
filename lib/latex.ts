import { CVData, Language } from './types';

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

  return `% IMPORTANT: Compile with XeLaTeX (not pdfLaTeX)
% In Overleaf: Menu → Compiler → XeLaTeX
\\documentclass[11pt]{article}
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
 * Generate HARVARD style LaTeX document
 */
export function toHarvardTex(data: CVData): string {
  const { contact, summary, experience, education, skills, certifications, languages_extra } = data;

  let tex = generatePreamble(data.language);

  // Name (large and bold)
  tex += `\\begin{center}\n`;
  tex += `{\\LARGE \\textbf{${latexEscape(contact.name)}}}\n`;
  tex += `\\end{center}\n\n`;

  // Contact line
  const contactParts: string[] = [];
  if (contact.email) contactParts.push(latexEscape(contact.email));
  if (contact.phone) contactParts.push(latexEscape(contact.phone));
  if (contact.location) contactParts.push(latexEscape(contact.location));
  if (contact.links) {
    const links = contact.links.split(',').map(l => l.trim()).filter(l => l);
    contactParts.push(...links.map(l => latexEscape(l)));
  }

  tex += `\\begin{center}\n`;
  tex += contactParts.join(' $\\bullet$ ');
  tex += `\n\\end{center}\n\n`;
  tex += `\\vspace{10pt}\n\n`;

  // Summary
  if (summary && summary.trim()) {
    tex += `\\section*{Professional Summary}\n`;
    tex += `${latexEscape(summary)}\n\n`;
  }

  // Experience
  if (experience && experience.length > 0) {
    tex += `\\section*{Professional Experience}\n\n`;

    experience.forEach((exp, idx) => {
      tex += `\\textbf{${latexEscape(exp.title)}} $|$ ${latexEscape(exp.company)}\\\\\n`;
      tex += `{\\itshape ${latexEscape(exp.location)} $\\bullet$ ${latexEscape(exp.start)} -- ${latexEscape(exp.end)}}\n\n`;

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
        tex += `\\vspace{8pt}\n\n`;
      }
    });
    tex += '\n';
  }

  // Education
  if (education && education.length > 0) {
    tex += `\\section*{Education}\n\n`;

    education.forEach((edu, idx) => {
      tex += `\\textbf{${latexEscape(edu.school)}}\\\\\n`;
      tex += `{\\itshape ${latexEscape(edu.degree)}} $\\bullet$ ${latexEscape(edu.dates)}\n`;

      if (edu.extra && edu.extra.trim()) {
        tex += `\\\\\n${latexEscape(edu.extra)}\n`;
      }

      if (idx < education.length - 1) {
        tex += `\\vspace{6pt}\n\n`;
      }
    });
    tex += '\n';
  }

  // Skills
  if (skills && (skills.hard.length > 0 || skills.soft.length > 0 || skills.tools.length > 0)) {
    tex += `\\section*{Technical Skills}\n\n`;

    if (skills.hard.length > 0) {
      tex += `\\textbf{Technical Skills:} ${skills.hard.map(latexEscape).join(', ')}\\\\\n`;
    }
    if (skills.tools.length > 0) {
      tex += `\\textbf{Tools \\& Technologies:} ${skills.tools.map(latexEscape).join(', ')}\\\\\n`;
    }
    if (skills.soft.length > 0) {
      tex += `\\textbf{Soft Skills:} ${skills.soft.map(latexEscape).join(', ')}\\\\\n`;
    }
    tex += '\n';
  }

  // Certifications
  if (certifications && certifications.length > 0) {
    tex += `\\section*{Certifications}\n\n`;
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
    tex += `\\section*{Languages}\n\n`;
    tex += languages_extra.map(latexEscape).join(' $\\bullet$ ');
    tex += '\n\n';
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
 * Generate LaTeX based on selected style
 */
export function generateLatex(data: CVData): string {
  if (data.style === 'HARVARD') {
    return toHarvardTex(data);
  } else {
    return toProTex(data);
  }
}
