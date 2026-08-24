<template>
  <div id="global-sider">
    <a-layout-sider v-if="userStore.loginUser.id" width="200">
      <a-menu
        v-model:selectedKeys="current"
        mode="inline"
        @click="doMenuClick"
        :items="menuItems"
        class="sider-menu"
      />
    </a-layout-sider>
  </div>
</template>

<script lang="ts" setup>
import { ref, h, computed, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'antdv-next'
import { PictureOutlined, TeamOutlined, UserOutlined } from '@antdv-next/icons'
import { useUserStore } from '@/stores/user-store'
import { SPACE_TYPE_ENUM } from '@/constants/space'
import { listMyTeamSpaceUsingPost } from '@/api/space-user-controller'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 当前选中的菜单项
const current = ref<string[]>([])
// 固定菜单列表
const fixedMenuItems = [
  {
    key: '/',
    label: '公共图库',
    icon: () => h(PictureOutlined),
  },
  {
    key: '/my-space',
    label: '我的空间',
    icon: () => h(UserOutlined),
  },
  {
    key: '/add-space?type=' + SPACE_TYPE_ENUM.TEAM,
    label: '创建团队',
    icon: () => h(TeamOutlined),
  },
]

// 团队空间列表
const teamSpaceList = ref<API.SpaceUserVO[]>([])
// 动态菜单列表
const menuItems = computed(() => {
  // 如果没有团队空间，则只展示固定菜单项
  if (teamSpaceList.value.length === 0) {
    return fixedMenuItems
  }

  // 如果有团队空间，则将团队空间添加到“我的团队”菜单项的 children 中
  const teamSpaceSubMenus = teamSpaceList.value.map((spaceUser) => {
    const space = spaceUser.space
    return {
      key: '/space/' + spaceUser.spaceId,
      label: space?.spaceName,
    }
  })

  // 展示团队空间分组
  const teamSpaceMenuGroup = {
    type: 'group',
    label: '我的团队',
    key: 'team-space',
    children: teamSpaceSubMenus,
  }

  return [...fixedMenuItems, teamSpaceMenuGroup]
})

/** 加载团队空间列表 */
const fetchTeamSpaceList = async () => {
  const res = await listMyTeamSpaceUsingPost()
  if (res.data.code === 0 && res.data.data) {
    teamSpaceList.value = res.data.data
  } else {
    message.error('加载我的团队空间失败' + res.data.message)
  }
}

/**
 * 点击菜单项跳转
 * @param key 点击的菜单项
 */
const doMenuClick = ({ key }: { key: string }) => {
  router.push(key)
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

/** 监听变量，变量改变了才触发 */
watchEffect(() => {
  // 登录才加载团队空间列表
  if (userStore.loginUser?.id) {
    fetchTeamSpaceList()
  }
})

// 组件挂载时初始化当前选中项
onMounted(() => {
  current.value = [route.path]
})
</script>

<style scoped>
#global-sider .ant-layout-sider {
  background-color: var(--sider-bg);
  /* 父盒子一定要有固定高度 */
  height: 100vh;
  /* 让导航栏内容向上/下移动底部/头部高度+间距10px的距离 */
  padding-top: 74px;
  padding-bottom: 58px;
  /* overflow: auto; */
  position: fixed;
  left: 0;
}

.sider-menu {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  /* 设置滚动条的宽度为0 firefox兼容 */
  /* scrollbar-width: none; */
}

/* .sider-menu::-webkit-scrollbar {
  display: none;
} */
</style>
