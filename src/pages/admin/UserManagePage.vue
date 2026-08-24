<template>
  <div id="user-manage-page">
    <!-- 搜索栏表单 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch" style="margin-bottom: 16px">
      <a-form-item label="账号">
        <a-input v-model:value="searchParams.userAccount" placeholder="请输入账号" allow-clear />
      </a-form-item>

      <a-form-item label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="请输入用户名" allow-clear />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>

    <!-- 用户信息表格 -->
    <a-table
      size="middle"
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar" :width="100" />
        </template>

        <template v-if="column.dataIndex === 'userRole'">
          <a-tag :color="USER_ROLE_TAG_MAP[record.userRole]">
            {{ USER_ROLE_MAP[record.userRole] }}
          </a-tag>
        </template>

        <template v-if="column.dataIndex === 'createTime'">
          {{ formatDate(record.createTime) }}
        </template>

        <template v-else-if="column.key === 'action'">
          <a-popconfirm
            placement="left"
            title="删除确认"
            description="确认删除该用户吗？"
            @confirm="doDelete(record.id)"
          >
            <a-button danger size="middle" type="primary">删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'antdv-next'

import { deleteUserUsingPost, listUserVoByPageUsingPost } from '@/api/user-controller'
import { USER_ROLE_MAP, USER_ROLE_TAG_MAP } from '@/constants/user'
import { formatDate } from '@/utils/date'

// 表格列配置
const columns = [
  { title: 'id', dataIndex: 'id', align: 'center' },
  { title: '账号', dataIndex: 'userAccount', align: 'center' },
  { title: '用户名', dataIndex: 'userName', align: 'center' },
  { title: '头像', dataIndex: 'userAvatar', align: 'center' },
  { title: '简介', dataIndex: 'userProfile', align: 'center' },
  { title: '用户角色', dataIndex: 'userRole', align: 'center' },
  { title: '创建时间', dataIndex: 'createTime', align: 'center' },
  { title: '操作', key: 'action', align: 'center' },
]

// 表格数据
const dataList = ref<USER_API.UserVO[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<USER_API.UserQueryRequest>({
  userAccount: '',
  userName: '',
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
  const res = await listUserVoByPageUsingPost({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0
  } else {
    message.error('数据获取失败' + res.data.message)
  }
}

/**
 * 表格分页数据改变监听的回调函数
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
 * 删除用户
 * @param id 用户id
 */
const doDelete = async (id: number) => {
  if (!id) {
    return
  }
  const res = await deleteUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
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
