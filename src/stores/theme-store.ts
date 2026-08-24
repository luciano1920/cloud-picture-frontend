import { ref, watch, computed } from 'vue'
import { defineStore } from 'pinia'

/** 主题类型定义 */
export type ThemeMode = 'light' | 'dark'

export interface Theme {
  header: {
    bg: string // 背景色
    text: string // 标题文字颜色
    switchBg: string // 主题切换开关背景色
    switchSliderBg: string // 主题切换滑块背景色
  }
  sider: {
    bg: string // 背景色
    border: string // 边框颜色
  }
  content: {
    bgGradientStart: string // 内容区域背景渐变起始色
    bgGradientEnd: string // 内容区域背景渐变结束色
  }
  footer: {
    bg: string // 背景色
  }
  auth: {
    bg: string // 背景色
    border: string // 边框颜色
    shadow: string // 阴影颜色
    inputBg: string // 输入框背景色
  }
}

// 亮色主题配置
export const lightTheme: Theme = {
  header: {
    bg: 'rgba(255, 255, 255, 0.6)',
    text: '#000000',
    switchBg: '#ebedf0',
    switchSliderBg: '#314659',
  },
  sider: {
    bg: '#ffffff',
    border: 'rgb(240, 240, 240)',
  },
  content: {
    bgGradientStart: '#fefefe',
    bgGradientEnd: '#ffffff',
  },
  footer: {
    bg: '#fcfcfc',
  },
  auth: {
    bg: 'rgba(255, 255, 255, 0.15)',
    border: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.15)',
    inputBg: 'rgba(255, 255, 255, 0.7)',
  },
}

// 暗色主题配置
export const darkTheme: Theme = {
  header: {
    bg: 'rgba(0, 0, 0, 0.6)',
    text: '#e8e8e8',
    switchBg: '#303030',
    switchSliderBg: '#314659',
  },
  sider: {
    bg: '#141414',
    border: 'rgba(43, 43, 43, 0.8)',
  },
  content: {
    bgGradientStart: '#1f1f1f',
    bgGradientEnd: '#141414',
  },
  footer: {
    bg: '#0f0f0f',
  },
  auth: {
    bg: 'rgba(20, 20, 20, 0.8)',
    border: 'rgba(43, 43, 43, 0.8)',
    shadow: 'rgba(128, 128, 128, 0.15)',
    inputBg: 'rgba(29, 30, 31, 0.7)',
  },
}

/**
 * 存储主题设置的状态
 */
export const useThemeStore = defineStore('theme', () => {
  const defaultTheme = (import.meta.env.VITE_DEFAULT_THEME as ThemeMode) || 'light'
  const savedTheme = localStorage.getItem('theme-mode') as ThemeMode | null
  const themeMode = ref<ThemeMode>(savedTheme || defaultTheme)

  // 当前主题配置（计算属性）
  const currentTheme = computed<Theme>(() => {
    return themeMode.value === 'dark' ? darkTheme : lightTheme
  })

  /**
   * 切换主题
   */
  function toggleTheme() {
    themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
  }

  /**
   * 应用主题到 DOM（更新 CSS 变量）
   */
  function applyThemeToDOM() {
    const root = document.documentElement
    const theme = currentTheme.value

    // GlobalHeader 区域
    root.style.setProperty('--header-bg', theme.header.bg)
    root.style.setProperty('--header-text', theme.header.text)
    root.style.setProperty('--header-switch-bg', theme.header.switchBg)
    root.style.setProperty('--header-switch-slider-bg', theme.header.switchSliderBg)
    // GlobalSider 区域
    root.style.setProperty('--sider-bg', theme.sider.bg)
    root.style.setProperty('--sider-border', theme.sider.border)
    // AdminLayout 区域
    root.style.setProperty('--content-bg-gradient-start', theme.content.bgGradientStart)
    root.style.setProperty('--content-bg-gradient-end', theme.content.bgGradientEnd)
    root.style.setProperty('--footer-bg', theme.footer.bg)
    // Auth 区域
    root.style.setProperty('--auth-bg', theme.auth.bg)
    root.style.setProperty('--auth-border', theme.auth.border)
    root.style.setProperty('--auth-shadow', theme.auth.shadow)
    root.style.setProperty('--auth-input-bg', theme.auth.inputBg)
  }

  // 监听主题变化，自动保存到 localStorage 并应用到 DOM
  watch(
    themeMode,
    (newMode) => {
      localStorage.setItem('theme-mode', newMode)
      applyThemeToDOM()
    },
    { immediate: true },
  )

  // 返回状态和方法
  return { themeMode, toggleTheme, applyThemeToDOM }
})
