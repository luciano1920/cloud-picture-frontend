<template>
  <div id="tag-manage-page">
    <a-flex justify="space-between">
      <h2>标签管理</h2>
      <a-button type="primary" @click="handleAdd">新建标签</a-button>
    </a-flex>

    <!-- 搜索栏表单 -->
    <a-form
      layout="inline"
      :model="searchParams"
      @finish="handleSearch"
      style="margin-top: 16px; margin-bottom: 16px"
    >
      <a-form-item label="标签名称">
        <a-input v-model:value="searchParams.tagName" placeholder="请输入标签名称" allow-clear />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
        <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
      </a-form-item>
    </a-form>

    <!-- 标签信息表格 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space wrap align="center" direction="vertical">
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-popconfirm
              placement="left"
              title="删除确认"
              description="确认删除该标签吗？"
              @confirm="handleDelete(record.id)"
            >
              <a-button danger type="link" size="small">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 新增/编辑标签弹窗 -->
    <TagFormModal ref="tagFormModalRef" @success="fetchData" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'antdv-next'

import { deleteTagUsingPost, listTagByPageUsingPost } from '@/api/tag-controller'
import TagFormModal from './TagFormModal.vue'

// 表格列配置
const columns = [
  { title: '标签 id', dataIndex: 'id', align: 'center' },
  { title: '标签名称', dataIndex: 'tagName', align: 'center' },
  { title: '用户 id', dataIndex: 'userId', align: 'center' },
  { title: '操作', key: 'action', align: 'center', fixed: 'right', width: 100 },
]

// 表格相关数据
const dataList = ref<TAG_API.TagVO[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<TAG_API.TagQueryRequest>({
  current: 1,
  pageSize: 10,
})

// 新增/编辑弹窗引用
const tagFormModalRef = ref()

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
  const res = await listTagByPageUsingPost({ ...searchParams })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('数据获取失败' + res.data.message)
  }
}

/**
 * 表格change监听的回调函数
 * @param page 分页参数
 */
const handleTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

/** 处理搜索 */
const handleSearch = () => {
  searchParams.current = 1 // 重置页码
  fetchData()
}

/** 重置搜索条件 */
const handleReset = () => {
  searchParams.tagName = undefined
  searchParams.current = 1
  fetchData()
}

/**
 * 处理删除标签
 * @param id 标签id
 */
const handleDelete = async (id: number) => {
  if (!id) {
    return
  }
  const res = await deleteTagUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    fetchData()
  } else {
    message.error('删除失败' + res.data.message)
  }
}

/** 打开新增标签弹窗 */
const handleAdd = () => {
  tagFormModalRef.value?.show()
}

/**
 * 打开编辑标签弹窗
 * @param record 要编辑的所在行的标签
 */
const handleEdit = (record: TAG_API.TagVO) => {
  tagFormModalRef.value?.show(record)
}

// 页面加载时获取数据，请求一次
onMounted(() => {
  fetchData()
})
</script>

<style scoped></style>
