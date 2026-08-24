<template>
  <div id="add-picture-batch-page">
    <h2 style="margin-bottom: 16px">批量创建图片</h2>
    <!-- 图片信息表单 -->
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item name="searchText" label="关键词">
        <a-input v-model:value="formData.searchText" placeholder="请输入关键词" allow-clear />
      </a-form-item>

      <a-form-item name="namePrefix" label="名称前缀">
        <a-input
          v-model:value="formData.namePrefix"
          placeholder="请输入名称前缀，会自动补充序号"
          allow-clear
        />
      </a-form-item>

      <a-form-item name="count" label="抓取数量">
        <a-input-number
          v-model:value="formData.count"
          placeholder="请输入数量"
          style="min-width: 180px"
          :min="1"
          :max="30"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
          批量创建
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'antdv-next'
import { uploadPictureByBatchUsingPost } from '@/api/picture-controller'

const router = useRouter()

// 批量创建图片表单数据
const formData = reactive<API.PictureUploadByBatchRequest>({})
// 提交表单时loading状态
const loading = ref<boolean>(false)

/**
 * 提交表单
 * @param values 提交的表单formData
 */
const handleSubmit = async () => {
  loading.value = true

  const res = await uploadPictureByBatchUsingPost({ ...formData })
  // 提交成功
  if (res.data.code === 0 && res.data.data) {
    message.success(`图片批量创建成功，共 ${res.data.data} 张图片`)
    // 跳转到图库主页
    router.push({
      path: '/',
    })
  } else {
    message.error('图片批量创建失败' + res.data.message)
  }

  loading.value = false
}
</script>

<style scoped>
#add-picture-batch-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 20px;
}
</style>
