<template>
  <a-modal
    v-model:open="visible"
    :title="editingTagId ? '编辑标签' : '新增标签'"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="tagForm" layout="vertical">
      <a-form-item
        name="tagName"
        label="标签名称"
        :rules="[{ required: true, message: '请输入标签名称' }]"
      >
        <a-input v-model:value="tagForm.tagName" placeholder="请输入标签名称" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'antdv-next'

import { addTagUsingPost, updateTagUsingPost } from '@/api/tag-controller'

const emit = defineEmits<{
  success: []
}>()

// 弹窗显隐状态由组件内部管理
const visible = ref(false)
const loading = ref(false)
const formRef = ref()
const tagForm = reactive<TAG_API.TagAddRequest>({ tagName: '' })
// 编辑时记录标签 id，null 表示新增
const editingTagId = ref<number | null>(null)

/**
 * 打开弹窗
 * @param tag 编辑时的标签数据；不传或 null 表示新增模式
 */
const show = (tag?: TAG_API.TagVO | null) => {
  formRef.value?.resetFields()
  editingTagId.value = tag?.id ?? null
  tagForm.tagName = tag?.tagName ?? ''
  visible.value = true
}

/** 关闭弹窗 */
const hide = () => {
  visible.value = false
  editingTagId.value = null
}

defineExpose({ show, hide })

/** 取消关闭弹窗 */
const handleCancel = () => {
  hide()
}

/**
 * 提交新增或编辑表单
 * @description 有 editingTagId 时走更新接口，否则走新增接口
 */
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  loading.value = true
  const res = editingTagId.value
    ? await updateTagUsingPost({ id: editingTagId.value, tagName: tagForm.tagName })
    : await addTagUsingPost({ tagName: tagForm.tagName })
  if (res.data.code === 0) {
    message.success(editingTagId.value ? '标签编辑成功' : '标签新增成功')
    hide()
    emit('success')
  } else {
    message.error((editingTagId.value ? '标签编辑失败' : '标签新增失败') + res.data.message)
  }
  loading.value = false
}
</script>

<style scoped></style>
