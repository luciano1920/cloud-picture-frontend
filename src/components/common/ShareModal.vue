<template>
  <div class="share-modal">
    <a-modal v-model:open="visible" :title="title" :footer="false" @cancel="closeModal">
      <h4>复制分享链接</h4>
      <a-typography-link copyable>
        {{ props.link }}
      </a-typography-link>

      <div style="margin-bottom: 16px"></div>

      <h4>手机扫码查看</h4>
      <a-qrcode :value="link" />
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

interface Props {
  link: string
  title?: string
}
const props = withDefaults(defineProps<Props>(), {
  link: 'http://www.baidu.com',
  title: '分享图片',
})
const visible = ref<boolean>(false)

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

defineExpose({
  openModal,
})
</script>
