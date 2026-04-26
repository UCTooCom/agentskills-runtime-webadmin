<script lang="ts" setup>
import { registerPageTool } from '@opentiny/next-sdk'
import {
  Notify,
  Button as TinyButton,
  DialogBox as TinyDialogBox,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Input as TinyInput,
  DatePicker as TinyDatePicker,
  Row as TinyRow,
  Col as TinyCol,
  Switch as TinySwitch,
  Modal as TinyModal,
} from '@opentiny/vue'
import { onMounted, onUnmounted, reactive, ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { entity } from '@/store/models/uctoo'
import { useAxiosRepo } from '@pinia-orm/axios'
import { useDisclosure } from '@/hooks/useDisclosure'
import { sleep, removeEmpty } from '@/utils/base-utils'

const emits = defineEmits<{
  entityChange: []
  batchRemove: []
  exportEntity: []
  recycleBinChange: [boolean]
  batchRestore: []
  emptyRecycleBin: []
  batchPermanentDelete: []
}>()
const { open, onOpen, onClose } = useDisclosure()
const entityForm = ref()
const i18n = useI18n()

// 回收站相关
const isRecycleBin = ref(false)

const formModel = reactive({
  link: '',
  privacy_level: 0,
  stars: 0,
  description: '',
  group_id: '',
  picture: '',
  images: '',
  content: '',
  json: '',
  city: '',
  price: 0,
  birthday: '',
  owner: '',
  end_time: '',
  start_time: '',
  status: '',
})

function onBatchRemove() {
  emits('batchRemove')
}

function onExportEntity() {
  emits('exportEntity')
}

// 批量恢复
function onBatchRestore() {
  emits('batchRestore')
}

// 清空回收站
function onEmptyRecycleBin() {
  TinyModal.confirm({
    title: '清空回收站确认',
    message: '确定要清空回收站吗？此操作将彻底删除所有回收站中的数据，无法恢复！',
    onConfirm: () => {
      emits('emptyRecycleBin')
    },
  })
}

// 批量彻底删除
function onBatchPermanentDelete() {
  emits('batchPermanentDelete')
}

// 回收站切换
function handleRecycleBinChange(checked: boolean) {
  isRecycleBin.value = checked
  emits('recycleBinChange', checked)
}

const rules = {
  link: [
    {
      required: true,
      trigger: 'blur',
    },
  ],
  privacy_level: [
    {
      required: true,
      trigger: 'blur',
    },
  ],
  stars: [
    {
      required: true,
      trigger: 'blur',
    },
  ],
}

function addEntity() {
  entityForm.value
    .validate()
    .then(() => {
      const submitData = { ...formModel }
      
      // 转换数字类型
      if (submitData.privacy_level !== undefined) {
        submitData.privacy_level = Number(submitData.privacy_level)
      }
      if (submitData.stars !== undefined) {
        submitData.stars = Number(submitData.stars)
      }
      if (submitData.price !== undefined) {
        submitData.price = Number(submitData.price)
      }

      // 移除空字符串、null和undefined值
      const cleanedData = removeEmpty(submitData)

      useAxiosRepo(entity).api().addEntity(cleanedData)
        .then(() => {
          // 重置表单
          Object.keys(formModel).forEach((key) => {
            formModel[key] = ''
          })
          formModel.privacy_level = 0
          formModel.stars = 0
          formModel.price = 0
          emits('entityChange')
        })
        .catch((reason) => {
          Notify({
            type: 'error',
            message: reason.response.data.message,
          })
        })
        .finally(() => {
          onClose()
        })
    })
}

// registerPageTool 返回 cleanup 函数，在 onUnmounted 中调用
let cleanupPageTool: () => void

onMounted(async () => {
  cleanupPageTool = registerPageTool({
    handlers: {
      // create-entity 工具Handler
      'create-entity': async (params: any) => {
        const {
          link,
          description,
          privacy_level = 'public',
          stars = 0,
          price = 0,
          owner,
          status = 'active',
          city,
          group_id,
          picture,
          images,
          content,
          json,
          birthday,
          end_time,
          start_time
        } = params
        
        // 打开新增对话框
        onOpen()
        await sleep(500)
        
        // 填充表单数据
        formModel.link = link || ''
        formModel.description = description || ''
        formModel.privacy_level = privacy_level === 'public' ? 0 : 1
        formModel.stars = Number(stars) || 0
        formModel.price = Number(price) || 0
        formModel.owner = owner || ''
        formModel.status = status || 'active'
        formModel.city = city || ''
        formModel.group_id = group_id || ''
        formModel.picture = picture || ''
        formModel.images = images || ''
        formModel.content = content || ''
        formModel.json = json || ''
        formModel.birthday = birthday || ''
        formModel.end_time = end_time || ''
        formModel.start_time = start_time || ''
        
        await nextTick()
        await sleep(500)
        
        // 提交表单
        try {
          await addEntity()
          return {
            content: [{
              type: 'text' as const,
              text: `创建entity成功，link: ${link}`
            }]
          }
        } catch (error: any) {
          return {
            content: [{
              type: 'text' as const,
              text: `创建entity失败: ${error.response?.data?.message || '未知错误'}`
            }]
          }
        }
      },
    },
  })
})

// 页面卸载时取消注册，避免内存泄漏和消息串扰
onUnmounted(() => cleanupPageTool?.())
</script>

<template>
  <div class="entity-add-container">
    <div class="entity-add-btn">
      <!-- 正常状态按钮 -->
      <template v-if="!isRecycleBin">
        <TinyButton v-permission="'uctoo:entity:add'" show-footer type="primary" round @click="onOpen">
          {{ $t('page.Add') }}
        </TinyButton>
        <TinyButton v-permission="'uctoo:entity:batch-del'" round @click="onBatchRemove">
          {{ $t('page.BatchDelete') }}
        </TinyButton>
        <TinyButton v-permission="'uctoo:entity:all'" round @click="onExportEntity">
          {{ $t('page.Export') }}
        </TinyButton>
      </template>
      
      <!-- 回收站状态按钮 -->
      <template v-else>
        <TinyButton v-permission="'uctoo:entity:batch-del'" type="danger" round @click="onEmptyRecycleBin">
          清空
        </TinyButton>
        <TinyButton v-permission="'uctoo:entity:batch-del'" round @click="onBatchRestore">
          批量恢复
        </TinyButton>
        <TinyButton v-permission="'uctoo:entity:batch-del'" type="danger" round @click="onBatchPermanentDelete">
          批量彻底删除
        </TinyButton>
      </template>
    </div>
    <div class="recycle-bin-switch">
      <TinySwitch
        v-model="isRecycleBin"
        :show-text="true"
        :checked-text="'回收站'"
        :unchecked-text="'回收站'"
        @change="handleRecycleBinChange"
      />
    </div>
    <TinyDialogBox
      v-model:visible="open"
      :title="$t('page.Add')"
      width="800px"
      :close-on-click-modal="false"
      dialog-class="entity-dialog-box"
    >
      <TinyForm
        ref="entityForm"
        :model="formModel"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <TinyRow>
          <TinyCol :span="12">
            <TinyFormItem label="link" prop="link">
              <TinyInput v-model="formModel.link" />
            </TinyFormItem>
          </TinyCol>
          <TinyCol :span="12">
            <TinyFormItem label="privacy_level" prop="privacy_level">
              <TinyInput v-model="formModel.privacy_level" type="number" :min="0" />
            </TinyFormItem>
          </TinyCol>
        </TinyRow>
        <TinyRow>
          <TinyCol :span="12">
            <TinyFormItem label="stars" prop="stars">
              <TinyInput v-model="formModel.stars" type="number" :min="0" />
            </TinyFormItem>
          </TinyCol>
          <TinyCol :span="12">
            <TinyFormItem label="group_id" prop="group_id">
              <TinyInput v-model="formModel.group_id" />
            </TinyFormItem>
          </TinyCol>
        </TinyRow>
        <TinyRow>
          <TinyCol :span="12">
            <TinyFormItem label="price" prop="price">
              <TinyInput v-model="formModel.price" type="number" :min="0" step="0.01" />
            </TinyFormItem>
          </TinyCol>
          <TinyCol :span="12">
            <TinyFormItem label="birthday" prop="birthday">
              <TinyDatePicker
                v-model="formModel.birthday"
                type="date"
                value-format="yyyy-MM-dd"
                :placeholder="$t('page.PleaseSelect')"
              />
            </TinyFormItem>
          </TinyCol>
        </TinyRow>
        <TinyRow>
          <TinyCol :span="12">
            <TinyFormItem label="owner" prop="owner">
              <TinyInput v-model="formModel.owner" />
            </TinyFormItem>
          </TinyCol>
          <TinyCol :span="12">
            <TinyFormItem label="status" prop="status">
              <TinyInput v-model="formModel.status" />
            </TinyFormItem>
          </TinyCol>
        </TinyRow>
        <TinyRow>
          <TinyCol :span="12">
            <TinyFormItem label="start_time" prop="start_time">
              <TinyDatePicker
                v-model="formModel.start_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :placeholder="$t('page.PleaseSelect')"
              />
            </TinyFormItem>
          </TinyCol>
          <TinyCol :span="12">
            <TinyFormItem label="end_time" prop="end_time">
              <TinyDatePicker
                v-model="formModel.end_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :placeholder="$t('page.PleaseSelect')"
              />
            </TinyFormItem>
          </TinyCol>
        </TinyRow>
        <TinyRow>
          <TinyCol :span="24">
            <TinyFormItem label="description" prop="description">
              <TinyInput
                v-model="formModel.description"
                type="textarea"
                :rows="3"
                :placeholder="$t('page.PleaseInput')"
              />
            </TinyFormItem>
          </TinyCol>
        </TinyRow>
        <TinyRow>
          <TinyCol :span="24">
            <TinyFormItem label="content" prop="content">
              <TinyInput
                v-model="formModel.content"
                type="textarea"
                :rows="3"
                :placeholder="$t('page.PleaseInput')"
              />
            </TinyFormItem>
          </TinyCol>
        </TinyRow>
        <TinyRow>
          <TinyCol :span="24">
            <TinyFormItem label="json" prop="json">
              <TinyInput
                v-model="formModel.json"
                type="textarea"
                :rows="3"
                :placeholder="$t('page.PleaseInput')"
              />
            </TinyFormItem>
          </TinyCol>
        </TinyRow>
        <TinyRow>
          <TinyCol :span="12">
            <TinyFormItem label="city" prop="city">
              <TinyInput v-model="formModel.city" />
            </TinyFormItem>
          </TinyCol>
          <TinyCol :span="12">
            <TinyFormItem label="picture" prop="picture">
              <TinyInput v-model="formModel.picture" />
            </TinyFormItem>
          </TinyCol>
        </TinyRow>
        <TinyRow>
          <TinyCol :span="24">
            <TinyFormItem label="images" prop="images">
              <TinyInput
                v-model="formModel.images"
                type="textarea"
                :rows="2"
                :placeholder="$t('page.PleaseInput')"
              />
            </TinyFormItem>
          </TinyCol>
        </TinyRow>
      </TinyForm>
      <template #footer>
        <TinyButton size="small" @click="onClose">
          {{ $t('menu.btn.cancel') }}
        </TinyButton>
        <TinyButton
          size="small"
          :text="$t('page.Add')"
          type="primary"
          round
          @click="addEntity"
        />
      </template>
    </TinyDialogBox>
  </div>
</template>

<style scoped lang="less">
.entity-dialog-box :deep(.tiny-dialog-box .tiny-dialog-box__body) {
  padding-top: 0px;
  padding-bottom: 0px;
}
.tiny-button {
  width: 96px;
  margin-right: 12px;
}
.entity-add-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 24px 10px;
}
.entity-add-btn {
  display: flex;
  align-items: center;
}
.recycle-bin-switch {
  margin-right: 10px;
}
</style>