<template>
  <div id="my-space-page">
    <p>正在跳转，请稍后......</p>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'antdv-next'

import { SPACE_TYPE_ENUM } from '@/constants/space'
import { useUserStore } from '@/stores/user-store'
import { listSpaceVoByPageUsingPost } from '@/api/space-controller'

const router = useRouter()
const userStore = useUserStore()

/** 检查用户是否有个人空间 */
const checkUserSpace = async () => {
  // 用户未登录，则跳转到登录页面
  const loginUser = userStore.loginUser
  if (!loginUser?.id) {
    message.error('请先登录')
    // 要使用replace，否则会跳转到登录页面后，再跳转回我的空间页面，形成死循环
    router.replace('/auth/login')
    return
  }

  // 如果用户已登录，获取该用户已创建的空间
  const res = await listSpaceVoByPageUsingPost({
    userId: loginUser.id,
    current: 1,
    pageSize: 1, // 只获取一条数据
    spaceType: SPACE_TYPE_ENUM.PRIVATE, // 只获取个人私有空间
  })
  if (res.data.code === 0 && res.data.data) {
    // 如果有已创建的空间，则默认进入第一个空间
    if (res.data.data?.records && res.data.data?.records?.length > 0) {
      const space = res.data.data.records[0]
      if (space) {
        router.replace(`/space/${space.id}`)
      }
    } else {
      // 如果没有已创建的空间，则跳转到创建空间页面
      router.replace('/add-space')
      message.warning('您还没有创建个人空间，请先创建一个')
    }
  } else {
    message.error('加载个人空间失败，' + res.data.message)
  }
}

// 在页面加载时，检查用户是否有个人空间
onMounted(() => {
  checkUserSpace()
})
</script>

<style scoped></style>
