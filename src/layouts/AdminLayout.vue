<template>
  <a-layout class="admin-layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      :trigger="null"
      class="admin-layout-sider"
    >
      <!-- 侧边栏 logo 标题 -->
      <RouterLink to="/">
        <div class="title-bar">
          <img class="title-bar-logo" src="@/assets/images/logo.png" alt="logo" />
          <div class="title-bar-title" v-show="!collapsed">管理中心</div>
        </div>
      </RouterLink>
      <!-- 侧边栏菜单 -->
      <a-menu
        v-model:selectedKeys="current"
        :open-keys="openKeys"
        mode="inline"
        :items="filteredMenus"
        :styles="{ root: { border: 'unset' } }"
        @click="doMenuClick"
        @open-change="onMenuOpenChange"
      />
    </a-layout-sider>

    <a-layout :style="{ marginLeft: collapsed ? '80px' : '200px' }">
      <a-layout-header class="admin-layout-header">
        <AdminHeader
          :collapsed="collapsed"
          @collapse="toggleCollapsed"
          :style="{ width: collapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 200px)' }"
        />
      </a-layout-header>

      <a-layout-content class="admin-layout-content">
        <RouterView v-slot="{ Component }">
          <Transition name="admin-content-animation" mode="out-in" appear>
            <component :is="Component" :key="$route.fullPath" />
          </Transition>
        </RouterView>
      </a-layout-content>

      <a-layout-footer class="admin-layout-footer">
        <a href="https://github.com/luciano1920">Copyright © LJ5323</a>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute, type RouteRecordRaw } from 'vue-router'

import { routes } from '@/router/routes'
import { useUserStore } from '@/stores/user-store.ts'
import { checkAccess } from '@/utils/auth.ts'
import AdminHeader from '@/components/layout/AdminHeader.vue'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 侧边栏折叠状态
const collapsed = ref(false)

/** 侧边栏折叠状态切换 */
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

// 当前选中的菜单项
const current = ref<string[]>([])
// 当前展开的父级菜单（受控）
const openKeys = ref<string[]>([])

/**
 * 拼接路由路径，处理多余的斜杠
 * @param parent 父级路径
 * @param child 子级路径
 */
const joinRoutePath = (parent: string, child: string) => {
  return `${parent}/${child}`.replace(/\/{2,}/g, '/')
}

/**
 * 根据当前登录用户权限过滤菜单
 * @param routes 全局路由列表
 * @return 过滤后的路由列表
 */
const filterRoutes = (routes: RouteRecordRaw[]) => {
  return routes.filter((route) => {
    if (route.meta?.show === false) {
      return false
    }
    return checkAccess(userStore.loginUser, route.meta?.access as string)
  })
}

/**
 * 递归把路由映射成 Menu 的 items 结构
 * @param routeList 路由列表
 * @param parentPath 父级路径
 */
const buildMenuItems = (routeList: RouteRecordRaw[], parentPath: string) => {
  return filterRoutes(routeList).map((route) => {
    const fullPath = joinRoutePath(parentPath, route.path)
    const base = {
      key: fullPath,
      label: route.name,
      title: route.name, // 折叠时 tooltip 用
      icon: route.meta?.icon,
    }
    // 有可见子路由时递归生成 children，否则作为叶子菜单项
    const children: any[] = route.children?.length ? buildMenuItems(route.children, fullPath) : []
    return children.length ? { ...base, children } : base
  })
}

/**
 * 过滤后的路由列表映射的菜单
 * @return 过滤后的路由列表映射的菜单
 */
const filteredMenus = computed(() => {
  // 找到 AdminLayout 路由
  const adminRoute = routes.find((route) => route.name === 'AdminLayout')

  // 如果 AdminLayout 存在且有 children，则使用其 children 生成菜单
  if (adminRoute?.children) {
    return buildMenuItems(adminRoute.children, adminRoute.path)
  }
  // 默认返回空菜单
  return []
})

/**
 * 手风琴模式实现
 * @param keys 变化后的完整 openKeys 数组
 */
const onMenuOpenChange = (keys: string[]) => {
  const latest = keys.find((k) => !openKeys.value.includes(k))
  openKeys.value = latest ? [latest] : []
}

/** 根据当前路由初始化/同步选中项与展开项 */
const syncMenuState = () => {
  current.value = [route.path]
  // 如果当前路由命中某个子菜单，则展开它的父级
  const parent = filteredMenus.value.find((menu: any) =>
    menu.children?.some((c: any) => c.key === route.path),
  )
  openKeys.value = parent ? [parent.key] : []
}

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
router.afterEach(() => {
  syncMenuState()
})

// 组件挂载时初始化当前选中项
onMounted(() => {
  syncMenuState()
})
</script>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;

  .admin-layout-sider {
    background-color: var(--sider-bg);
    border-right: 1px solid var(--sider-border);
    height: 100vh;
    overflow: auto;
    position: fixed;
    z-index: 100;

    .title-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 64px;

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
  }

  .admin-layout-header {
    background: var(--header-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: unset;
    padding-inline: 0;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
    position: fixed;
    z-index: 100;
  }

  .admin-layout-content {
    background: linear-gradient(
      to right,
      var(--content-bg-gradient-start),
      var(--content-bg-gradient-end)
    );
    padding: 24px;
    margin-top: 64px;
    min-height: calc(100vh - 128px); // 减去头部和页脚高度
    overflow: auto; // 内容区域可滚动
  }

  .admin-layout-footer {
    background: var(--footer-bg);
    text-align: center;
  }
}

// ------------------ 动画 ------------------

/* 定义进入和离开动画的过渡效果 */
.admin-content-animation-enter-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.admin-content-animation-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

/* 新内容进入前的初始状态：从左侧 30px 处开始，透明度为 0（完全透明） */
.admin-content-animation-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

/* 旧内容离开后的最终状态：向右侧移动 30px 后消失，透明度为 0 */
.admin-content-animation-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 新内容进入后的最终状态：到达正常位置，透明度为 1*/
/* 旧内容离开前的初始状态：在正常位置，透明度为 1 */
.admin-content-animation-enter-to,
.admin-content-animation-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
