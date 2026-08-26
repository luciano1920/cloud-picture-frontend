<template>
  <div
    class="picture-card"
    :style="cardStyle"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    @click="handleClick"
  >
    <!-- 图片区域 -->
    <div class="picture-card-image-wrapper">
      <img
        :src="picture.thumbnailUrl ?? picture.url ?? ''"
        :alt="picture.picName ?? '图片'"
        class="picture-card-image"
        :class="{ 'is-zoomed': isHovering }"
      />
    </div>

    <!-- 底部模糊毛玻璃横栏 -->
    <Transition name="bar-fade">
      <div v-if="isHovering" class="picture-card-bar">
        <span class="picture-card-name">{{ picture.picName }}</span>
        <div class="picture-card-actions">
          <slot name="actions">
            <a-button type="text" size="small" class="picture-card-action-btn" @click.stop>
              <template #icon><LikeOutlined /></template>
            </a-button>
            <a-button type="text" size="small" class="picture-card-action-btn" @click.stop>
              <template #icon><DownloadOutlined /></template>
            </a-button>
            <a-button type="text" size="small" class="picture-card-action-btn" @click.stop>
              <template #icon><ShareAltOutlined /></template>
            </a-button>
          </slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { LikeOutlined, DownloadOutlined, ShareAltOutlined } from '@antdv-next/icons'

interface Props {
  /** 图片数据 */
  picture: PICTURE_API.PictureVO
  /** 卡片高度，默认 240px */
  height?: number
  /** 点击卡片是否跳转图片详情，默认 true */
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 240,
  clickable: true,
})

const emit = defineEmits<{
  click: [picture: PICTURE_API.PictureVO]
}>()

const router = useRouter()

const isHovering = ref(false)

const cardStyle = computed(() => ({
  height: `${props.height}px`,
}))

/** 点击卡片跳转图片详情 */
const handleClick = () => {
  emit('click', props.picture)
  if (props.clickable && props.picture.id) {
    router.push({
      path: `/picture/${props.picture.id}`,
    })
  }
}
</script>

<style lang="scss" scoped>
.picture-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: #f5f5f5;

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

      &.is-zoomed {
        transform: scale(1.12);
      }
    }
  }

  .picture-card-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    pointer-events: auto;

    .picture-card-name {
      color: #fff;
      font-weight: 500;
      font-size: 14px;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      min-width: 0;
      margin-right: 8px;
    }

    .picture-card-actions {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 6px;

      .picture-card-action-btn {
        width: 30px;
        height: 30px;
        border-radius: 6px;
        background: #fff;
        border: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background: #f0f0f0;
        }

        :deep(.anticon) {
          color: #000;
          font-size: 15px;
        }
      }
    }
  }
}

// 底部横栏动画
.bar-fade-enter-active {
  animation: bar-in 0.25s ease;
}

.bar-fade-leave-active {
  animation: bar-out 0.2s ease;
}

@keyframes bar-in {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bar-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
}
</style>