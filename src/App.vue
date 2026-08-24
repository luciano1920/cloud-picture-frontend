<template>
  <a-config-provider
    :locale="appLocale"
    :theme="themeConfig"
    :get-popup-container="getPopupContainer"
    :modal="{ mask: { blur: true } }"
  >
    <div id="app">
      <RouterView />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import zhCN from 'antdv-next/locale/zh_CN'
import type { ConfigProviderProps } from 'antdv-next'
import { theme } from 'antdv-next'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 引入 dayjs 的中文语言包

import { useThemeStore } from '@/stores/theme-store'

type Locale = ConfigProviderProps['locale']

const appLocale = ref<Locale>(zhCN) // 设置当前应用的语言环境
dayjs.locale('zh-cn') // 设置 dayjs 默认语言为中文

// 使用主题全局状态来管理主题模式
const themeStore = useThemeStore()

// 动态计算主题配置
const themeConfig = computed(() => {
  return {
    algorithm: themeStore.themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  }
})

/**
 * @description: 配置Ant Design Vue组件库的全局弹出框（Select, Tooltip, Menu 等等）渲染父节点，其默认渲染到 body 元素下
 * @param node 触发弹出框的元素节点
 * @return {*} 弹出框渲染的父节点
 */
const getPopupContainer = (node?: HTMLElement | null): HTMLElement => {
  if (node) {
    return node.parentNode as HTMLElement
  }
  return document.body
}
</script>
