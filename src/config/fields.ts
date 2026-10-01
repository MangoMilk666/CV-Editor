import type { EntryRecord, FieldSchema, ModuleType, ResumeLocale } from '../types';

export const MODULE_FIELDS: Record<ResumeLocale, Record<ModuleType, FieldSchema[]>> = {
  zh: {
    education: [
      { key: 'school', label: '学校名称', type: 'text', placeholder: '北京大学', span: 'full' },
      { key: 'major', label: '专业', type: 'text', placeholder: '计算机科学与技术', span: 'half' },
      { key: 'degree', label: '学历', type: 'select', options: ['本科', '硕士', '博士', '专科', '高中'], span: 'half' },
      { key: 'gpa', label: 'GPA', type: 'text', placeholder: '3.8/4.0（选填）', span: 'half' },
      { key: 'startDate', label: '开始年月', type: 'date-ym', span: 'half' },
      { key: 'endDate', label: '结束年月', type: 'date-ym', span: 'half' },
      { key: 'notes', label: '补充说明', type: 'textarea-md', placeholder: '荣誉、课程、奖项等（选填，支持 Markdown）', span: 'full' },
    ],
    skills: [
      { key: 'content', label: '技能内容', type: 'textarea-md', placeholder: '- **编程语言**：TypeScript、Python、Java\n- **前端框架**：React、Vue 3\n- **工具链**：Git、Docker、Linux', span: 'full' },
    ],
    projects: [
      { key: 'name', label: '项目名称', type: 'text', placeholder: '简历编辑器', span: 'full' },
      { key: 'role', label: '项目角色', type: 'text', placeholder: '独立开发 / 前端负责人（选填）', span: 'half' },
      { key: 'link', label: '项目链接', type: 'text', placeholder: 'github.com/…（选填）', span: 'half' },
      { key: 'startDate', label: '开始年月', type: 'date-ym', span: 'half' },
      { key: 'endDate', label: '结束年月', type: 'date-ym', span: 'half' },
      { key: 'techStack', label: '技术栈', type: 'text', placeholder: 'React · TypeScript · Vite', span: 'full' },
      { key: 'description', label: '项目描述', type: 'textarea-md', placeholder: '1. 实现了…\n2. 优化了…', span: 'full' },
    ],
    internship: [
      { key: 'company', label: '公司名称', type: 'text', placeholder: '某科技公司', span: 'half' },
      { key: 'position', label: '岗位名称', type: 'text', placeholder: '前端开发实习生', span: 'half' },
      { key: 'city', label: '城市', type: 'text', placeholder: '北京（选填）', span: 'half' },
      { key: 'startDate', label: '开始年月', type: 'date-ym', span: 'half' },
      { key: 'endDate', label: '结束年月', type: 'date-ym', span: 'half' },
      { key: 'description', label: '实习内容', type: 'textarea-md', placeholder: '1. 负责…\n2. 优化…', span: 'full' },
    ],
    work: [
      { key: 'company', label: '公司名称', type: 'text', placeholder: '某科技公司', span: 'half' },
      { key: 'position', label: '职位名称', type: 'text', placeholder: '高级前端工程师', span: 'half' },
      { key: 'city', label: '城市', type: 'text', placeholder: '上海（选填）', span: 'half' },
      { key: 'startDate', label: '开始年月', type: 'date-ym', span: 'half' },
      { key: 'endDate', label: '结束年月', type: 'date-ym', span: 'half' },
      { key: 'description', label: '工作内容', type: 'textarea-md', placeholder: '1. 负责…\n2. 主导…', span: 'full' },
    ],
    others: [
      { key: 'content', label: '其他内容', type: 'textarea-md', placeholder: '- **国家奖学金**（2022）\n- **CET-6** 580分\n- 兴趣：开源贡献、技术写作', span: 'full' },
    ],
    custom: [
      { key: 'content', label: '内容', type: 'textarea-md', placeholder: '自由填写，支持 Markdown…', span: 'full' },
    ],
  },
  en: {
    education: [
      { key: 'school', label: 'School', type: 'text', placeholder: 'Peking University', span: 'full' },
      { key: 'degree', label: 'Degree / Program', type: 'text', placeholder: 'Master of Science in Computer Science', span: 'full' },
      { key: 'gpa', label: 'GPA', type: 'text', placeholder: '3.8/4.0 (Optional)', span: 'half' },
      { key: 'startDate', label: 'Start', type: 'date-ym', span: 'half' },
      { key: 'endDate', label: 'End', type: 'date-ym', span: 'half' },
      { key: 'notes', label: 'Notes', type: 'textarea-md', placeholder: 'Honors, coursework, awards, etc. (Optional, Markdown supported)', span: 'full' },
    ],
    skills: [
      { key: 'content', label: 'Skills', type: 'textarea-md', placeholder: '- **Languages:** TypeScript, Python, Java\n- **Frameworks:** React, Vue 3\n- **Tooling:** Git, Docker, Linux', span: 'full' },
    ],
    projects: [
      { key: 'name', label: 'Project Name', type: 'text', placeholder: 'Resume Editor', span: 'full' },
      { key: 'role', label: 'Role', type: 'text', placeholder: 'Solo Developer / Frontend Lead (Optional)', span: 'half' },
      { key: 'link', label: 'Link', type: 'text', placeholder: 'github.com/... (Optional)', span: 'half' },
      { key: 'startDate', label: 'Start', type: 'date-ym', span: 'half' },
      { key: 'endDate', label: 'End', type: 'date-ym', span: 'half' },
      { key: 'techStack', label: 'Tech Stack', type: 'text', placeholder: 'React · TypeScript · Vite', span: 'full' },
      { key: 'description', label: 'Description', type: 'textarea-md', placeholder: '1. Built...\n2. Optimized...', span: 'full' },
    ],
    internship: [
      { key: 'company', label: 'Company', type: 'text', placeholder: 'Example Tech', span: 'half' },
      { key: 'position', label: 'Position', type: 'text', placeholder: 'Frontend Engineering Intern', span: 'half' },
      { key: 'city', label: 'City', type: 'text', placeholder: 'Beijing (Optional)', span: 'half' },
      { key: 'startDate', label: 'Start', type: 'date-ym', span: 'half' },
      { key: 'endDate', label: 'End', type: 'date-ym', span: 'half' },
      { key: 'description', label: 'Description', type: 'textarea-md', placeholder: '1. Delivered...\n2. Improved...', span: 'full' },
    ],
    work: [
      { key: 'company', label: 'Company', type: 'text', placeholder: 'Example Tech', span: 'half' },
      { key: 'position', label: 'Position', type: 'text', placeholder: 'Senior Frontend Engineer', span: 'half' },
      { key: 'city', label: 'City', type: 'text', placeholder: 'Shanghai (Optional)', span: 'half' },
      { key: 'startDate', label: 'Start', type: 'date-ym', span: 'half' },
      { key: 'endDate', label: 'End', type: 'date-ym', span: 'half' },
      { key: 'description', label: 'Description', type: 'textarea-md', placeholder: '1. Led...\n2. Delivered...', span: 'full' },
    ],
    others: [
      { key: 'content', label: 'Additional Info', type: 'textarea-md', placeholder: '- **National Scholarship** (2022)\n- **CET-6:** 580\n- Interests: Open source, technical writing', span: 'full' },
    ],
    custom: [
      { key: 'content', label: 'Content', type: 'textarea-md', placeholder: 'Free-form content, Markdown supported...', span: 'full' },
    ],
  },
};

export function getModuleFields(locale: ResumeLocale, type: ModuleType): FieldSchema[] {
  return MODULE_FIELDS[locale][type];
}

export function emptyEntry(type: ModuleType): EntryRecord {
  return Object.fromEntries(MODULE_FIELDS.zh[type].map((field) => [field.key, '']));
}
