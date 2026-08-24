<template>
  <div class="space-user-analysis">
    <a-card title="空间用户行为分析">
      <v-chart :option="options" style="height: 320px; max-width: 100%" :loading="loading" />
      <template #extra>
        <a-space>
          <a-segmented v-model:value="timeDimension" :options="timeDimensionOptions" />

          <!-- 提供根据用户名搜索用户ID -->
          <a-auto-complete
            v-model:value="userId"
            :options="userOptions"
            @search="handleSearch"
            @select="handleSelect"
          >
            <template #option="item">
              <div style="display: flex; justify-content: space-between">
                <span>{{ item.value }}</span>
                <span>{{ item.id }}</span>
              </div>
            </template>

            <a-input-search placeholder="请输入用户名称或ID" enter-button="搜索用户" allow-clear />
          </a-auto-complete>
        </a-space>
      </template>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { message } from 'antdv-next'
import 'echarts'
import VChart from 'vue-echarts'
import { analyzeSpaceUserUsingPost } from '@/api/analyze-controller'
import { listUserVoByPageUsingPost } from '@/api/user-controller'

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

// 时间维度
const timeDimension = ref<'day' | 'week' | 'month'>('day')
// 分段选择器的时间维度选项
const timeDimensionOptions = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
]

// 用户ID
const userId = ref<number>()
const userOptions = ref() // 用户查询结果选项列表

/**
 * 处理选择事件
 * @param value 选中的值
 * @param option 选中的选项
 */
const handleSelect = (value: string, option: any) => {
  userId.value = option.id
}

/**
 * 处理搜索事件
 * @param value 搜索框输入的值
 */
const handleSearch = async (value: string) => {
  const res = await listUserVoByPageUsingPost({ userName: value })
  if (res.data.code === 0 && res.data.data?.records) {
    userOptions.value = res.data.data.records.map((item) => {
      return {
        value: item.userName,
        id: item.id,
      }
    })
  } else {
    message.error('用户查询失败' + res.data.message)
  }
}

// 图表数据
const dataList = ref<API.SpaceUserAnalyzeResponse[]>([])

/** 获取图表数据 */
const fetchData = async () => {
  loading.value = true
  const res = await analyzeSpaceUserUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
    timeDimension: timeDimension.value,
    userId: userId.value,
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
  const periods = dataList.value.map((item) => item.period) // 时间区间
  const counts = dataList.value.map((item) => item.count) // 上传数量

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: periods, name: '时间区间' },
    yAxis: { type: 'value', name: '上传数量' },
    series: [
      {
        name: '上传数量',
        type: 'line',
        data: counts,
        smooth: true, // 平滑折线
        emphasis: {
          focus: 'series',
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
