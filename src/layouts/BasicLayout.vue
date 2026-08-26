<template>
  <a-layout class="basic-layout">
    <a-layout-header class="basic-layout-header">
      <GlobalHeader />
    </a-layout-header>

    <a-layout-content class="basic-layout-content">
      <RouterView v-slot="{ Component }">
        <Transition name="basic-content-animation" mode="out-in" appear>
          <component :is="Component" :key="$route.fullPath" />
        </Transition>
      </RouterView>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/layout/GlobalHeader.vue'
</script>

<style scoped lang="scss">
.basic-layout {
  min-height: 100vh;

  :deep(.ant-menu-inline) {
    border-inline-end: none;
  }

  .basic-layout-header {
    background: var(--header-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: unset;
    padding-inline: 10vw;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 100;
  }

  .basic-layout-content {
    background: linear-gradient(
      to right,
      var(--content-bg-gradient-start),
      var(--content-bg-gradient-end)
    );
    height: 100vh;
    padding: 92px 260px 56px;
    width: 100%;
    overflow-y: auto;
  }
}

// ------------------ 动画 ------------------

/* 定义进入和离开动画的过渡效果 */
.basic-content-animation-enter-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.basic-content-animation-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

/* 新内容进入前的初始状态：从左侧 30px 处开始，透明度为 0（完全透明） */
.basic-content-animation-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

/* 旧内容离开后的最终状态：向右侧移动 30px 后消失，透明度为 0 */
.basic-content-animation-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 新内容进入后的最终状态：到达正常位置，透明度为 1*/
/* 旧内容离开前的初始状态：在正常位置，透明度为 1 */
.basic-content-animation-enter-to,
.basic-content-animation-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
