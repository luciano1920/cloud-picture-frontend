---
paths:
  - 'src/types/**'
description: TypeScript 类型定义规范。编辑 src/types 时生效。
---

# 开发规范 · 类型（types）

> 本规范与全局基线 `global.md` 叠加生效，仅补充本目录特有约束。

## 文件约定

- 文件名：kebab-case + `-api.d.ts`，如 `user-api.d.ts`，与 `src/api/` 模块一一对应
- 结构：`declare namespace USER_API { ... }`，导出命名空间供 `api/` 层以 `USER_API.XXRequest` 引用
- 命名沿用后端类型名（`BaseResponseBoolean_`、`UserLoginRequest`），与 Swagger 对齐

## DTO

- API 入参/出参必须定义 Request/Response DTO
- **字段定义必须与后端 Swagger 完全对齐，不得主观调整字段名或类型**
- 分页、通用响应等公共类型优先复用既有命名空间，不重复定义

## 联合类型

- 支持多类型的入参定义并导出联合类型：`export type DateInput = string | number | Date | null | undefined`（供 `utils/`、`composables/` 使用）
