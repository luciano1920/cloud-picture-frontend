<template>
  <div id="add-picture-page">
    <h2 style="margin-bottom: 16px">{{ route.query?.id ? '编辑图片' : '创建图片' }}</h2>
    <!-- 如果有空间ID，展示要上传的对应空间 -->
    <a-typography-text v-if="spaceId" type="secondary">
      保存至空间：
      <a :href="`/space/${spaceId}`" target="_blank">{{ space?.spaceName }}</a>
    </a-typography-text>

    <!-- 选择上传图片的方式 -->
    <a-tabs v-model:active-key="uploadType">
      <a-tab-pane key="file" tab="文件上传">
        <!-- 图片文件上传组件 -->
        <PictureUpload :picture="picture" :space-id="spaceId" :on-success="onSuccess" />
      </a-tab-pane>
      <!-- force-render：在未进入这个标签页时强制渲染，一种懒加载方式，优化体验 -->
      <a-tab-pane key="url" tab="URL 上传" force-render>
        <!-- 图片URL上传组件 -->
        <UrlPictureUpload :picture="picture" :space-id="spaceId" :on-success="onSuccess" />
      </a-tab-pane>
    </a-tabs>

    <!-- 图片多功能编辑区域 -->
    <div v-if="picture" class="picture-edit-bar">
      <a-space>
        <a-button :icon="h(EditOutlined)" @click="editPicture">编辑图片</a-button>
        <a-button type="primary" :icon="h(FullscreenOutlined)" @click="paintingPicture">
          AI 扩图
        </a-button>
      </a-space>

      <!-- 图片裁切编辑组件 -->
      <ImageCropper
        ref="imageCropperRef"
        :image-url="picture?.url"
        :picture="picture"
        :space-id="spaceId"
        :space="space"
        :on-success="onCropSuccess"
      />
      <!-- AI 扩图组件 -->
      <ImageOutPainting
        ref="imageOutPaintingRef"
        :picture="picture"
        :space-id="spaceId"
        :on-success="onPaintingSuccess"
      />
    </div>

    <!-- 图片信息表单 -->
    <a-form v-if="picture" layout="vertical" :model="pictureForm" @finish="handleSubmit">
      <a-form-item name="picName" label="名称">
        <a-input v-model:value="pictureForm.picName" placeholder="请输入图片名称" allow-clear />
      </a-form-item>

      <a-form-item name="introduction" label="简介">
        <a-textarea
          v-model:value="pictureForm.introduction"
          placeholder="请输入图片简介"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          allow-clear
        />
      </a-form-item>

      <a-form-item name="category" label="分类">
        <a-auto-complete
          v-model:value="pictureForm.category"
          placeholder="请输入图片分类"
          :options="categoryOptions"
          allow-clear
        />
      </a-form-item>

      <a-form-item name="tags" label="标签">
        <a-select
          v-model:value="pictureForm.tags"
          mode="tags"
          placeholder="请输入图片标签"
          :options="tagsOptions"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">
          {{ route.query?.id ? '修改' : '创建' }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, h, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'antdv-next'
import { EditOutlined, FullscreenOutlined } from '@antdv-next/icons'
import {
  editPictureUsingPost,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryVoUsingGet,
} from '@/api/picture-controller'
import { getSpaceVoByIdUsingGet } from '@/api/space-controller'

import PictureUpload from '@/components/common/PictureUpload.vue'
import UrlPictureUpload from '@/components/common/UrlPictureUpload.vue'
import ImageCropper from '@/components/common/ImageCropper.vue'
import ImageOutPainting from '@/components/common/ImageOutPainting.vue'

const router = useRouter()
const route = useRoute()

// 空间ID，在指定空间新增图片时用到
const spaceId = computed(() => route.query?.spaceId as unknown as number)
const space = ref<API.SpaceVO>()
const picture = ref<API.PictureVO>()
const pictureForm = reactive<API.PictureEditRequest>({})
const uploadType = ref<'file' | 'url'>('file') // 上传图片的方式，文件上传或URL上传
// const tabItems = [
//   { key: 'file', label: '文件上传' },
//   { key: 'url', label: 'URL上传' },
// ]

// 图片分类和标签选项
interface Option {
  value: string
  label: string
}
const categoryOptions = ref<Option[]>([])
const tagsOptions = ref<Option[]>([])

/** 获取标签分类选项 */
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryVoUsingGet()
  if (res.data.code === 0 && res.data.data) {
    categoryOptions.value = (res.data.data.categoryList ?? []).map((item: string) => {
      return {
        value: item,
        label: item,
      }
    })
    tagsOptions.value = (res.data.data.tagList ?? []).map((item: string) => {
      return {
        value: item,
        label: item,
      }
    })
  } else {
    message.error('获取标签分类选项失败' + res.data.message)
  }
}

// 图片裁剪编辑器组件引用
const imageCropperRef = ref()

/** 调用裁剪编辑器编辑图片 */
const editPicture = () => {
  imageCropperRef.value?.openModal()
}

/**
 * 裁剪图片成功的回调函数
 * @param newPicture 新的图片信息
 */
const onCropSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

// AI 扩图组件引用
const imageOutPaintingRef = ref()

/** 调用编辑器编辑图片 */
const paintingPicture = () => {
  imageOutPaintingRef.value?.openModal()
}

/**
 * AI 扩图成功的回调函数
 * @param newPicture 新的图片信息
 */
const onPaintingSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

/**
 * 上传图片成功的回调函数
 * @param newPicture 新的图片信息
 */
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  // 上传图片后，将返回的图片信息回填到表单中
  pictureForm.picName = newPicture.picName
}

/** 获取已上传的图片信息 */
const getOldPicture = async () => {
  // 获取到图片id
  const pictureId = route.query?.id as unknown as number
  // 编辑状态下有查询参数图片id，则先获取已有的图片信息
  if (pictureId) {
    const res = await getPictureVoByIdUsingGet({ id: pictureId })
    if (res.data.code === 0 && res.data.data) {
      const oldPicture = res.data.data
      picture.value = oldPicture
      pictureForm.picName = oldPicture.picName
      pictureForm.introduction = oldPicture.introduction
      pictureForm.category = oldPicture.category
      pictureForm.tags = oldPicture.tags
    }
  }
}

/** 获取图片所在的空间信息 */
const fetchSpace = async () => {
  if (spaceId.value) {
    const res = await getSpaceVoByIdUsingGet({ id: spaceId.value })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    }
  }
}

/**
 * 提交表单
 * @param values 提交的表单pictureForm
 */
const handleSubmit = async (values: any) => {
  const pictureId = picture.value?.id
  if (!pictureId) {
    return
  }

  const res = await editPictureUsingPost({
    id: pictureId,
    spaceId: spaceId.value,
    ...values,
  })
  // 提交成功
  if (res.data.code === 0 && res.data.data) {
    message.success('图片' + (route.query?.id ? '编辑' : '创建') + '成功')
    // 跳转到图片详情页
    router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('图片' + (route.query?.id ? '编辑' : '创建') + '失败，' + res.data.message)
  }
}

onMounted(() => {
  getOldPicture()
  fetchSpace()
  getTagCategoryOptions()
})

watchEffect(() => {
  fetchSpace()
})
</script>

<style scoped>
#add-picture-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 20px;
}

#add-picture-page .picture-edit-bar {
  margin: 8px 0;
  text-align: center;
}
</style>
