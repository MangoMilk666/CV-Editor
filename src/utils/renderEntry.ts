import { renderMarkdown } from './markdown';
import type { EntryRecord, ModuleType, ResumeLocale } from '../types';

const ENGLISH_MONTHS: Record<string, string> = {
  '01': 'Jan.',
  '02': 'Feb.',
  '03': 'Mar.',
  '04': 'Apr.',
  '05': 'May',
  '06': 'Jun.',
  '07': 'Jul.',
  '08': 'Aug.',
  '09': 'Sep.',
  '10': 'Oct.',
  '11': 'Nov.',
  '12': 'Dec.',
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(left: string, right: string, rightBold = false): string {
  if (!left && !right) return '';
  const rightHtml = right
    ? `<span style="white-space:nowrap;flex-shrink:0;color:#555;${rightBold ? 'font-weight:700;' : ''}">${esc(right)}</span>`
    : '';
  return `<div class="resume-entry-timeline" style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;line-height:1.4">
    <span style="flex:1;min-width:0">${left}</span>${rightHtml}
  </div>`;
}

function md(s: string): string {
  return s.trim() ? renderMarkdown(s) : '';
}

function formatDateValue(value: string, locale: ResumeLocale): string {
  if (!value) return '';
  if (locale === 'zh') return value;
  if (value === 'Present') return value;
  const [year, month] = value.split('.');
  if (!year || !month) return value;
  return `${ENGLISH_MONTHS[month] ?? month} ${year}`;
}

function dateRange(e: EntryRecord, locale: ResumeLocale): string {
  return [formatDateValue(e.startDate ?? '', locale), formatDateValue(e.endDate ?? '', locale)]
    .filter(Boolean)
    .join(' – ');
}

export function renderEntry(type: ModuleType, e: EntryRecord, locale: ResumeLocale): string {
  switch (type) {
    case 'education': {
      const titleParts = [
        e.school && `<strong>${esc(e.school)}</strong>`,
        locale === 'zh' && e.major && esc(e.major),
        e.degree && esc(e.degree),
        e.gpa && `GPA: ${esc(e.gpa)}`,
      ].filter(Boolean);
      return [
        row(titleParts.join('&ensp;&ensp;&ensp;'), dateRange(e, locale), locale === 'en'),
        md(e.notes ?? ''),
      ].filter(Boolean).join('\n');
    }

    case 'projects': {
      // Title row: name · role
      const titleLeft = [
        e.name && `<strong>${esc(e.name)}</strong>`,
        e.role && esc(e.role),
      ].filter(Boolean).join(' · ');

      // Link on title row (right side replaces date → push date below link)
      // Layout:
      //   项目名 · 角色          起止年月
      //   链接 (blue, if present)
      //   技术栈 (if present)
      //   描述
      const linkLine = e.link
        ? `<div class="resume-entry-project-meta"><a href="https://${e.link.replace(/^https?:\/\//, '')}" style="color:#2563eb">${esc(e.link)}</a></div>`
        : '';
      const stackLine = e.techStack
        ? `<div class="resume-entry-project-meta" style="color:#555">${locale === 'zh' ? '技术栈：' : 'Tech Stack: '}${esc(e.techStack)}</div>`
        : '';
      return [
        row(titleLeft, dateRange(e, locale), locale === 'en'),
        linkLine,
        stackLine,
        md(e.description ?? ''),
      ].filter(Boolean).join('\n');
    }

    case 'internship':
    case 'work': {
      const titleParts = [
        e.company  && `<strong>${esc(e.company)}</strong>`,
        e.position && esc(e.position),
        e.city     && esc(e.city),
      ].filter(Boolean);
      return [
        row(titleParts.join(' · '), dateRange(e, locale), locale === 'en'),
        md(e.description ?? ''),
      ].filter(Boolean).join('\n');
    }

    case 'skills':
      return md(e.content ?? '');

    case 'others':
      return md(e.content ?? '');

    case 'custom':
      return md(e.content ?? '');

    default:
      return '';
  }
}
