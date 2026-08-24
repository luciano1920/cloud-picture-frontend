<template>
  <div class="theme-status">
    <div
      class="theme-switch"
      @click="() => themeStore.toggleTheme()"
      :class="{ 'left-active': themeStore.themeMode === 'light' }"
    >
      <img :src="themeStore.themeMode === 'light' ? lightActive : lightBase" class="switch-icon" />
      <img :src="themeStore.themeMode === 'dark' ? darkActive : darkBase" class="switch-icon" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

import lightBase from '@/assets/svgs/light_base.svg'
import lightActive from '@/assets/svgs/light_active.svg'
import darkBase from '@/assets/svgs/dark_base.svg'
import darkActive from '@/assets/svgs/dark_active.svg'

import { useThemeStore } from '@/stores/theme-store'

const themeStore = useThemeStore()

/** 预加载所有图标，避免切换时重新加载 */
const preloadIcons = () => {
  const icons = [lightBase, lightActive, darkBase, darkActive]
  icons.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

// 组件挂载时初始化当前选中项
onMounted(() => {
  preloadIcons() // 预加载所有图标
})
</script>

<style scoped lang="scss">
.theme-status {
  display: flex;
  align-items: center;

  /* 主题切换开关样式 */
  .theme-switch {
    position: relative;
    display: inline-flex;
    background: var(--header-switch-bg);
    border-radius: 100vw;
    cursor: pointer;
    transition: all 0.3s;
    overflow: hidden;
    width: 64px;
    height: 32px;
    align-items: center;
    justify-content: space-between;

    /* 图标样式 */
    .switch-icon {
      position: relative;
      width: 32px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      transition: all 0.3s;
      font-size: 16px;
      padding: 6px;
      z-index: 2;
      flex-shrink: 0;
      object-fit: contain;
    }
  }

  /* 圆形滑块 - 默认在右侧（暗色主题） */
  .theme-switch::before {
    position: absolute;
    top: 0;
    left: calc(100% - 32px); /* 默认在右侧 */
    width: 32px;
    height: 32px;
    background: var(--header-switch-slider-bg);
    border-radius: 100vw;
    transition: all 0.3s;
    content: '';
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  /* 滑块在左侧 */
  .theme-switch.left-active::before {
    left: 0; /* 亮色主题时在左侧 */
  }
}
</style>
