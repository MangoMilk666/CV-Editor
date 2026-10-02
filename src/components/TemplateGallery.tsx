import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Pencil, Sparkles } from 'lucide-react';
import { UI_TEXT } from '../config/i18n';
import { createDefaultResume } from '../config/resumeDefaults';
import type { ResumeLocale, ResumeTemplate } from '../types';
import { CHINESE_TEMPLATE_PREVIEW } from '../config/chineseTemplatePreview';
import ResumeContent from './ResumeContent';

const PREVIEW_RESUMES = {
  zh: createDefaultResume('zh'),
  en: createDefaultResume('en'),
};

function getPreviewResume(template: ResumeTemplate, locale: ResumeLocale) {
  return template.rendererId === 'chinese-template-2'
    ? CHINESE_TEMPLATE_PREVIEW
    : PREVIEW_RESUMES[locale];
}

interface Props {
  locale: ResumeLocale;
  templates: ResumeTemplate[];
  activeTemplateId: string;
  onBack: () => void;
  onSelect: (templateId: string) => void;
  onRename: (templateId: string, name: string) => void;
}

export default function TemplateGallery({ locale, templates, activeTemplateId, onBack, onSelect, onRename }: Props) {
  const text = UI_TEXT[locale];

  function handleRename(template: ResumeTemplate) {
    const name = window.prompt(text.templateNamePrompt, template.name)?.trim();
    if (name) onRename(template.id, name);
  }

  return (
    <main className="template-gallery no-print">
      <header className="template-gallery-header">
        <button className="template-back-button" type="button" onClick={onBack}>
          <ArrowLeft size={17} />
          {text.backToEditor}
        </button>
        <div className="template-gallery-heading">
          <h1>{text.chooseTemplate}</h1>
          <p>{text.templateGallerySubtitle}</p>
        </div>
      </header>

      <section className="template-gallery-grid" aria-label={text.chooseTemplate}>
        {templates.map((template) => {
          const active = template.id === activeTemplateId;
          const previewLayout = template.layout;
          const paperVars = {
            '--resume-font-family': previewLayout.fontFamily,
            '--resume-body-size': `${previewLayout.bodyFontSize}px`,
            '--resume-heading-size': `${previewLayout.headingFontSize}px`,
            '--resume-entry-title-size': `${previewLayout.entryTitleFontSize}px`,
            '--resume-header-name-size': `${previewLayout.headerNameFontSize}px`,
            '--resume-header-info-size': `${previewLayout.headerInfoFontSize}px`,
            '--resume-header-info-line-height': String(previewLayout.headerInfoLineHeight),
            '--resume-module-sub-info-size': `${previewLayout.moduleSubInfoFontSize}px`,
            '--resume-line-height': String(previewLayout.lineHeight),
            '--resume-module-gap-top': `${previewLayout.modulePaddingTop}px`,
            '--resume-module-gap-bottom': `${previewLayout.modulePaddingBottom}px`,
            '--resume-page-margin-v': `${previewLayout.pageMarginV}mm`,
            '--resume-page-margin-h': `${previewLayout.pageMarginH}mm`,
            '--resume-accent': previewLayout.accentColor,
          } as React.CSSProperties;

          return (
            <TemplateCard
              key={template.id}
              template={template}
              locale={locale}
              active={active}
              paperVars={paperVars}
              onSelect={() => onSelect(template.id)}
              onRename={() => handleRename(template)}
            />
          );
        })}
      </section>
    </main>
  );
}

function TemplateCard({
  template,
  locale,
  active,
  paperVars,
  onSelect,
  onRename,
}: {
  template: ResumeTemplate;
  locale: ResumeLocale;
  active: boolean;
  paperVars: React.CSSProperties;
  onSelect: () => void;
  onRename: () => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  const text = UI_TEXT[locale];

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / 794);
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <article className={`template-card${active ? ' template-card-active' : ''}`}>
      <div className="template-card-title-row">
        <div>
          <h2>{template.name}</h2>
          <p>{locale === 'zh' ? '中文简历' : 'English resume'}</p>
        </div>
        <button className="template-icon-button" type="button" title={text.renameTemplate} onClick={onRename}>
          <Pencil size={15} />
        </button>
      </div>

      <div ref={frameRef} className="template-preview-frame" aria-label={text.templatePreview}>
        <div
          className="template-preview-paper resume-screen-box"
          style={{ ...paperVars, transform: `scale(${scale}) translateX(-50%)` }}
        >
          <ResumeContent
            resume={getPreviewResume(template, locale)}
            locale={locale}
            rendererId={template.rendererId}
          />
        </div>
      </div>

      <footer className="template-card-footer">
        <span className="template-renderer-label"><Sparkles size={14} />{text.templatePreview}</span>
        <button className={active ? 'template-use-button template-use-button-active' : 'template-use-button'} type="button" onClick={onSelect}>
          {active ? <><Check size={15} />{text.currentTemplate}</> : text.useTemplate}
        </button>
      </footer>
    </article>
  );
}
