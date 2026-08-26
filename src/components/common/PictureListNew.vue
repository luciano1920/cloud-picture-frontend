<template>
  <div class="picture-list-new">
    <a-spin :spinning="loading" tip="加载中...">
      <a-masonry :columns="columns" :gutter="16" :items="masonryItems">
        <template #itemRender="{ data: picture }">
          <PictureCard :picture="picture" />
        </template>
      </a-masonry>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PictureCard from './PictureCard.vue'
import type { MasonryItemType } from 'antdv-next/dist/masonry/MasonryItem'

interface Props {
  /** 图片列表数据 */
  dataList?: PICTURE_API.PictureVO[]
  /** 加载状态 */
  loading?: boolean
  /** 瀑布流列数 */
  columns?: number
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  columns: 4,
})

const masonryItems = computed<MasonryItemType[]>(() => {
  return props.dataList.map((item, index) => ({
    key: `card-${item.id ?? index}`,
    data: item,
  }))
})
</script>

<style lang="scss" scoped>
.picture-list-new {
  width: 100%;
}
</style>