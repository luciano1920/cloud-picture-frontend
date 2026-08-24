<template>
  <div id="space-manage-page">
    <a-flex justify="space-between">
      <h2>空间管理</h2>
      <a-space size="middle">
        <a-button type="primary" href="/add-space">创建空间</a-button>
        <a-button type="primary" ghost href="/space-analyze?queryPublic=1">公共图库分析</a-button>
        <a-button type="primary" ghost href="/space-analyze?queryAll=1">全部空间分析</a-button>
      </a-space>
    </a-flex>

    <!-- 搜索栏表单 -->
    <a-form
      layout="inline"
      :model="searchParams"
      @finish="doSearch"
      style="margin-top: 16px; margin-bottom: 16px"
    >
      <a-form-item label="空间名称">
        <a-input v-model:value="searchParams.spaceName" placeholder="请输入空间名称" allow-clear />
      </a-form-item>

      <a-form-item label="空间级别">
        <a-select
          v-model:value="searchParams.spaceLevel"
          placeholder="请选择空间级别"
          style="min-width: 180px"
          :options="SPACE_LEVEL_OPTIONS"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="空间类别">
        <a-select
          v-model:value="searchParams.spaceType"
          placeholder="请选择空间类别"
          style="min-width: 180px"
          :options="SPACE_TYPE_OPTIONS"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="用户ID">
        <a-input v-model:value="searchParams.userId" placeholder="请输入用户ID" allow-clear />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>

    <!-- 空间信息表格 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'spaceLevel'">
          <div>{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</div>
        </template>

        <template v-if="column.dataIndex === 'spaceType'">
          <div>{{ SPACE_TYPE_MAP[record.spaceType] }}</div>
        </template>

        <template v-if="column.dataIndex === 'spaceUseInfo'">
          <div>大小：{{ formatSize(record.totalSize) }} / {{ formatSize(record.maxSize) }}</div>
          <div>数量：{{ record.totalCount }} / {{ record.maxCount }}</div>
        </template>

        <template v-if="column.dataIndex === 'createTime'">
          {{ formatDate(record.createTime) }}
        </template>

        <template v-if="column.dataIndex === 'editTime'">
          {{ formatDate(record.editTime) }}
        </template>

        <template v-else-if="column.key === 'action'">
          <a-space wrap align="center" direction="vertical">
            <a-button type="link" size="small" :href="`/space-analyze?spaceId=${record.id}`">
              分析
            </a-button>
            <a-button type="link" size="small" :href="`/add-space?id=${record.id}`">编辑</a-button>
            <a-popconfirm
              placement="left"
              title="删除确认"
              description="确认删除该空间吗？"
              @confirm="doDelete(record.id)"
            >
              <a-button danger type="link" size="small">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'antdv-next'

import { deleteSpaceUsingPost, listSpaceByPageUsingPost } from '@/api/space-controller'
import {
  SPACE_LEVEL_MAP,
  SPACE_LEVEL_OPTIONS,
  SPACE_TYPE_MAP,
  SPACE_TYPE_OPTIONS,
} from '@/constants/space'
import { formatSize } from '@/utils'
import { formatDate } from '@/utils/date'

// 表格列配置
const columns = [
  { title: '空间名称', dataIndex: 'spaceName', align: 'center', fixed: 'left', width: 180 },
  { title: '空间级别', dataIndex: 'spaceLevel', align: 'center', width: 100 },
  { title: '空间类别', dataIndex: 'spaceType', align: 'center', width: 100 },
  { title: '使用情况', dataIndex: 'spaceUseInfo', align: 'center', width: 240 },
  { title: '空间 id', dataIndex: 'id', align: 'center' },
  { title: '用户 id', dataIndex: 'userId', align: 'center' },
  { title: '创建时间', dataIndex: 'createTime', align: 'center', width: 110 },
  { title: '编辑时间', dataIndex: 'editTime', align: 'center', width: 110 },
  { title: '操作', key: 'action', align: 'center', fixed: 'right', width: 70 },
]

// 表格相关数据
const dataList = ref<API.Space[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'create_time',
  sortOrder: 'descend',
})

// 分页器
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  }
})

/** 获取数据列表 */
const fetchData = async () => {
  const res = await listSpaceByPageUsingPost({ ...searchParams })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0
  } else {
    message.error('数据获取失败' + res.data.message)
  }
}

/**
 * 表格change监听的回调函数
 * @param page 分页参数
 */
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

/** 处理搜索 */
const doSearch = () => {
  searchParams.current = 1 // 重置页码
  fetchData()
}

/**
 * 处理删除空间
 * @param id 空间id
 */
const doDelete = async (id: number) => {
  if (!id) {
    return
  }
  const res = await deleteSpaceUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    fetchData()
  } else {
    message.error('删除失败' + res.data.message)
  }
}

// 页面加载时获数据，请求一次
onMounted(() => {
  fetchData()
})
</script>

<style scoped></style>
