import type { LayoutConfig, ResumeData, ResumeHeader, ResumeLocale, ResumeModule } from '../types';
import { MODULE_LABELS } from './i18n';
import { v4 as uuid } from '../utils/uuid';

const SHARED_LAYOUT: Omit<LayoutConfig, 'fontFamily'> = {
  modulePaddingTop: 16,
  modulePaddingBottom: 16,
  lineHeight: 1.5,
  bodyFontSize: 13,
  headingFontSize: 16,
  pageMarginV: 18,
  pageMarginH: 18,
  accentColor: '#1a1a1a',
};

export const DEFAULT_LAYOUTS: Record<ResumeLocale, LayoutConfig> = {
  zh: {
    ...SHARED_LAYOUT,
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  en: {
    ...SHARED_LAYOUT,
    fontFamily: "'Times New Roman', serif",
  },
};

export const DEFAULT_HEADERS: Record<ResumeLocale, ResumeHeader> = {
  zh: {
    name: '张三',
    jobTarget: '前端开发工程师',
    internshipDuration: '',
    email: 'zhangsan@example.com',
    phone: '138-0000-0000',
    city: '北京',
    github: 'github.com/zhangsan',
    website: '',
    linkedin: '',
    photo: '',
    photoSize: '1inch',
    headerAlign: 'left',
  },
  en: {
    name: 'Alex Zhang',
    jobTarget: 'Frontend Engineer',
    internshipDuration: 'Available for a 3-month internship',
    email: 'alex.zhang@example.com',
    phone: '+86 138-0000-0000',
    city: 'Beijing',
    github: 'github.com/alexzhang',
    website: '',
    linkedin: 'linkedin.com/in/alexzhang',
    photo: '',
    photoSize: '1inch',
    headerAlign: 'left',
  },
};

function zhModules(): ResumeModule[] {
  return [
    {
      id: uuid(),
      type: 'education',
      title: MODULE_LABELS.zh.education,
      entrySortOrder: 'desc',
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
      title: MODULE_LABELS.zh.skills,
      entries: [{ content: '- **编程语言**：TypeScript、Python、Java\n- **前端框架**：React、Vue 3\n- **工具链**：Git、Docker、Linux' }],
      visible: true,
    },
    {
      id: uuid(),
      type: 'projects',
      title: MODULE_LABELS.zh.projects,
      entrySortOrder: 'desc',
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
      title: MODULE_LABELS.zh.internship,
      entrySortOrder: 'desc',
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
}

function enModules(): ResumeModule[] {
  return [
    {
      id: uuid(),
      type: 'education',
      title: MODULE_LABELS.en.education,
      entrySortOrder: 'desc',
      entries: [{
        school: 'Peking University',
        major: '',
        degree: 'Bachelor of Engineering in Computer Science and Technology',
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
      title: MODULE_LABELS.en.skills,
      entries: [{ content: '- **Languages:** TypeScript, Python, Java\n- **Frameworks:** React, Vue 3\n- **Tooling:** Git, Docker, Linux' }],
      visible: true,
    },
    {
      id: uuid(),
      type: 'projects',
      title: MODULE_LABELS.en.projects,
      entrySortOrder: 'desc',
      entries: [{
        name: 'Resume Editor',
        role: 'Solo Developer',
        techStack: 'React · TypeScript · Vite',
        startDate: '2024.03',
        endDate: 'Present',
        link: '',
        description: '1. Built a Markdown-based resume editor with real-time preview.\n2. Added drag-and-drop module ordering and layout controls.\n3. Exported polished A4 resumes to PDF via the browser print pipeline.',
      }],
      visible: true,
    },
    {
      id: uuid(),
      type: 'internship',
      title: MODULE_LABELS.en.internship,
      entrySortOrder: 'desc',
      entries: [{
        company: 'Example Tech',
        position: 'Frontend Engineering Intern',
        city: 'Beijing',
        startDate: '2023.07',
        endDate: '2023.09',
        description: '1. Developed core product features with React and TypeScript.\n2. Improved first-screen performance and reduced LCP by 40%.',
      }],
      visible: true,
    },
  ];
}

function cloneHeader(locale: ResumeLocale): ResumeHeader {
  return { ...DEFAULT_HEADERS[locale] };
}

function cloneLayout(locale: ResumeLocale): LayoutConfig {
  return { ...DEFAULT_LAYOUTS[locale] };
}

export function createDefaultModules(locale: ResumeLocale): ResumeModule[] {
  return locale === 'zh' ? zhModules() : enModules();
}

export function createDefaultResume(locale: ResumeLocale): ResumeData {
  return {
    header: cloneHeader(locale),
    modules: createDefaultModules(locale),
    layout: cloneLayout(locale),
  };
}
