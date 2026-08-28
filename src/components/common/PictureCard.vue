<template>
  <div class="picture-card-stack">
    <!-- 底下叠的两层纯色卡片（视觉层） -->
    <div class="stack-card stack-card-1" :style="stackCardStyle1"></div>
    <div class="stack-card stack-card-2" :style="stackCardStyle2"></div>

    <div
      class="picture-card"
      :class="{ 'always-show-bar': alwaysShowBar }"
      @click="handleCardClick"
    >
      <div class="picture-card-tag-bar">
        <slot name="tag"></slot>
      </div>

      <div class="picture-card-image-wrapper">
        <img
          :src="picture.thumbnailUrl ?? picture.url"
          :alt="picture.picName ?? '图片'"
          class="picture-card-image"
        />
      </div>

      <div v-if="showActionBar" class="picture-card-action-bar">
        <span class="picture-card-name">{{ picture.picName }}</span>
        <div class="picture-card-actions">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>

    <div v-if="showInfo" class="picture-card-info">
      <div class="picture-info-title">{{ picture.picName }}</div>
      <div class="picture-info-meta">
        <div class="user-info">
          <a-avatar :size="20" :src="picture.user?.userAvatar" />
          <div class="user-name">{{ picture.user?.userName }}</div>
        </div>
        <div class="view-info">
          <EyeOutlined />
          {{ picture.viewCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EyeOutlined } from '@antdv-next/icons'

interface Props {
  /** 图片数据 */
  picture: PICTURE_API.PictureVO
  /** 是否始终显示底部毛玻璃操作栏，设置为false则鼠标悬停时才显示，需showActionBar设置为true */
  alwaysShowBar?: boolean
  /** 是否显示底部毛玻璃操作栏 */
  showActionBar?: boolean
  /** 是否显示底部叠卡投影 */
  showStackShadow?: boolean
  /** 是否显示图片底部信息栏 */
  showInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alwaysShowBar: false,
  showActionBar: false,
  showStackShadow: false,
  showInfo: false,
})

const emit = defineEmits<{
  'card-click': [picture: PICTURE_API.PictureVO]
}>()

/** 点击卡片跳转图片详情 */
const handleCardClick = () => {
  emit('card-click', props.picture)
}

/** 主色调 */
const mainColor = computed(() => props.picture.picColor ?? '#409EFF')

/** 第一层叠卡（靠上）：降低饱和度和透明度 */
const stackCardStyle1 = computed(() => {
  return props.showStackShadow
    ? { background: mainColor.value, filter: 'opacity(0.32) saturate(0.45)' }
    : {}
})

/** 第二层叠卡（靠下）：进一步降低饱和度和透明度 */
const stackCardStyle2 = computed(() => {
  return props.showStackShadow
    ? { background: mainColor.value, filter: 'opacity(0.2) saturate(0.4)' }
    : {}
})
</script>

<style lang="scss" scoped>
.picture-card-stack {
  position: relative;
  /* 新增：让卡片图片区和 info 区纵向瓜分 item 的高度 */
  display: flex;
  flex-direction: column;
  height: 100%;

  .stack-card {
    position: absolute;
    top: 0;
    bottom: 0px; /* 与主卡片同高 */
    left: 50%;
    border-radius: 16px;
  }

  .stack-card-1 {
    width: 360px;
    transform: translateX(-50%) translateY(12px);
  }

  .stack-card-2 {
    width: 334px;
    transform: translateX(-50%) translateY(24px);
  }
}

.picture-card {
  position: relative;
  z-index: 2;
  border-radius: 16px;
  height: 100%;
  overflow: hidden;
  cursor: pointer;

  .picture-card-tag-bar {
    position: absolute;
    top: 5%;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    padding: 0 24px;
    box-sizing: border-box;
    overflow: hidden;
    z-index: 3; /* 确保tag栏始终显示在图片上方 */
  }

  .picture-card-image-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .picture-card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s ease;
      display: block;
    }
  }

  .picture-card-action-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 24px;
    box-sizing: border-box;
    height: 52px;
    background: rgba(0, 0, 0, 0);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    /* 隐藏态 */
    opacity: 0;
    transform: translateY(100%);
    pointer-events: none; /* 防止看不见的按钮挡住点击 */
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;

    .picture-card-name {
      color: #fff;
      font-weight: 600;
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }

    .picture-card-actions {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }

  /* ============ 显示态：hover 或 always-show-bar ============ */
  &:hover .picture-card-image {
    transform: scale(1.12);
  }

  &:hover .picture-card-action-bar,
  &.always-show-bar .picture-card-action-bar {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

.picture-card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 2px;

  .picture-info-title {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.3;
    margin-left: 2px;
    color: #303133;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .picture-info-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    .user-info {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
    }

    .view-info {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #9ca3af;
      flex-shrink: 0;
      margin-left: auto;
    }
  }
}
</style>
