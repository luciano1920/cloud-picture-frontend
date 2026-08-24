<template>
  <div id="global-header">
    <a-row :wrap="false">
      <a-col flex="200px">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="title-bar-logo" src="../../assets/images/logo.png" alt="logo" />
            <div class="title-bar-title">{{ appNameCN }}</div>
          </div>
        </RouterLink>
      </a-col>

      <a-col flex="auto">
        <a-menu
          v-model:selected-keys="current"
          mode="horizontal"
          @click="doMenuClick"
          :items="globalMenuItems"
        />
      </a-col>

      <!-- 用户信息操作栏 -->
      <a-col flex="580px" style="display: flex; align-items: center; gap: 24px">
        <!-- 全局搜索框 -->
        <a-input-search placeholder="搜索内容" allow-clear style="width: 200px" />
        <!-- 发布按钮 -->
        <a-button type="primary" class="linear-gradient-button">
          <template #icon>
            <PlusOutlined />
          </template>
          发布
        </a-button>
        <!-- 主题切换开关 -->
        <ThemeSwitch />
        <!-- 消息中心入口 -->
        <BellOutlined />
        <!-- 用户信息状态栏 -->
        <UserActions />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  HomeOutlined,
  SafetyCertificateOutlined,
  BellOutlined,
  PlusOutlined,
} from '@antdv-next/icons'

import ThemeSwitch from './ThemeSwitch.vue'
import UserActions from './UserActions.vue'

const appNameCN = import.meta.env.VITE_APP_NAME_CN

const router = useRouter()
const route = useRoute()

// 当前选中的菜单项
const current = ref<string[]>([])

const globalMenuItems = [
  {
    label: '主页',
    title: '主页',
    key: '/',
    icon: HomeOutlined,
  },
  {
    label: '论坛',
    title: '论坛',
    key: '/forum',
  },
  {
    label: '聊天',
    title: '聊天',
    key: '/chat',
  },
  {
    label: '管理中心',
    title: '管理中心',
    key: '/admin',
    icon: SafetyCertificateOutlined,
  },
]

/**
 * 点击菜单项跳转
 * @param key 点击的菜单项
 */
const doMenuClick = ({ key }: { key: string }) => {
  router.push({ path: key })
}

/**
 * @description 监听路由变化的钩子函数，用于更新当前选中的菜单项
 * @param to 路由信息
 * @param from 上一个路由信息
 * @param failure 失败回调函数
 */
router.afterEach((to) => {
  current.value = [to.path]
})

// 组件挂载时初始化当前选中项
onMounted(() => {
  current.value = [route.path]
})
</script>

<style scoped lang="scss">
.title-bar {
  display: flex;
  align-items: center;

  .title-bar-logo {
    height: 48px;
  }

  .title-bar-title {
    color: var(--header-text);
    font-size: 18px;
    font-weight: 600;
    margin-left: 16px;
  }
}

:deep(.ant-menu) {
  background: transparent;
  border-bottom: none;
}
</style>

<style>
/** 按钮渐变效果 */
.linear-gradient-button.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous) {
  position: relative;
}

.linear-gradient-button.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous) > span {
  position: relative;
}

.linear-gradient-button.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous)::before {
  content: '';
  background: linear-gradient(135deg, #6253e1, #04befe);
  position: absolute;
  inset: -1px;
  opacity: 1;
  transition: all 0.3s;
  border-radius: inherit;
}

.linear-gradient-button.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous):hover::before {
  opacity: 0;
}
</style>
