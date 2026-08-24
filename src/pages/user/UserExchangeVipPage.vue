<template>
  <div id="user-exchange-vip-page">
    <h2 style="margin-bottom: 16px">用户会员码兑换</h2>
    <!-- 图片信息表单 -->
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item name="vipCode" label="会员码">
        <a-input v-model:value="formData.vipCode" placeholder="请输入会员兑换码" allow-clear />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
          兑换
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'antdv-next'
import { exchangeVipUsingPost } from '@/api/user-controller'

const router = useRouter()

// 表单数据
const formData = reactive<API.VipExchangeRequest>({})
// 提交表单时loading状态
const loading = ref<boolean>(false)

/**
 * 提交表单
 * @param values 提交的表单formData
 */
const handleSubmit = async () => {
  loading.value = true

  const res = await exchangeVipUsingPost({ ...formData })
  // 提交成功
  if (res.data.code === 0 && res.data.data) {
    message.success(`兑换会员成功！`)
    // 跳转到图库主页
    router.push({
      path: '/',
    })
  } else {
    message.error('会员兑换失败，' + res.data.message)
  }

  loading.value = false
}
</script>

<style scoped>
#user-exchange-vip-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 20px;
}
</style>
