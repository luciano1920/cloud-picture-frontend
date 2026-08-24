<template>
  <div class="space-usage-analysis">
    <a-flex gap="middle">
      <a-card title="存储空间" style="width: 50%">
        <div style="height: 320px; text-align: center">
          <h3>
            {{ formatSize(chartData.usedSize) }} /
            {{ chartData.maxSize ? formatSize(chartData.maxSize) : '无限制' }}
          </h3>
          <a-progress type="dashboard" :percent="chartData.sizeUsageRatio ?? 0" />
        </div>
      </a-card>

      <a-card title="图片数量" style="width: 50%">
        <div style="height: 320px; text-align: center">
          <h3>{{ chartData.usedCount }} / {{ chartData.maxCount ?? '无限制' }}</h3>
          <a-progress type="dashboard" :percent="chartData.countUsageRatio ?? 0" />
        </div>
      </a-card>
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { message } from 'antdv-next'
import { analyzeSpaceUsageUsingPost } from '@/api/analyze-controller'
import { formatSize } from '@/utils'

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
const chartData = ref<API.SpaceUsageAnalyzeResponse>({})

/** 获取图表数据 */
const fetchData = async () => {
  loading.value = true
  const res = await analyzeSpaceUsageUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  })
  if (res.data.code === 0 && res.data.data) {
    chartData.value = res.data.data
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

// 监听事件，当props变化时重新获取数据
watchEffect(() => {
  fetchData()
})
</script>

<style scoped></style>
