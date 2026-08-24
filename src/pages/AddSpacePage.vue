<template>
  <div id="add-space-page">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? '编辑' : '创建' }} {{ SPACE_TYPE_MAP[spaceType] }}
    </h2>
    <!-- 空间信息表单 -->
    <a-form layout="vertical" :model="spaceForm" @finish="handleSubmit">
      <a-form-item name="spaceName" label="空间名称">
        <a-input v-model:value="spaceForm.spaceName" placeholder="请输入空间名称" allow-clear />
      </a-form-item>

      <a-form-item name="spaceLevel" label="空间级别">
        <a-select
          v-model:value="spaceForm.spaceLevel"
          placeholder="请选择空间级别"
          :options="SPACE_LEVEL_OPTIONS"
          allow-clear
        />
      </a-form-item>

      <!-- <a-form-item name="maxSize" label="空间大小">
        <a-input v-model:value="spaceForm.maxSize" placeholder="请输入空间大小" allow-clear />
      </a-form-item>

      <a-form-item name="maxCount" label="空间条数">
        <a-input v-model:value="spaceForm.maxCount" placeholder="请输入空间条数" allow-clear />
      </a-form-item> -->

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
          {{ route.query?.id ? '修改' : '创建' }}
        </a-button>
      </a-form-item>
    </a-form>

    <!-- 空间级别介绍 -->
    <a-card title="空间级别介绍">
      <a-space direction="vertical">
        <div>
          * 目前非云图库系统管理员角色仅支持开通普通版，如需升级空间，请联系
          <a href="mailto:1290582790@qq.com">智能云图库管理员</a>
        </div>

        <div v-for="spaceLevel in spaceLevelList" :key="spaceLevel.text">
          {{ spaceLevel.text }}：大小 {{ formatSize(spaceLevel.maxSize) }}， 数量
          {{ spaceLevel.maxCount }}
        </div>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'antdv-next'
import {
  addSpaceUsingPost,
  getSpaceVoByIdUsingGet,
  listSpaceLevelUsingGet,
  updateSpaceUsingPost,
} from '@/api/space-controller'
import { SPACE_LEVEL_OPTIONS, SPACE_TYPE_ENUM, SPACE_TYPE_MAP } from '@/constants/space'
import { formatSize } from '@/utils'

const router = useRouter()
const route = useRoute()

const space = ref<API.SpaceVO>()
const spaceLevelList = ref<API.SpaceLevel[]>([]) // 空间级别列表
const spaceForm = reactive<API.SpaceAddRequest | API.SpaceUpdateRequest>({})
const loading = ref<boolean>(false)

// 空间类别，默认为私有空间
const spaceType = computed((): number => {
  if (space.value) {
    return space.value?.spaceType ?? SPACE_TYPE_ENUM.PRIVATE
  }

  if (route.query?.type) {
    return Number(route.query.type)
  } else {
    return SPACE_TYPE_ENUM.PRIVATE
  }
})

/** 获取空间级别列表 */
const fetchSpaceLevelList = async () => {
  const res = await listSpaceLevelUsingGet()
  if (res.data.code === 0 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else {
    message.error('获取空间级别失败，' + res.data.message)
  }
}

/**
 * 提交表单
 * @param values 提交的表单spaceForm
 */
const handleSubmit = async () => {
  loading.value = true
  const spaceId = space.value?.id
  let res
  if (spaceId) {
    res = await updateSpaceUsingPost({ ...spaceForm, id: spaceId })
  } else {
    res = await addSpaceUsingPost({ ...spaceForm, spaceType: spaceType.value })
  }
  // 提交成功
  if (res.data.code === 0 && res.data.data) {
    message.success('空间' + (route.query?.id ? '编辑' : '创建') + '成功')
    // 跳转到空间详情页
    router.push({
      path: '/space/' + (spaceId ? spaceId : res.data.data),
    })
  } else {
    message.error('空间' + (route.query?.id ? '编辑' : '创建') + '失败，' + res.data.message)
  }
  loading.value = false
}

/** 获取已上传的空间信息 */
const getOldSpace = async () => {
  // 获取到空间id
  const spaceId = route.query?.id as unknown as number
  // 编辑状态下有查询参数空间id，则先获取已有的空间信息
  if (spaceId) {
    const res = await getSpaceVoByIdUsingGet({ id: spaceId })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
      spaceForm.spaceName = res.data.data.spaceName
      spaceForm.spaceLevel = res.data.data.spaceLevel
      // spaceForm.maxSize = res.data.data.maxSize
      // spaceForm.maxCount = res.data.data.maxCount
    }
  }
}

onMounted(() => {
  fetchSpaceLevelList()
  getOldSpace()
})
</script>

<style scoped>
#add-space-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 20px;
}
</style>
