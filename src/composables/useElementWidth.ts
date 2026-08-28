import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * 监听元素宽度（响应容器/窗口变化），返回响应式宽度。必须在 setup 中调用（内部注册了生命周期钩子）
 * @param el 元素
 */
export const useElementWidth = (el: Ref<HTMLElement | undefined>) => {
  const width = ref(0)
  let observer: ResizeObserver | null = null

  onMounted(() => {
    const node = el.value
    if (!node) return

    // observe 时 ResizeObserver 会立即触发一次回调，初始值就有了
    observer = new ResizeObserver((entries) => {
      // 直接用回调给的数据，避免再读 clientWidth 触发强制布局
      width.value = entries[0]?.contentRect.width ?? node.clientWidth
    })
    observer.observe(node)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return width
}
