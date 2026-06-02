import { useRef } from 'react';
import { AlignLeft, AlignCenter } from 'lucide-react';
import { useResumeStore } from '../store';
import { PHOTO_DIMENSIONS, type PhotoSize } from '../types';

export default function HeaderEditor() {
  const { header, updateHeader } = useResumeStore();
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateHeader({ photo: ev.target?.result as string });
    reader.readAsDataURL(file);
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-3">
      {/* Title + alignment toggle */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">个人信息</h2>
        <div className="flex items-center gap-1 bg-slate-100 rounded p-0.5">
          <button
            title="居左对齐"
            onClick={() => updateHeader({ headerAlign: 'left' })}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              header.headerAlign === 'left'
                ? 'bg-white text-blue-600 shadow-sm font-medium'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <AlignLeft size={13} />
            居左
          </button>
          <button
            title="居中对齐"
            onClick={() => updateHeader({ headerAlign: 'center' })}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              header.headerAlign === 'center'
                ? 'bg-white text-blue-600 shadow-sm font-medium'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <AlignCenter size={13} />
            居中
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label="姓名" value={header.name} onChange={(v) => updateHeader({ name: v })} />
        <Field label="城市" value={header.city} onChange={(v) => updateHeader({ city: v })} />
        <Field label="邮箱" value={header.email} onChange={(v) => updateHeader({ email: v })} />
        <Field label="电话" value={header.phone} onChange={(v) => updateHeader({ phone: v })} />
        <Field label="GitHub" value={header.github} onChange={(v) => updateHeader({ github: v })} />
        <Field label="个人网站" value={header.website} onChange={(v) => updateHeader({ website: v })} />
        <Field label="LinkedIn" value={header.linkedin} onChange={(v) => updateHeader({ linkedin: v })} className="col-span-2" />
      </div>

      {/* Photo upload */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3">
        <div className="flex-1">
          <span className="text-xs text-slate-500 block mb-1">证件照（选填）</span>
          <div className="flex gap-2 items-center flex-wrap">
            <button
              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              上传照片
            </button>
            {header.photo && (
              <button
                className="text-xs px-3 py-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                onClick={() => updateHeader({ photo: '' })}
              >
                移除
              </button>
            )}
            <select
              className="text-xs border border-slate-200 rounded px-2 py-1.5 text-slate-700 bg-white"
              value={header.photoSize}
              onChange={(e) => updateHeader({ photoSize: e.target.value as PhotoSize })}
            >
              {(Object.entries(PHOTO_DIMENSIONS) as [PhotoSize, { label: string }][]).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>
        {header.photo && (
          <img
            src={header.photo}
            alt="证件照预览"
            className="border border-slate-200 object-cover rounded"
            style={{ width: 40, height: 56 }}
          />
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handlePhotoUpload}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs text-slate-400 block mb-0.5">{label}</label>
      <input
        className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:border-blue-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
