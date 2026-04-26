<script lang="ts" setup>
import { ref } from 'vue'
import GeneralLayout from '@/layout/general-layout.vue'
import addLocale from './components/add-locale.vue'
import localeTable from './components/locale-table.vue'

const localTable = ref()
function onChange() {
  localTable.value.reload()
}
function onRemove() {
  localTable.value.batchRemoveLocale()
}
function onExport() {
  localTable.value.exportI18n()
}
</script>

<template>
  <GeneralLayout :breadcrumb="['menu.systemManager', 'menu.i18n']">
    <add-locale
      class="locale-add-btn"
      @lang-change="onChange"
      @local-change="onChange"
      @batch-remove="onRemove"
      @export-i18n="onExport"
    />
    <locale-table ref="localTable" />
  </GeneralLayout>
</template>

<style scoped lang="less">
.locale-add-btn {
  padding: 10px 0 24px 10px;
}
</style>
