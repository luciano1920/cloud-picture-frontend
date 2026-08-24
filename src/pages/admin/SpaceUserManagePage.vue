<template>
  <div id="space-manage-page">
    <h2>空间成员管理</h2>

    <!-- 添加成员表单 -->
    <a-form
      layout="inline"
      :model="formData"
      @finish="handleSubmit"
      style="margin-top: 16px; margin-bottom: 16px"
    >
      <a-form-item label="查询用户">
        <a-auto-complete
          v-model:value="formData.userId"
          style="width: 320px"
          :options="userOptions"
          @search="handleSearch"
          @select="handleSelect"
        >
          <template #option="item">
            <div style="display: flex; justify-content: space-between">
              <span>{{ item.value }}</span>
              <span>
                <UserOutlined />
                {{ item.id }}
              </span>
            </div>
          </template>

          <a-input-search placeholder="请输入用户名称或用户ID" enter-button allow-clear />
        </a-auto-complete>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">添加用户</a-button>
      </a-form-item>

      <a-form-item>
        <span
          v-if="userStore.loginUser.userRole === 'admin'"
          style="color: #909399; font-size: 14px; margin-left: 16px"
        >
          您是云图库系统管理员，可以根据用户名快捷查询用户列表，获取用户ID。
        </span>
        <span v-else style="color: #909399; font-size: 14px; margin-left: 16px">
          由于您不是云图库系统管理员，无法根据用户名查询用户列表，请手动输入用户ID添加用户。
        </span>
      </a-form-item>
    </a-form>

    <!-- 空间成员信息表格 -->
    <a-table :columns="columns" :data-source="dataList">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userInfo'">
          <a-space>
            <a-avatar :src="record.user?.userAvatar" />
            {{ record.user?.userName }}
          </a-space>
        </template>

        <template v-if="column.dataIndex === 'spaceRole'">
          <a-select
            v-model:value="record.spaceRole"
            :options="SPACE_ROLE_OPTIONS"
            @change="(value: any) => editSpaceRole(value, record)"
          />
        </template>

        <template v-if="column.dataIndex === 'createTime'">
          {{ formatDate(record.createTime) }}
        </template>

        <template v-else-if="column.key === 'action'">
          <a-popconfirm
            placement="left"
            title="删除确认"
            description="确认删除该成员吗？"
            @confirm="doDelete(record.id)"
          >
            <a-button danger type="link" size="small">删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import { message } from 'antdv-next'
import { UserOutlined } from '@antdv-next/icons'

import { SPACE_ROLE_OPTIONS } from '@/constants/space'
import {
  addSpaceUserUsingPost,
  deleteSpaceUserUsingPost,
  editSpaceUserUsingPost,
  listSpaceUserUsingPost,
} from '@/api/space-user-controller'
import { listUserVoByPageUsingPost } from '@/api/user-controller'
import { useUserStore } from '@/stores/user-store'
import { formatDate } from '@/utils/date'

const userStore = useUserStore()

interface Props {
  value: string
  id: number
}
const props = defineProps<Props>()

// 用户ID表单数据
const formData = reactive<API.SpaceUserAddRequest>({})
const userOptions = ref() // 用户查询结果选项列表

/**
 * 处理选择事件
 * @param value 选中的值
 * @param option 选中的选项
 */
const handleSelect = (value: string, option: any) => {
  formData.userId = option.id
}

/**
 * 处理搜索事件
 * @param value 搜索框输入的值
 */
const handleSearch = async (value: string) => {
  // 先判断当前用户是不是管理员，不是管理员则不能调用查询用户的接口
  if (userStore.loginUser.userRole !== 'admin') {
    return
  }

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

/** 提交表单 */
const handleSubmit = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }

  const res = await addSpaceUserUsingPost({
    spaceId,
    ...formData,
  })
  if (res.data.code === 0) {
    message.success('添加成功')
    fetchData()
  } else {
    message.error('添加失败' + res.data.message)
  }
}

// 表格列配置
const columns = [
  { title: '用户', dataIndex: 'userInfo', align: 'center' },
  { title: '角色', dataIndex: 'spaceRole', align: 'center' },
  { title: '创建时间', dataIndex: 'createTime', align: 'center' },
  { title: '操作', key: 'action', align: 'center', fixed: 'right', width: 170 },
]

// 表格相关数据
const dataList = ref<API.SpaceUser[]>([])

/** 获取数据列表 */
const fetchData = async () => {
  const res = await listSpaceUserUsingPost({ spaceId: props.id })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data ?? []
  } else {
    message.error('数据获取失败' + res.data.message)
  }
}

/**
 * 编辑成员角色
 * @param value 角色值
 * @param record 成员信息记录对象
 */
const editSpaceRole = async (value: string, record: any) => {
  const res = await editSpaceUserUsingPost({
    id: record.id,
    spaceRole: value,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('修改成功')
  } else {
    message.error('修改失败' + res.data.message)
  }
}

/**
 * 处理删除空间
 * @param id 空间id
 */
const doDelete = async (id: number) => {
  if (!id) {
    return
  }
  const res = await deleteSpaceUserUsingPost({ id })
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
