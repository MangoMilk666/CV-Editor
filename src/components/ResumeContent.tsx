import { useResumeStore } from '../store';
import { renderEntry } from '../utils/renderEntry';
import { PHOTO_DIMENSIONS, type ResumeData, type ResumeLocale, type ResumeRendererId } from '../types';
import { UI_TEXT } from '../config/i18n';
import ChineseTemplate2Content from './ChineseTemplate2Content';
import { sortEntriesByDate, supportsModuleSort } from '../utils/entrySort';

const LINK_STYLE: React.CSSProperties = { color: '#2563eb', textDecoration: 'none' };

function chunkItems<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/** Pure content — no outer page wrapper. Used both for screen pages and print portal. */
function SuperResumeContent({ resume, locale }: { resume: ResumeData; locale: ResumeLocale }) {
  const { header, modules } = resume;
  const photoDim = PHOTO_DIMENSIONS[header.photoSize];
  const isCenter = header.headerAlign === 'center';
  const text = UI_TEXT[locale];
  const headerNameSize = locale === 'zh' ? 'var(--resume-header-name-size)' : '24px';
  const headerInfoSize = locale === 'zh' ? 'var(--resume-header-info-size)' : '12px';
  const headerInfoLineHeight = locale === 'zh' ? 'var(--resume-header-info-line-height)' : undefined;

  const contactItems = [
    header.email ? { label: header.email, href: `mailto:${header.email}` } : null,
    header.phone ? { label: header.phone, href: null } : null,
    header.city ? { label: header.city, href: null } : null,
    header.github   ? { label: header.github,   href: `https://${header.github.replace(/^https?:\/\//, '')}` } : null,
    header.website ? { label: header.website, href: `https://${header.website.replace(/^https?:\/\//, '')}` } : null,
    header.linkedin ? { label: header.linkedin, href: `https://${header.linkedin.replace(/^https?:\/\//, '')}` } : null,
  ].filter(Boolean) as { label: string; href: string | null }[];
  const contactRows = chunkItems(contactItems, 2);

  function InfoItem({ label, href }: { label: string; href: string | null }) {
    return href ? <a href={href} style={LINK_STYLE}>{label}</a> : <span>{label}</span>;
  }

  return (
    <>
      {/* ── Header ── */}
      {isCenter ? (
        <div style={{
          position: 'relative', textAlign: 'center', marginBottom: '10px',
          minHeight: header.photo ? `${photoDim.h}mm` : undefined,
        }}>
          {header.photo && (
            <img src={header.photo} alt="证件照" style={{
              position: 'absolute', top: 0, right: 0,
              width: `${photoDim.w}mm`, height: `${photoDim.h}mm`,
              objectFit: 'cover', border: '1px solid #ddd',
            }} />
          )}
          <div style={{ fontSize: headerNameSize, fontWeight: 700, letterSpacing: '0.06em', marginBottom: '4px' }}>
            {header.name || '姓名'}
          </div>
          {contactRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              style={{ fontSize: headerInfoSize, lineHeight: headerInfoLineHeight, color: '#444', marginBottom: '2px' }}
            >
              {row.map((item, i) => (
                <span key={`${rowIndex}-${i}`}>
                  {i > 0 && <span style={{ margin: '0 6px', color: '#bbb' }}>|</span>}
                  <InfoItem {...item} />
                </span>
              ))}
            </div>
          ))}
          {header.jobTarget && (
            <div style={{ fontSize: headerInfoSize, lineHeight: headerInfoLineHeight, color: '#444', marginTop: '2px' }}>
              {text.jobTargetPrefix}{header.jobTarget}
            </div>
          )}
          {header.internshipDuration && (
            <div style={{ fontSize: headerInfoSize, lineHeight: headerInfoLineHeight, color: '#444', marginTop: '2px' }}>
              {text.internshipDurationPrefix}{header.internshipDuration}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: headerNameSize, fontWeight: 700, letterSpacing: '0.04em', marginBottom: '4px' }}>
              {header.name || '姓名'}
            </div>
            {contactRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                style={{
                  fontSize: headerInfoSize,
                  lineHeight: headerInfoLineHeight,
                  color: '#444',
                  display: 'flex',
                  gap: '0 12px',
                  marginTop: rowIndex > 0 ? '2px' : 0,
                }}
              >
                {row.map((item, i) => <InfoItem key={`${rowIndex}-${i}`} {...item} />)}
              </div>
            ))}
            {header.jobTarget && (
              <div style={{ fontSize: headerInfoSize, lineHeight: headerInfoLineHeight, color: '#444', marginTop: '2px' }}>
                {text.jobTargetPrefix}{header.jobTarget}
              </div>
            )}
            {header.internshipDuration && (
              <div style={{ fontSize: headerInfoSize, lineHeight: headerInfoLineHeight, color: '#444', marginTop: '2px' }}>
                {text.internshipDurationPrefix}{header.internshipDuration}
              </div>
            )}
          </div>
          {header.photo && (
            <img src={header.photo} alt="证件照" style={{
              width: `${photoDim.w}mm`, height: `${photoDim.h}mm`,
              objectFit: 'cover', flexShrink: 0, border: '1px solid #ddd',
            }} />
          )}
        </div>
      )}

      {/* ── Modules ── */}
      {modules.filter((m) => m.visible).map((mod) => {
        const entries = supportsModuleSort(mod.type)
          ? sortEntriesByDate(mod.entries, mod.entrySortOrder ?? 'desc')
          : mod.entries;

        return (
          <div key={mod.id} className="resume-module">
            <div className="resume-module-title">{mod.title}</div>
            {entries.map((entry, i) => {
              const html = renderEntry(mod.type, entry, locale);
              if (!html) return null;
              return (
                <div
                  key={i}
                  className={`resume-content${locale === 'zh' ? ' resume-super-zh-content' : ''}`}
                  style={{ marginTop: i > 0 ? '8px' : 0 }}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

interface ResumeContentProps {
  resume?: ResumeData;
  locale?: ResumeLocale;
  rendererId?: ResumeRendererId;
}

export default function ResumeContent(props: ResumeContentProps) {
  const store = useResumeStore();
  const resume = props.resume ?? { header: store.header, modules: store.modules, layout: store.layout };
  const locale = props.locale ?? store.locale;
  const rendererId = props.rendererId ?? store.templates[store.locale].find(
    (template) => template.id === store.activeTemplateIds[store.locale]
  )?.rendererId;

  switch (rendererId) {
    case 'chinese-template-2':
      return <ChineseTemplate2Content resume={resume} />;
    case 'super-resume':
    default:
      return <SuperResumeContent resume={resume} locale={locale} />;
  }
}
