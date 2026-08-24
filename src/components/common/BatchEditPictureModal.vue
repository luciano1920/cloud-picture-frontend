<template>
  <div class="batch-edit-picture-modal">
    <a-modal v-model:open="visible" :title="title" :footer="false" @cancel="closeModal">
      <a-typography-paragraph type="secondary">* 只对当前页面的图片生效</a-typography-paragraph>

      <!-- 图片信息表单 -->
      <a-form layout="vertical" :model="formData" @finish="handleSubmit">
        <a-form-item name="category" label="分类">
          <a-auto-complete
            v-model:value="formData.category"
            placeholder="请输入图片分类"
            :options="categoryOptions"
            allow-clear
          />
        </a-form-item>

        <a-form-item name="tags" label="标签">
          <a-select
            v-model:value="formData.tags"
            mode="tags"
            placeholder="请输入图片标签"
            :options="tagsOptions"
            allow-clear
          />
        </a-form-item>

        <a-form-item name="nameRule" label="命名规则">
          <a-input
            v-model:value="formData.nameRule"
            placeholder="请输入命名规则，输入 {序号} 可动态生成"
            allow-clear
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">提交</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { message } from 'antdv-next'
import {
  editPictureByBatchUsingPost,
  listPictureTagCategoryVoUsingGet,
} from '@/api/picture-controller'

interface Props {
  title?: string
  pictureList: API.PictureVO[]
  spaceId: number
  onSuccess?: () => void
}
const props = withDefaults(defineProps<Props>(), { title: '批量编辑图片' })
const visible = ref<boolean>(false)

// 表单数据
const formData = reactive<API.PictureEditByBatchRequest>({
  category: '',
  tags: [],
  nameRule: '',
})

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

// 图片分类和标签选项
interface Option {
  value: string
  label: string
}
const categoryOptions = ref<Option[]>([])
const tagsOptions = ref<Option[]>([])

/** 获取标签分类选项 */
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryVoUsingGet()
  if (res.data.code === 0 && res.data.data) {
    categoryOptions.value = (res.data.data.categoryList ?? []).map((item: string) => {
      return {
        value: item,
        label: item,
      }
    })
    tagsOptions.value = (res.data.data.tagList ?? []).map((item: string) => {
      return {
        value: item,
        label: item,
      }
    })
  } else {
    message.error('获取标签分类选项失败' + res.data.message)
  }
}

/**
 * 提交表单
 * @param values 提交的表单formData
 */
const handleSubmit = async (values: any) => {
  if (!props.pictureList) {
    return
  }

  const res = await editPictureByBatchUsingPost({
    pictureIdList: props.pictureList.map((picture) => picture.id),
    spaceId: props.spaceId,
    ...values,
  })
  // 提交成功
  if (res.data.code === 0 && res.data.data) {
    message.success('批量编辑图片成功')
    closeModal()
    props.onSuccess?.()
  } else {
    message.error('批量编辑图片失败，' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

defineExpose({
  openModal,
})
</script>
