import { renderMarkdown } from './markdown';
import type { EntryRecord, ModuleType } from '../types';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(left: string, right: string): string {
  if (!left && !right) return '';
  const rightHtml = right
    ? `<span style="white-space:nowrap;flex-shrink:0;color:#555;font-size:0.92em">${esc(right)}</span>`
    : '';
  return `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;line-height:1.4">
    <span style="flex:1;min-width:0">${left}</span>${rightHtml}
  </div>`;
}

function md(s: string): string {
  return s.trim() ? renderMarkdown(s) : '';
}

export function renderEntry(type: ModuleType, e: EntryRecord): string {
  switch (type) {
    case 'education': {
      const titleParts = [e.school && `<strong>${esc(e.school)}</strong>`, e.major && esc(e.major), e.degree && esc(e.degree)].filter(Boolean);
      const dateStr = [e.startDate, e.endDate].filter(Boolean).join(' – ');
      const gpaLine = e.gpa ? `<div style="color:#555;font-size:0.92em">GPA: ${esc(e.gpa)}</div>` : '';
      return [
        row(titleParts.join(' · '), dateStr),
        gpaLine,
        md(e.notes ?? ''),
      ].filter(Boolean).join('\n');
    }

    case 'projects': {
      const nameAndStack = [
        e.name && `<strong>${esc(e.name)}</strong>`,
        e.techStack && esc(e.techStack),
      ].filter(Boolean).join(' | ');
      const dateStr = [e.startDate, e.endDate].filter(Boolean).join(' – ');
      const linkLine = e.link
        ? `<div><a href="https://${e.link.replace(/^https?:\/\//, '')}" style="color:#2563eb">${esc(e.link)}</a></div>`
        : '';
      return [row(nameAndStack, dateStr), linkLine, md(e.description ?? '')].filter(Boolean).join('\n');
    }

    case 'internship':
    case 'work': {
      const titleParts = [
        e.company && `<strong>${esc(e.company)}</strong>`,
        e.position && esc(e.position),
        e.city && esc(e.city),
      ].filter(Boolean);
      const dateStr = [e.startDate, e.endDate].filter(Boolean).join(' – ');
      return [row(titleParts.join(' · '), dateStr), md(e.description ?? '')].filter(Boolean).join('\n');
    }

    case 'skills':
      return md(e.content ?? '');

    case 'others': {
      if (!e.name && !e.description) return '';
      const name = e.name ? `<strong>${esc(e.name)}</strong>` : '';
      const desc = e.description ? ` — ${esc(e.description)}` : '';
      return `<div style="margin:2px 0">${name}${desc}</div>`;
    }

    case 'custom':
      return md(e.content ?? '');

    default:
      return '';
  }
}
