import type { LayoutConfig } from '../types';

export function applyLayoutVars(layout: LayoutConfig) {
  const root = document.documentElement;
  root.style.setProperty('--resume-font-family', layout.fontFamily);
  root.style.setProperty('--resume-body-size', `${layout.bodyFontSize}px`);
  root.style.setProperty('--resume-heading-size', `${layout.headingFontSize}px`);
  root.style.setProperty('--resume-line-height', String(layout.lineHeight));
  root.style.setProperty('--resume-module-gap-top', `${layout.modulePaddingTop}px`);
  root.style.setProperty('--resume-module-gap-bottom', `${layout.modulePaddingBottom}px`);
  root.style.setProperty('--resume-page-margin', `${layout.pageMarginMm}mm`);
  root.style.setProperty('--resume-accent', layout.accentColor);
}
