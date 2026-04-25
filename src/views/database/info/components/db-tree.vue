<script lang="ts" setup>
import { TinyGrid, TinyGridColumn } from '@opentiny/vue'
import { ref, watch } from 'vue'
import { useResponsiveSize } from '@/hooks/responsive'

const props = defineProps<{
  data: any[]
}>()

const { gridSize } = useResponsiveSize()

const dbList = ref([])

watch(
  () => props.data,
  (newData) => {
    console.log('=== db-tree watch triggered ===')
    console.log('=== db-tree newData ===', newData)
    dbList.value = newData
    console.log('=== db-tree dbList.value ===', dbList.value)
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <TinyGrid
    :data="dbList"
    :tree-config="{ children: 'children' }"
    :auto-resize="true"
    align="center"
    :size="gridSize"
  >
    <TinyGridColumn
      field="table_name"
      :title="$t('databaseInfo.table.tableName')"
      tree-node
    >
      <template #default="{ row }">
        {{ row.table_name || row.column_name }}
      </template>
    </TinyGridColumn>
    <TinyGridColumn field="data_type" :title="$t('databaseInfo.table.dataType')" />
    <TinyGridColumn field="is_nullable" :title="$t('databaseInfo.table.isNullable')" />
    <TinyGridColumn field="column_default" :title="$t('databaseInfo.table.defaultValue')" />
    <TinyGridColumn field="column_comment" :title="$t('databaseInfo.table.comment')" />
    <TinyGridColumn field="ordinal_position" :title="$t('databaseInfo.table.position')" />
    <TinyGridColumn field="character_maximum_length" :title="$t('databaseInfo.table.length')" />
  </TinyGrid>
</template>

<style scoped lang="less">
.operation {
  &-delete {
    padding-right: 10px;
    color: red;
  }

  &-update {
    padding-right: 5px;
    color: #1890ff;
  }

  &-info {
    padding-right: 10px;
    color: orange;
  }
}

.del-icon {
  fill: #1890ff;
  margin-right: 8px;
  font-size: 16px;
  margin-top: -3px;
}

.operation-update:hover {
  text-decoration: underline;
}
</style>
