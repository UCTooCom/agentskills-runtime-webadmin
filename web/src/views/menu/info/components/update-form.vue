<script lang="ts" setup>
import type { ITreeNodeData } from '@/router/guard/menu'
import { icons } from '@opentiny/icons/json/icons.json'
import {
  TinyCol,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Input as TinyInput,
  TinyRow,
  Select as TinySelect,
} from '@opentiny/vue'
import { computed, h, reactive, ref, unref } from 'vue'

const props = defineProps<{
  node: ITreeNodeData
  menus: ITreeNodeData[]
  localeData: { value: string, label: string }[]
  readonly: boolean
}>()

// 校验规则
const rulesType = {
  required: true,
  trigger: 'blur',
}
const rulesSelect = {
  required: true,
  message: '必选',
  trigger: 'blur',
}
const rules = computed(() => {
  return {
    oldLabel: [rulesType],
    order: [rulesType],
    component: [rulesType],
    url: [rulesType],
    locale: [rulesSelect],
  }
})

const treeOp = computed(() => ({ data: props.menus }))
const updateForm = ref()
const menuInfo = reactive<ITreeNodeData>({
  id: props.node.id,
  permission_name: props.node.permission_name,
  path: props.node.path,
  component: props.node.component,
  icon: props.node.icon,
  menu_type: props.node.menu_type,
  parent_id: props.node.parent_id,
  weight: props.node.weight,
  locale: props.node.locale,
  title: props.node.title,
  type: props.node.type,
  hidden: props.node.hidden,
  keepalive: props.node.keepalive,
})
const iconDatas = Object.keys(icons).map((key) => {
  return {
    label: key,
    value: key,
    icon: h('i', { class: `ci-${key}`, style: { fontSize: '18px', marginRight: '6px' } }),
  }
})

function getMenuInfo() {
  return {
    ...unref(menuInfo),
    parent_id:
        (menuInfo.parent_id as string | number) === ''
        || menuInfo.parent_id === null
          ? null
          : menuInfo.parent_id,
  } as ITreeNodeData
}
defineExpose({
  getMenuInfo,
  valid: async () => updateForm.value.validate(),
})
</script>

<template>
  <TinyForm
    ref="updateForm"
    :display-only="props.readonly"
    :rules="rules"
    :model="menuInfo"
  >
    <TinyRow class="flex flex-wrap">
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem :label="$t('menuInfo.table.name')" prop="locale">
          <TinySelect
            v-model="menuInfo.locale"
            :placeholder="$t('baseForm.form.label.placeholder')"
            filterable
            no-match-text="No Match"
            :options="props.localeData"
            optimization
          />
        </TinyFormItem>
      </TinyCol>
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem :label="$t('menuInfo.table.order')" prop="weight">
          <TinyInput v-model="menuInfo.weight" />
        </TinyFormItem>
      </TinyCol>
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem :label="$t('menuInfo.table.parentId')" prop="parent_id">
          <TinySelect
            v-model="menuInfo.parent_id"
            value-field="id"
            text-field="permission_name"
            render-type="tree"
            :tree-op="treeOp"
            clearable
          />
        </TinyFormItem>
      </TinyCol>
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem :label="$t('menuInfo.table.icon')" prop="icon">
          <TinySelect
            v-model="menuInfo.icon"
            :placeholder="$t('baseForm.form.label.placeholder')"
            filterable
            no-match-text="No Match"
            :options="iconDatas"
            optimization
          />
        </TinyFormItem>
      </TinyCol>
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem :label="$t('menuInfo.table.component')" prop="component">
          <TinyInput v-model="menuInfo.component" />
        </TinyFormItem>
      </TinyCol>
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem :label="$t('menuInfo.table.path')" prop="path">
          <TinyInput v-model="menuInfo.path" />
        </TinyFormItem>
      </TinyCol>
      <TinyCol class="w-1/2 max-sm:w-full">
        <TinyFormItem
          prop="permission_name"
          :label="$t('menuInfo.table.id')"
          :extra="$t('menuInfo.modal.tips.upd-id')"
        >
          <TinyInput v-model="menuInfo.permission_name" />
        </TinyFormItem>
      </TinyCol>
    </TinyRow>
  </TinyForm>
</template>

<style scoped>
  :deep(.font-14-css) {
  font-size: 12px;
}
</style>
