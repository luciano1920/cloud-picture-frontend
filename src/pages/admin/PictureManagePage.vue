<template>
  <div id="picture-manage-page">
    <a-flex justify="space-between">
      <h2>图片管理</h2>
      <a-space>
        <a-button type="primary" href="/add-picture">创建图片</a-button>
        <a-button type="primary" href="/add-picture/batch" ghost>批量创建图片</a-button>
      </a-space>
    </a-flex>
    <!-- 搜索栏表单 -->
    <a-form
      layout="inline"
      :model="searchParams"
      @finish="doSearch"
      style="margin-top: 16px; margin-bottom: 16px"
    >
      <a-form-item label="关键词">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="从名称和简介搜索"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="类型">
        <a-input v-model:value="searchParams.category" placeholder="请输入类型" allow-clear />
      </a-form-item>

      <a-form-item label="标签">
        <a-select
          v-model:value="searchParams.tags"
          mode="tags"
          placeholder="请输入图片标签"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="审核状态">
        <a-select
          v-model:value="searchParams.reviewStatus"
          placeholder="请选择审核状态"
          style="min-width: 180px"
          :options="PIC_REVIEW_STATUS_OPTIONS"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>

    <!-- 图片信息表格 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
      :scroll="{ x: '140%', y: 550 }"
      :loading="tableLoading"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image :src="record.url" :width="120" :height="90" style="object-fit: cover" />
        </template>

        <template v-else-if="column.dataIndex === 'tags'">
          <a-space wrap>
            <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">{{ tag }}</a-tag>
          </a-space>
        </template>

        <template v-else-if="column.dataIndex === 'picInfo'">
          <div>格式：{{ record.picFormat }}</div>
          <div>宽度：{{ record.picWidth }}</div>
          <div>高度：{{ record.picHeight }}</div>
          <div>宽高比：{{ record.picScale }}</div>
          <div>大小：{{ formatSize(record.picSize) }}</div>
        </template>

        <template v-else-if="column.dataIndex === 'reviewMessage'">
          <div>审核状态：{{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}</div>
          <div>审核信息：{{ record.reviewMessage }}</div>
          <div>审核人：{{ record.reviewerId }}</div>
          <div>审核时间：{{ formatDate(record.reviewTime) }}</div>
        </template>

        <template v-else-if="column.dataIndex === 'createTime'">
          {{ formatDate(record.createTime) }}
        </template>

        <template v-else-if="column.dataIndex === 'editTime'">
          {{ formatDate(record.editTime) }}
        </template>

        <template v-else-if="column.key === 'action'">
          <a-space wrap align="center" direction="vertical">
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
              type="link"
              @click="showModal(record, PIC_REVIEW_STATUS_ENUM.PASS)"
            >
              通过
            </a-button>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
              type="link"
              danger
              @click="showModal(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
            >
              拒绝
            </a-button>
            <a-button type="link" :href="`/add-picture?id=${record.id}`">编辑</a-button>
            <a-popconfirm
              placement="left"
              title="删除确认"
              description="确认删除该图片吗？"
              @confirm="doDelete(record.id)"
            >
              <a-button danger size="small">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 审核表单模态框 -->
    <a-modal
      v-model:open="visible"
      title="审核图片"
      :confirm-loading="confirmLoading"
      @ok="handleReview"
    >
      <a-form ref="reviewForm" :model="reviewParams" auto-complete="off" @finish="handleReview">
        <a-form-item
          label="审核信息"
          name="reviewMessage"
          :rules="[{ required: true, message: '请务必填写审核信息，不可为空' }]"
        >
          <a-input
            v-model:value="reviewParams.reviewMessage"
            placeholder="请填写审核信息"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'antdv-next'

import {
  deletePictureUsingPost,
  listPictureByPageUsingPost,
  reviewPictureUsingPost,
} from '@/api/picture-controller'
import { formatSize } from '@/utils'
import { formatDate } from '@/utils/date'
import {
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_OPTIONS,
} from '@/constants/picture'

// 表格列配置
const columns = [
  { title: '名称', dataIndex: 'picName', align: 'center', fixed: 'left', width: 100 },
  { title: '图片', dataIndex: 'url', align: 'center', fixed: 'left', width: 150 },
  { title: '简介', dataIndex: 'introduction', width: 150, align: 'center' },
  { title: '类型', dataIndex: 'category', align: 'center' },
  { title: '标签', dataIndex: 'tags', align: 'center', width: 135 },
  { title: '图片 id', dataIndex: 'id', align: 'center', width: 120 },
  { title: '用户 id', dataIndex: 'userId', align: 'center', width: 120 },
  { title: '图片信息', dataIndex: 'picInfo', align: 'center' },
  { title: '审核信息', dataIndex: 'reviewMessage', align: 'center', width: 250 },
  { title: '创建时间', dataIndex: 'createTime', align: 'center' },
  { title: '编辑时间', dataIndex: 'editTime', align: 'center' },
  { title: '操作', key: 'action', align: 'center', fixed: 'right', width: 100 },
]

// 表格相关数据
const dataList = ref<API.Picture[]>([])
const total = ref(0)
const tableLoading = ref<boolean>(false)
// 审核模态框相关数据
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'create_time',
  sortOrder: 'descend',
})

// 审核表单实例
const reviewForm = ref()
// 审核信息
const reviewParams = reactive<API.PictureReviewRequest>({})

// 分页器配置
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
  tableLoading.value = true
  const res = await listPictureByPageUsingPost({ ...searchParams, nullSpaceId: true })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0
  } else {
    message.error('数据获取失败' + res.data.message)
  }
  tableLoading.value = false
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
 * 处理删除图片
 * @param id 图片id
 */
const doDelete = async (id: number) => {
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    fetchData()
  } else {
    message.error('删除失败' + res.data.message)
  }
}

/**
 * 显示审核图片模态框
 * @param record 要审核的所在行的图片
 * @param reviewStatus 审核状态
 */
const showModal = (record: API.Picture, reviewStatus: number) => {
  reviewForm.value?.resetFields() // 重置审核表单
  visible.value = true
  reviewParams.id = record.id
  reviewParams.reviewStatus = reviewStatus
  // reviewParams.reviewMessage = '' // 清空审核信息
  // 根据审核状态设置默认审核信息，提升用户填写审核表单体验
  if (reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS) {
    reviewParams.reviewMessage = '管理员审核通过'
  }
  if (reviewStatus === PIC_REVIEW_STATUS_ENUM.REJECT) {
    reviewParams.reviewMessage = '管理员审核拒绝'
  }
}

/** 处理审核图片 */
const handleReview = async () => {
  try {
    // 触发表单的校验
    await reviewForm.value?.validate()

    confirmLoading.value = true
    const res = await reviewPictureUsingPost({ ...reviewParams })

    if (res.data.code === 0) {
      message.success('审核操作成功')
      Object.assign(reviewParams, {}) // 清空审核参数
      visible.value = false // 关闭弹窗
      fetchData() // 审核成功后重新获取数据
    } else {
      message.error('审核操作失败' + res.data.message)
      Object.assign(reviewParams, {}) // 清空审核参数
      visible.value = false // 关闭弹窗
    }
  } catch {
    message.error('请填写完整审核信息')
  } finally {
    confirmLoading.value = false
  }
}

// 页面加载时获数据，请求一次
onMounted(() => {
  fetchData()
})
</script>

<style scoped></style>
