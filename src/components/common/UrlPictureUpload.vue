<template>
  <div class="url-picture-upload">
    <a-space-compact block>
      <a-input
        v-model:value="fileUrl"
        style="width: calc(100% - 120px)"
        placeholder="请输入图片URL"
      />
      <a-button type="primary" style="width: 120px" :loading="loading" @click="handleUpload">
        提交
      </a-button>
    </a-space-compact>

    <!-- 上传后的图片展示 -->
    <div class="img-wrapper">
      <img v-if="props.picture?.url" :src="props.picture?.url" alt="avatar" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'antdv-next'
import { uploadPictureByUrlUsingPost } from '@/api/picture-controller'

// 定义props
interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}
const props = defineProps<Props>()

// 定义要上传的图片url
const fileUrl = ref<string>()
// 定义loading状态
const loading = ref<boolean>(false)

/**
 * 上传图片方法
 * @param file 上传的文件
 */
const handleUpload = async () => {
  loading.value = true
  const params: API.PictureUploadRequest = { fileUrl: fileUrl.value }
  params.spaceId = props.spaceId

  if (props.picture) {
    params.id = props.picture.id
  }

  try {
    const res = await uploadPictureByUrlUsingPost(params)
    if (res.data.code === 0 && res.data.data) {
      message.success('上传成功')
      // 将上传成功的信息（picture的相关信息）传递给父页面
      props.onSuccess?.(res.data.data)
    } else {
      message.error(res.data.message || '上传失败')
    }
  } catch (error) {
    console.error('图片上传失败：', error)
  }
  loading.value = false
}
</script>

<style scoped>
.url-picture-upload {
  margin-bottom: 16px;
}

.url-picture-upload img {
  max-width: 100%;
  max-height: 480px;
}

.url-picture-upload .img-wrapper {
  margin-top: 16px;
  text-align: center;
}
</style>
