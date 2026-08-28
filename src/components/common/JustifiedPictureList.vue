<template>
  <div ref="bodyRef" class="justified-picture-list">
    <div
      v-for="row in layoutRows"
      :key="row.startIndex"
      class="justified-row"
      :style="{ height: `${row.height}px`, gap: `${gap}px`, marginBottom: `${gap + 8}px` }"
    >
      <div
        v-for="item in row.items"
        :key="item.key"
        class="justified-item"
        :style="{ width: `${item.width}px` }"
      >
        <slot name="item" :picture="item.data"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useElementWidth } from '@/composables/useElementWidth'
import { justifyLayout, type JustifyItem, type JustifyRow } from '@/utils/justify-layout'

interface Props {
  /** 当前页数据（整页替换） */
  dataList?: PICTURE_API.PictureVO[]
  /** 目标行高 */
  targetRowHeight?: number
  /** 行高下限，低于则退一张图到下一行 */
  minRowHeight?: number
  /** 间距 */
  gap?: number
  /** 图片缺尺寸时的兜底宽高比 */
  fallbackRatio?: number
  /** 行内除图片外附加内容的高度（如卡片信息栏），布局时预留，默认 0 */
  extraHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  targetRowHeight: 350,
  minRowHeight: 160,
  gap: 12,
  fallbackRatio: 4 / 3,
  extraHeight: 0,
})

const bodyRef = ref<HTMLElement>()
const containerWidth = useElementWidth(bodyRef) // 容器宽度

// ==================== Justified 布局：贪心分行 ====================

/** 布局算法的输入 */
const layoutInputs = computed<JustifyItem<PICTURE_API.PictureVO>[]>(() =>
  props.dataList.map((picture, index) => ({
    key: `${picture.id ?? index}`,
    ratio:
      picture.picWidth && picture.picHeight
        ? picture.picWidth / picture.picHeight
        : props.fallbackRatio,
    data: picture,
    width: 0, // 实际宽度在行高确定后计算
    index,
  })),
)

/** 行数据：输入或容器宽度任一变化即自动重排 */
const layoutRows = computed<JustifyRow<PICTURE_API.PictureVO>[]>(() =>
  justifyLayout(layoutInputs.value, containerWidth.value, {
    targetRowHeight: props.targetRowHeight,
    minRowHeight: props.minRowHeight,
    gap: props.gap,
    extraHeight: props.extraHeight,
  }),
)
</script>

<style lang="scss" scoped>
.justified-picture-list {
  width: 100%;
  min-height: 200px; /* 避免空数据/首屏 loading 时高度塌陷 */

  .justified-row {
    display: flex;

    .justified-item {
      height: 100%;
      flex-shrink: 0;
      overflow: hidden;
    }
  }
}
</style>
