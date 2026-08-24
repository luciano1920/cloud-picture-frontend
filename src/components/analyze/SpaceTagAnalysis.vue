<template>
  <div class="space-tag-analysis">
    <a-card title="空间图片标签分析">
      <v-chart :option="options" style="height: 320px; max-width: 100%" :loading="loading" />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { message } from 'antdv-next'
import 'echarts'
import 'echarts-wordcloud'
import VChart from 'vue-echarts'
import { analyzeSpaceTagUsingPost } from '@/api/analyze-controller'

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
const dataList = ref<API.SpaceTagAnalyzeResponse[]>([])

/** 获取图表数据 */
const fetchData = async () => {
  loading.value = true
  const res = await analyzeSpaceTagUsingPost({
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
  const tagData = dataList.value.map((item) => ({
    name: item.tag,
    value: item.count,
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `${params.name}: ${params.value} 次`,
    },
    series: [
      {
        type: 'wordCloud',
        gridSize: 10,
        sizeRange: [12, 50], // 字体大小范围
        rotationRange: [-90, 90],
        shape: 'circle',
        textStyle: {
          color: () =>
            `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
              Math.random() * 255,
            )}, ${Math.round(Math.random() * 255)})`, // 随机颜色
        },
        data: tagData,
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
