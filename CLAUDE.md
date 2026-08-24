# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

智能云图库 Web 端（Vue 3 + Vite 8 + TS + antdv-next）。本文件仅为项目导航。

**所有编码规范请严格遵循 `.claude/rules/` 下的对应文件**：全局基线 `.claude/rules/global.md` 常驻，编辑 src 下目录时按路径自动叠加加载专属规则（`vue.md`/`network.md` 等，各文件 frontmatter 声明了生效路径）；完整权威规范见 `docs/rule.md`，仅在规则有歧义时翻阅。

## 高频命令

```sh
npm run dev        # 本地开发（mode env.local，端口见 VITE_PORT=5323）
npm run build      # 类型检查 + 构建（标准构建）
npm run build:prod # 生产构建（产物 dist-prod，部署见 README）
npm run lint       # oxlint + eslint 自动修复
npm run format     # prettier 格式化 src/
npm run openapi    # 从后端 Swagger 重新生成 api/*-controller.ts 与 types/*-api.d.ts（勿手改）
```

- Node 要求 `^22.18.0 || >=24.12.0`（nvm 管理）。
- `VITE_API_BASE_URL` / `VITE_BASE_PATH` / `VITE_OUT_DIR` 按 mode 从 `.env*` 加载（本地开发指向 `http://localhost:8123/api`）。

## 架构速览

**数据流**：页面/组件 → `src/api/*-controller.ts` → `src/libs/axios/request.ts`（唯一 axios 实例）→ 后端。

- 响应统一为 `{ code, data, message }`；`code === 0` 成功，`40100` 未登录（拦截器自动跳登录页）
- 鉴权：`src/permission.ts` 全局守卫 + 路由 `meta.access` + `ACCESS_ENUM`；未登录跳 `/auth/login`，无权限跳 `/auth/unauthorized`
- antdv-next 组件由 unplugin 自动按需引入 —— SFC 无需/禁止手动 import `a-*` 组件
- 目录划分：`pages/`（`XxxPage.vue`）、`layouts/`、`components/{common,layout,业务}`、`stores/`（组合式 API）、`constants/`（枚举+MAP）、`composables/`、`utils/`、`types/`（`XXX_API.d.ts`）

## Antdv Next 官方文档

组件 API / Props / 事件 / 主题 token 等以官方离线资料为准，**按需取用，禁止整份读入大文件**。以下两项均已 gitignore（可重新生成，新克隆需重建）：

- **Skill（首选）**：`antdv-next`（描述命中时自动触发）。逐组件离线文档在 `.claude/skills/antdv-next/references/components/<name>/docs.md`，demo 在 `demo/`，主题 token 在 `token.md` 与 `global-token.md`。注意：skill 基于 2026-07-03 生成，en-US。重新安装：`npx skills add antdv-next/skills`。
- **完整文档（仅全文检索）**：`.claude/references/antdv-llms-full-cn.txt`（中文，~1.7MB，只允许 Grep 检索，**禁止整体 Read**）。重新拉取：`curl -s -o .claude/references/antdv-llms-full-cn.txt https://antdv-next.com/llms-full-cn.txt`。
- **组件索引（入库）**：`.claude/references/antdv-llms.txt`（12KB，结构总览，可整读）。重新拉取：`curl -s -o .claude/references/antdv-llms.txt https://antdv-next.com/llms.txt`。

## 导航

| 入口 | 位置 / 触发 | 用途 |
| --- | --- | --- |
| 开发规范 | `.claude/rules/`（全局基线 + 按目录专属） | 强制规范：全局基线常驻，src 下目录按路径加载对应规则；`docs/rule.md` 为权威源，仅在歧义时翻阅（默认遵循） |
| Antdv Next 文档 | `antdv-next` skill / `.claude/references/` | 组件 API、Props、事件、主题 token 离线查询 |
| Code Review | `/code-review` | 审查改动：规范 + 缺陷 + 资源泄漏检查 |
| Git 工作流 | `/git-workflow` | 分支策略 + Commit Message 规范（操作 git 时调用） |

## 约定

- 提交前：`npm run lint` + `npm run format`，并按 `/git-workflow` 规范写 commit message
- docs/rule.md 中未摘录的细节（如 Git 提交 type 全表）按需从导航入口加载，避免重复阅读长文档
