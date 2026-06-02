import { useRef } from 'react';
import { Download, Upload, FileDown, SlidersHorizontal, RotateCcw, Maximize2 } from 'lucide-react';
import { useResumeStore } from '../store';
import type { ResumeData } from '../types';

interface Props {
  onToggleLayout: () => void;
  onToggleFullscreen: () => void;
  layoutOpen: boolean;
  fullscreen: boolean;
}

export default function Toolbar({ onToggleLayout, onToggleFullscreen, layoutOpen, fullscreen }: Props) {
  const store = useResumeStore();
  const importRef = useRef<HTMLInputElement>(null);

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
        alert('JSON 文件格式错误，导入失败');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleExportPDF() {
    window.print();
  }

  function handleReset() {
    if (confirm('确定要重置所有内容吗？此操作不可恢复。')) {
      store.resetAll();
    }
  }

  return (
    <header className="no-print h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-2 flex-shrink-0">
      <span className="font-semibold text-slate-700 mr-3 text-sm">简历编辑器</span>

      <div className="flex items-center gap-1 ml-auto">
        <ToolBtn icon={<Upload size={15} />} label="导入" onClick={() => importRef.current?.click()} />
        <ToolBtn icon={<Download size={15} />} label="导出 JSON" onClick={handleExportJSON} />
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <ToolBtn
          icon={<Maximize2 size={15} />}
          label={fullscreen ? '退出预览' : '全屏预览'}
          onClick={onToggleFullscreen}
          active={fullscreen}
        />
        <ToolBtn
          icon={<SlidersHorizontal size={15} />}
          label="排版"
          onClick={onToggleLayout}
          active={layoutOpen}
        />
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <ToolBtn icon={<FileDown size={15} />} label="导出 PDF" onClick={handleExportPDF} primary />
        <ToolBtn icon={<RotateCcw size={15} />} label="重置" onClick={handleReset} danger />
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
