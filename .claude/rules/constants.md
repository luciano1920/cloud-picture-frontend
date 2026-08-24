---
paths:
  - 'src/constants/**'
description: 常量与枚举规范。编辑 src/constants 时生效。
---

# 开发规范 · 常量（constants）

> 本规范与全局基线 `global.md` 叠加生效，仅补充本目录特有约束。

## 文件约定

- 文件名：kebab-case（`access.ts`、`space.ts`、`user.ts`）
- 常量/枚举必须抽离到 `src/constants/`，**禁止**在组件或页面内散落硬编码魔法值

## 枚举与映射

- 业务枚举定义后**必须**导出对应文本/选项 `Map`，供模板、下拉、徽标复用（参考 `src/constants/space.ts`）
- `Map` 显式标注 key/value 类型，**禁止** `as any` 断言

```ts
// src/constants/space.ts —— 枚举定义后必须导出映射 Map
export const SPACE_ROLE_ENUM = { VIEWER: 'viewer', ADMIN: 'admin' } as const
export const SPACE_ROLE_MAP: Record<string, string> = {
  viewer: '浏览者',
  admin: '管理员',
}
```

## 鉴权枚举

- `ACCESS_ENUM` 为鉴权等级常量，路由 `meta.access` 与 `permission.ts` 均引用它（见 `router.md`），**禁止**拆分复制

## 注释

- 模块级常量、复杂配置对象、枚举映射必须行内注释说明用途或数据来源
