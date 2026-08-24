<template>
  <div class="picture-search-form">
    <!-- 搜索栏表单 -->
    <a-form
      layout="inline"
      :model="searchParams"
      :labelCol="{ style: { width: '50px' } }"
      @finish="doSearch"
    >
      <a-form-item label="关键词">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="从名称和简介搜索"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="类型">
        <a-auto-complete
          v-model:value="searchParams.category"
          placeholder="请输入类型"
          style="width: 110px"
          :options="categoryOptions"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="标签">
        <a-select
          v-model:value="searchParams.tags"
          mode="tags"
          placeholder="请输入标签"
          style="width: 110px"
          :options="tagsOptions"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="宽度">
        <a-input-number v-model:value="searchParams.picWidth" :min="0" />
      </a-form-item>

      <a-form-item label="高度">
        <a-input-number v-model:value="searchParams.picHeight" :min="0" />
      </a-form-item>

      <a-form-item label="名称">
        <a-input v-model:value="searchParams.picName" placeholder="请输入名称" allow-clear />
      </a-form-item>

      <a-form-item label="简介">
        <a-input v-model:value="searchParams.introduction" placeholder="请输入简介" allow-clear />
      </a-form-item>

      <a-form-item label="格式">
        <a-input v-model:value="searchParams.picFormat" placeholder="请输入图片格式" allow-clear />
      </a-form-item>

      <a-form-item label="日期">
        <a-range-picker
          v-model:value="dateRange"
          style="width: 360px"
          show-time
          :placeholder="['开始编辑时间', '结束编辑时间']"
          separator="至"
          format="YYYY/MM/DD HH:mm:ss"
          :presets="rangePresets"
          @change="onRangeChange"
        />
      </a-form-item>

      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit" style="width: 96px">搜索</a-button>
          <a-button html-type="reset" @click="doReset">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { message } from 'antdv-next'
import dayjs from 'dayjs'
import { listPictureTagCategoryVoUsingGet } from '@/api/picture-controller'

interface Props {
  onSearch?: (searchParams: API.PictureQueryRequest) => void
}
const props = defineProps<Props>()

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

// 日期选择器日期范围
const dateRange = ref<[]>([])
// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({})

/**
 * 日期范围更改时触发
 * @param dates
 * @param dateStrings
 */
const onRangeChange = (dates: any[]) => {
  if (dates && dates.length >= 2) {
    searchParams.startEditTime = dates[0].toDate()
    searchParams.endEditTime = dates[1].toDate()
  } else {
    searchParams.startEditTime = undefined
    searchParams.endEditTime = undefined
  }
}

// 日期范围预设
const rangePresets = ref([
  { label: '过去 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '过去 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '过去 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '过去 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
])

/** 处理搜索 */
const doSearch = () => {
  props.onSearch?.(searchParams)
}

/** 处理重置 */
const doReset = () => {
  // 取消对象中所有的值
  ;(Object.keys(searchParams) as Array<keyof typeof searchParams>).forEach((key) => {
    searchParams[key] = undefined
  })
  // 日期选项单独清空，必须定义为数组
  dateRange.value = []
  // 重置后重新搜索
  props.onSearch?.(searchParams)
}

// 页面加载时获数据，请求一次
onMounted(() => {
  getTagCategoryOptions()
})
</script>

<style scoped>
.picture-search-form .ant-form-item {
  margin-bottom: 16px;
}
</style>
