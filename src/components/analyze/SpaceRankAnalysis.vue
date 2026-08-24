<template>
  <div class="space-rank-analysis">
    <a-card title="空间排行分析">
      <v-chart :option="options" style="height: 320px; max-width: 100%" :loading="loading" />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { message } from 'antdv-next'
import 'echarts'
import VChart from 'vue-echarts'
import { analyzeSpaceRankUsingPost } from '@/api/analyze-controller'

// interface Props {
//   queryAll?: boolean
//   queryPublic?: boolean
//   spaceId?: string
// }
// const props = withDefaults(defineProps<Props>(), {
//   queryAll: false,
//   queryPublic: false,
// })
const loading = ref<boolean>(false)

// 图表数据
const dataList = ref<API.Space[]>([])

/** 获取图表数据 */
const fetchData = async () => {
  loading.value = true
  const res = await analyzeSpaceRankUsingPost({
    // queryAll: props.queryAll,
    // queryPublic: props.queryPublic,
    // spaceId: props.spaceId,
    topN: 10, // 默认获取前10个数据
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
  const spaceNames = dataList.value.map((item) => item.spaceName)
  const usageData = dataList.value.map((item) => ((item.totalSize ?? 0) / (1024 * 1024)).toFixed(2)) // 转为 MB

  return {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: spaceNames,
    },
    yAxis: {
      type: 'value',
      name: '空间使用量 (MB)',
    },
    series: [
      {
        name: '空间使用量 (MB)',
        type: 'bar',
        data: usageData,
        itemStyle: {
          color: '#5470C6', // 自定义柱状图颜色
        },
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
