<template>
  <div id="home-page">
    <!-- 搜索框 -->
    <div class="search-bar">
      <a-input-search
        v-model:value="searchParams.searchText"
        placeholder="从海量图库中搜索"
        enter-button="搜索"
        size="large"
        @search="handleSearch"
      />
    </div>

    <!-- 轮播图 -->
    <a-carousel :autoplay="{ dotDuration: true }" :autoplay-speed="5000" class="carousel-container">
      <img src="../../assets/images/1.jpg" alt="1" class="bg-img" />
      <img src="../../assets/images/2.jpg" alt="2" class="bg-img" />
      <img src="../../assets/images/3.jpg" alt="3" class="bg-img" />
      <img src="../../assets/images/4.jpg" alt="4" class="bg-img" />
    </a-carousel>

    <div class="panel-container">
      <!-- <div class="panel-item">
        <div class="panel-title">精选专题</div>
        <div class="panel-title-en">FEATURED TOPIC</div>
      </div> -->
      <a-spin
        v-if="loading"
        :spinning="loading"
        size="large"
        description="加载中......"
        style="height: 160px"
      />
      <JustifiedPictureList ref="listRef" :data-list="pictureDataList" :extra-height="35">
        <template #item="{ picture }">
          <RouterLink :to="`/picture/${picture.id}`">
            <PictureCard :picture="picture" show-info @card-click="viewPictureDetail" />
          </RouterLink>
        </template>
      </JustifiedPictureList>

      <a-pagination
        :current="searchParams.current"
        :page-size="searchParams.pageSize"
        :total="listTotal"
        style="margin-top: 16px"
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'antdv-next'
import { listPictureVoByPageUsingPost } from '@/api/picture-controller'
import PictureCard from '@/components/common/PictureCard.vue'
import JustifiedPictureList from '@/components/common/JustifiedPictureList.vue'

// 图片展示列表相关数据
const loading = ref<boolean>(true)
const pictureDataList = ref<PICTURE_API.PictureVO[]>([])
const listTotal = ref<number>(0)

// 搜索条件
const searchParams = reactive<PICTURE_API.PictureQueryRequest>({
  current: 1,
  pageSize: 100,
  sortField: 'createTime',
  sortOrder: 'descend',
})

/** 获取数据列表 */
const fetchPictureData = async () => {
  loading.value = true

  try {
    const res = await listPictureVoByPageUsingPost({ ...searchParams })
    if (res.data.code === 0 && res.data.data) {
      pictureDataList.value = res.data.data.records ?? []
      listTotal.value = res.data.data.total ?? 0
    } else {
      message.error('数据获取失败' + res.data.message)
    }
  } catch (error) {
    console.error('请求异常:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 分页器变化回调
 * @param page 当前页码
 * @param pageSize 每页条数
 */
const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchPictureData()
}

/** 搜索方法 */
const handleSearch = () => {
  searchParams.current = 1 // 重置搜索条件
  fetchPictureData()
}

const viewPictureDetail = (picture: PICTURE_API.PictureVO) => {
  console.log('查看图片详情', picture)
}

// 页面加载时获数据，请求一次
onMounted(() => {
  fetchPictureData()
})
</script>

<style scoped lang="scss">
:deep(.carousel-container) {
  --ant-carousel-dot-offset: 144px;
  --ant-carousel-dot-height: 5px;
  --ant-carousel-dot-width: 28px;
  --ant-carousel-dot-active-width: 44px;
  --ant-carousel-dot-gap: 8px;
}
.bg-img {
  width: 100%;
  height: 640px;
  object-fit: cover;
}

.search-bar {
  position: absolute;
  top: 260px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 680px;
}

.panel-container {
  z-index: 10;
  position: absolute;
  top: 520px;
  min-height: 1000px;
  width: 100%;
  border-top-left-radius: 64px;
  border-top-right-radius: 64px;
  padding: 64px 260px 56px;
  background: linear-gradient(
    to right,
    var(--content-bg-gradient-start),
    var(--content-bg-gradient-end)
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  // 添加以下样式确保内容可以正常显示
  overflow: visible;

  .panel-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .panel-title {
      color: rgba(0, 0, 0, 0.88);
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .panel-title-en {
      color: rgba(0, 0, 0, 0.45);
      font-size: 22px;
      margin-bottom: 32px;
    }
  }
}
</style>
