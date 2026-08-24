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

    <!-- 分类和标签筛选栏 -->
    <a-tabs v-model:active-key="selectedCategory" :items="tabItems" @change="handleSearch" />

    <div class="tag-bar">
      <span style="margin-right: 8px">标签：</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag-group
          v-model:value="selectedTagList"
          :options="tagOptions"
          multiple
          @change="handleSearch"
        />
      </a-space>
    </div>

    <!-- 图片列表 -->
    <PictureList :data-list="dataList" :loading="loading" />

    <!-- 分页器 -->
    <a-pagination
      :current="searchParams.current"
      :page-size="searchParams.pageSize"
      :total="total"
      style="justify-content: flex-end"
      @change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'antdv-next'
import {
  listPictureTagCategoryVoUsingGet,
  listPictureVoByPageUsingPost,
} from '@/api/picture-controller'
import PictureList from '@/components/common/PictureList.vue'

// 图片展示列表相关数据
const loading = ref(true)
const dataList = ref<API.PictureVO[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'create_time',
  sortOrder: 'descend',
})

/**
 * 分页器变化回调
 * @param page 当前页码
 * @param pageSize 每页条数
 */
const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

const categoryList = ref<string[]>([])
const tabItems = computed(() => {
  return [
    { key: 'all', label: '全部' },
    ...categoryList.value.map((category) => ({ key: category, label: category })),
  ]
})
const selectedCategory = ref<string>('all')

const tagList = ref<string[]>([])
const tagOptions = computed(() => {
  return tagList.value.map((tag) => ({ label: tag, value: tag }))
})
const selectedTagList = ref([])

/** 获取标签分类选项 */
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryVoUsingGet()
  if (res.data.code === 0 && res.data.data) {
    categoryList.value = res.data.data.categoryList ?? []
    tagList.value = res.data.data.tagList ?? []
  } else {
    message.error('获取标签分类选项失败' + res.data.message)
  }
}

/** 获取数据列表 */
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    ...searchParams,
    tags: selectedTagList.value,
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }

  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 1
  } else {
    message.error('数据获取失败' + res.data.message)
  }
  loading.value = false
}

/** 搜索方法 */
const handleSearch = () => {
  searchParams.current = 1 // 重置搜索条件
  fetchData()
}

// 页面加载时获数据，请求一次
onMounted(() => {
  getTagCategoryOptions()
  fetchData()
})
</script>

<style scoped>
#home-page {
  margin-bottom: 16px;
}

#home-page .search-bar {
  max-width: 480px;
  margin: 0 auto 16px;
}

#home-page .tag-bar {
  margin-bottom: 16px;
}
</style>
