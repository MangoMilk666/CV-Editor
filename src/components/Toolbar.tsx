import { useRef } from 'react';
import { Download, Upload, FileDown, SlidersHorizontal, RotateCcw, Maximize2 } from 'lucide-react';
import { useResumeStore } from '../store';
import type { ResumeData } from '../types';
import { UI_TEXT } from '../config/i18n';

interface Props {
  onToggleLayout: () => void;
  onToggleFullscreen: () => void;
  layoutOpen: boolean;
  fullscreen: boolean;
}

export default function Toolbar({ onToggleLayout, onToggleFullscreen, layoutOpen, fullscreen }: Props) {
  const store = useResumeStore();
  const importRef = useRef<HTMLInputElement>(null);
  const text = UI_TEXT[store.locale];

  function handleExportJSON() {
    const data: ResumeData = { header: store.header, modules: store.modules, layout: store.layout };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as ResumeData;
        store.importData(data);
      } catch {
        alert(text.importError);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleExportPDF() {
    window.print();
  }

  function handleReset() {
    if (confirm(text.resetConfirm)) {
      store.resetAll();
    }
  }

  return (
    <header className="no-print h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-2 flex-shrink-0">
      <span className="font-semibold text-slate-700 mr-3 text-sm">{text.appTitle}</span>

      <div className="flex items-center gap-1 bg-slate-100 rounded p-0.5">
        <LangBtn
          label={text.languageZh}
          active={store.locale === 'zh'}
          onClick={() => store.setLocale('zh')}
        />
        <LangBtn
          label={text.languageEn}
          active={store.locale === 'en'}
          onClick={() => store.setLocale('en')}
        />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <ToolBtn icon={<Upload size={15} />} label={text.import} onClick={() => importRef.current?.click()} />
        <ToolBtn icon={<Download size={15} />} label={text.exportJson} onClick={handleExportJSON} />
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <ToolBtn
          icon={<Maximize2 size={15} />}
          label={fullscreen ? text.exitPreview : text.fullscreen}
          onClick={onToggleFullscreen}
          active={fullscreen}
        />
        <ToolBtn
          icon={<SlidersHorizontal size={15} />}
          label={text.layout}
          onClick={onToggleLayout}
          active={layoutOpen}
        />
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <ToolBtn icon={<FileDown size={15} />} label={text.exportPdf} onClick={handleExportPDF} primary />
        <ToolBtn icon={<RotateCcw size={15} />} label={text.reset} onClick={handleReset} danger />
      </div>

      <input
        ref={importRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImportJSON}
      />
    </header>
  );
}

function LangBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
        active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function ToolBtn({
  icon,
  label,
  onClick,
  primary,
  danger,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
  active?: boolean;
}) {
  let cls = 'flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ';
  if (primary) cls += 'bg-blue-600 text-white hover:bg-blue-700';
  else if (danger) cls += 'text-slate-400 hover:text-red-500 hover:bg-red-50';
  else if (active) cls += 'bg-blue-50 text-blue-600';
  else cls += 'text-slate-600 hover:bg-slate-100';

  return (
    <button className={cls} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}
