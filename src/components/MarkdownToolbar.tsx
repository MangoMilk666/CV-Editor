import type { RefObject } from 'react';
import { Bold, Italic, List, ListOrdered, Link, Minus } from 'lucide-react';

interface Props {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
}

type Action =
  | { kind: 'wrap'; before: string; after: string; placeholder: string }
  | { kind: 'line-prefix'; prefix: string };

const TOOLS: { label: string; icon: React.ReactNode; action: Action; title: string }[] = [
  {
    label: 'B',
    title: '粗体 (**text**)',
    icon: <Bold size={13} />,
    action: { kind: 'wrap', before: '**', after: '**', placeholder: '粗体文字' },
  },
  {
    label: 'I',
    title: '斜体 (*text*)',
    icon: <Italic size={13} />,
    action: { kind: 'wrap', before: '*', after: '*', placeholder: '斜体文字' },
  },
  {
    label: '-',
    title: '无序列表',
    icon: <List size={13} />,
    action: { kind: 'line-prefix', prefix: '- ' },
  },
  {
    label: '1.',
    title: '有序列表',
    icon: <ListOrdered size={13} />,
    action: { kind: 'line-prefix', prefix: '1. ' },
  },
  {
    label: 'link',
    title: '链接 [text](url)',
    icon: <Link size={13} />,
    action: { kind: 'wrap', before: '[', after: '](url)', placeholder: '链接文字' },
  },
  {
    label: '---',
    title: '分隔线',
    icon: <Minus size={13} />,
    action: { kind: 'line-prefix', prefix: '---' },
  },
];

export default function MarkdownToolbar({ textareaRef, onChange }: Props) {
  function applyAction(action: Action) {
    const el = textareaRef.current;
    if (!el) return;

    const val = el.value;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = val.slice(start, end);

    let newVal: string;
    let nextStart: number;
    let nextEnd: number;

    if (action.kind === 'wrap') {
      const text = selected || action.placeholder;
      newVal = val.slice(0, start) + action.before + text + action.after + val.slice(end);
      nextStart = start + action.before.length;
      nextEnd = nextStart + text.length;
    } else {
      // line-prefix: find start of current line
      const lineStart = val.lastIndexOf('\n', start - 1) + 1;
      const lineContent = val.slice(lineStart, end);
      // Toggle: if line already starts with prefix, remove it
      if (lineContent.startsWith(action.prefix)) {
        newVal = val.slice(0, lineStart) + lineContent.slice(action.prefix.length) + val.slice(end);
        nextStart = Math.max(lineStart, start - action.prefix.length);
        nextEnd = nextStart;
      } else {
        newVal = val.slice(0, lineStart) + action.prefix + lineContent + val.slice(end);
        nextStart = start + action.prefix.length;
        nextEnd = end + action.prefix.length;
      }
    }

    onChange(newVal);

    // Restore selection after React re-render
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(nextStart, nextEnd);
    });
  }

  return (
    <div className="flex items-center gap-0.5 px-1.5 py-1 bg-slate-50 border border-slate-200 border-b-0 rounded-t">
      {TOOLS.map((t) => (
        <button
          key={t.title}
          title={t.title}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault(); // keep textarea focus
            applyAction(t.action);
          }}
          className="flex items-center justify-center w-6 h-6 rounded text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}
