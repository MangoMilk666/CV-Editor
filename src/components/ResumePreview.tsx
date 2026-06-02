import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ResumeContent from './ResumeContent';

const DEFAULT_PAGE_H = 1122; // 297mm @ 96 dpi fallback

export default function ResumePreview() {
  const [pageHeightPx, setPageHeightPx] = useState(DEFAULT_PAGE_H);
  const [totalPages, setTotalPages] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  // Measure actual CSS-pixel height of 297mm once on mount
  useEffect(() => {
    const ruler = document.createElement('div');
    ruler.style.cssText =
      'position:fixed;top:-9999px;left:-9999px;height:297mm;visibility:hidden;pointer-events:none';
    document.body.appendChild(ruler);
    const h = ruler.getBoundingClientRect().height;
    document.body.removeChild(ruler);
    if (h > 0) setPageHeightPx(h);
  }, []);

  // Watch the screen content box height and recalculate page count
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      // 4px tolerance avoids spurious extra pages from sub-pixel rounding
      setTotalPages(Math.max(1, Math.ceil((el.scrollHeight - 4) / pageHeightPx)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [pageHeightPx]);

  return (
    <>
      {/*
       * PRINT PORTAL — mounted directly under <body> so window.print()
       * can access the full flowing document. Hidden on screen via CSS.
       */}
      {createPortal(
        <div className="resume-print-node">
          <ResumeContent />
        </div>,
        document.body,
      )}

      {/*
       * SCREEN VIEW — single flowing box (same layout as print node) with
       * dashed page-break indicator lines overlaid at 297mm intervals.
       * Using the same layout as the print node avoids render-path divergence
       * that caused screen clip-boxes to show different break points vs PDF.
       */}
      <div className="no-print" style={{ position: 'relative', width: '210mm' }}>
        {/* Dashed page-break lines + page labels */}
        {Array.from({ length: totalPages - 1 }, (_, i) => (
          <div
            key={i}
            className="resume-page-break"
            style={{ top: `${(i + 1) * pageHeightPx}px` }}
          >
            <span className="resume-page-break-label">第 {i + 2} 页</span>
          </div>
        ))}

        {/* Content — same styles as print node so layouts match */}
        <div
          ref={contentRef}
          className="resume-screen-box shadow-xl"
          style={{ minHeight: `${pageHeightPx}px` }}
        >
          <ResumeContent />
        </div>
      </div>
    </>
  );
}
