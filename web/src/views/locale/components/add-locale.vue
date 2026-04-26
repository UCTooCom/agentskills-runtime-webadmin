<script lang="ts" setup>
import type { CreateLocal } from '@/api/local'
import { registerPageTool } from '@opentiny/next-sdk'
import {
  Notify,
  Button as TinyButton,
  DialogBox as TinyDialogBox,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Input as TinyInput,
  Option as TinyOption,
  Popover as TinyPopover,
  Select as TinySelect,
} from '@opentiny/vue'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { createLang } from '@/api/lang'
import { i18 } from '@/store/models/uctoo'
import { useAxiosRepo } from '@pinia-orm/axios'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useLocales } from '@/store/modules/locales'
import { sleep } from '@/utils/base-utils'
import langTable from './lang-table.vue'

const emits = defineEmits<{
  langChange: []
  localChange: []
  batchRemove: []
  exportI18n: []
}>()
const { open, onOpen, onClose } = useDisclosure()
const { open: langPopoverOpen, onClose: setLangPopoverClose }
  = useDisclosure()
const { open: langTableOpen, onOpen: setLangTableOpen, onClose: setLangTableClose } = useDisclosure()
const localeForm = ref()
const langForm = ref()
const locales = useLocales()
const langes = computed(() => locales.lang)
const locale = reactive<CreateLocal>({
  key: '',
  content: '',
  lang: '' as any,
})
const lang = reactive({ name: '' })

function onBatchRemove() {
  emits('batchRemove')
}

function onExportI18n() {
  emits('exportI18n')
}

const rules = {
  key: [
    {
      required: true,
      trigger: 'blur',
    },
  ],
  content: [
    {
      required: true,
      trigger: 'blur',
    },
  ],
  lang: [
    {
      required: true,
      trigger: 'blur',
    },
  ],
}
const langRule = {
  name: [
    {
      required: true,
      trigger: 'blur',
    },
  ],
}

function addLang() {
  langForm.value
    .validate()
    .then(() => {
      createLang({ name: lang.name })
        .then(({ data }) => {
          locales.pushLang(data)
          emits('langChange')
        })
        .catch((reason) => {
          Notify({
            type: 'error',
            message: reason.response.data.message,
          })
        })
        .finally(() => {
          lang.name = ''
          setLangPopoverClose()
        })
    })
}

const i18n = useI18n()

function addLocale() {
  localeForm.value
    .validate()
    .then(() => {
      useAxiosRepo(i18).api().addI18({
        key: locale.key,
        content: locale.content,
        lang_id: locale.lang,
      })
        .then((result) => {
          const data = result.response.data as any
          locale.key = ''
          locale.content = ''
          locale.lang = '' as any
          locales.pushLocale(data)
          i18n.mergeLocaleMessage(data.lang?.name || data.lang_name, {
            [data.key]: data.content,
          })
          emits('localChange')
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
watch(open, (value) => {
  if (!value && (langPopoverOpen.value || langTableOpen.value)) {
    setLangPopoverClose()
    setLangTableClose()
  }
})

// registerPageTool 返回 cleanup 函数，在 onUnmounted 中调用
let cleanupPageTool: () => void

onMounted(async () => {
  cleanupPageTool = registerPageTool({
    handlers: {
      // key 必须与 mcp-servers 中注册的工具名一致
      'add-i18n-entry': async ({ key, content, lang: langId }) => {
        onOpen()
        await sleep(1000)
        locale.key = key
        locale.content = content
        locale.lang = langId
        await sleep(1000)
        addLocale()
        return { content: [{ type: 'text', text: `收到: ${key}` }] }
      },
    },
  })
})

// 页面卸载时取消注册，避免内存泄漏和消息串扰
onUnmounted(() => cleanupPageTool?.())
</script>

<template>
  <div>
    <TinyButton v-permission="'uctoo:i18:add'" show-footer type="primary" round @click="onOpen">
      {{ $t('locale.add.btn') }}
    </TinyButton>
    <TinyButton v-permission="'uctoo:i18:batch-del'" round @click="onBatchRemove">
      {{ $t('locale.batchRemove') }}
    </TinyButton>
    <TinyButton v-permission="'uctoo:i18:all'" round @click="onExportI18n">
      {{ $t('locale.export') }}
    </TinyButton>
    <TinyDialogBox
      v-model:visible="open"
      :title="$t('locale.add.title')"
      :close-on-click-modal="false"
      dialog-class="locale-dialog-box"
    >
      <TinyForm
        ref="localeForm"
        :model="locale"
        :rules="rules"
        label-position="left"
        label-width="118px"
      >
        <TinyFormItem :label="$t('locale.add.key')" prop="key">
          <TinyInput v-model="locale.key" />
        </TinyFormItem>
        <TinyFormItem :label="$t('locale.add.content')" prop="content">
          <TinyInput v-model="locale.content" />
        </TinyFormItem>
        <TinyFormItem :label="$t('locale.add.lang')" prop="lang">
          <TinySelect v-model="locale.lang">
            <TinyOption
              v-for="item of langes"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </TinySelect>
          <TinyPopover v-model="langPopoverOpen" trigger="manual">
            <div>
              <TinyForm ref="langForm" :model="lang" :rules="langRule" label-width="90px">
                <TinyFormItem :label="$t('lang.add.title')" prop="name">
                  <TinyInput v-model="lang.name" />
                </TinyFormItem>
                <TinyButton @click="addLang">
                  {{ $t('lang.add.btn') }}
                </TinyButton>
              </TinyForm>
            </div>
            <template #reference>
              <TinyButton
                  v-permission="'uctoo:lang:add'"
                  type="text"
                  :text="$t('locale.add.lang.btn')"
                  class="max-sm:w-unset!"
                  @click="langPopoverOpen = !langPopoverOpen"
                />
                <TinyButton
                  v-permission="'uctoo:lang:update'"
                  type="text"
                  :text="$t('lang.manage.btn')"
                  class="max-sm:w-unset!"
                  @click="setLangTableOpen"
                />
            </template>
          </TinyPopover>
        </TinyFormItem>
      </TinyForm>
      <template #footer>
        <TinyButton size="small" @click="onClose">
          {{ $t('menu.btn.cancel') }}
        </TinyButton>
        <TinyButton
          size="small"
          :text="$t('locale.add.btn')"
          type="primary"
          round
          @click="addLocale"
        />
      </template>
    </TinyDialogBox>
    <TinyDialogBox
      v-model:visible="langTableOpen"
      :title="$t('lang.manage.title')"
      width="60%"
    >
      <lang-table />
    </TinyDialogBox>
  </div>
</template>

<style scoped lang="less">
.locale-dialog-box :deep(.tiny-dialog-box .tiny-dialog-box__body) {
  padding-top: 0px;
  padding-bottom: 0px;
}
.tiny-button {
  width: 96px;
}
</style>
