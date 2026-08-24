# 云图拾光 - 智能云图库与影像社区

## 项目简介

云图拾光（Cloud Pick）前端项目，基于 Vue 3 + Vite + TypeScript 构建，采用 Ant Design Vue Next 作为 UI 组件库，支持多环境打包部署与严格的代码规范化约束。

> **强制规范**：本项目有严格的开发规范，所有代码提交与合并请求必须符合 [开发规范文档](./docs/rule.md)，否则予以驳回。开发前**务必**仔细阅读！

> **Node.js 版本**：严格要求 `^22.18.0 || >=24.12.0`，推荐使用 `nvm` 管理本地 Node.js 版本。

## 技术栈

- **框架**：Vue 3 (Composition API) + TypeScript
- **构建工具**：Vite 8+
- **路由**：Vue Router 5+
- **状态管理**：Pinia
- **UI 组件库**：Ant Design Vue Next
- **网络请求**：Axios + qs
- **日期处理**：Dayjs
- **代码规范**：ESLint + Prettier

## 快速开始

### 1. 环境准备

推荐使用 [VS Code](https://code.visualstudio.com/) 进行开发，并建议安装以下插件：

- [Vue - Official (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（务必禁用 Vetur）
- ESLint
- Prettier - Code formatter
- koroFileHeader（用于生成文件头部注释）

### 2. 安装与运行

```sh
npm install
```

- **本地开发环境启动**：

```sh
npm run dev
```

- **测试环境启动**：

```sh
npm run serve
```

## 构建与部署

### 构建打包

项目内置了多环境打包命令：

- **开发环境构建**：`npm run build:dev`
- **测试环境构建**：`npm run build:test`
- **生产环境构建**：`npm run build:prod`
- **标准生产构建（含类型检查）**：`npm run build`

### 生产部署流程

本项目采用直接拷贝打包产物至服务器的方式部署，具体流程如下：

1. 执行 `npm run build:prod` 获取生产环境打包产物。
2. 将生成的打包产物（默认为 `dist` 目录下的所有文件）直接拷贝至堡垒机对应的目标服务器上。
3. 服务器已配置 Nginx，将拷贝的文件放置于 Nginx 配置的 `html` 文件夹内的对应项目二级子目录下即可。

## 代码规范

完整规范请阅读 **[开发规范文档](./docs/rule.md)**
