'use client';

import { EducationEntry } from '@/lib/types';

interface EducationFieldsProps {
  education: EducationEntry[];
  onChange: (education: EducationEntry[]) => void;
}

export default function EducationFields({ education, onChange }: EducationFieldsProps) {
  const addEducation = () => {
    onChange([
      ...education,
      {
        school: '',
        degree: '',
        dates: '',
        extra: '',
      },
    ]);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof EducationEntry, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <div key={index} className="card space-y-4 relative">
          {education.length > 1 && (
            <button
              type="button"
              onClick={() => removeEducation(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-400"
              title="Remove this education"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <h3 className="text-lg font-semibold text-primary">Education #{index + 1}</h3>

          <div>
            <label className="label">Institution/School *</label>
            <input
              type="text"
              className="input"
              value={edu.school}
              onChange={(e) => updateEducation(index, 'school', e.target.value)}
              placeholder="e.g., Queen Mary University of London"
              required
            />
          </div>

          <div>
            <label className="label">Degree/Program *</label>
            <input
              type="text"
              className="input"
              value={edu.degree}
              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
              placeholder="e.g., MSc Actuarial Science & Data Analytics"
              required
            />
          </div>

          <div>
            <label className="label">Dates *</label>
            <input
              type="text"
              className="input"
              value={edu.dates}
              onChange={(e) => updateEducation(index, 'dates', e.target.value)}
              placeholder="YYYY–YYYY (e.g., 2020–2024)"
              required
            />
          </div>

          <div>
            <label className="label">Additional Details (Optional)</label>
            <textarea
              className="textarea"
              value={edu.extra || ''}
              onChange={(e) => updateEducation(index, 'extra', e.target.value)}
              placeholder="e.g., First Class Honours, Key modules: Risk Management, Financial Data Analysis"
              rows={2}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="btn btn-primary w-full"
      >
        + Add Another Education
      </button>
    </div>
  );
}
