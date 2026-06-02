import type { FieldSchema, ModuleType, EntryRecord } from '../types';

export const MODULE_FIELDS: Record<ModuleType, FieldSchema[]> = {
  education: [
    { key: 'school',    label: '学校名称', type: 'text',      placeholder: '北京大学',             span: 'full' },
    { key: 'major',     label: '专业',     type: 'text',      placeholder: '计算机科学与技术',      span: 'half' },
    { key: 'degree',    label: '学历',     type: 'select',    options: ['本科','硕士','博士','专科','高中'], span: 'half' },
    { key: 'startDate', label: '开始年月', type: 'text',      placeholder: '2020.09',              span: 'half' },
    { key: 'endDate',   label: '结束年月', type: 'text',      placeholder: '2024.06 或 至今',       span: 'half' },
    { key: 'gpa',       label: 'GPA',      type: 'text',      placeholder: '3.8/4.0（选填）',       span: 'full' },
    { key: 'notes',     label: '补充说明', type: 'textarea-md', placeholder: '荣誉、课程、奖项等（选填，支持 Markdown）', span: 'full' },
  ],

  skills: [
    { key: 'content', label: '技能内容', type: 'textarea-md', placeholder: '- **编程语言**：TypeScript、Python、Java\n- **前端框架**：React、Vue 3\n- **工具链**：Git、Docker、Linux', span: 'full' },
  ],

  projects: [
    { key: 'name',        label: '项目名称', type: 'text',       placeholder: '简历编辑器',           span: 'full' },
    { key: 'techStack',   label: '技术栈',   type: 'text',       placeholder: 'React · TypeScript · Vite', span: 'full' },
    { key: 'startDate',   label: '开始年月', type: 'text',       placeholder: '2024.03',              span: 'half' },
    { key: 'endDate',     label: '结束年月', type: 'text',       placeholder: '至今',                  span: 'half' },
    { key: 'link',        label: '项目链接', type: 'text',       placeholder: 'github.com/…（选填）',  span: 'full' },
    { key: 'description', label: '项目描述', type: 'textarea-md', placeholder: '1. 实现了…\n2. 优化了…', span: 'full' },
  ],

  internship: [
    { key: 'company',     label: '公司名称', type: 'text',       placeholder: '某科技公司',            span: 'half' },
    { key: 'position',    label: '岗位名称', type: 'text',       placeholder: '前端开发实习生',         span: 'half' },
    { key: 'city',        label: '城市',     type: 'text',       placeholder: '北京（选填）',            span: 'half' },
    { key: 'startDate',   label: '开始年月', type: 'text',       placeholder: '2023.07',               span: 'half' },
    { key: 'endDate',     label: '结束年月', type: 'text',       placeholder: '2023.09',               span: 'half' },
    { key: 'description', label: '实习内容', type: 'textarea-md', placeholder: '1. 负责…\n2. 优化…',   span: 'full' },
  ],

  work: [
    { key: 'company',     label: '公司名称', type: 'text',       placeholder: '某科技公司',            span: 'half' },
    { key: 'position',    label: '职位名称', type: 'text',       placeholder: '高级前端工程师',         span: 'half' },
    { key: 'city',        label: '城市',     type: 'text',       placeholder: '上海（选填）',            span: 'half' },
    { key: 'startDate',   label: '开始年月', type: 'text',       placeholder: '2022.07',               span: 'half' },
    { key: 'endDate',     label: '结束年月', type: 'text',       placeholder: '至今',                   span: 'half' },
    { key: 'description', label: '工作内容', type: 'textarea-md', placeholder: '1. 负责…\n2. 主导…',   span: 'full' },
  ],

  others: [
    { key: 'name',        label: '名称',   type: 'text', placeholder: '国家奖学金、CET-6 等', span: 'full' },
    { key: 'description', label: '描述',   type: 'text', placeholder: '简要说明（选填）',      span: 'full' },
  ],

  custom: [
    { key: 'content', label: '内容', type: 'textarea-md', placeholder: '自由填写，支持 Markdown…', span: 'full' },
  ],
};

export function emptyEntry(type: ModuleType): EntryRecord {
  return Object.fromEntries(MODULE_FIELDS[type].map((f) => [f.key, '']));
}
