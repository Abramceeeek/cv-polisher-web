'use client';

import { ExperienceEntry } from '@/lib/types';

interface ExperienceFieldsProps {
  experience: ExperienceEntry[];
  onChange: (experience: ExperienceEntry[]) => void;
}

export default function ExperienceFields({ experience, onChange }: ExperienceFieldsProps) {
  const addExperience = () => {
    onChange([
      ...experience,
      {
        company: '',
        title: '',
        location: '',
        start: '',
        end: '',
        bullets: [''],
      },
    ]);
  };

  const removeExperience = (index: number) => {
    onChange(experience.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof ExperienceEntry, value: any) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addBullet = (expIndex: number) => {
    const updated = [...experience];
    updated[expIndex].bullets.push('');
    onChange(updated);
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...experience];
    updated[expIndex].bullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    onChange(updated);
  };

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const updated = [...experience];
    updated[expIndex].bullets[bulletIndex] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {experience.map((exp, expIndex) => (
        <div key={expIndex} className="card space-y-4 relative">
          {experience.length > 1 && (
            <button
              type="button"
              onClick={() => removeExperience(expIndex)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-400"
              title="Remove this experience"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <h3 className="text-lg font-semibold text-primary">Experience #{expIndex + 1}</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Job Title *</label>
              <input
                type="text"
                className="input"
                value={exp.title}
                onChange={(e) => updateExperience(expIndex, 'title', e.target.value)}
                placeholder="e.g., Senior Data Analyst"
                required
              />
            </div>

            <div>
              <label className="label">Company *</label>
              <input
                type="text"
                className="input"
                value={exp.company}
                onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                placeholder="e.g., Apple Inc."
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Location</label>
            <input
              type="text"
              className="input"
              value={exp.location}
              onChange={(e) => updateExperience(expIndex, 'location', e.target.value)}
              placeholder="e.g., London, UK"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date *</label>
              <input
                type="text"
                className="input"
                value={exp.start}
                onChange={(e) => updateExperience(expIndex, 'start', e.target.value)}
                placeholder="MMM YYYY (e.g., Jan 2020)"
                required
              />
            </div>

            <div>
              <label className="label">End Date *</label>
              <input
                type="text"
                className="input"
                value={exp.end}
                onChange={(e) => updateExperience(expIndex, 'end', e.target.value)}
                placeholder="MMM YYYY or Present"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="label">Achievements & Responsibilities</label>
            {exp.bullets.map((bullet, bulletIndex) => (
              <div key={bulletIndex} className="flex gap-2">
                <textarea
                  className="textarea flex-1"
                  value={bullet}
                  onChange={(e) => updateBullet(expIndex, bulletIndex, e.target.value)}
                  placeholder="Describe your achievement or responsibility..."
                  rows={2}
                />
                {exp.bullets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBullet(expIndex, bulletIndex)}
                    className="text-red-500 hover:text-red-400 px-2"
                    title="Remove bullet"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addBullet(expIndex)}
              className="btn btn-secondary text-sm"
            >
              + Add Bullet Point
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExperience}
        className="btn btn-primary w-full"
      >
        + Add Another Experience
      </button>
    </div>
  );
}
