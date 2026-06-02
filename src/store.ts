import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from './utils/uuid';
import type { ResumeData, ResumeHeader, ResumeModule, LayoutConfig, ModuleType } from './types';
import { MODULE_LABELS } from './types';
import { emptyEntry } from './config/fields';

const DEFAULT_LAYOUT: LayoutConfig = {
  modulePaddingTop: 16,
  modulePaddingBottom: 16,
  lineHeight: 1.5,
  bodyFontSize: 13,
  headingFontSize: 16,
  fontFamily: "'Noto Sans SC', sans-serif",
  pageMarginV: 18,
  pageMarginH: 18,
  accentColor: '#1a1a1a',
};

const DEFAULT_HEADER: ResumeHeader = {
  name: '张三',
  jobTarget: '前端开发工程师',
  email: 'zhangsan@example.com',
  phone: '138-0000-0000',
  city: '北京',
  github: 'github.com/zhangsan',
  website: '',
  linkedin: '',
  photo: '',
  photoSize: '1inch',
  headerAlign: 'left',
};

const DEFAULT_MODULES: ResumeModule[] = [
  {
    id: uuid(),
    type: 'education',
    title: '教育背景',
    entries: [{
      school: '北京大学',
      major: '计算机科学与技术',
      degree: '本科',
      startDate: '2020.09',
      endDate: '2024.06',
      gpa: '3.8/4.0',
      notes: '',
    }],
    visible: true,
  },
  {
    id: uuid(),
    type: 'skills',
    title: '专业技能',
    entries: [{ content: '- **编程语言**：TypeScript、Python、Java\n- **前端框架**：React、Vue 3\n- **工具链**：Git、Docker、Linux' }],
    visible: true,
  },
  {
    id: uuid(),
    type: 'projects',
    title: '项目经历',
    entries: [{
      name: '简历编辑器',
      role: '独立开发',
      techStack: 'React · TypeScript · Vite',
      startDate: '2024.03',
      endDate: '至今',
      link: '',
      description: '1. 实现基于 Markdown 的简历内容编辑与实时预览\n2. 支持模块拖拽排序、排版参数调整\n3. 一键导出标准 A4 PDF',
    }],
    visible: true,
  },
  {
    id: uuid(),
    type: 'internship',
    title: '实习经历',
    entries: [{
      company: '某科技公司',
      position: '前端开发实习生',
      city: '北京',
      startDate: '2023.07',
      endDate: '2023.09',
      description: '1. 负责核心业务模块的前端开发，使用 React 重构旧版页面\n2. 优化首屏加载性能，LCP 指标降低 40%',
    }],
    visible: true,
  },
];

interface ResumeStore extends ResumeData {
  updateHeader: (patch: Partial<ResumeHeader>) => void;
  updateLayout: (patch: Partial<LayoutConfig>) => void;
  addModule: (type: ModuleType) => void;
  updateModule: (id: string, patch: Partial<ResumeModule>) => void;
  deleteModule: (id: string) => void;
  reorderModules: (orderedIds: string[]) => void;
  addEntry: (moduleId: string) => void;
  updateEntry: (moduleId: string, idx: number, key: string, value: string) => void;
  deleteEntry: (moduleId: string, idx: number) => void;
  resetAll: () => void;
  importData: (data: ResumeData) => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      header: DEFAULT_HEADER,
      modules: DEFAULT_MODULES,
      layout: DEFAULT_LAYOUT,

      updateHeader: (patch) =>
        set((s) => ({ header: { ...s.header, ...patch } })),

      updateLayout: (patch) =>
        set((s) => ({ layout: { ...s.layout, ...patch } })),

      addModule: (type) =>
        set((s) => ({
          modules: [
            ...s.modules,
            { id: uuid(), type, title: MODULE_LABELS[type], entries: [emptyEntry(type)], visible: true },
          ],
        })),

      updateModule: (id, patch) =>
        set((s) => ({
          modules: s.modules.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),

      deleteModule: (id) =>
        set((s) => ({ modules: s.modules.filter((m) => m.id !== id) })),

      reorderModules: (orderedIds) =>
        set((s) => ({
          modules: orderedIds
            .map((id) => s.modules.find((m) => m.id === id))
            .filter(Boolean) as ResumeModule[],
        })),

      addEntry: (moduleId) => {
        const mod = get().modules.find((m) => m.id === moduleId);
        if (!mod) return;
        set((s) => ({
          modules: s.modules.map((m) =>
            m.id === moduleId ? { ...m, entries: [...m.entries, emptyEntry(m.type)] } : m
          ),
        }));
      },

      updateEntry: (moduleId, idx, key, value) =>
        set((s) => ({
          modules: s.modules.map((m) => {
            if (m.id !== moduleId) return m;
            const entries = m.entries.map((e, i) =>
              i === idx ? { ...e, [key]: value } : e
            );
            return { ...m, entries };
          }),
        })),

      deleteEntry: (moduleId, idx) =>
        set((s) => ({
          modules: s.modules.map((m) => {
            if (m.id !== moduleId) return m;
            const entries = m.entries.filter((_, i) => i !== idx);
            return { ...m, entries: entries.length ? entries : [emptyEntry(m.type)] };
          }),
        })),

      resetAll: () =>
        set({ header: DEFAULT_HEADER, modules: DEFAULT_MODULES, layout: DEFAULT_LAYOUT }),

      importData: (data) => set(data),
    }),
    {
      name: 'cv-editor-v3',
      // Deep-merge layout so new fields added to DEFAULT_LAYOUT are never undefined
      merge: (persisted: unknown, current) => {
        const p = persisted as Partial<typeof current>;
        return {
          ...current,
          ...p,
          layout: { ...DEFAULT_LAYOUT, ...(p.layout ?? {}) },
        };
      },
    }
  )
);
