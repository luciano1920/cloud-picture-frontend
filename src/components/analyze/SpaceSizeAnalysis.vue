<template>
  <div class="space-size-analysis">
    <a-card title="空间图片大小分析">
      <v-chart :option="options" style="height: 320px; max-width: 100%" :loading="loading" />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { message } from 'antdv-next'
import 'echarts'
import VChart from 'vue-echarts'
import { analyzeSpaceSizeUsingPost } from '@/api/analyze-controller'

interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: number
}
const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})
const loading = ref<boolean>(false)

// 图表数据
const dataList = ref<API.SpaceSizeAnalyzeResponse[]>([])

/** 获取图表数据 */
const fetchData = async () => {
  loading.value = true
  const res = await analyzeSpaceSizeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data ?? []
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

// 设置 options 为计算属性，根据 chartData 动态生成
const options = computed(() => {
  const pieData = dataList.value.map((item) => ({
    name: item.sizeRange,
    value: item.count,
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      top: 'bottom',
    },
    series: [
      {
        name: '图片大小',
        type: 'pie',
        radius: '50%',
        data: pieData,
      },
    ],
  }
})

// 监听事件，当props变化时重新获取数据
watchEffect(() => {
  fetchData()
})
</script>

<style scoped></style>
