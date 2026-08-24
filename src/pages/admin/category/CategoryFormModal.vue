<template>
  <a-modal
    v-model:open="visible"
    :title="editingCategoryId ? '编辑分类' : '新增分类'"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="categoryForm" layout="vertical">
      <a-form-item
        name="categoryName"
        label="分类名称"
        :rules="[{ required: true, message: '请输入分类名称' }]"
      >
        <a-input
          v-model:value="categoryForm.categoryName"
          placeholder="请输入分类名称"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'antdv-next'

import { addCategoryUsingPost, updateCategoryUsingPost } from '@/api/category-controller'

const emit = defineEmits<{
  success: []
}>()

// 弹窗显隐状态由组件内部管理
const visible = ref(false)
const loading = ref(false)
const formRef = ref()
const categoryForm = reactive<CATEGORY_API.CategoryAddRequest>({
  categoryName: '',
})
// 编辑时记录分类 id，null 表示新增
const editingCategoryId = ref<number | null>(null)

/**
 * 打开弹窗
 * @param category 编辑时的分类数据；不传或 null 表示新增模式
 */
const show = (category?: CATEGORY_API.CategoryVO | null) => {
  formRef.value?.resetFields()
  editingCategoryId.value = category?.id ?? null
  categoryForm.categoryName = category?.categoryName ?? ''
  visible.value = true
}

/** 关闭弹窗 */
const hide = () => {
  visible.value = false
  editingCategoryId.value = null
}

defineExpose({ show, hide })

/** 取消关闭弹窗 */
const handleCancel = () => {
  hide()
}

/**
 * 提交新增或编辑表单
 * @description 有 editingCategoryId 时走更新接口，否则走新增接口
 */
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  loading.value = true
  const res = editingCategoryId.value
    ? await updateCategoryUsingPost({
        id: editingCategoryId.value,
        categoryName: categoryForm.categoryName,
      })
    : await addCategoryUsingPost({ categoryName: categoryForm.categoryName })
  if (res.data.code === 0) {
    message.success(editingCategoryId.value ? '分类编辑成功' : '分类新增成功')
    hide()
    emit('success')
  } else {
    message.error((editingCategoryId.value ? '分类编辑失败' : '分类新增失败') + res.data.message)
  }
  loading.value = false
}
</script>

<style scoped></style>
