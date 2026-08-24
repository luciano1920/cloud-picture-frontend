<template>
  <div class="user-info-modal">
    <a-modal
      v-model:open="visible"
      width="400px"
      title="用户个人信息"
      :footer="false"
      @cancel="closeModal"
    >
      <div class="user-avatar">
        <a-image
          :width="150"
          :src="loginUser?.userAvatar"
          style="border-radius: 50%; border: 1px solid #ccc; padding: 3px"
        />
      </div>

      <!-- 用户信息描述列表 -->
      <a-descriptions
        :column="1"
        style="margin-left: 20px"
        :styles="{ label: { width: '80px', fontSize: '15px', fontWeight: 'bold' } }"
      >
        <a-descriptions-item label="用户名">
          {{ loginUser?.userName ?? '未命名' }}
        </a-descriptions-item>
        <a-descriptions-item label="简介">{{ loginUser?.userProfile ?? '-' }}</a-descriptions-item>
        <a-descriptions-item label="账号">{{ loginUser?.userAccount ?? '-' }}</a-descriptions-item>

        <a-descriptions-item label="角色">
          <a-tag :color="USER_ROLE_TAG_MAP[loginUser?.userRole ?? 'user']">
            {{ USER_ROLE_MAP[loginUser?.userRole ?? 'user'] }}
          </a-tag>
        </a-descriptions-item>

        <a-descriptions-item label="用户ID">{{ loginUser?.id ?? '-' }}</a-descriptions-item>
        <a-descriptions-item label="注册时间">
          {{ formatDate(loginUser?.createTime) ?? '-' }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { USER_ROLE_TAG_MAP, USER_ROLE_MAP } from '@/constants/user'
import { useUserStore } from '@/stores/user-store'
import { formatDate } from '@/utils/date'

const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)

const visible = ref<boolean>(false)

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

defineExpose({
  openModal,
})
</script>

<style scoped>
.user-avatar {
  text-align: center;
  margin-bottom: 20px;
}

.user-avatar :deep(.ant-image-mask) {
  border-radius: 50%;
}
</style>
