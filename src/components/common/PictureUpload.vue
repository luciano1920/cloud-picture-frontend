<template>
  <div class="picture-upload">
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :custom-request="handleUpload"
      :before-upload="beforeUpload"
    >
      <img v-if="props.picture?.url" :src="props.picture?.url" alt="avatar" />
      <div v-else>
        <LoadingOutlined v-if="loading" />
        <PlusOutlined v-else />
        <div class="ant-upload-text">点击或拖拽上传图片</div>
      </div>
    </a-upload>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'antdv-next'
import type { UploadFile } from 'antdv-next'
import { PlusOutlined, LoadingOutlined } from '@antdv-next/icons'
import { uploadPictureUsingPost } from '@/api/picture-controller'

// 定义props
interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}
const props = defineProps<Props>()

// 定义loading状态
const loading = ref<boolean>(false)

/**
 * 上传前的校验
 * @param file 上传的文件
 */
const beforeUpload = (file: UploadFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('不支持上传该格式的图片，推荐 .jpg 或 .png 格式')
  }
  const isLt8M = (file.size ?? 0) / 1024 / 1024 < 8
  if (!isLt8M) {
    message.error('不能上传超过 8MB 的图片')
  }
  return isJpgOrPng && isLt8M
}

/**
 * 上传图片方法
 * @param file 上传的文件
 */
const handleUpload = async ({ file }: any) => {
  loading.value = true
  const params: API.uploadPictureUsingPOSTParams = props.picture ? { id: props.picture.id } : {}
  params.spaceId = props.spaceId

  try {
    const res = await uploadPictureUsingPost(params, {}, file)
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
.picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-width: 152px;
  min-height: 152px;
}
.picture-upload img {
  max-width: 100%;
  max-height: 480px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
