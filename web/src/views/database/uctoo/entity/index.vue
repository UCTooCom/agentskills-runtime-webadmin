<script lang="ts" setup>
import { ref } from 'vue'
import GeneralLayout from '@/layout/general-layout.vue'
import addEntity from './components/add-entity.vue'
import entityTable from './components/entity-table.vue'

const entityTableRef = ref()
const isRecycleBin = ref(false)

function onChange() {
  entityTableRef.value.reload()
}
function onRemove() {
  entityTableRef.value.batchRemoveEntity()
}
function onExport() {
  entityTableRef.value.exportEntity()
}

function onRecycleBinChange(status: boolean) {
  isRecycleBin.value = status
}

function onBatchRestore() {
  entityTableRef.value.batchRestoreEntity()
}

function onEmptyRecycleBin() {
  // 调用清空回收站方法
  if (entityTableRef.value && entityTableRef.value.emptyRecycleBin) {
    entityTableRef.value.emptyRecycleBin()
  }
}

function onBatchPermanentDelete() {
  entityTableRef.value.batchRemoveEntity()
}
</script>

<template>
  <GeneralLayout :breadcrumb="['menu.database', 'uctoo.entity']">
    <add-entity
      class="entity-add-btn"
      @entity-change="onChange"
      @batch-remove="onRemove"
      @export-entity="onExport"
      @recycle-bin-change="onRecycleBinChange"
      @batch-restore="onBatchRestore"
      @empty-recycle-bin="onEmptyRecycleBin"
      @batch-permanent-delete="onBatchPermanentDelete"
    />
    <entity-table 
      ref="entityTableRef" 
      :recycle-bin-status="isRecycleBin" 
    />
  </GeneralLayout>
</template>

<style scoped lang="less">
.entity-add-btn {
  padding: 10px 0 24px 10px;
}
</style>
