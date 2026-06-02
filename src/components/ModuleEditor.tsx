import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, ChevronRight, Trash2, Plus } from 'lucide-react';
import { useResumeStore } from '../store';
import type { ResumeModule } from '../types';
import { MODULE_FIELDS } from '../config/fields';
import EntryForm from './EntryForm';

interface Props {
  module: ResumeModule;
}

export default function ModuleEditor({ module }: Props) {
  const { updateModule, deleteModule, addEntry, updateEntry, deleteEntry } = useResumeStore();
  const [expanded, setExpanded] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fields = MODULE_FIELDS[module.type];

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    deleteModule(module.id);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border mb-2 overflow-hidden transition-colors ${
        module.visible ? 'border-slate-200' : 'border-slate-100 opacity-60'
      }`}
    >
      {/* ── Header bar ── */}
      <div className="flex items-center gap-1 px-2 py-2 bg-slate-50 border-b border-slate-100">
        <button
          className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing p-0.5 flex-shrink-0"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>

        <button
          className="text-slate-400 hover:text-slate-600 p-0.5 flex-shrink-0"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        <input
          className="flex-1 text-sm font-medium bg-transparent border-none outline-none text-slate-700 min-w-0"
          value={module.title}
          onChange={(e) => updateModule(module.id, { title: e.target.value })}
        />

        {/* Toggle switch */}
        <button
          role="switch"
          aria-checked={module.visible}
          title={module.visible ? '隐藏此模块' : '显示此模块'}
          onClick={() => updateModule(module.id, { visible: !module.visible })}
          className="flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none"
          style={{ width: 32, height: 18, background: module.visible ? '#3b82f6' : '#cbd5e1' }}
        >
          <span
            className="block bg-white rounded-full shadow transition-transform duration-200"
            style={{
              width: 14, height: 14, margin: '2px',
              transform: module.visible ? 'translateX(14px)' : 'translateX(0)',
            }}
          />
        </button>

        <button
          className={`p-0.5 transition-colors flex-shrink-0 ${
            confirmDelete ? 'text-red-500' : 'text-slate-300 hover:text-red-400'
          }`}
          title={confirmDelete ? '再次点击确认删除' : '删除模块'}
          onClick={handleDelete}
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* ── Entry forms ── */}
      {expanded && (
        <div className="p-2 space-y-2">
          {module.entries.map((entry, idx) => (
            <EntryForm
              key={idx}
              fields={fields}
              entry={entry}
              canDelete={module.entries.length > 1}
              onChange={(key, value) => updateEntry(module.id, idx, key, value)}
              onDelete={() => deleteEntry(module.id, idx)}
            />
          ))}

          <button
            onClick={() => addEntry(module.id)}
            className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-blue-500 hover:text-blue-700 hover:bg-blue-50 border border-dashed border-blue-200 hover:border-blue-400 rounded transition-colors"
          >
            <Plus size={13} />
            添加经历
          </button>
        </div>
      )}
    </div>
  );
}
