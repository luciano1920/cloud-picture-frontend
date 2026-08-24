<template>
  <div id="auth-layout" :class="authLayoutBgClass">
    <a-layout style="min-height: 100vh; background: transparent !important">
      <a-layout-header class="header">
        <img src="../assets/images/logo.png" class="logo" />
        <span class="header-title">{{ systemTitle }}</span>
      </a-layout-header>

      <a-layout-content class="content">
        <RouterView v-slot="{ Component }">
          <Transition name="auth-content-animation" mode="out-in" appear>
            <component :is="Component" :key="$route.fullPath" />
          </Transition>
        </RouterView>
      </a-layout-content>

      <a-layout-footer class="footer">
        <a href="https://github.com/ant-design/ant-design-vue">Copyright © LJ5323</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme-store'

const systemTitle = import.meta.env.VITE_APP_SYSTEM_TITLE

const themeStore = useThemeStore()

// 根据主题模式切换背景图
const authLayoutBgClass = computed(() => {
  return themeStore.themeMode === 'light' ? 'light-theme' : 'dark-theme'
})
</script>

<style scoped>
#auth-layout.light-theme {
  background: url('../assets/images/bg_light.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
#auth-layout.dark-theme {
  background: url('../assets/images/bg_dark.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

#auth-layout .header {
  background: transparent;
  padding: 28px 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
#auth-layout .logo {
  width: 50px;
  height: 50px;
}
#auth-layout .header-title {
  font-size: 32px;
  font-family: 'YouSheBiaoTiHei';
  font-weight: 400;
}

#auth-layout .content {
  background-color: var(--auth-bg);
  backdrop-filter: blur(15px) saturate(100%);
  border: 2px solid var(--auth-border);
  border-radius: 16px;
  box-shadow: 0 0 20px 10px var(--auth-shadow);
  width: 450px;
  max-height: 600px;
  margin: 0 auto;
  padding: 60px 40px;
}

#auth-layout .footer {
  background: transparent;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 16px;
  text-align: center;
}

/* 内容区域淡入淡出动画 */
/*
 * Vue Transition 动画类说明：
 * .auth-content-animation-enter-active: 新内容进入时的动画
 * .auth-content-animation-leave-active: 旧内容离开时的动画
 * .auth-content-animation-enter-from: 新内容的初始状态（从哪里开始）
 * .auth-content-animation-leave-to: 旧内容的结束状态（离开到哪里）
 * .auth-content-animation-enter-to: 新内容的结束状态（到达哪里）
 * .auth-content-animation-leave-from: 旧内容的初始状态
 */
/*
 * transition 属性：
 * opacity: 透明度变化，过渡时间 0.5秒
 * transform: 位置变化，过渡时间 0.5秒
 * ease: 缓动函数，让动画开始和结束时较慢，中间较快
 */

/* 定义进入和离开动画的过渡效果 */
.auth-content-animation-enter-active {
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}

.auth-content-animation-leave-active {
  transition:
    opacity 0.5s ease-in,
    transform 0.5s ease-in;
}

/* 新内容进入前的初始状态：从s上方 30px 处开始，透明度为 0（完全透明） */
.auth-content-animation-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

/* 旧内容离开后的最终状态：向下方移动 30px 后消失，透明度为 0 */
.auth-content-animation-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 新内容进入后的最终状态：到达正常位置，透明度为 1 */
/* 旧内容离开前的初始状态：在正常位置，透明度为 1 */
.auth-content-animation-enter-to,
.auth-content-animation-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
