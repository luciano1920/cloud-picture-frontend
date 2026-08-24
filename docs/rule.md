# 前端项目开发规范与协作要求

本文档为前端项目强制执行的开发规范，所有代码提交与合并请求必须符合此规范，否则予以驳回。

## 一、 技术栈与环境要求

- **框架**：Vue 3 + TypeScript
- **构建工具**：Vite 8+
- **状态管理**：Pinia
- **路由**：Vue Router 5+
- **UI组件库**：Ant Design Vue Next
- **网络请求**：Axios + qs
- **日期处理**：Dayjs
- **代码校验**：ESLint + Prettier
- **Node.js 版本**：严格要求 `^22.18.0 || >=24.12.0`，推荐使用 `nvm` 管理本地不同的 Node.js 版本。

## 二、 命名规范

项目的目录结构遵循**按功能模块划分**的原则，严禁随意在根目录新建散落文件。所有命名必须清晰、语义化。

### 2.1 目录命名

- 一级与业务模块目录：全小写 kebab-case（如 `composables`, `constants`, `pages/apply`）。
- 组件目录（复杂组件拆分）：必须包含 `components` 文件夹（如 `src/pages/apply/components/`）。

### 2.2 文件命名

- **Vue 页面**：大驼峰 PascalCase，必须以 `Page.vue` 结尾（如 `ApplyPage.vue`, `UserLoginPage.vue`）。
- **Vue 组件**：大驼峰 PascalCase，必须以 `.vue` 结尾。全局通用组件（`src/components/common` 目录下）。业务组件按照业务场景和功能命名并直接放在`src/components` 目录下。
- **API 接口文件**：全小写 kebab-case，必须以 `-controller.ts` 结尾（如 `auth-controller.ts`）。对应的类型文件放在`src/types` 目录下，以`-api.d.ts` 结尾
- **Pinia 状态文件**：全小写 kebab-case，必须以 `-store.ts` 结尾（如 `user-store.ts`）。
- **Hooks/组合式函数**：全小写 kebab-case，必须以 `use` 开头（如 `usePicker.ts`）。
- **常量文件**：全小写 kebab-case（如 `access.ts`、`record.ts`）。
- **工具函数文件**：全小写 kebab-case（如 `date.ts`、`auth.ts`）。
- **静态资源文件**：全小写 kebab-case（如 `detail-avatar.svg`、`upload.png`）。

### 2.3 组件标签命名

- 在 Vue 模板中，Ant Design Vue Next 组件使用短横线命名（如 `<a-table></a-table>`），自定义组件（包括全局和业务模块）使用大驼峰命名（如 `<GlobalHeader></GlobalHeader>`）。
- **正例**：
  - TDesign 组件：`<a-table></a-table>`
  - 自定义组件：`<GlobalHeader></GlobalHeader>`（对应 `GlobalHeader.vue`）
- **反例**：`<app-back-list-top></app-back-list-top>`（自定义组件使用短横线）

### 2.4 变量与函数命名

- **函数命名后缀**：
  - 工具类函数：按需使用 `Util` 后缀（如 `getAccessTokenUtil`、`formatDate` ）。
  - 判断函数：使用 `is`/`has` 前缀（如 `isFutureDate`）。
- **变量与函数命名语义化**：
  - **禁止**使用无业务语义的泛化命名，如 `tianyi`、`getTianyiFn`、`postLogin`、`getUrl`、`handleData`、`doAction` 等。
  - 函数命名必须**清晰表达其行为与意图**，建议遵循 `动词 + 名词` 结构（如 `fetchUserInfo`、`formatDateToYMD`）。
  - 变量命名必须**反映其存储的数据含义**，禁止使用 `data`、`res`、`temp`、`item` 作为顶层变量（回调或极短作用域的临时变量除外）。
  - **正例**：`getUserAccessToken` / `submitAttendanceForm` / `hasEditPermission`
  - **反例**：`getData` / `handleClick` (过于泛化) / `temp1` / `tianyi` (无业务语义)
- **相等比较**：**严禁使用 `==`**，必须使用 `===`

## 三、 代码编写规范

### 3.1 文件头部注释规范

所有新建的 `.vue`、`.ts` 文件，**建议在首行添加标准注释块**，便于追溯责任人：可以使用 VSCode 的 koroFileHeader 插件并进行相应配置。（该项目暂不需要遵循头部注释规范）

### 3.2 TypeScript 类型规范

1. **限制 `any` 的使用**：当前 ESLint 配置虽允许 `any`，但新增代码应尽量定义具体类型。**API 请求的入参和出参最好不要直接使用 `any`**，建议定义具体的 Request/Response DTO 类型。
2. **常量类型提取**：常量必须抽离至 `src/constants/` 目录，并导出对应的映射 `Map`（参考 `space.ts` 中的 `SPACE_ROLE_MAP`）。
3. **工具函数入参**：支持多类型的入参应使用联合类型并导出（如 `export type DateInput = string | number | Date | null | undefined`）。
4. **路径别名**：统一使用 `@/` 代替 `../` 等相对路径引入 src 内的模块

### 3.3 Vue 组件规范

1. **SFC 顺序**：严格遵守 `<template>` -> `<script setup lang="ts">` -> `<style lang="scss" scoped>`。
2. **Props 定义**：必须使用 TypeScript 接口（interface）定义 Props，并使用 withDefaults 提供默认值。
3. **样式隔离**：业务组件样式必须添加 `scoped`，全局样式仅允许在 `src/styles/global.css` 中修改，禁止直接在 `App.vue` 中写全局样式。
4. **SVG 图标**：新增图标可以去 [在线图标网站](https://lucide.dev/icons/) 获取想要的线框式图标，下载其svg文件后，不更改原有图标文件名，放入 `src/assets/svgs/icons/` 目录内，通过 `<AppSvgIcon name="xxx" />` 引用，严禁使用在线链接或 base64 大图。
5. **组件拆分与行数限制**：
   - **硬性行数限制**：单个 Vue 组件/页面文件（含 template、script、style）的总行数**建议不超过 500 行，严禁超过 800 行**。
   - **UI 组件拆分**：当页面包含多个独立的 UI 区块、表单项过多、或存在可复用的 UI 模式时，**必须**将其抽离为子组件，存放于当前模块或者公共模块的 `components` 目录下。
   - **逻辑 Hooks 拆分**：当 `<script setup>` 中的业务逻辑过长（如超过 100 行），或包含多个相互独立的功能模块（如多个表单联动、复杂的列表过滤逻辑）时，**必须**将逻辑抽离至 `composables` 目录下的自定义 Hook（以 `use` 开头）中（如 `usePicker.ts` 、`useInfiniteList.ts`）。
   - **拒绝“上帝组件”**：严禁在一个组件内堆砌所有逻辑和 UI，遵循单一职责原则（SRP），一个组件只做一件事。

### 3.4 网络请求与鉴权规范

1. 统一使用 `src/libs/axios/request.ts` 封装的实例，接口函数统一放在 `src/api/` 目录下按模块划分，每个封装的API方法单独命名导出，禁止使用默认导出。严禁在页面中直接 `import axios from 'axios'` 并在 Vue 组件内直接调用 axios.request 发起请求。
2. API 函数命名必须遵循 `{action}{entity}Using{Method}` 的规范（如 `userLoginUsingPost`），由后端 Swagger 生成或人工按此规范编写。
3. 异步请求必须使用 `async/await` 语法。禁止在业务组件中使用 `.then()/.catch()/.finally()` 链式调用处理 Promise。异常捕获应统一通过 `try/catch/finally` 结构实现。
4. 路由鉴权统一由 `src/permission.ts` 控制，新增需鉴权的路由必须配置 `meta.access` 并使用 `ACCESS_ENUM` 常量。

### 3.5 路由与状态规范

1. **路由必须使用懒加载**：`() => import('@/pages/xxx/XxxPage.vue')`
2. 路由 name 必须有业务语义，严禁重名；必须要给路由加上对应的 title。
3. Pinia Store 必须使用**组合式 API**写法（参考 user-store.ts），严禁使用 Options API 写法。

### 3.6 代码格式化（Prettier 规则）

项目已配置 `.prettierrc.json`，核心规则：单引号、无分号、尾随逗号、行宽 100 字符、缩进 2 空格。提交前必须格式化！

### 3.7 注释与文档规范

1. **方法/函数注释**：所有导出函数、公共方法、复杂工具函数必须使用 JSDoc 格式注释，包含但不限于功能描述、参数类型与含义、返回值类型与含义。
2. **关键变量注释**：模块级常量、复杂配置对象、枚举映射必须添加行内注释说明其用途或数据来源。
3. **行内复杂逻辑注释**：分支条件复杂、算法实现、异步时序控制等难以一眼看懂的代码，必须添加行内注释解释**为什么这么做**（而非重复代码本身）。
4. **禁止无意义或垃圾注释**
   - 禁止出现仅重复代码含义的注释（如 `// 赋值`、`// 循环`）。
   - 禁止提交大段被注释掉的代码（除非明确保留原因）。
   - 临时调试用 `console.log` 必须在提交前删除。
   - 禁止提交含 `// TODO` 但无开发负责人和待开发日期的注释。

## 四、 Git 工作流与提交规范

### 4.1 分支管理

- `main、master`：主分支，受保护，仅管理员可合并。
- `dev`：日常开发集成分支，开发者可推送或合并。
- `feat/xxx`：新功能分支，从 `main` 拉取，完成后提 MR 合并。
- `fix/xxx`：Bug 修复分支。

### 4.2 Commit Message 规范

格式：`<type>(<scope>): <subject>`

**允许的 type**：

| 类型         | 说明                                                                |
| ------------ | ------------------------------------------------------------------- |
| `feat`     | 新功能                                                              |
| `fix`      | 修复 bug                                                            |
| `docs`     | 文档变更                                                            |
| `style`    | 代码格式改变（不影响代码运行，如空格、缩进、分号等）                |
| `refactor` | 重构                                                                |
| `perf`     | 性能优化                                                            |
| `test`     | 添加或修改测试用例                                                  |
| `build`    | 构建系统或外部依赖变更（如修改 webpack、vite、npm 包版本）          |
| `ci`       | CI 配置文件和脚本变更（如 GitHub Actions、Jenkins）                 |
| `chore`    | 其他杂项（不修改 src 或 test 文件，如修改 .gitignore、eslint 配置） |
| `revert`   | 回滚之前的提交                                                      |

**补充说明**：

- `scope` 可选，表示影响范围（如 `apply`、`auth`、`utils`），建议使用小写 kebab-case。
- `subject` 必须使用中文或英文，首字母小写，结尾不加句号，不超过 50 个字符。
- 若使用 `revert` 类型，则 `subject` 应包含被回滚的 commit hash 和原 commit message，格式为：`revert: <原 commit hash> - <原 subject>`

**反例**：

- git commit -m "更新"
- git commit -m "修bug"

**正例**：

- git commit -m "feat(apply): 增加补卡申请页面"
- git commit -m "fix(auth): 修复 token 刷新后权限未更新"
- git commit -m "test(utils): 添加 formatDate 单元测试"
- git commit -m "revert: abc1234 - feat(apply): 增加补卡申请页面"
- git commit -m "ci: 添加 commitlint 校验"
