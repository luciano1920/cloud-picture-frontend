---
paths:
  - 'src/api/**'
  - 'src/libs/**'
description: 网络请求与 API 层规范。编辑 src/api、src/libs 时生效。
---

# 开发规范 · 网络层（api / libs）

> 本规范与全局基线 `global.md` 叠加生效，仅补充本目录特有约束。

## 请求入口

- 统一使用 `src/libs/axios/request.ts` 导出的 axios 实例（default 导出）
- **禁止**在页面/组件/Vue 文件内 `import axios` 直接发起请求
- 接口函数统一放 `src/api/` 按模块划分文件，全部**命名导出**，禁默认导出

## API 方法写法

- 方法名：`{action}{entity}Using{Method}`，如 `userLoginUsingPost`、`changeUserPasswordUsingPost`
- 方法签名固定为：`(body: API_NS.XXRequest, options?: { [key: string]: any })`，options 透传请求配置
- 入参/出参类型引用 `types/*-api.d.ts` 里导出的命名空间类型（如 `USER_API.LoginUserVO`）
- 全部 `async/await`，**禁止** `.then()/.catch()/.finally()` 链式调用；调用模式 `request<T>(url, { method, headers, data: body, ...(options || {}) })`（GET 用 `params`）

```ts
// src/api/user-controller.ts —— POST 标准写法
export async function userLoginUsingPost(
  body: USER_API.UserLoginRequest,
  options?: { [key: string]: any },
) {
  return request<USER_API.BaseResponseLoginUserVO_>('/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}
```

## 响应约定

- 响应包统一 `{ code, data, message }`：`code === 0` 成功；`40100` 未登录（响应拦截器已处理跳转登录页）
- 业务层取 `data` 字段：`res.data.code === 0 && res.data.data`；`request.ts` 拦截器负责 token、错误提示与 40100 跳转

## 错误处理

- 业务层捕获异常后，**必须**使用 `message.error` 或统一错误处理器向用户反馈，**禁止静默失败**

## 生成文件

- `*-controller.ts` 由 `npm run openapi` 依据后端 Swagger 生成，**勿手改**；类型与后端文档不一致时先改后端再重新生成，或注明理由单独修改
