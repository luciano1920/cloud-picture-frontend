---
name: git-workflow
description: 执行 git 提交、分支管理、合并请求等操作时使用。包含 Commit Message 规范与分支策略。当用户说"提交/commit/commit之前/branch/MR/合并"等指令时调用。
---

# Git 工作流与提交规范

> 来源：docs/rule.md 第四章。

## 分支管理

- `main`（仓库中为 `master`）：主分支，受保护，仅管理员可合并
- `dev`：日常开发集成分支，可推送可合并
- `feat/xxx`：新功能分支，从主分支拉取，完成后提 MR 合并
- `fix/xxx`：Bug 修复分支

## Commit Message 规范

### 格式

```
<type>(<scope>): <subject>

<详细说明>（可选，多行时与 subject 空一行）

<type2>: <subject2>（可选，多 type 时与上一段落同层级，不缩进）
```

- `scope`：可选，影响范围，小写 kebab-case（如 `apply`、`auth`、`user`、`component`）
- `subject`：中文或英文，首字母小写，结尾无句号，**不超过 50 字符**
- `feat` 的 body 必须写详细说明，逐条列出做了什么（每行用 `- ` 开头）
- 多 type 共存时（如 `feat` + `docs`），每个 type 段落**同层级**，`docs` 不要缩进在 `feat` 的 body 下面

### 允许的 type

| type       | 说明                                                                  |
| ---------- | --------------------------------------------------------------------- |
| `feat`     | 新功能（scope 必填）                                                  |
| `fix`      | 修复 bug                                                              |
| `docs`     | 文档变更                                                              |
| `style`    | 代码格式改变（不影响运行）                                            |
| `refactor` | 重构                                                                  |
| `perf`     | 性能优化                                                              |
| `test`     | 添加/修改测试                                                         |
| `build`    | 构建系统或依赖变更（vite、npm 包版本等）                              |
| `ci`       | CI 配置文件/脚本变更                                                  |
| `chore`    | 其他杂项（`.gitignore`、eslint 配置等，不涉及 src/test）              |
| `revert`   | 回滚，subject 含原 commit hash，格式：`revert: <hash> - <原 subject>` |

### 正反例

```sh
# 正例
git commit -m "feat(apply): 增加补卡申请页面"
git commit -m "fix(auth): 修复 token 刷新后权限未更新"
git commit -m "test(utils): 添加 formatDate 单元测试"
git commit -m "revert: abc1234 - feat(apply): 增加补卡申请页面"

# 正例（多 type + 详细 body）
git commit -m "feat(component): 新增 PictureCard 图片卡片组件及 PictureListNew 瀑布流列表

- PictureCard: 图片悬浮缩放动画、底部毛玻璃横栏
- PictureListNew: 基于 a-masonry 的瀑布流布局
- HomePage: 替换旧 PictureList 为新组件

docs: 补充 vue.md CSS 类名 SMACSS 命名规范"

# 反例
git commit -m "更新"      # 无 type/scope
git commit -m "修bug"     # 无具体信息
```

## 执行要点

1. 提交前先询问用户是否全局校验和格式化代码。
   - 如果用户确认校验和格式化，则运行 `npm run lint` 、 `npm run format`，确保规范通过后再提交
   - 如果用户不需要全局校验和格式化代码，你则自行校验和格式化当前修改且已被git追踪的文件，确保规范通过后再提交
2. 新功能/修复从主分支拉分支（`feat/*` / `fix/*`），不要直接在主分支上开发
3. 主分支只接受 MR 合并，本地尽量不直接向主分支 push
