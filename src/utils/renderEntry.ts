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
    ? `<span style="white-space:nowrap;flex-shrink:0;color:#555">${esc(right)}</span>`
    : '';
  return `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;line-height:1.4">
    <span style="flex:1;min-width:0">${left}</span>${rightHtml}
  </div>`;
}

function md(s: string): string {
  return s.trim() ? renderMarkdown(s) : '';
}

function dateRange(e: EntryRecord): string {
  return [e.startDate, e.endDate].filter(Boolean).join(' – ');
}

export function renderEntry(type: ModuleType, e: EntryRecord): string {
  switch (type) {
    case 'education': {
      // School / major / degree separated by spaces (no dot), GPA on same line
      const titleParts = [
        e.school  && `<strong>${esc(e.school)}</strong>`,
        e.major   && esc(e.major),
        e.degree  && esc(e.degree),
        e.gpa     && `GPA: ${esc(e.gpa)}`,
      ].filter(Boolean);
      return [
        row(titleParts.join('&ensp;&ensp;&ensp;'), dateRange(e)),
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
        ? `<div><a href="https://${e.link.replace(/^https?:\/\//, '')}" style="color:#2563eb;font-size:0.92em">${esc(e.link)}</a></div>`
        : '';
      const stackLine = e.techStack
        ? `<div style="color:#555;font-size:0.92em">技术栈：${esc(e.techStack)}</div>`
        : '';
      return [
        row(titleLeft, dateRange(e)),
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
        row(titleParts.join(' · '), dateRange(e)),
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
