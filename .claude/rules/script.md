---
paths:
  - 'src/composables/**'
  - 'src/utils/**'
description: 组合式函数(Hook)与工具函数规范。编辑 src/composables、src/utils 时生效。
---

# 开发规范 · Hook 与工具（composables / utils）

> 本规范与全局基线 `global.md` 叠加生效，仅补充本目录特有约束。

## 文件约定

- Hook（`composables/`）：kebab-case + `use` 开头，如 `useProgress.ts`、`useInfiniteList.ts`
- 工具（`utils/`）：kebab-case，如 `auth.ts`、`date.ts`、`edit-websocket.ts`
- 组件 `<script setup>` 逻辑 >100 行或含独立功能模块时，抽到 `composables/`（见 `vue.md`）

## 导出与命名

- 文件内方法全部**命名导出**，禁默认导出；导出收口 `src/utils/index.ts`
- 函数 `动词 + 名词`：`fetchUserInfo`、`formatDateToYMD`；判断函数 `is`/`has` 前缀；工具函数按需 `Util` 后缀
- 禁止泛化命名：`getData`、`handleData`、`doAction`

## 入参与返回

- 支持多类型的入参定义并导出联合类型（`type DateInput = string | number | Date | null | undefined`，见 `types.md`）
- 返回值尽量沿用后端/业务既有结构，避免无谓包装
- 异步必须 `async/await`，**禁止** `.then()` 链式调用

## 注释

- 导出函数必须 JSDoc：功能描述、参数类型与含义、返回值类型与含义
- 复杂分支/算法/异步时序必须行内注释说明"为什么这么做"
