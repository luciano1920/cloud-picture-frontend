---
paths:
  - 'src/pages/**'
  - 'src/components/**'
  - 'src/layouts/**'
  - 'src/App.vue'
description: Vue 页面/组件/布局规范。编辑 src/pages、src/components、src/layouts、src/App.vue 时生效。
---

# 开发规范 · Vue 模板（pages / components / layouts）

> 本规范与全局基线 `global.md` 叠加生效，仅补充本目录特有约束。

## SFC 结构

- 顺序严格固定：`<template>` → `<script setup lang="ts">` → `<style lang="scss" scoped>`

## 组件引用（antdv-next 按需引入机制）

- antdv-next 组件由 unplugin 自动按需引入：**DO NOT `import { Button } from 'antdv-next'`** → 直接在模板中使用 `<a-button>`
- 模板标签：antdv-next 组件短横线 `<a-table>`；自定义组件（全局与业务）大驼峰 `<GlobalHeader>`；反例：自定义组件乱用短横线 `<app-back-list-top>`

## Props

- 必须用 TypeScript `interface` 定义 Props，并用 `withDefaults` 提供默认值

## 样式隔离

- 业务组件样式必须 `scoped`
- 全局样式只允许改 `src/styles/global.css`，**禁止**在 `App.vue` 或组件内写全局样式

## CSS 类名命名

遵循 **kebab-case + SMACSS 五层结构**：

| 层级 | 规则 | 示例 |
| --- | --- | --- |
| **Base** | 元素选择器，仅在全局样式中使用 | `body`、`a`、`img` |
| **Layout** | `l-` 前缀，用于页面级布局容器 | `l-main`、`l-grid`、`l-header` |
| **Module** | 组件名 kebab-case，与组件命名一致 | `.picture-card`、`.search-bar`、`.global-header` |
| **State** | `is-` 前缀，表示临时状态 | `.is-active`、`.is-zoomed`、`.is-hidden` |
| **Theme** | `theme-` 前缀，表示主题变体 | `.theme-dark`、`.theme-compact` |

详细约束：

- **禁止** BEM 分隔符（`__`、`--`）：子元素类名直接以模块名短横线连接，如 `.picture-card-image-wrapper` 而非 `.picture-card__image-wrapper`
- 子元素类名以模块名为前缀，逐级拼接：`.picture-card` → `.picture-card-bar` → `.picture-card-action-btn`
- 状态类统一用 `is-` 前缀，配合 `&.is-xxx` 或 `:class="{ 'is-xxx': condition }"` 使用，**禁止** `--modifier` 或 `-active` 等非标后缀
- 过渡动画类名（Vue `<Transition name="foo">` 自动生成 `.foo-enter-active` 等）不受此限
- `:deep()` 包裹的第三方库类名不受此限

## 行数与拆分（SRP）

- 单文件**总行数**（含 template/script/style）：建议 ≤500，**硬上限 800**
- UI 拆分：页面含多个独立 UI 区块、表单项过多、存在可复用模式时，**必须**抽子组件到当前模块或公共 `components/`
- 逻辑拆分：`<script setup>` 逻辑 >100 行、或含多个独立功能模块（多表单联动、复杂列表过滤）时，**必须**抽到 `composables/` 的自定义 Hook（`use` 开头，见 `script.md`）
- 拒绝"上帝组件"：一个组件只做一件事

## 性能规范

- `v-for` **必须**搭配唯一 `:key`
- **禁止**在模板中写复杂表达式，应抽为 `computed`

## 图标

- 图标从 lucide 获取线框 svg，**不更改文件名**，放入 `src/assets/svgs/icons/`，用 `<AppSvgIcon name="xxx" />` 引用
- **禁止**在线图标链接或 base64 大图（详见 `styles.md`）

## 类型

- 组件内局部类型就地定义；对接后端的 DTO 统一放 `src/types/*-api.d.ts`（见 `types.md`）
