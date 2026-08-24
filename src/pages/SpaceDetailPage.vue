<template>
  <div id="space-detail-page">
    <!-- 展示空间的基本信息 -->
    <a-flex justify="space-between" align="center">
      <h2>{{ space.spaceName }}（{{ SPACE_TYPE_MAP[space.spaceType ?? 0] }}）</h2>
      <a-space :size="25">
        <a-tooltip
          :title="`占用空间 ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`"
        >
          <a-progress
            :percent="(((space?.totalSize ?? 0) * 100) / (space?.maxSize ?? 1)).toFixed(1)"
            :size="16"
            style="width: 300px"
          />
        </a-tooltip>

        <!-- 空间操作 -->
        <a-button v-if="canUploadPicture" type="primary" :href="`/add-picture?spaceId=${props.id}`">
          创建图片
        </a-button>
        <a-button
          v-if="canManageSpaceUser && space.spaceType === SPACE_TYPE_ENUM.TEAM"
          type="primary"
          ghost
          :icon="h(TeamOutlined)"
          :href="`/admin/space-user-manage/${props.id}`"
        >
          成员管理
        </a-button>
        <a-button
          v-if="canManageSpaceUser"
          type="primary"
          ghost
          :icon="h(BarChartOutlined)"
          :href="`/space-analyze?spaceId=${props.id}`"
        >
          空间分析
        </a-button>
        <a-button v-if="canEditPicture" :icon="h(EditOutlined)" @click="doBatchEdit">
          批量编辑
        </a-button>
      </a-space>
    </a-flex>

    <div style="margin-bottom: 16px"></div>

    <!-- 搜索表单 -->
    <PictureSearchForm :on-search="handleSearch" />

    <!-- 颜色搜索表单，跟其他搜索条件独立 -->
    <a-form-item label="按颜色搜索">
      <color-picker format="hex" @pure-color-change="onColorChange" />
    </a-form-item>

    <!-- 图片列表 -->
    <PictureList
      :data-list="dataList"
      :loading="loading"
      :show-operation="true"
      :reload="fetchData"
      :can-edit="canEditPicture"
      :can-delete="canDeletePicture"
    />

    <!-- 分页器 -->
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      @change="onPageChange"
    />

    <!-- 批量编辑图片弹窗 -->
    <BatchEditPictureModal
      ref="batchEditPictureModalRef"
      title="批量编辑图片"
      :space-id="props.id"
      :picture-list="dataList"
      :on-success="onBatchEditSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, h, watch, computed } from 'vue'
import { message } from 'antdv-next'
import { BarChartOutlined, EditOutlined, TeamOutlined } from '@antdv-next/icons'

import { getSpaceVoByIdUsingGet } from '@/api/space-controller'
import {
  listPictureVoByPageUsingPost,
  searchPictureByColorUsingPost,
} from '@/api/picture-controller'
import { formatSize } from '@/utils'
import { SPACE_PERMISSION_ENUM, SPACE_TYPE_ENUM, SPACE_TYPE_MAP } from '@/constants/space'

// 引入第三方 ColorPicker 组件
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'

import PictureList from '@/components/common/PictureList.vue'
import PictureSearchForm from '@/components/common/PictureSearchForm.vue'
import BatchEditPictureModal from '@/components/common/BatchEditPictureModal.vue'

interface Props {
  id: number
}
const props = defineProps<Props>()

// 当前空间详情相关数据
const space = ref<API.SpaceVO>({})

// 图片展示列表相关数据
const loading = ref(true)
const dataList = ref<API.PictureVO[]>([])
const total = ref(0)

// 搜索条件
const searchParams = ref<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'create_time',
  sortOrder: 'descend',
})

/**
 * 分页器变化回调
 * @param page 当前页码
 * @param pageSize 每页条数
 */
const onPageChange = (page: number, pageSize: number) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  fetchData()
}

/**
 * 通用权限检查函数
 * @param permission 权限名称
 */
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (space.value.permissionList ?? []).includes(permission)
  })
}

// 定义权限检查计算属性
const canManageSpaceUser = createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE)
const canUploadPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_UPLOAD)
const canEditPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDeletePicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)

/** 获取数据列表 */
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    spaceId: props.id,
    ...searchParams.value,
  }

  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0
  } else {
    message.error('图片数据获取失败' + res.data.message)
  }
  loading.value = false
}

/** 获取空间详情 */
const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({ id: props.id })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败 ' + res.data.message)
    }
  } catch (error: any) {
    message.error('获取空间详情失败 ' + error.message)
  }
}

/**
 * 颜色选择器组件，点击选择不同颜色触发的事件
 * @param color 颜色选择器选择的颜色
 */
const onColorChange = async (color: string) => {
  loading.value = true
  const res = await searchPictureByColorUsingPost({
    picColor: color,
    spaceId: props.id,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data ?? []
    total.value = res.data.data.length ?? 0
  } else {
    message.error('图片数据获取失败' + res.data.message)
  }
  loading.value = false
}

/** 触发表单搜索
 * @param newSearchParams 搜索表单组件中传递的新搜索参数
 */
const handleSearch = (newSearchParams: API.PictureQueryRequest) => {
  searchParams.value = {
    ...searchParams.value,
    ...newSearchParams,
    // 重置分页条件为第 1 页
    current: 1,
  }
  fetchData()
}

/** 批量编辑图片回调函数 */
const onBatchEditSuccess = () => {
  fetchData()
}

// 批量编辑图片弹窗组件实例
const batchEditPictureModalRef = ref()
/** 批量编辑操作 */
const doBatchEdit = () => {
  batchEditPictureModalRef.value?.openModal()
}

// 页面挂载后加载数据
onMounted(() => {
  fetchSpaceDetail()
  fetchData()
})

// 空间 ID 改变时重新加载数据
watch(
  () => props.id, // 监听 props.id 的变化
  () => {
    fetchData()
    fetchSpaceDetail()
  },
)
</script>

<style scoped></style>
