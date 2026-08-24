<template>
  <div id="search-picture-page">
    <h2 style="margin-bottom: 16px">以图搜图</h2>
    <h3 style="margin-bottom: 16px">原图</h3>

    <!-- 单张图片 -->
    <a-card hoverable style="width: 240px">
      <template #cover>
        <a-image
          :alt="picture.picName"
          :src="picture.thumbnailUrl ?? picture.url"
          style="height: 180px; object-fit: cover"
        />
      </template>
    </a-card>

    <h3 style="margin: 16px 0">识图结果</h3>
    <!-- 图片结果列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <!-- 用一个 a 标签来进行跳转到搜索到的图片源网址 -->
        <a :href="picture.fromUrl" target="_blank">
          <a-list-item style="padding: 0">
            <!-- 单张图片 -->
            <a-card hoverable>
              <template #cover>
                <a-image
                  :alt="picture.picName"
                  :src="picture.thumbUrl ?? picture.url"
                  style="height: 180px; object-fit: cover"
                />
              </template>
            </a-card>
          </a-list-item>
        </a>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'antdv-next'
import { getPictureVoByIdUsingGet, searchPictureByPictureUsingPost } from '@/api/picture-controller'

const route = useRoute()
const pictureId = computed(() => route.query?.pictureId as unknown as number)
const picture = ref<API.PictureVO>({})

/** 获取图片详情 */
const fetchPictureDetail = async () => {
  try {
    const res = await getPictureVoByIdUsingGet({ id: pictureId.value })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('获取图片详情失败 ' + res.data.message)
    }
  } catch (error: any) {
    message.error('获取图片详情失败 ' + error.message)
  }
}

// 以图搜图的结果列表
const dataList = ref<API.ImageSearchResult[]>([])
const loading = ref<boolean>(false)

/** 获取以图搜图结果列表 */
const fetchResultData = async () => {
  loading.value = true
  try {
    const res = await searchPictureByPictureUsingPost({ pictureId: pictureId.value })
    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data
    } else {
      message.error('获取数据失败 ' + res.data.message)
    }
  } catch (error: any) {
    message.error('获取数据失败 ' + error.message)
  }
  loading.value = false
}

onMounted(() => {
  fetchPictureDetail()
  fetchResultData()
})
</script>

<style scoped></style>
