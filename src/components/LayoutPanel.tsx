import { X } from 'lucide-react';
import { useResumeStore } from '../store';

const FONTS = [
  { label: 'Noto Sans SC（黑体）', value: "'Noto Sans SC', sans-serif" },
  { label: 'Noto Serif SC（宋体）', value: "'Noto Serif SC', serif" },
  { label: 'Inter（英文衬线）', value: "'Inter', sans-serif" },
  { label: 'Times New Roman', value: "'Times New Roman', serif" },
  { label: 'Georgia', value: 'Georgia, serif' },
];

interface Props {
  onClose: () => void;
}

export default function LayoutPanel({ onClose }: Props) {
  const { layout, updateLayout } = useResumeStore();

  return (
    <div className="bg-white border-l border-slate-200 w-72 flex-shrink-0 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700">排版设置</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-4 space-y-5">
        <Section title="字体">
          <div>
            <Label text="字体选择" />
            <select
              className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 bg-white"
              value={layout.fontFamily}
              onChange={(e) => updateLayout({ fontFamily: e.target.value })}
            >
              {FONTS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <SliderField
            label="正文字号"
            value={layout.bodyFontSize}
            min={10} max={16} step={0.5}
            unit="px"
            onChange={(v) => updateLayout({ bodyFontSize: v })}
          />
          <SliderField
            label="标题字号"
            value={layout.headingFontSize}
            min={12} max={22} step={0.5}
            unit="px"
            onChange={(v) => updateLayout({ headingFontSize: v })}
          />
          <SliderField
            label="行距"
            value={layout.lineHeight}
            min={1.0} max={2.5} step={0.1}
            onChange={(v) => updateLayout({ lineHeight: v })}
          />
        </Section>

        <Section title="间距">
          <SliderField
            label="模块上间距"
            value={layout.modulePaddingTop}
            min={4} max={32} step={1}
            unit="px"
            onChange={(v) => updateLayout({ modulePaddingTop: v })}
          />
          <SliderField
            label="模块下间距"
            value={layout.modulePaddingBottom}
            min={4} max={32} step={1}
            unit="px"
            onChange={(v) => updateLayout({ modulePaddingBottom: v })}
          />
          <SliderField
            label="页边距"
            value={layout.pageMarginMm}
            min={10} max={30} step={1}
            unit="mm"
            onChange={(v) => updateLayout({ pageMarginMm: v })}
          />
        </Section>

        <Section title="颜色">
          <div>
            <Label text="主题色（标题/线条）" />
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="w-9 h-9 border border-slate-200 rounded cursor-pointer"
                value={layout.accentColor}
                onChange={(e) => updateLayout({ accentColor: e.target.value })}
              />
              <input
                type="text"
                className="flex-1 text-sm border border-slate-200 rounded px-2 py-1.5 font-mono"
                value={layout.accentColor}
                onChange={(e) => {
                  if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value))
                    updateLayout({ accentColor: e.target.value });
                }}
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return <span className="text-xs text-slate-500 block mb-1">{text}</span>;
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <Label text={label} />
        <span className="text-xs text-slate-500 font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        className="w-full accent-blue-500"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
