<template>
  <div id="space-analyze-page">
    <h2 style="margin-bottom: 16px">
      空间图库分析 -
      <span v-if="queryAll">全部空间</span>
      <span v-else-if="queryPublic">公共图库</span>
      <span v-else>
        <a :href="`/space/${spaceId}`" target="_blank">独立空间：{{ space?.spaceName }}</a>
      </span>
    </h2>
    <a-row :gutter="[16, 16]">
      <!-- 空间使用分析 -->
      <a-col :xs="24" :md="12">
        <SpaceUsageAnalysis :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>
      <!-- 空间分类分析 -->
      <a-col :xs="24" :md="12">
        <SpaceCategoryAnalysis :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>
      <!-- 标签分析 -->
      <a-col :xs="24" :md="12">
        <SpaceTagAnalysis :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>
      <!-- 图片大小分段分析 -->
      <a-col :xs="24" :md="12">
        <SpaceSizeAnalysis :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>
      <!-- 用户上传行为分析 -->
      <a-col :xs="24" :md="12">
        <SpaceUserAnalysis :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>
      <!-- 空间使用排行分析 -->
      <a-col :xs="24" :md="12">
        <SpaceRankAnalysis :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import SpaceUsageAnalysis from '@/components/analyze/SpaceUsageAnalysis.vue'
import SpaceCategoryAnalysis from '@/components/analyze/SpaceCategoryAnalysis.vue'
import SpaceTagAnalysis from '@/components/analyze/SpaceTagAnalysis.vue'
import SpaceSizeAnalysis from '@/components/analyze/SpaceSizeAnalysis.vue'
import SpaceUserAnalysis from '@/components/analyze/SpaceUserAnalysis.vue'
import SpaceRankAnalysis from '@/components/analyze/SpaceRankAnalysis.vue'

import { useRoute } from 'vue-router'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { getSpaceVoByIdUsingGet } from '@/api/space-controller'

const route = useRoute()
// 接收路由参数
const spaceId = computed(() => route.query?.spaceId as unknown as number)
const queryAll = computed(() => !!route.query?.queryAll)
const queryPublic = computed(() => !!route.query?.queryPublic)

const space = ref<API.SpaceVO>()
/** 获取图片所在的空间信息 */
const fetchSpace = async () => {
  if (spaceId.value) {
    const res = await getSpaceVoByIdUsingGet({ id: spaceId.value })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    }
  }
}

onMounted(() => {
  fetchSpace()
})

watchEffect(() => {
  fetchSpace()
})
</script>

<style scoped></style>
