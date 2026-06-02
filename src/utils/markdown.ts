import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ breaks: true });

export function renderMarkdown(src: string): string {
  const raw = marked.parse(src) as string;
  return DOMPurify.sanitize(raw);
}
