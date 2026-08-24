/// <reference types="vite/client" />

declare module 'virtual:svg-icons-register'

interface ImportMetaEnv {
  // 应用基础配置
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_NAME_CN: string
  readonly VITE_APP_NAME_EN: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_SLOGAN: string
  readonly VITE_APP_VERSION: string

  // 默认主题模式
  readonly VITE_DEFAULT_THEME: 'light' | 'dark'

  // 开发配置
  readonly VITE_PORT: string
  readonly VITE_OPEN: string

  // 环境标识
  readonly VITE_DEV: string

  // API 配置
  readonly VITE_API_BASE_URL: string

  // 构建配置
  readonly VITE_DROP_DEBUGGER: string
  readonly VITE_DROP_CONSOLE: string
  readonly VITE_SOURCEMAP: string
  readonly VITE_BASE_PATH: string
  readonly VITE_OUT_DIR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
