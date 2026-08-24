<template>
  <div class="image-cropper">
    <a-modal
      v-model:open="visible"
      :title="props.title"
      @cancel="closeModal"
      @ok="handleComfirm"
      :confirm-loading="confirmLoading"
      :styles="{ body: { marginBottom: '130px', height: '400px', textAlign: 'center' } }"
    >
      <!-- 比例选择 -->
      <div class="aspect-ratio-selector">
        <a-radio-group v-model:value="aspectRatio" button-style="solid">
          <a-radio-button value="free">自由比例</a-radio-button>
          <a-radio-button value="1:1">1:1</a-radio-button>
          <a-radio-button value="4:3">4:3</a-radio-button>
          <a-radio-button value="16:9">16:9</a-radio-button>
          <a-radio-button value="3:4">3:4</a-radio-button>
          <a-radio-button value="9:16">9:16</a-radio-button>
        </a-radio-group>
      </div>

      <!-- 图片裁切框组件 -->
      <vue-cropper
        ref="cropperRef"
        :img="props.imageUrl"
        :auto-crop="true"
        :fixed-box="false"
        :center-box="true"
        :can-move-box="true"
        :info="true"
        output-type="png"
        :fixed="aspectRatio !== 'free'"
        :fixed-number="currentAspectRatio"
      />

      <!-- 协同编辑操作 -->
      <div class="image-edit-actions" v-if="isTeamSpace">
        <a-space>
          <a-button v-if="editingUser" disabled>{{ editingUser.userName }} 正在编辑</a-button>
          <a-button v-if="canEnterEdit" type="primary" ghost @click="enterEdit">进入编辑</a-button>
          <a-button v-if="canExitEdit" danger ghost @click="exitEdit">退出编辑</a-button>
        </a-space>
      </div>

      <!-- 图片操作 -->
      <div class="image-cropper-actions">
        <a-space>
          <a-button @click="rotateLeft" :disabled="!canEdit">向左旋转</a-button>
          <a-button @click="rotateRight" :disabled="!canEdit">向右旋转</a-button>
          <a-button @click="changeScale(1)" :disabled="!canEdit">放大</a-button>
          <a-button @click="changeScale(-1)" :disabled="!canEdit">缩小</a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import { message } from 'antdv-next'

import { uploadPictureUsingPost } from '@/api/picture-controller'
import { useUserStore } from '@/stores/user-store'
import PictureEditWebSocket from '@/utils/edit-websocket'
import { PICTURE_EDIT_ACTION_ENUM, PICTURE_EDIT_MESSAGE_TYPE_ENUM } from '@/constants/picture'
import { SPACE_TYPE_ENUM } from '@/constants/space'

interface Props {
  imageUrl?: string
  title?: string
  picture?: API.PictureVO
  spaceId?: number
  space?: API.SpaceVO
  onSuccess?: (newPicture: API.PictureVO) => void
}
const props = withDefaults(defineProps<Props>(), {
  title: '图片裁剪',
})
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)

// 宽高比选项，默认为自由比例
const aspectRatio = ref('free')
/**
 * 当前宽高比的计算属性
 * @returns [width, height] 宽高比
 */
const currentAspectRatio = computed(() => {
  if (aspectRatio.value === 'free') return [0, 0]
  const [width, height] = aspectRatio.value.split(':').map(Number)
  return [width, height]
})

// 编辑器组件的引用
const cropperRef = ref()

/** 向左旋转 */
const rotateLeft = () => {
  cropperRef.value?.rotateLeft()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT)
}

/** 向右旋转 */
const rotateRight = () => {
  cropperRef.value?.rotateRight()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT)
}

/**
 * 缩放比例
 * @param num 放大或缩小的倍数
 */
const changeScale = (num: number) => {
  cropperRef.value?.changeScale(num)
  if (num > 0) editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_IN)
  else editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT)
}

/** 确认裁切图片 */
const handleComfirm = () => {
  cropperRef.value?.getCropBlob((blob: Blob) => {
    const fileName = (props.picture?.picName || 'image') + '.png'
    const file = new File([blob], fileName, { type: blob.type })
    handleUpload({ file })
    closeModal()
  })
}

/**
 * 上传图片方法
 * @param file 上传的文件
 */
const handleUpload = async ({ file }: any) => {
  confirmLoading.value = true
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
  confirmLoading.value = false
}

const openModal = () => {
  aspectRatio.value = 'free'
  visible.value = true
}

const closeModal = () => {
  visible.value = false
  // 断开连接
  if (websocket) {
    websocket.disconnect()
  }
  editingUser.value = undefined
}

defineExpose({
  openModal,
})

// ----------------- 实时编辑功能模块 -----------------
const isTeamSpace = computed(() => {
  return props.space?.spaceType === SPACE_TYPE_ENUM.TEAM
})

const userStore = useUserStore()
const loginUser = userStore.loginUser
// 正在编辑的用户
const editingUser = ref<API.UserVO>()
// 当前用户是否可进入编辑（如果没有正在编辑的用户，才可以进入编辑）
const canEnterEdit = computed(() => {
  return !editingUser.value
})
// 当前用户是否可退出编辑（如果正在编辑的用户是当前用户，才可以退出编辑）
const canExitEdit = computed(() => {
  return editingUser.value?.id === loginUser.id
})
// 是否可点击编辑图片的操作按钮（如果正在编辑的用户是当前用户，才可以编辑）
const canEdit = computed(() => {
  // 如果不是团队空间，则默认可编辑
  if (!isTeamSpace.value) {
    return true
  }
  return editingUser.value?.id === loginUser.id
})

let websocket: PictureEditWebSocket | null

/** 初始化 WebSocket 连接，绑定事件 */
const initWebsocket = () => {
  const pictureId = props.picture?.id
  console.log('pictureId', pictureId)
  if (!pictureId || !visible.value) return

  // 防止之前的连接未释放
  if (websocket) {
    websocket.disconnect()
  }
  // 创建 WebSocket 实例
  websocket = new PictureEditWebSocket(pictureId)
  // 建立 WebSocket 连接
  websocket.connect()

  // 监听通知消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.INFO, (msg) => {
    console.log('收到通知消息', msg)
    message.info(msg.message)
  })

  // 监听错误消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ERROR, (msg) => {
    console.log('收到错误消息', msg)
    message.info(msg.message)
  })

  // 监听进入编辑状态消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT, (msg) => {
    console.log('收到进入编辑状态消息', msg)
    message.info(msg.message)
    editingUser.value = msg.user
  })

  // 监听编辑操作消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION, (msg) => {
    console.log('收到编辑操作消息', msg)
    message.info(msg.message)
    switch (msg.editAction) {
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT:
        cropperRef.value?.rotateLeft()
        break
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT:
        cropperRef.value?.rotateRight()
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_IN:
        cropperRef.value?.changeScale(1)
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT:
        cropperRef.value?.changeScale(-1)
        break
    }
  })

  // 监听退出编辑状态消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT, (msg) => {
    console.log('收到退出编辑状态消息', msg)
    message.info(msg.message)
    editingUser.value = undefined
  })
}

/** 进入编辑状态 */
const enterEdit = () => {
  if (websocket) {
    // 发送进入编辑状态的消息
    websocket.sendMessage({ type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT })
  }
}

/** 退出编辑状态 */
const exitEdit = () => {
  if (websocket) {
    // 发送退出编辑状态的消息
    websocket.sendMessage({ type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT })
  }
}

/**
 * 编辑图片操作
 * @param action 编辑操作
 */
const editAction = (action: string) => {
  if (websocket) {
    // 发送编辑操作的请求
    websocket.sendMessage({ type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION, editAction: action })
  }
}

// 团队空间才初始化
watchEffect(() => {
  if (isTeamSpace.value) {
    initWebsocket()
  }
})

onUnmounted(() => {
  // 断开连接
  if (websocket) {
    websocket.disconnect()
  }
  editingUser.value = undefined
})
</script>

<style scoped>
.aspect-ratio-selector {
  margin-bottom: 8px;
}

.image-edit-actions {
  margin-top: 8px;
}

.image-cropper-actions {
  margin-top: 8px;
}
</style>
