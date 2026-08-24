---
paths:
  - 'src/stores/**'
description: Pinia 状态管理规范。编辑 src/stores 时生效。
---

# 开发规范 · 状态（stores）

> 本规范与全局基线 `global.md` 叠加生效，仅补充本目录特有约束。

## 写法

- **必须使用组合式 API**：`defineStore(id, () => { ... })`（参考 `src/stores/user-store.ts`）
- **禁止** Options API 写法（state/getters/actions 对象式）

```ts
// src/stores/user-store.ts —— 标准写法
export const useUserStore = defineStore('user', () => {
  const loginUser = ref<USER_API.LoginUserVO>()
  async function fetchLoginUser() {
    loginUser.value = (await getLoginUserInfoUsingGet()).data.data
  }
  return { loginUser, fetchLoginUser }
})
```

## 设计

- 跨页面共享的状态才入 store；页面/组件私有状态用 `ref`/`reactive` 即可
- 异步动作内部调用 `src/api/` 层方法（见 `network.md`），保持 `async/await`
- 命名语义化：状态反映业务含义（`loginUser`），动作用动词（`fetchLoginUser`）
