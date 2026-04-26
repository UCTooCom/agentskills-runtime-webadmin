<script lang="ts" setup>
import { registerPageTool } from '@opentiny/next-sdk'
import {
  Loading,
  Button as TinyButton,
  Modal as TinyModal,
} from '@opentiny/vue'
import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { db_info } from '@/store/models/uctoo/db_info'
import useLoading from '@/hooks/loading'
import dbTree from './db-tree.vue'

const { t } = useI18n()
const vLoading = Loading.directive
const { loading, setLoading } = useLoading(false)
const { loading: treeLoading, setLoading: setTreeLoading } = useLoading(true)

// 树形数据：直接使用API返回的结构
const dbTreeData = ref<any[]>([])

async function fetchDbTableInfo() {
  setTreeLoading(true)
  try {
    const response = await db_info.config.axiosApi.actions.getDbTableInfo('uctoo')

    console.log('=== fetchDbTableInfo response ===', response)

    const axiosResponse = response.response || response
    const responseData = axiosResponse.data || response.data

    console.log('=== fetchDbTableInfo responseData ===', responseData)

    const dbInfos = responseData.db_infos || responseData.data?.db_infos || []

    const tableMap = new Map<string, any>()

    for (const col of dbInfos) {
      const tableName = col.table_name || col.db_table_name
      if (!tableMap.has(tableName)) {
        tableMap.set(tableName, {
          id: tableName,
          table_name: tableName,
          table_schema: col.table_schema,
          table_catalog: col.table_catalog,
          children: []
        })
      }
      tableMap.get(tableName).children.push({
        id: `${tableName}.${col.column_name}`,
        column_name: col.column_name,
        data_type: col.data_type,
        is_nullable: col.is_nullable,
        column_default: col.column_default,
        column_comment: col.column_comment,
        ordinal_position: col.ordinal_position,
        character_maximum_length: col.character_maximum_length
      })
    }

    dbTreeData.value = Array.from(tableMap.values())

    console.log('=== fetchDbTableInfo dbTreeData.value ===', dbTreeData.value)
  } catch (error: any) {
    console.error('=== fetchDbTableInfo error ===', error)
    TinyModal.message({
      message: error.response?.data?.errmsg || t('databaseInfo.fetch.error'),
      status: 'error',
    })
  } finally {
    setTreeLoading(false)
  }
}

async function loadDbInfo() {
  setLoading(true)
  try {
    const response = await db_info.config.axiosApi.actions.loadDbInfo('uctoo')

    console.log('=== loadDbInfo response ===', response)

    // 处理响应
    const axiosResponse = response.response || response
    const responseData = axiosResponse.data || response.data

    console.log('=== loadDbInfo responseData ===', responseData)

    if (responseData.desc && responseData.desc.includes('成功')) {
      TinyModal.message({
        message: t('databaseInfo.load.success'),
        status: 'success',
      })
      // 重新获取数据库结构
      await fetchDbTableInfo()
    } else {
      TinyModal.message({
        message: responseData.errmsg || t('databaseInfo.load.failure'),
        status: 'error',
      })
    }
  } catch (error: any) {
    console.error('=== loadDbInfo error ===', error)
    TinyModal.message({
      message: error.response?.data?.errmsg || t('databaseInfo.load.error'),
      status: 'error',
    })
  } finally {
    setLoading(false)
  }
}

let cleanupPageTool: () => void

onMounted(async () => {
  await fetchDbTableInfo()

  cleanupPageTool = registerPageTool({
    handlers: {
      // 可以添加工具处理逻辑
    },
  })
})

onUnmounted(() => cleanupPageTool?.())
</script>

<template>
  <div class="tiny-fullscreen-scroll">
    <div class="tiny-fullscreen-wrapper">
      <div class="db-add-btn">
        <TinyButton
          type="primary"
          :loading="loading"
          @click="loadDbInfo"
        >
          {{ $t('databaseInfo.btn.loadDbInfo') }}
        </TinyButton>
      </div>
      <dbTree
        v-loading="treeLoading"
        :data="dbTreeData"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.db-add-btn {
  padding: 0px 0 24px 0;
}

.table {
  padding-bottom: 20px;
  background-color: #fff;
}

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
</style>
