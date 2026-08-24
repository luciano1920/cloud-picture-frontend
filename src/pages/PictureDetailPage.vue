<template>
  <div id="picture-detail-page">
    <a-row :gutter="[16, 16]">
      <!-- 图片预览 -->
      <a-col :sm="24" :md="16" :xl="18">
        <a-card title="图片预览" :styles="{ body: { textAlign: 'center' } }">
          <a-spin :spinning="loading" description="图片加载中...">
            <a-image :src="picture.url" style="max-height: 600px; object-fit: contain" />
          </a-spin>
        </a-card>
      </a-col>

      <!-- 图片信息编辑 -->
      <a-col :sm="24" :md="8" :xl="6">
        <a-card title="图片信息">
          <!-- 图片信息展示 -->
          <a-descriptions :column="1">
            <a-descriptions-item label="作者">
              <a-space>
                <a-avatar :src="picture.user?.userAvatar" :size="24" />
                <div>{{ picture.user?.userName }}</div>
              </a-space>
            </a-descriptions-item>

            <a-descriptions-item label="名称">
              {{ picture.picName ?? '未命名' }}
            </a-descriptions-item>

            <a-descriptions-item label="简介">
              {{ picture.introduction ?? '-' }}
            </a-descriptions-item>

            <a-descriptions-item label="分类">{{ picture.category ?? '默认' }}</a-descriptions-item>

            <a-descriptions-item label="标签">
              <a-tag v-for="tag in picture.tags" :key="tag">{{ tag }}</a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="格式">{{ picture.picFormat ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="宽度">{{ picture.picWidth ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="高度">{{ picture.picHeight ?? '-' }}</a-descriptions-item>
            <a-descriptions-item label="宽高比">{{ picture.picScale ?? '-' }}</a-descriptions-item>

            <a-descriptions-item label="大小">
              {{ formatSize(picture.picSize) }}
            </a-descriptions-item>

            <a-descriptions-item label="主色调">
              <a-space>
                {{ picture.picColor ?? '-' }}
                <div
                  v-if="picture.picColor"
                  :style="{
                    width: '16px',
                    height: '16px',
                    background: toHexColor(picture.picColor),
                  }"
                ></div>
              </a-space>
            </a-descriptions-item>
          </a-descriptions>

          <!-- 图片信息操作 -->
          <a-space wrap>
            <a-button v-if="canEdit" :icon="h(EditOutlined)" @click="doEdit">编辑</a-button>
            <a-button v-if="canDelete" :icon="h(DeleteOutlined)" danger @click="doDelete">
              删除
            </a-button>
            <a-button type="primary" @click="doDownload">
              免费下载
              <template #icon>
                <DownloadOutlined />
              </template>
            </a-button>
            <a-button type="primary" ghost :icon="h(ShareAltOutlined)" @click="doShare">
              分享图片
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>

    <!-- 分享图片弹窗 -->
    <ShareModal ref="shareModalRef" :title="'分享图片'" :link="shareLink" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'antdv-next'
import { DeleteOutlined, EditOutlined, DownloadOutlined, ShareAltOutlined } from '@antdv-next/icons'

import { deletePictureUsingPost, getPictureVoByIdUsingGet } from '@/api/picture-controller'
import { downloadImage, formatSize, toHexColor } from '@/utils'
import { SPACE_PERMISSION_ENUM } from '@/constants/space'
import ShareModal from '../components/common/ShareModal.vue'

interface Props {
  id: number
}
const props = defineProps<Props>()
const router = useRouter()

// 函数内部有变化的值，且返回值依赖该变化值的时候，将其定义为计算属性。判断是否有编辑权限
/**
 * 通用权限检查函数
 * @param permission 权限名称
 */
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (picture.value.permissionList ?? []).includes(permission)
  })
}

// 定义权限检查计算属性
const canEdit = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDelete = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)

const picture = ref<API.PictureVO>({})
const loading = ref<boolean>(false)
/** 获取图片详情 */
const fetchPictureDetail = async () => {
  loading.value = true
  try {
    const res = await getPictureVoByIdUsingGet({ id: props.id })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('获取图片详情失败 ' + res.data.message)
    }
  } catch (error: any) {
    message.error('获取图片详情失败 ' + error.message)
  } finally {
    loading.value = false
  }
}

/** 删除图片 */
const doDelete = async () => {
  const id = picture.value.id
  if (!id) {
    return
  }

  // 确认删除，弹出模态框
  Modal.confirm({
    title: '删除图片',
    content: `确定要删除图片 ${picture.value.picName} 吗？`,
    onOk: async () => {
      const res = await deletePictureUsingPost({ id })
      if (res.data.code === 0) {
        message.success('删除成功')
        fetchPictureDetail()
      } else {
        message.error('删除失败，' + res.data.message)
      }
    },
  })
}

/** 编辑图片 */
const doEdit = () => {
  // 跳转时要携带spaceId，不然获取不到空间信息
  router.push({
    path: '/add-picture',
    query: {
      id: picture.value.id,
      spaceId: picture.value.spaceId,
    },
  })
}

/** 处理下载 */
const doDownload = () => {
  // 调用工具函数处理下载
  downloadImage(picture.value.url, picture.value.picName)
}

// 定义分享图片链接
const shareLink = ref<string>('')
// 分享弹窗实例
const shareModalRef = ref()

/** 分享图片 */
const doShare = () => {
  // 获取分享链接
  shareLink.value = `${window.location.origin}/picture/${picture.value.id}`
  // shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.value.id}`
  // 打开分享弹窗
  shareModalRef.value?.openModal()
}

onMounted(() => {
  fetchPictureDetail()
})
</script>

<style scoped></style>
