import { useRef } from 'react';
import { X } from 'lucide-react';
import type { FieldSchema, EntryRecord } from '../types';
import MarkdownToolbar from './MarkdownToolbar';
import DatePicker from './DatePicker';

interface Props {
  fields: FieldSchema[];
  entry: EntryRecord;
  canDelete: boolean;
  onChange: (key: string, value: string) => void;
  onDelete: () => void;
}

export default function EntryForm({ fields, entry, canDelete, onChange, onDelete }: Props) {
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  return (
    <div className="border border-slate-200 rounded overflow-hidden">
      {canDelete && (
        <div className="flex justify-end px-2 py-1 bg-slate-50 border-b border-slate-100">
          <button
            onClick={onDelete}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors"
          >
            <X size={13} />
            删除此条
          </button>
        </div>
      )}

      <div className="p-3 grid grid-cols-2 gap-x-3 gap-y-2">
        {fields.map((field) => (
          <div key={field.key} className={field.span === 'full' ? 'col-span-2' : 'col-span-1'}>
            <label className="text-xs text-slate-400 block mb-0.5">{field.label}</label>

            {field.type === 'text' && (
              <input
                className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:border-blue-400 text-slate-700"
                placeholder={field.placeholder}
                value={entry[field.key] ?? ''}
                onChange={(e) => onChange(field.key, e.target.value)}
              />
            )}

            {field.type === 'select' && (
              <select
                className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-blue-400 text-slate-700"
                value={entry[field.key] ?? ''}
                onChange={(e) => onChange(field.key, e.target.value)}
              >
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {field.type === 'date-ym' && (
              <DatePicker
                value={entry[field.key] ?? ''}
                onChange={(v) => onChange(field.key, v)}
              />
            )}

            {field.type === 'textarea-md' && (
              <div>
                <MarkdownToolbar
                  textareaRef={{ current: textareaRefs.current[field.key] ?? null }}
                  onChange={(v) => onChange(field.key, v)}
                />
                <textarea
                  ref={(el) => { textareaRefs.current[field.key] = el; }}
                  className="w-full text-sm font-mono border border-slate-200 border-t-0 rounded-b p-2 resize-y focus:outline-none focus:border-blue-400 text-slate-700 leading-relaxed"
                  rows={4}
                  placeholder={field.placeholder}
                  value={entry[field.key] ?? ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
