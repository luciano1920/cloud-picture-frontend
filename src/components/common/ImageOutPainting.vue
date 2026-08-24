<template>
  <div class="image-out-painting">
    <a-modal
      v-model:open="visible"
      :title="props.title"
      @cancel="closeModal"
      :footer="null"
      :width="800"
    >
      <a-row gutter="16">
        <a-col span="12">
          <h4>原始图片</h4>
          <a-image :src="props.picture?.url" :alt="picture?.picName" />
        </a-col>

        <a-col span="12">
          <h4>扩图结果</h4>
          <a-image v-if="resultImageUrl" :src="resultImageUrl" :alt="picture?.picName" />
        </a-col>
      </a-row>

      <a-flex gap="16" justify="center" style="margin-top: 16px">
        <a-button type="primary" ghost @click="createTask" :loading="!!taskId">生成图片</a-button>
        <a-button
          v-if="resultImageUrl"
          type="primary"
          @click="handleUpload"
          :loading="uploadLoading"
        >
          应用结果
        </a-button>
      </a-flex>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
/// <reference types="node" />
import { onUnmounted, ref } from 'vue'
import { message } from 'antdv-next'
import {
  createPictureOutPaintingUsingPost,
  getPictureOutPaintingUsingGet,
  uploadPictureByUrlUsingPost,
} from '@/api/picture-controller'

interface Props {
  title?: string
  spaceId?: number
  picture?: API.PictureVO
  onSuccess?: (newPicture: API.PictureVO) => void
}
const props = withDefaults(defineProps<Props>(), {
  title: 'AI 扩图',
})
const visible = ref<boolean>(false)
const createLoading = ref<boolean>(false)
const uploadLoading = ref<boolean>(false)

// 任务ID，用于轮询，检查任务状态
const taskId = ref<string>()
// 轮询定时器
let pollingTimer: NodeJS.Timeout | null = null

// 生成结果图的URL
const resultImageUrl = ref<string>()

/** 创建任务 */
const createTask = async () => {
  if (!props.picture?.id) {
    return
  }
  createLoading.value = true
  const res = await createPictureOutPaintingUsingPost({
    pictureId: props.picture.id,
    // 根据需要设置扩图参数
    parameters: {
      xScale: 2,
      yScale: 2,
    },
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('创建任务成功，请耐心等待，不要退出界面~')
    // 保存任务ID
    taskId.value = res.data.data.output?.taskId
    // 开启轮询，检查任务状态
    startPolling()
  } else {
    message.error(res.data.message || '上传失败')
  }
  createLoading.value = false
}

/** 开始轮询 */
const startPolling = () => {
  if (!taskId.value) {
    return
  }

  pollingTimer = setInterval(async () => {
    try {
      const res = await getPictureOutPaintingUsingGet({ taskId: taskId.value })
      if (res.data.code === 0 && res.data.data) {
        const taskResult = res.data.data.output
        if (taskResult?.taskStatus === 'SUCCEEDED') {
          message.success('扩图任务执行完成')
          resultImageUrl.value = taskResult?.outputImageUrl
          // 清理轮询
          clearPolling()
        } else if (taskResult?.taskStatus === 'FAILED') {
          message.error('扩图任务执行失败')
          // 清理轮询
          clearPolling()
        }
      }
    } catch (error) {
      console.error('扩图任务轮询失败：', error)
      message.error('扩图任务轮询失败')
      // 清理轮询
      clearPolling()
    }
  }, 3000) // 每隔 3s 轮询一次
}

/** 结束轮询 */
const clearPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
    taskId.value = ''
  }
}

/**
 * 上传图片方法
 * @param file 上传的文件
 */
const handleUpload = async () => {
  uploadLoading.value = true
  const params: API.PictureUploadRequest = { fileUrl: resultImageUrl.value }
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
      // 关闭弹窗
      closeModal()
    } else {
      message.error(res.data.message || '上传失败')
    }
  } catch (error) {
    console.error('图片上传失败：', error)
  }
  uploadLoading.value = false
}

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

defineExpose({
  openModal,
})

onUnmounted(() => {
  clearPolling()
})
</script>

<style scoped></style>
