---
paths:
  - 'src/router/**'
  - 'src/permission.ts'
  - 'src/main.ts'
description: 路由与鉴权规范。编辑 src/router、src/permission.ts、src/main.ts 时生效。
---

# 开发规范 · 路由与鉴权（router）

> 本规范与全局基线 `global.md` 叠加生效，仅补充本目录特有约束。

## 组织结构

- `src/router/routes.ts`：集中配置路由表；**新增页面路由 MUST register 在 `src/router/routes.ts`，DO NOT 在组件内使用 `router.addRoute`**
- `src/router/index.ts`：创建实例、挂载页面标题守卫与进度条（NProgress）、注册权限守卫
- `src/permission.ts`：全局权限守卫（`router.beforeEach` 权限校验）独立于此文件

## 路由定义

- 页面组件**必须懒加载**：`component: () => import('@/pages/x/XxxPage.vue')`
- `name` 必须有业务语义且全局唯一，**严禁重名**
- 每条路由必须配置 `meta.title`（页面标题守卫按 `meta.title` 动态设置 `document.title`）

## 鉴权

- 需登录/权限的路由必须配置 `meta.access`，取值用 `ACCESS_ENUM`（`src/constants/access.ts`）
- 守卫用**返回值式**写法（Vue Router 4+ 弃用 `next` 回调）：未登录 → `return '/auth/login?redirect=...'`；无权限 → `return '/auth/unauthorized'`
- 权限判定集中：`permission.ts` 调 `checkAccess`（`src/utils/auth.ts`），业务组件内不重复实现鉴权逻辑

## main.ts

- 应用入口：挂载路由/状态/国际化等初始化；全局样式通过 `src/styles/global.css` 引入，**禁止**在此写内联全局样式
