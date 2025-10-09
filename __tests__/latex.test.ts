/**
 * Tests for LaTeX escaping and generation
 */

import { latexEscape } from '../lib/latex';

describe('latexEscape', () => {
  it('should escape backslashes', () => {
    expect(latexEscape('\\test')).toBe('\\textbackslash{}test');
  });

  it('should escape curly braces', () => {
    expect(latexEscape('{test}')).toBe('\\{test\\}');
  });

  it('should escape dollar signs', () => {
    expect(latexEscape('$100')).toBe('\\$100');
  });

  it('should escape hashes', () => {
    expect(latexEscape('#hashtag')).toBe('\\#hashtag');
  });

  it('should escape percent signs', () => {
    expect(latexEscape('100%')).toBe('100\\%');
  });

  it('should escape ampersands', () => {
    expect(latexEscape('Smith & Jones')).toBe('Smith \\& Jones');
  });

  it('should escape underscores', () => {
    expect(latexEscape('file_name')).toBe('file\\_name');
  });

  it('should escape carets', () => {
    expect(latexEscape('x^2')).toBe('x\\textasciicircum{}2');
  });

  it('should escape tildes', () => {
    expect(latexEscape('~user')).toBe('\\textasciitilde{}user');
  });

  it('should handle multiple special characters', () => {
    expect(latexEscape('$100 & 50% of {users} #1')).toBe(
      '\\$100 \\& 50\\% of \\{users\\} \\#1'
    );
  });

  it('should handle empty strings', () => {
    expect(latexEscape('')).toBe('');
  });

  it('should handle normal text without special chars', () => {
    expect(latexEscape('Hello World')).toBe('Hello World');
  });

  it('should handle company names with ampersands', () => {
    expect(latexEscape('Johnson & Johnson')).toBe('Johnson \\& Johnson');
    expect(latexEscape('AT&T')).toBe('AT\\&T');
  });

  it('should handle email addresses', () => {
    expect(latexEscape('user_name@example.com')).toBe('user\\_name@example.com');
  });

  it('should handle complex real-world text', () => {
    const input = 'Increased revenue by 25% & reduced costs (saving $10k)';
    const expected = 'Increased revenue by 25\\% \\& reduced costs (saving \\$10k)';
    expect(latexEscape(input)).toBe(expected);
  });
});
