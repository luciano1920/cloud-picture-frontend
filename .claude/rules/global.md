---
paths:
  - 'src/**'
description: 全局基线规范。所有 src/ 下代码必须遵守；编辑各子目录时会叠加加载目录专属规则（见文末清单）。
---
# 开发规范 · 全局基线

> 唯一真理源：`.claude/rules/*.md` 各子规则与此叠加生效，仅补充目录特有约束；有歧义时以 `docs/rule.md` 为准。

## 技术栈

- Vue 3 + TypeScript + Vite 8 + antdv-next + Pinia + Vue Router + Axios + Dayjs
- Node.js：`^22.18.0 || >=24.12.0`（nvm 管理）
- antdv-next 组件由 unplugin 按需自动引入：SFC **禁止**手动 import `a-*` 组件

## 文件命名总表（权威唯一）

| 类型                   | 规则                                                                              | 存放目录                              | 示例                                     |
| ---------------------- | --------------------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------- |
| 页面                   | PascalCase +`Page.vue` 结尾                                                     | `pages/`                            | `HomePage.vue`                         |
| 组件                   | PascalCase +`.vue`（全局通用放 `components/common/`，业务放 `components/`） | `components/`                       | `GlobalHeader.vue`                     |
| API                    | kebab-case +`-controller.ts`                                                    | `api/`                              | `user-controller.ts`                   |
| 类型                   | kebab-case +`-api.d.ts`                                                         | `types/`                            | `user-api.d.ts`                        |
| Store                  | kebab-case +`-store.ts`                                                         | `stores/`                           | `user-store.ts`                        |
| Hook                   | kebab-case +`use` 开头                                                          | `composables/`                      | `useProgress.ts`                       |
| 常量 / 工具 / 静态资源 | kebab-case                                                                        | `constants/` `utils/` `assets/` | `access.ts` `date.ts` `upload.png` |

## 变量与函数命名

- 函数遵循 `动词 + 名词` 语义化：`fetchUserInfo`、`submitAttendanceForm`；判断函数 `is`/`has` 前缀；工具函数按需 `Util` 后缀
- **禁止**泛化命名：`getData`、`handleClick`、`doAction`、`tianyi`（无业务语义）
- 变量必须反映数据含义，**禁止** `data`、`res`、`temp`、`item` 作顶层变量（回调/极短作用域临时变量除外）
- 相等比较**严禁 `==`**，必须 `===`

## 路径引用

- 引入 src 内模块统一用 `@/` 别名，**禁止** `../` 相对路径

## TypeScript 与类型安全

- **严禁无理由使用 `any`**：若因第三方库类型缺失或临时适配，必须添加 `// eslint-disable-next-line @typescript-eslint/no-explicit-any` 注释并简述理由
- API 入参/出参必须定义 DTO（见 `types.md` / `network.md`）
- 常量/枚举抽离到 `constants/` 并导出映射 Map；支持多类型的入参用导出的联合类型

## 注释与日志

- 导出函数、公共方法、复杂工具函数必须 JSDoc：功能描述、参数类型与含义、返回值类型与含义
- 复杂分支/算法/异步时序必须行内注释说明**为什么**（而非重复代码）
- **禁止**：重复代码含义的注释、大段被注释代码、无负责人与日期的 `// TODO`
- **禁止在最终提交代码中保留无条件 `console.log`**：开发调试允许 `console.debug`，合并前必须移除；生产日志通过统一 Logger

## 格式化

- `.prettierrc.json`：单引号、无分号、尾随逗号、行宽 100、缩进 2
- 提交前：`npm run lint` + `npm run format`，commit message 走 `/git-workflow`

## 目录专属规则（按编辑路径自动叠加）

| 编辑路径                                            | 叠加规则         |
| --------------------------------------------------- | ---------------- |
| `pages/` `components/` `layouts/` `App.vue` | `vue.md`       |
| `api/` `libs/`                                  | `network.md`   |
| `types/`                                          | `types.md`     |
| `constants/`                                      | `constants.md` |
| `stores/`                                         | `stores.md`    |
| `router/` `permission.ts` `main.ts`           | `router.md`    |
| `composables/` `utils/`                         | `script.md`    |
| `assets/` `styles/`                             | `styles.md`    |

## 环境优先原则

> **环境优先原则**：若项目现有代码（`src/` 目录下）的普遍写法与本规则存在冲突，且该写法在当前上下文中无明显缺陷，Agent 应优先模仿周边代码的既有模式，保证代码风格一致性。若有疑虑，可在提交时说明。
