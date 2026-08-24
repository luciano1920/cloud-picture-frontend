---
paths:
  - 'src/assets/**'
  - 'src/styles/**'
description: 静态资源与全局样式规范。编辑 src/assets、src/styles 时生效。
---

# 开发规范 · 资源与样式（assets / styles）

> 本规范与全局基线 `global.md` 叠加生效，仅补充本目录特有约束。

## 静态资源（assets）

- 文件名：全小写 kebab-case（`detail-avatar.svg`、`upload.png`）
- 图标：新增图标从 lucide 获取线框 svg，**不更改文件名**放入 `src/assets/svgs/icons/`，经 `<AppSvgIcon name="xxx" />` 引用
- **禁止**模板内联在线图标链接或 base64 大图（见 `vue.md`）

## 全局样式（styles）

- `src/styles/global.css` 是**唯一**全局样式入口：全局样式只允许在这里修改
- **禁止**在 `App.vue` 或组件内（非 scoped）写全局样式
- 各文件职责单一：`fonts.css`（字体引入）、`nprogress.css`（进度条样式），不混入业务样式
- 业务样式一律在组件内 `scoped`

## 主题

- 主题 token 通过 antdv-next `ConfigProvider` 的 `theme.token` 统一管理，业务组件内**禁止**硬编码色值/间距魔法值
