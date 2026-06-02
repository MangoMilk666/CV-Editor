import { useEffect, useRef, useState } from 'react';
import { useResumeStore } from '../store';
import { renderEntry } from '../utils/renderEntry';
import { PHOTO_DIMENSIONS } from '../types';

const LINK_STYLE: React.CSSProperties = { color: '#2563eb', textDecoration: 'none' };

function parseDateVal(d: string): number {
  if (!d || d === '至今') return 999999;
  const [y, m] = d.split('.');
  return parseInt(y || '0') * 100 + parseInt(m || '0');
}

export default function ResumePreview() {
  const { header, modules } = useResumeStore();
  const photoDim = PHOTO_DIMENSIONS[header.photoSize];
  const isCenter = header.headerAlign === 'center';
  const pageRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  // Measure page count via ResizeObserver
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    // Measure mm → px using a dummy element
    const ruler = document.createElement('div');
    ruler.style.cssText = 'position:absolute;visibility:hidden;height:297mm';
    document.body.appendChild(ruler);
    const pageHeightPx = ruler.offsetHeight || 1122;
    document.body.removeChild(ruler);

    const observer = new ResizeObserver(() => {
      setPageCount(Math.max(1, Math.ceil(el.scrollHeight / pageHeightPx)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const row1 = [
    header.email ? { label: header.email, href: `mailto:${header.email}` } : null,
    header.phone ? { label: header.phone, href: null } : null,
    header.city  ? { label: header.city,  href: null } : null,
  ].filter(Boolean) as { label: string; href: string | null }[];

  const row2 = [
    header.github   ? { label: header.github,   href: `https://${header.github.replace(/^https?:\/\//, '')}` } : null,
    header.website  ? { label: header.website,  href: `https://${header.website.replace(/^https?:\/\//, '')}` } : null,
    header.linkedin ? { label: header.linkedin, href: `https://${header.linkedin.replace(/^https?:\/\//, '')}` } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  function InfoItem({ label, href }: { label: string; href: string | null }) {
    return href ? <a href={href} style={LINK_STYLE}>{label}</a> : <span>{label}</span>;
  }

  return (
    <div className="relative">
      {/* Page count badge */}
      {pageCount > 1 && (
        <div className="no-print absolute -top-7 right-0 text-xs text-slate-400 bg-white border border-slate-200 rounded px-2 py-0.5 shadow-sm">
          共 {pageCount} 页
        </div>
      )}

      <div ref={pageRef} className="resume-page shadow-xl mx-auto">
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
            <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '4px' }}>
              {header.name || '姓名'}
            </div>
            {row1.length > 0 && (
              <div style={{ fontSize: '12px', color: '#444', marginBottom: '2px' }}>
                {row1.map((item, i) => (
                  <span key={i}>
                    {i > 0 && <span style={{ margin: '0 6px', color: '#bbb' }}>|</span>}
                    <InfoItem {...item} />
                  </span>
                ))}
              </div>
            )}
            {row2.length > 0 && (
              <div style={{ fontSize: '12px', marginBottom: '2px' }}>
                {row2.map((item, i) => (
                  <span key={i}>
                    {i > 0 && <span style={{ margin: '0 6px', color: '#bbb' }}>|</span>}
                    <InfoItem {...item} />
                  </span>
                ))}
              </div>
            )}
            {header.jobTarget && (
              <div style={{ fontSize: '12px', color: '#444', marginTop: '2px' }}>
                求职意向：{header.jobTarget}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '4px' }}>
                {header.name || '姓名'}
              </div>
              {row1.length > 0 && (
                <div style={{ fontSize: '12px', color: '#444', display: 'flex', flexWrap: 'wrap', gap: '0 12px' }}>
                  {row1.map((item, i) => <InfoItem key={i} {...item} />)}
                </div>
              )}
              {row2.length > 0 && (
                <div style={{ fontSize: '12px', display: 'flex', flexWrap: 'wrap', gap: '0 12px', marginTop: '2px' }}>
                  {row2.map((item, i) => <InfoItem key={i} {...item} />)}
                </div>
              )}
              {header.jobTarget && (
                <div style={{ fontSize: '12px', color: '#444', marginTop: '2px' }}>
                  求职意向：{header.jobTarget}
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
          // Sort project entries by endDate desc, then startDate desc
          const entries = mod.type === 'projects'
            ? [...mod.entries].sort((a, b) => {
                const ed = parseDateVal(b.endDate) - parseDateVal(a.endDate);
                return ed !== 0 ? ed : parseDateVal(b.startDate) - parseDateVal(a.startDate);
              })
            : mod.entries;

          return (
            <div key={mod.id} className="resume-module">
              <div className="resume-module-title">{mod.title}</div>
              {entries.map((entry, i) => {
                const html = renderEntry(mod.type, entry);
                if (!html) return null;
                return (
                  <div
                    key={i}
                    className="resume-content"
                    style={{ marginTop: i > 0 ? '8px' : 0 }}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
