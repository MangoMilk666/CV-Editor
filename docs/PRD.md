# 简历编辑工具 PRD

## 1. 产品概述

### 1.1 产品定位

一款运行在浏览器端的纯前端简历编辑工具，无需后端服务，用户可直接在浏览器中完成简历的编辑、排版与导出，开箱即用。

### 1.2 纯前端可行性分析

**结论：完全可行。**

| 功能 | 实现方案 | 可行性 |
|------|---------|--------|
| 内容编辑（Markdown） | 集成轻量 Markdown 解析库（如 `marked.js`） | ✅ |
| 模块增删改排序 | React 状态管理 + `localStorage` 持久化 | ✅ |
| 排版参数调整 | CSS 变量动态注入，实时预览 | ✅ |
| 简历预览 | 独立预览区域，与编辑区同步渲染 | ✅ |
| 一键导出 PDF | `html2canvas` + `jsPDF`，或浏览器原生 `window.print()` | ✅ |
| 数据持久化 | `localStorage` / 导出/导入 JSON | ✅ |

**技术边界说明：**
- 无需注册登录，数据存储在本地浏览器
- 导出 PDF 的排版精度依赖浏览器渲染引擎，与专业排版工具存在细微差异
- 跨设备同步需用户手动导出/导入 JSON 文件

---

## 2. 功能需求

### 2.1 简历模块管理

#### 2.1.1 内置模块类型

| 模块 ID | 模块名称 | 说明 |
|---------|---------|------|
| `education` | 教育背景 | 学校、学位、时间、GPA 等 |
| `skills` | 专业技能 | 技术栈、语言、工具等 |
| `projects` | 项目经历 | 项目名、描述、技术栈、成果 |
| `internship` | 实习经历 | 公司、职位、时间、工作内容 |
| `work` | 工作经历 | 同上，针对正式职位 |
| `others` | 其他 | 获奖、证书、兴趣等 |
| `custom` | 自定义模块 | 用户自定义标题和内容 |

#### 2.1.2 模块操作

- **添加**：从模块列表中选择类型，点击添加，新模块追加到简历末尾
- **编辑**：点击模块进入编辑态，支持直接修改内容
- **删除**：点击删除按钮，二次确认后移除模块
- **排序**：支持拖拽（`@dnd-kit/core`）或上移/下移按钮调整模块顺序
- **折叠/展开**：编辑区各模块支持折叠，方便管理多模块场景

### 2.2 内容编辑

#### 2.2.1 Markdown 支持

每个模块的内容区支持 Markdown 语法，具体支持范围：

| 语法 | 示例 | 用途 |
|------|------|------|
| 有序列表 | `1. 负责 XXX 模块开发` | 工作职责、项目成果 |
| 无序列表 | `- 使用 React + TypeScript` | 技能列表 |
| 加粗 | `**关键词**` | 突出重点 |
| 斜体 | `*补充说明*` | 次要信息 |
| 链接 | `[GitHub](https://...)` | 项目链接 |
| 分隔线 | `---` | 分隔内容块 |

#### 2.2.2 编辑模式

- 提供 **编辑/预览切换**（Split 或 Tab 模式）
- 实时将 Markdown 渲染为 HTML，呈现在右侧预览区

### 2.3 简历头部（个人信息）

独立于模块之外的固定区域，包含：

- 姓名（大号字体，居中/左对齐）
- 联系方式一行：邮箱 | 电话 | 城市
- 链接一行：GitHub | 个人网站 | LinkedIn（选填）
- **个人照片**（选填）：支持上传 JPG/PNG，可选 1 寸（25×35mm）或 2 寸（35×49mm）展示尺寸，照片显示在头部右侧，导出 PDF 时一并包含；图片以 base64 存储在 localStorage，无需上传服务器

### 2.4 排版参数

提供独立的"排版设置"面板，参数调整后实时生效：

| 参数 | 控件类型 | 范围 | 默认值 |
|------|---------|------|--------|
| 模块上间距 | Slider | 4px – 32px | 16px |
| 模块下间距 | Slider | 4px – 32px | 16px |
| 正文行距 | Slider | 1.0 – 2.5 | 1.5 |
| 正文字体大小 | Slider | 10px – 16px | 13px |
| 标题字体大小 | Slider | 12px – 22px | 16px |
| 字体 | Select | 见下方列表 | `'Noto Sans SC', sans-serif` |
| 页边距 | Slider | 10mm – 30mm | 18mm |
| 主题色 | Color Picker | — | `#1a1a1a` |

**可选字体：**
- 中文：Noto Sans SC、思源宋体（Noto Serif SC）
- 英文/混排：Inter、Times New Roman、Georgia

> 字体通过 Google Fonts CDN 按需加载，避免打包体积过大。

### 2.5 简历预览

- 页面尺寸：标准 A4（210mm × 297mm），与 Word / PDF 默认尺寸一致
- 右侧固定宽度预览区（宽度模拟 A4：210mm），与编辑内容实时同步
- 提供"全屏预览"模式，隐藏编辑区，以真实比例查看
- 预览区样式与导出 PDF 完全一致（same DOM，不额外维护）

### 2.6 导出 PDF

**方案选择：`window.print()` + 打印样式表**

优先使用浏览器原生打印，因为：
- 文字清晰，无像素化（`html2canvas` 会将文字转为图片）
- 无额外依赖，包体积小
- 可选"另存为 PDF"，格式标准

实现要点：
- 定义 `@media print` CSS，隐藏编辑区和工具栏
- 设置 `@page { size: A4; margin: 18mm; }`
- 导出时自动触发 `window.print()`
- 提供提示文案，引导用户选择"另存为 PDF"

备选方案（如精度要求更高）：`jsPDF` + `html2canvas`，但文字质量略差。

### 2.7 数据持久化

- 每次编辑自动保存到 `localStorage`（debounce 1s）
- 支持**导出 JSON**：将当前简历数据下载为 `.json` 文件
- 支持**导入 JSON**：上传已有 `.json` 文件恢复数据
- 支持**重置**：清空所有数据，回到初始模板（二次确认）

---

## 3. 非功能需求

### 3.1 性能
- 首次加载 < 3s（LCP），编辑响应 < 100ms
- 排版参数变更实时生效，无明显卡顿

### 3.2 兼容性
- 目标浏览器：Chrome 100+、Edge 100+、Safari 15+（主要是 PDF 导出依赖浏览器能力）
- 响应式：支持 1280px 以上宽屏，移动端仅供查看不作为核心场景

### 3.3 体积控制
- 核心 JS bundle < 300KB（gzip）
- 避免引入重型依赖

---

## 4. 技术选型

| 层级 | 选型 | 理由 |
|------|------|------|
| 框架 | React 18 + TypeScript | 生态成熟，组件化适合模块化编辑器 |
| 构建 | Vite | 开发体验好，构建快 |
| 样式 | Tailwind CSS | 快速布局，工具类直接控制排版 |
| Markdown 解析 | `marked` + `DOMPurify` | 轻量（marked ~43KB），DOMPurify 防 XSS |
| 拖拽排序 | `@dnd-kit/core` | 轻量，无障碍支持好 |
| 状态管理 | Zustand | 轻量，比 Redux 简单，满足本项目需求 |
| 持久化 | `zustand/middleware` persist | 与 Zustand 无缝集成，自动写 localStorage |
| PDF 导出 | 浏览器 `window.print()` | 文字清晰，零依赖 |

---

## 5. 页面结构

```
┌─────────────────────────────────────────────────────┐
│  顶部工具栏：[导入JSON] [导出JSON] [导出PDF] [排版设置]  │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│   左侧编辑区          │   右侧预览区（A4 宽度）        │
│                      │                              │
│  ┌─ 个人信息区 ──┐   │  ┌──────────────────────┐   │
│  │ 姓名/联系方式  │   │  │  [简历实时渲染]        │   │
│  └──────────────┘   │  │                       │   │
│                      │  │                       │   │
│  ┌─ 模块列表 ────┐   │  │                       │   │
│  │ ▼ 教育背景    │   │  │                       │   │
│  │ ▼ 项目经历    │   │  │                       │   │
│  │ + 添加模块    │   │  └──────────────────────┘   │
│  └──────────────┘   │                              │
│                      │                              │
├──────────────────────┴──────────────────────────────┤
│  排版设置面板（抽屉/侧边栏，按需展开）                   │
└─────────────────────────────────────────────────────┘
```

---

## 6. 数据模型

```typescript
interface ResumeData {
  meta: {
    version: string;
    updatedAt: string;
  };
  header: {
    name: string;
    email: string;
    phone: string;
    city: string;
    github?: string;
    website?: string;
    linkedin?: string;
    photo?: string;           // base64 DataURL
    photoSize?: '1inch' | '2inch'; // 1寸 25×35mm | 2寸 35×49mm
  };
  modules: ResumeModule[];
  layout: LayoutConfig;
}

interface ResumeModule {
  id: string;           // uuid
  type: ModuleType;     // 'education' | 'skills' | 'projects' | ... | 'custom'
  title: string;        // 模块标题（用户可修改）
  content: string;      // Markdown 字符串
  visible: boolean;
}

interface LayoutConfig {
  modulePaddingTop: number;     // px
  modulePaddingBottom: number;  // px
  lineHeight: number;           // 倍数
  bodyFontSize: number;         // px
  headingFontSize: number;      // px
  fontFamily: string;
  pageMargin: number;           // mm
  accentColor: string;          // hex
}
```

---

## 7. 里程碑计划

| 阶段 | 内容 | 目标产出 |
|------|------|---------|
| M1 | 项目初始化、数据模型、编辑区骨架 | 可输入内容，localStorage 持久化 |
| M2 | Markdown 渲染、预览区同步 | 编辑内容实时预览 |
| M3 | 排版设置面板、CSS 变量联动 | 参数可调，实时生效 |
| M4 | 模块拖拽排序、添加/删除 | 完整模块管理 |
| M5 | PDF 导出、JSON 导入导出 | 完整产品闭环 |
| M6 | 样式打磨、默认模板、细节优化 | 可对外使用 |
