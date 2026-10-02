import type { ReactNode } from 'react';
import { renderMarkdown } from '../utils/markdown';
import { sortEntriesByDate, supportsModuleSort } from '../utils/entrySort';
import { PHOTO_DIMENSIONS, type EntryRecord, type ModuleType, type ResumeData } from '../types';

function dateRange(entry: EntryRecord): string {
  return [entry.startDate, entry.endDate].filter(Boolean).join(' – ');
}

function SeparatedLine({ items, className = '' }: { items: ReactNode[]; className?: string }) {
  const presentItems = items.filter((item) => item !== undefined && item !== null && item !== '');
  if (presentItems.length === 0) return null;

  return (
    <div className={`resume-cn2-meta ${className}`}>
      {presentItems.map((item, index) => (
        <span className="resume-cn2-meta-item" key={index}>
          {index > 0 && <span className="resume-cn2-meta-divider" aria-hidden="true">|</span>}
          {item}
        </span>
      ))}
    </div>
  );
}

function TimelineLine({ items, date, below }: { items: ReactNode[]; date: string; below?: ReactNode }) {
  const presentItems = items.filter((item) => item !== undefined && item !== null && item !== '');
  if (presentItems.length === 0 && !date) return null;

  return (
    <div className="resume-cn2-timeline">
      <SeparatedLine items={presentItems} className="resume-cn2-timeline-main" />
      {date && <span className="resume-cn2-timeline-date">{date}</span>}
      {below && <div className="resume-cn2-timeline-below">{below}</div>}
    </div>
  );
}

function Markdown({ value }: { value?: string }) {
  if (!value?.trim()) return null;
  return <div className="resume-content resume-cn2-desc" dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />;
}

function projectUrl(value: string): string {
  return `https://${value.replace(/^https?:\/\//, '')}`;
}

function ProjectResources({ link, techStack }: { link?: string; techStack?: string }) {
  if (!link && !techStack) return null;
  return (
    <div className="resume-cn2-project-resources">
      {link && <em>开源地址：<a className="resume-cn2-project-url" href={projectUrl(link)}>{link}</a></em>}
      {link && techStack && <span className="resume-cn2-project-divider"> | </span>}
      {techStack && <em>技术栈：{techStack}</em>}
    </div>
  );
}

function renderEntry(type: ModuleType, entry: EntryRecord): ReactNode {
  const dates = dateRange(entry);

  switch (type) {
    case 'education':
      return <>
        <TimelineLine date={dates} items={[
          entry.school && <strong>{entry.school}</strong>,
          entry.major,
          entry.degree,
          entry.gpa && `GPA: ${entry.gpa}`,
        ]} />
        <Markdown value={entry.notes} />
      </>;
    case 'projects':
      return <>
        <TimelineLine date={dates} below={<ProjectResources link={entry.link} techStack={entry.techStack} />} items={[
          entry.name && <strong>{entry.name}</strong>,
          entry.role && <em>{entry.role}</em>,
        ]} />
        <Markdown value={entry.description} />
      </>;
    case 'internship':
    case 'work':
      return <>
        <TimelineLine date={dates} items={[
          entry.company && <strong>{entry.company}</strong>,
          entry.position,
          entry.city,
        ]} />
        <Markdown value={entry.description} />
      </>;
    case 'skills':
    case 'others':
    case 'custom':
      return <Markdown value={entry.content} />;
    default:
      return null;
  }
}

export default function ChineseTemplate2Content({ resume }: { resume: ResumeData }) {
  const { header, modules } = resume;
  const photoSize = PHOTO_DIMENSIONS[header.photoSize];
  const contacts = [header.email, header.phone, header.city].filter(Boolean);
  const links = [
    header.github && { label: 'GitHub', value: header.github },
    header.website && { label: '个人主页', value: header.website },
    header.linkedin && { label: 'LinkedIn', value: header.linkedin },
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  return (
    <div className="resume-cn2">
      <header className={`resume-cn2-header${header.headerAlign === 'center' ? ' resume-cn2-header-centered' : ''}`}>
        <div className="resume-cn2-header-main">
          <h1>{header.name || '姓名'}</h1>
          {contacts.length > 0 && <div className="resume-cn2-contacts">{contacts.join('  |  ')}</div>}
          {links.length > 0 && (
            <div className="resume-cn2-links">
              {links.map(({ label, value }, index) => (
                <span key={label}>
                  {index > 0 && <span className="resume-cn2-separator"> | </span>}
                  {label}：<a href={projectUrl(value)}>{value}</a>
                </span>
              ))}
            </div>
          )}
          {header.jobTarget && <div className="resume-cn2-target">求职意向：{header.jobTarget}</div>}
        </div>
        {header.photo && (
          <img
            className="resume-cn2-photo"
            src={header.photo}
            alt="证件照"
            style={{ width: `${photoSize.w}mm`, height: `${photoSize.h}mm` }}
          />
        )}
      </header>

      {modules.filter((module) => module.visible).map((module) => (
        <section className="resume-cn2-module" key={module.id}>
          <h2>{module.title}</h2>
          {(supportsModuleSort(module.type)
            ? sortEntriesByDate(module.entries, module.entrySortOrder ?? 'desc')
            : module.entries
          ).map((entry, index) => (
            <div className="resume-cn2-entry" key={`${module.id}-${index}`}>
              {renderEntry(module.type, entry)}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
