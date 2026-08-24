<template>
  <div id="admin-header">
    <a-row :wrap="false" class="header-row">
      <!-- 折叠按钮 -->
      <a-col flex="80px">
        <a-button type="text" class="trigger-button" @click="handleToggleCollapsed">
          <template #icon>
            <MenuUnfoldOutlined v-if="collapsed" />
            <MenuFoldOutlined v-else />
          </template>
        </a-button>
      </a-col>

      <!-- 面包屑导航 -->
      <a-col flex="auto">
        <a-breadcrumb :items="breadcrumbItems" :params="breadcrumbParams">
          <template #itemRender="{ route, paths }">
            <RouterLink v-if="paths.length > 0" :to="`/${paths.join('/')}`">
              <component :is="route.icon" v-if="route.icon" style="margin-right: 4px" />
              {{ route.title }}
            </RouterLink>
          </template>
        </a-breadcrumb>
      </a-col>

      <!-- 用户信息操作栏 -->
      <a-col flex="500px" class="header-actions">
        <!-- 全局搜索框 -->
        <a-input-search placeholder="搜索内容" allow-clear style="width: 220px" />
        <!-- 主题切换开关 -->
        <ThemeSwitch />
        <!-- 用户操作栏 -->
        <UserActions />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@antdv-next/icons'

import ThemeSwitch from './ThemeSwitch.vue'
import UserActions from './UserActions.vue'

const route = useRoute()

interface Props {
  collapsed: boolean
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'collapse'): void
  (e: 'search', value: string): void
}>()

/** 处理折叠按钮点击 */
const handleToggleCollapsed = () => {
  emit('collapse')
}

/** 提取当前路由的动态参数，供面包屑组件自动替换占位符 */
const breadcrumbParams = computed(() => route.params)

/** 根据当前页面路由配置生成面包屑数据 */
const breadcrumbItems = computed(() => {
  const items: any[] = []

  if (!route.path.startsWith('/admin')) {
    return items
  }

  items.push({
    path: 'admin',
    title: '管理中心',
  })

  // 利用 route.matched 获取当前匹配的路由层级，跳过第一层 AdminLayout 本身
  const matchedRoutes = route.matched.slice(1)

  matchedRoutes.forEach((matched) => {
    items.push({
      path: matched.path.replace('/admin/', ''),
      title: matched.meta?.title || '未知页面',
      icon: matched.meta?.icon,
    })
  })

  return items
})
</script>

<style scoped lang="scss">
.header-row {
  display: flex;
  align-items: center;
}

.trigger-button {
  width: 64px;
  height: 64px;
  font-size: 18px;
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  margin-right: 24px;
}
</style>
