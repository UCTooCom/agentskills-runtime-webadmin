<script lang="ts" setup>
import type { entity } from '@/store/models/uctoo'
import {
  TinyCol,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Input as TinyInput,
  TinyRow,
  DatePicker as TinyDatePicker,
  Select as TinySelect,
} from '@opentiny/vue'
import { computed, reactive, ref, unref, watch } from 'vue'
import { removeNull, getChangedFields } from '@/utils/data'

const props = defineProps<{
  entityData: Partial<entity>
  readonly: boolean
}>()

// 验证规则
const rulesRequired = {
  required: true,
  trigger: 'blur',
}

const rulesNumber = {
  type: 'number',
  min: 0,
  trigger: 'blur',
}

const rules = computed(() => {
  return {
    link: [rulesRequired],
    privacy_level: [rulesRequired, rulesNumber],
    stars: [rulesRequired, rulesNumber],
  }
})

const editForm = ref()

// 保存原始数据，用于对比修改
const originalData = ref<Partial<entity>>({})

const formData = reactive<Partial<entity>>({
  id: props.entityData.id,
  link: props.entityData.link || '',
  privacy_level: props.entityData.privacy_level || 0,
  stars: props.entityData.stars || 0,
  description: props.entityData.description || '',
  group_id: props.entityData.group_id || '',
  picture: props.entityData.picture || '',
  images: props.entityData.images || '',
  content: props.entityData.content || '',
  json: props.entityData.json || '',
  city: props.entityData.city || '',
  price: props.entityData.price || 0,
  birthday: props.entityData.birthday || '',
  owner: props.entityData.owner || '',
  end_time: props.entityData.end_time || '',
  start_time: props.entityData.start_time || '',
  status: props.entityData.status || '',
})

// 监听 entityData 变化，保存原始数据
watch(() => props.entityData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    // 保存原始数据副本（保持原始值，不进行转换）
    originalData.value = JSON.parse(JSON.stringify(newData))
    
    // 更新表单数据（用于显示，可以进行空值转换）
    Object.assign(formData, {
      id: newData.id,
      link: newData.link ?? '',
      privacy_level: newData.privacy_level ?? 0,
      stars: newData.stars ?? 0,
      description: newData.description ?? '',
      group_id: newData.group_id ?? '',
      picture: newData.picture ?? '',
      images: newData.images ?? '',
      content: newData.content ?? '',
      json: newData.json ?? '',
      city: newData.city ?? '',
      price: newData.price ?? 0,
      birthday: newData.birthday ?? '',
      owner: newData.owner ?? '',
      end_time: newData.end_time ?? '',
      start_time: newData.start_time ?? '',
      status: newData.status ?? '',
    })
  }
}, { immediate: true, deep: true })

// 状态选项
const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
  { label: '待审核', value: 'pending' },
]

function getFormData() {
  // 准备当前数据，确保数字类型
  const currentData = {
    ...unref(formData),
    privacy_level: Number(formData.privacy_level),
    stars: Number(formData.stars),
    price: formData.price ? Number(formData.price) : null,
  } as Partial<entity>
  
  // 调试日志
  console.log('=== getFormData Debug ===')
  console.log('originalData:', originalData.value)
  console.log('currentData:', currentData)
  
  // 如果有原始数据，只返回修改的字段
  if (originalData.value && originalData.value.id) {
    const changedFields = getChangedFields(originalData.value, currentData)
    console.log('changedFields:', changedFields)
    
    // 如果没有修改任何字段，返回 null
    if (Object.keys(changedFields).length === 1 && changedFields.id) {
      console.log('No changes detected, returning null')
      return null
    }
    
    // 移除 null 值，保留空字符串
    const result = removeNull(changedFields) as Partial<entity>
    console.log('Final result (after removeNull):', result)
    return result
  }
  
  // 新增模式：移除 null 和空字符串
  console.log('New mode, returning removeNull(currentData)')
  return removeNull(currentData) as Partial<entity>
}

defineExpose({
  getFormData,
  valid: async () => editForm.value.validate(),
})
</script>

<template>
  <TinyForm
    ref="editForm"
    :display-only="props.readonly"
    :rules="rules"
    :model="formData"
    label-position="left"
    label-width="120px"
  >
    <TinyRow class="flex flex-wrap">
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem label="ID" prop="id">
          <TinyInput v-model="formData.id" disabled />
        </TinyFormItem>
      </TinyCol>
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem label="link" prop="link">
          <TinyInput v-model="formData.link" />
        </TinyFormItem>
      </TinyCol>
    </TinyRow>

    <TinyRow class="flex flex-wrap">
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem label="privacy_level" prop="privacy_level">
          <TinyInput v-model="formData.privacy_level" type="number" :min="0" />
        </TinyFormItem>
      </TinyCol>
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem label="stars" prop="stars">
          <TinyInput v-model="formData.stars" type="number" :min="0" />
        </TinyFormItem>
      </TinyCol>
    </TinyRow>

    <TinyRow class="flex flex-wrap">
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem label="group_id" prop="group_id">
          <TinyInput v-model="formData.group_id" />
        </TinyFormItem>
      </TinyCol>
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem label="price" prop="price">
          <TinyInput v-model="formData.price" type="number" :min="0" step="0.01" />
        </TinyFormItem>
      </TinyCol>
    </TinyRow>

    <TinyRow class="flex flex-wrap">
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem label="city" prop="city">
          <TinyInput v-model="formData.city" />
        </TinyFormItem>
      </TinyCol>
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem label="owner" prop="owner">
          <TinyInput v-model="formData.owner" />
        </TinyFormItem>
      </TinyCol>
    </TinyRow>

    <TinyRow class="flex flex-wrap">
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem label="status" prop="status">
          <TinySelect v-model="formData.status" :options="statusOptions" />
        </TinyFormItem>
      </TinyCol>
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem label="birthday" prop="birthday">
          <TinyDatePicker
            v-model="formData.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
          />
        </TinyFormItem>
      </TinyCol>
    </TinyRow>

    <TinyRow class="flex flex-wrap">
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem label="start_time" prop="start_time">
          <TinyDatePicker
            v-model="formData.start_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始时间"
          />
        </TinyFormItem>
      </TinyCol>
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem label="end_time" prop="end_time">
          <TinyDatePicker
            v-model="formData.end_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择结束时间"
          />
        </TinyFormItem>
      </TinyCol>
    </TinyRow>

    <TinyRow class="flex flex-wrap">
      <TinyCol class="w-full">
        <TinyFormItem label="description" prop="description">
          <TinyInput
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </TinyFormItem>
      </TinyCol>
    </TinyRow>

    <TinyRow class="flex flex-wrap">
      <TinyCol class="w-full">
        <TinyFormItem label="content" prop="content">
          <TinyInput
            v-model="formData.content"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </TinyFormItem>
      </TinyCol>
    </TinyRow>

    <TinyRow class="flex flex-wrap">
      <TinyCol class="w-full">
        <TinyFormItem label="json" prop="json">
          <TinyInput
            v-model="formData.json"
            type="textarea"
            :rows="3"
            placeholder="请输入JSON数据"
          />
        </TinyFormItem>
      </TinyCol>
    </TinyRow>

    <TinyRow class="flex flex-wrap">
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem label="picture" prop="picture">
          <TinyInput v-model="formData.picture" placeholder="图片URL" />
        </TinyFormItem>
      </TinyCol>
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem label="images" prop="images">
          <TinyInput v-model="formData.images" placeholder="图片列表" />
        </TinyFormItem>
      </TinyCol>
    </TinyRow>
  </TinyForm>
</template>
