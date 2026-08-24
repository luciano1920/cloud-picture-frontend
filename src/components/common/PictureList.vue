<template>
  <div class="picture-list">
    <!-- 图片列表 -->
    <a-masonry :columns="4" :gutter="16" :items="masonryItems">
      <template #itemRender="{ data: picture }">
        <!-- 单张图片 -->
        <a-card hoverable @click="doClickPicture(picture)">
          <template #cover>
            <a-image
              :alt="picture.picName"
              :src="picture.thumbnailUrl ?? picture.url"
              style="min-height: 180px; max-height: 480px; object-fit: cover"
            />
          </template>

          <template v-if="showOperation" #actions>
            <a-space @click="(e: any) => doShare(picture, e)">
              分享
              <ShareAltOutlined />
            </a-space>
            <a-space @click="(e: any) => doSearch(picture, e)">
              搜索
              <SearchOutlined />
            </a-space>
            <a-space v-if="props.canEdit" @click="(e: any) => doEdit(picture, e)">
              编辑
              <EditOutlined />
            </a-space>
            <a-space v-if="props.canDelete" @click="(e: any) => doDelete(picture, e)">
              删除
              <DeleteOutlined />
            </a-space>
          </template>

          <a-card-meta>
            <template #title>
              {{ picture.picName }}
              <a-tag color="green">{{ picture.category ?? '默认' }}</a-tag>
            </template>

            <template #description>
              <a-flex>
                <a-tag v-for="tag in picture.tags" :key="tag">{{ tag }}</a-tag>
              </a-flex>
            </template>
          </a-card-meta>
        </a-card>
      </template>
    </a-masonry>

    <!-- 分享图片弹窗 -->
    <ShareModal ref="shareModalRef" :title="'分享图片'" :link="shareLink" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'antdv-next'
import { EditOutlined, DeleteOutlined, SearchOutlined, ShareAltOutlined } from '@antdv-next/icons'
import { deletePictureUsingPost } from '@/api/picture-controller'
import ShareModal from './ShareModal.vue'
import type { MasonryItemType } from 'antdv-next/dist/masonry/MasonryItem'

// 图片展示列表相关数据接收参数定义
interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOperation?: boolean
  canEdit?: boolean
  canDelete?: boolean
  reload?: () => void
}
const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOperation: false,
  canEdit: false,
  canDelete: false,
})

const router = useRouter()

const masonryItems = computed<MasonryItemType[]>(() => {
  return props.dataList.map((item, index) => {
    return {
      key: `item-${index}`,
      data: item,
    }
  })
})

/**
 * 点击图片跳转至图片详情页面
 * @param picture 点击的图片信息
 */
const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}

/**
 * 编辑图片
 * @param picture 点击的图片信息
 * @param e 事件对象
 */
const doEdit = (picture: API.PictureVO, e: any) => {
  // 点击卡片的操作栏编辑时要阻止事件冒泡
  e.stopPropagation()

  // 跳转时要携带spaceId，不然获取不到空间信息
  router.push({
    path: '/add-picture',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

/**
 * 处理删除图片
 * @param picture 点击的图片信息
 * @param e 事件对象
 */
const doDelete = async (picture: API.PictureVO, e: any) => {
  // 点击卡片的操作栏删除时要阻止事件冒泡
  e.stopPropagation()

  const id = picture.id
  if (!id) {
    return
  }

  // 确认删除，弹出模态框
  Modal.confirm({
    title: '删除图片',
    content: `确定要删除图片 ${picture.picName} 吗？`,
    onOk: async () => {
      const res = await deletePictureUsingPost({ id })
      if (res.data.code === 0) {
        message.success('删除成功')
        // 调用重新加载函数
        props?.reload?.()
      } else {
        message.error('删除失败，' + res.data.message)
      }
    },
  })
}

/**
 * 搜索图片
 * @param picture 点击的图片信息
 * @param e 事件对象
 */
const doSearch = (picture: API.PictureVO, e: any) => {
  // 点击卡片的操作栏编辑时要阻止事件冒泡
  e.stopPropagation()

  // 跳转到以图搜图页面
  router.push({
    path: '/search-picture',
    query: {
      pictureId: picture.id,
    },
  })
}

// 定义分享图片链接
const shareLink = ref<string>('')
// 分享弹窗实例
const shareModalRef = ref()

/**
 * 分享图片
 * @param picture 点击的图片信息
 * @param e 事件对象
 */
const doShare = (picture: API.PictureVO, e: any) => {
  // 点击卡片的操作栏编辑时要阻止事件冒泡
  e.stopPropagation()

  // 获取分享链接
  shareLink.value = `${window.location.origin}/picture/${picture.id}`
  // shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  // 打开分享弹窗
  shareModalRef.value?.openModal()
}
</script>

<style scoped></style>
