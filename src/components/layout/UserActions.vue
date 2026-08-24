<template>
  <div class="user-actions">
    <div v-if="userStore.loginUser.id">
      <a-dropdown arrow placement="bottom">
        <a-space>
          <a-avatar v-if="userStore.loginUser.userRole === 'vip'" :src="vipImg" />
          <a-avatar :src="userStore.loginUser.userAvatar" />
          {{ userStore.loginUser.userName ?? '无名' }}
        </a-space>

        <template #popupRender>
          <a-menu>
            <a-menu-item key="1" @click="showUserInfo">
              <IdcardOutlined />
              个人信息
              <UserInfoModal ref="userInfoModalRef" />
            </a-menu-item>

            <a-menu-item key="2">
              <RouterLink to="/my-space">
                <UserOutlined />
                我的空间
              </RouterLink>
            </a-menu-item>

            <a-menu-item key="3" @click="handleLogout">
              <LogoutOutlined />
              退出登录
              <ContextModal />
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <div v-else>
      <a-button type="primary" href="/auth/login">登录</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'antdv-next'
import { LogoutOutlined, UserOutlined, IdcardOutlined } from '@antdv-next/icons'

import { userLogoutUsingPost } from '@/api/user-controller'
import { useUserStore } from '@/stores/user-store.ts'
// import avatarImg from '@/assets/images/avatar.png'
import vipImg from '@/assets/images/vip.png'
import UserInfoModal from './UserInfoModal.vue'

const router = useRouter()
const userStore = useUserStore()

const [modal, ContextModal] = Modal.useModal()

// 用户信息弹窗实例
const userInfoModalRef = ref()

/** 显示用户信息弹窗 */
const showUserInfo = () => {
  userInfoModalRef.value?.openModal()
}

/** 退出登录 */
const handleLogout = async () => {
  await modal.confirm({
    title: '退出登录',
    content: '确定要退出登录吗？',
    onOk: async () => {
      const res = await userLogoutUsingPost()
      if (res.data.code === 0) {
        userStore.setLoginUser({
          userName: '未登录',
        })
        message.success('退出登录成功')
        router.push('/auth/login')
      } else {
        message.error('退出登录失败' + res.data.message)
      }
    },
  })
}
</script>

<style scoped>
.user-actions {
  display: flex;
  align-items: center;
}
</style>
