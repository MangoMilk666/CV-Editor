import type { ResumeData } from '../types';
import { SECOND_CHINESE_TEMPLATE } from './resumeDefaults';

export const CHINESE_TEMPLATE_PREVIEW: ResumeData = {
  header: {
    name: '示例候选人',
    jobTarget: 'AI 应用开发工程师 / 后端开发工程师',
    internshipDuration: '',
    email: 'candidate@example.com',
    phone: '+86 000-0000-0000',
    city: '杭州 / 新加坡',
    github: 'github.com/example',
    website: 'example.dev',
    linkedin: '',
    photo: '',
    photoSize: '1inch',
    headerAlign: 'left',
  },
  layout: { ...SECOND_CHINESE_TEMPLATE.layout },
  modules: [
    {
      id: 'cn2-preview-education',
      type: 'education',
      title: '教育背景',
      visible: true,
      entries: [
        {
          school: '新加坡国立大学（NUS）',
          major: '',
          degree: '计算机科学 硕士',
          gpa: '4.29 / 5.0',
          startDate: '2025.08',
          endDate: '2027.06',
          notes: '- **主修课程**：分布式系统、深度学习与神经网络、数据库安全与设计、计算机体系与操作系统。',
        },
        {
          school: '浙江大学（ZJU）',
          major: '英语（辅修工科课程）',
          degree: '本科',
          gpa: '4.01 / 5.0（学业进步标兵）',
          startDate: '2021.09',
          endDate: '2025.06',
          notes: '- **数理与计科基础**：数据结构与算法、线性代数、概率统计、微积分、Python / C 编程。\n- **语言能力**：TEM-8、CET-6 617、TOEFL 105。',
        },
      ],
    },
    {
      id: 'cn2-preview-skills',
      type: 'skills',
      title: '专业技能',
      visible: true,
      entries: [{
        content: '- **编程语言**：熟练掌握 Java（面向对象、并发基础）、Python；掌握 SQL、JavaScript / TypeScript。\n- **后端与微服务**：Spring Boot、FastAPI、Spring MVC、MyBatis、RESTful API 契约设计。\n- **AI 与大模型应用**：RAG、LangChain Tool Calling Agent、Qdrant / ChromaDB 向量检索。\n- **数据存储与缓存**：MySQL 事务与 SQL 调优、Redis 缓存、MongoDB 文档建模。\n- **DevOps 与基础架构**：Git、Linux、Shell、Docker、GitHub Actions CI/CD；理解 TCP/UDP、HTTP/HTTPS。',
      }],
    },
    {
      id: 'cn2-preview-projects',
      type: 'projects',
      title: '项目经历',
      visible: true,
      entrySortOrder: 'desc',
      entries: [
        {
          name: 'Vago - AI 原生智能旅行助理与知识引擎',
          role: '核心设计与后端开发',
          techStack: 'FastAPI, Spring Boot, LangChain, Qdrant, MySQL, Redis, SwiftUI',
          startDate: '2026.05',
          endDate: '至今',
          link: 'github.com/example/Vago',
          description: '- **混合微服务与多租户隔离**：结合 JWT 与 Redis 管理设备级会话；通过 Qdrant Payload Filtering 隔离个人知识库数据。\n- **Tool Calling Agent 与流式响应**：实现工具路由、调用去重与降级，并通过 WebFlux / SSE 透传执行事件。\n- **端云同步幂等性**：客户端离线事务队列配合服务端唯一索引，保证弱网重试与并发写入安全。',
        },
        {
          name: 'AMS - 企业数字资产全生命周期管理系统',
          role: '全栈架构与开发',
          techStack: 'Spring Boot, Vue 3, TypeScript, MyBatis, MySQL, Caffeine',
          startDate: '2026.06',
          endDate: '2026.08',
          link: '',
          description: '- **资产状态机与审批流**：实现入库、领用、调拨、维修、报废全流程状态约束及多级审批。\n- **认证与权限隔离**：接入钉钉 OAuth 免登，基于 RBAC 控制接口、路由和数据可见范围。\n- **多级缓存策略**：使用 Caffeine 优化组织树与统计看板等高频读取。',
        },
      ],
    },
    {
      id: 'cn2-preview-internships',
      type: 'internship',
      title: '实习经历',
      visible: true,
      entrySortOrder: 'desc',
      entries: [
        {
          company: '杭州云深处科技有限公司',
          position: '全栈开发实习生',
          city: '',
          startDate: '2026.06',
          endDate: '2026.08',
          description: '- **企业协同工具**：参与钉钉内嵌应用开发，支持内部资产与审批流程。\n- **部署与环境支持**：编写 Shell 部署脚本和 Docker 配置，协助搭建 Linux 测试环境。',
        },
        {
          company: '杭州数垚科技有限公司',
          position: '软件测试实习生',
          city: '',
          startDate: '2024.07',
          endDate: '2024.12',
          description: '- **软硬件协同测试**：参与 CTMS 标本采集流程测试，覆盖系统与条码扫描设备交互。\n- **接口质量左移**：使用 Postman 覆盖接口契约与边界场景，跟进 UAT 缺陷闭环。',
        },
      ],
    },
  ],
};
