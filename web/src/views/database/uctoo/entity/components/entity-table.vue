<script lang="ts" setup>
import type { FilterType, InputFilterValue } from '@/types/global'
import {
  Button as TinyButton,
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
  TinyModal,
  Popconfirm as TinyPopconfirm,
  Modal as TinyModalComponent,
  Checkbox as TinyCheckbox,
  Select as TinySelect,
  Option as TinyOption,
  Input as TinyInput,
} from '@opentiny/vue'
import { iconDel, iconRefresh, iconPlus, iconMinus } from '@opentiny/vue-icon'
import { computed, ref, watch, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { entity } from '@/store/models/uctoo'
import { useAxiosRepo } from '@pinia-orm/axios'
import useLoading from '@/hooks/loading'
import { useResponsive, useResponsiveSize } from '@/hooks/responsive'
import { useUserStore } from '@/store'
import { registerPageTool } from '@opentiny/next-sdk'
import { sleep } from '@/utils/base-utils'
import EditForm from './edit-form.vue'

const { gridSize } = useResponsiveSize()
const { sm } = useResponsive()

const IconDel = iconDel()
const IconRestore = iconRefresh()
const IconPlus = iconPlus()
const IconMinus = iconMinus()
const grid = ref()

const userStore = useUserStore()
const rolePermission = computed(() => userStore.rolePermission)

// 编辑相关
const editModal = ref(false)
const editFormRef = ref()
const currentEntity = ref<Partial<entity>>({})
const readonly = ref(false)

// 回收站相关
const isRecycleBin = ref(false)
const checkedHardDelete = ref(false)

// 接收外部传递的回收站状态
const props = defineProps<{
  recycleBinStatus: boolean
}>()

// 监听回收站状态变化
watch(() => props.recycleBinStatus, (newStatus) => {
  isRecycleBin.value = newStatus
  grid.value?.handleFetch()
}, { immediate: true })

const pagerConfigSm = ref({
  attrs: {
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    total: 0,
    align: 'right',
    layout: 'total, prev, pager, next',
  },
})
const pagerConfigLg = ref({
  attrs: {
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    total: 0,
    align: 'right',
    layout: 'sizes, total, prev, pager, next, jumper',
  },
})

const { loading, setLoading } = useLoading()

// 筛选条件
interface FilterCondition {
  id: string
  field: string
  operator: string
  value: string
}

const filterConditions = ref<FilterCondition[]>([
  {
    id: '1',
    field: 'link',
    operator: 'contains',
    value: ''
  }
])

// 表字段列表
const availableFields = [
  { label: 'ID', value: 'id' },
  { label: 'Link', value: 'link' },
  { label: 'Privacy Level', value: 'privacy_level' },
  { label: 'Stars', value: 'stars' },
  { label: 'Description', value: 'description' },
  { label: 'Group ID', value: 'group_id' },
  { label: 'Price', value: 'price' },
  { label: 'Owner', value: 'owner' },
  { label: 'Status', value: 'status' },
  { label: 'City', value: 'city' },
  { label: 'Creator', value: 'creator' },
  { label: 'Created At', value: 'created_at' },
  { label: 'Updated At', value: 'updated_at' },
  { label: 'Picture', value: 'picture' },
  { label: 'Images', value: 'images' },
  { label: 'Content', value: 'content' },
  { label: 'Json', value: 'json' },
  { label: 'Birthday', value: 'birthday' },
  { label: 'Deleted At', value: 'deleted_at' },
  { label: 'End Time', value: 'end_time' },
  { label: 'Start Time', value: 'start_time' }
]

// 筛选操作符列表
const operators = [
  { label: '等于', value: 'equals' },
  { label: '不等于', value: 'not' },
  { label: '小于', value: 'lt' },
  { label: '小于等于', value: 'lte' },
  { label: '大于', value: 'gt' },
  { label: '大于等于', value: 'gte' },
  { label: '包含', value: 'contains' },
  { label: '开头是', value: 'startsWith' },
  { label: '结尾是', value: 'endsWith' },
  { label: '在列表中', value: 'in' },
  { label: '不在列表中', value: 'notIn' },
  { label: '已设置', value: 'isSet' },
  { label: '在区间内', value: 'between' },
  { label: '不在区间内', value: 'notBetween' }
]

// 添加筛选条件
function addFilterCondition() {
  const newId = (filterConditions.value.length + 1).toString()
  filterConditions.value.push({
    id: newId,
    field: 'link',
    operator: 'contains',
    value: ''
  })
}

// 删除筛选条件
function removeFilterCondition(id: string) {
  const index = filterConditions.value.findIndex(condition => condition.id === id)
  if (index > -1) {
    filterConditions.value.splice(index, 1)
  }
}

// 应用筛选
function applyFilters() {
  grid.value?.handleFetch()
}

// 重置筛选条件
function resetFilters() {
  // 重置筛选条件为默认状态
  filterConditions.value = [
    {
      id: '1',
      field: 'link',
      operator: 'contains',
      value: ''
    }
  ]
  // 重新加载数据
  grid.value?.handleFetch()
}

function filterInputValue2String(value: InputFilterValue) {
  let str = ''
  if (value.relation === 'contains') {
    str += '%'
  }
  str += value.text
  if (value.relation === 'startwith' || value.relation === 'contains') {
    str += '%'
  }
  return str
}

function buildFilterQuery() {
  const filters: any = {}
  
  // 添加高级筛选条件
  filterConditions.value.forEach(condition => {
    if (condition.value || condition.operator === 'is_null' || condition.operator === 'not_null') {
      filters[condition.field] = { [condition.operator]: condition.value }
    }
  })
  
  return filters
}

function getData({
  page,
  filters,
}: {
  page: { pageSize: number, currentPage: number }
  filters: FilterType
}) {
  const link = filters.link
    ? filterInputValue2String(filters.link.value as InputFilterValue)
    : undefined
  const description = filters.description
    ? filterInputValue2String(filters.description.value as InputFilterValue)
    : undefined
  const { pageSize, currentPage } = page
  setLoading(true)
  
  // 构建查询参数，包含回收站过滤
  const searchParams: any = { link, description }

  // 添加高级筛选条件
  const advancedFilters = buildFilterQuery()
  if (Object.keys(advancedFilters).length > 0) {
    searchParams.filter = JSON.stringify(advancedFilters)
  }
  
  // 根据回收站状态添加 deleted_at 过滤
  if (isRecycleBin.value) {
    // 回收站：显示 deleted_at 不为空的数据
    if (searchParams.filter) {
      const existingFilter = JSON.parse(searchParams.filter)
      existingFilter.deleted_at = { not: null }
      searchParams.filter = JSON.stringify(existingFilter)
    } else {
      searchParams.filter = JSON.stringify({ deleted_at: { not: null } })
    }
  } else {
    // 正常数据：显示 deleted_at 为空的数据
    if (searchParams.filter) {
      const existingFilter = JSON.parse(searchParams.filter)
      existingFilter.deleted_at = null
      searchParams.filter = JSON.stringify(existingFilter)
    } else {
      searchParams.filter = JSON.stringify({ deleted_at: null })
    }
  }
  
  return new Promise((resolve) => {
    useAxiosRepo(entity).api().getEntityList(currentPage, pageSize, searchParams)
      .then((result) => {
        const res = result.response.data as any
        // 处理不同的数据结构
        let items: any[] = []
        let total = 0
        
        // 如果 res 是数组，说明直接返回了数据列表
        if (Array.isArray(res)) {
          items = res
          total = res.length
        } 
        // 如果 res 是对象，尝试从不同字段获取数据
        else if (typeof res === 'object' && res !== null) {
          items = res.entitys || res.items || []
          total = res.totalCount || res.meta?.totalItems || 0
        }

        resolve({
          result: items.map((item: any) => {
            return {
              id: item.id,
              link: item.link,
              privacy_level: item.privacy_level,
              stars: item.stars,
              description: item.description,
              group_id: item.group_id,
              picture: item.picture,
              images: item.images,
              content: item.content,
              json: item.json,
              city: item.city,
              price: item.price,
              birthday: item.birthday,
              owner: item.owner,
              creator: item.creator,
              created_at: item.created_at,
              updated_at: item.updated_at,
              deleted_at: item.deleted_at,
              end_time: item.end_time,
              start_time: item.start_time,
              status: item.status,
            }
          }),
          page: {
            total: total,
          },
        })
      })
      .finally(() => {
        setLoading(false)
      })
  })
}
function onEditClosed({ row }: { row: Record<string, any> }) {
  if (grid.value.hasRowChange(row)) {
    useAxiosRepo(entity).api().editEntity({
      id: row.id,
      link: row.link,
      privacy_level: row.privacy_level,
      stars: row.stars,
      description: row.description,
      group_id: row.group_id,
      picture: row.picture,
      images: row.images,
      content: row.content,
      json: row.json,
      city: row.city,
      price: row.price,
      birthday: row.birthday,
      owner: row.owner,
      end_time: row.end_time,
      start_time: row.start_time,
      status: row.status,
    })
      .then(() => {
        TinyModal.message({
          message: '更新成功',
          status: 'success',
        })
      })
      .catch((error) => {
        grid.value.revertData(row)
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.message || '未知错误'
          TinyModal.message({
            message: errorMessage,
            status: 'error',
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
}
function batchRemoveEntity() {
  const rowIds = grid.value.getAllSelection().flatMap(row => row.id)
  if (rowIds.length === 0) {
    TinyModal.message({
      message: '请选择要删除的实体',
      status: 'error',
    })
    return
  }
  
  // 根据回收站状态确定删除方式
  const isHardDelete = isRecycleBin.value
  
  TinyModal.confirm({
    title: isHardDelete ? '彻底删除确认' : '删除确认',
    message: isHardDelete ? '确定要彻底删除选中的实体吗？删除后无法恢复！' : '确定要批量删除选中的实体吗？',
    onConfirm: () => {
      setLoading(true)
      
      // 构建删除参数，包含force参数
      const deleteParams: any = { ids: JSON.stringify(rowIds) }
      if (isHardDelete) {
        deleteParams.force = 1 // 硬删除
      }
      
      useAxiosRepo(entity).api().batchDeleteEntity(deleteParams)
        .then(() => {
          TinyModal.message({
            message: isHardDelete ? '批量彻底删除成功' : '批量删除成功',
            status: 'success',
          })
          grid.value.handleFetch()
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            const errorMessage = error.response.data.errmsg || error.response.data.message || '未知错误'
            TinyModal.message({
              message: errorMessage,
              status: 'error',
            })
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
  })
}

function removeEntity(row: any) {
  setLoading(true)
  
  // 根据硬删除选项决定删除方式
  const deleteParams: any = { id: row.id }
  
  // 在回收站模式下，点击"彻底删除"按钮时强制设置 force: 1
  if (isRecycleBin.value || checkedHardDelete.value) {
    deleteParams.force = 1  // 硬删除
  }
  
  useAxiosRepo(entity).api().deleteEntity(deleteParams)
    .then(() => {
      TinyModal.message({
        message: (isRecycleBin.value || checkedHardDelete.value) ? '彻底删除成功' : '删除成功',
        status: 'success',
      })
      grid.value.handleFetch()
      checkedHardDelete.value = false  // 重置硬删除选项
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.errmsg || error.response.data.message || '未知错误'
        TinyModal.message({
          message: errorMessage,
          status: 'error',
        })
      }
    })
    .finally(() => {
      setLoading(false)
    })
}

// 恢复实体
function restoreEntity(row: any) {
  setLoading(true)
  useAxiosRepo(entity).api().editEntity({ id: row.id, deleted_at: '0' })
    .then(() => {
      TinyModal.message({
        message: '恢复成功',
        status: 'success',
      })
      grid.value.handleFetch()
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.errmsg || error.response.data.message || '未知错误'
        TinyModal.message({
          message: errorMessage,
          status: 'error',
        })
      }
    })
    .finally(() => {
      setLoading(false)
    })
}

// 批量恢复
function batchRestoreEntity() {
  const rowIds = grid.value.getAllSelection().flatMap(row => row.id)
  if (rowIds.length === 0) {
    TinyModal.message({
      message: '请选择要恢复的实体',
      status: 'error',
    })
    return
  }
  TinyModal.confirm({
    title: '恢复确认',
    message: '确定要恢复选中的实体吗？',
    onConfirm: () => {
      setLoading(true)
      useAxiosRepo(entity).api().batchRestoreEntity(rowIds)
        .then(() => {
          TinyModal.message({
            message: '批量恢复成功',
            status: 'success',
          })
          grid.value.handleFetch()
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            const errorMessage = error.response.data.errmsg || error.response.data.message || '未知错误'
            TinyModal.message({
              message: errorMessage,
              status: 'error',
            })
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
  })
}

// 清空回收站
function emptyRecycleBin() {
  TinyModal.confirm({
    title: '清空回收站确认',
    message: '确定要清空回收站吗？此操作将彻底删除所有回收站中的数据，无法恢复！',
    onConfirm: () => {
      setLoading(true)
      useAxiosRepo(entity).api().emptyRecycleBin()
        .then(() => {
          TinyModal.message({
            message: '清空回收站成功',
            status: 'success',
          })
          grid.value.handleFetch()
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            const errorMessage = error.response.data.errmsg || error.response.data.message || '未知错误'
            TinyModal.message({
              message: errorMessage,
              status: 'error',
            })
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
  })
}

// 编辑功能
function onEdit(row: any) {
  currentEntity.value = { ...row }
  readonly.value = false
  editModal.value = true
}

function onView(row: any) {
  currentEntity.value = { ...row }
  readonly.value = true
  editModal.value = true
}

function onEditCancel() {
  editModal.value = false
  currentEntity.value = {}
}

function onEditConfirm() {
  setLoading(true)
  editFormRef.value
    .valid()
    .then(() => {
      const formData = editFormRef.value.getFormData()
      
      // 如果没有修改任何字段，直接关闭对话框
      if (!formData) {
        TinyModal.message({
          message: '没有修改任何字段',
          status: 'info',
        })
        editModal.value = false
        setLoading(false)
        return
      }
      
      useAxiosRepo(entity).api().editEntity(formData)
        .then(() => {
          TinyModal.message({
            message: '更新成功',
            status: 'success',
          })
          editModal.value = false
          grid.value.handleFetch()
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            const errorMessage = error.response.data.errmsg || error.response.data.message || '未知错误'
            TinyModal.message({
              message: errorMessage,
              status: 'error',
            })
          }
        })
        .finally(() => {
          setLoading(false)
        })
    })
    .catch(() => {
      setLoading(false)
    })
}

const fetchData = ref({
  api: getData,
  filter: true,
})

function exportEntity() {
  const selectedRows = grid.value.getAllSelection()
  if (selectedRows.length === 0) {
    TinyModal.message({
      message: '请选择要导出的实体',
      status: 'error',
    })
    return
  }
  grid.value.exportCsv({
    filename: 'entity_export',
    original: true,
    isHeader: false,
    useTabs: false,
    data: selectedRows,
  })
}

// registerPageTool 返回 cleanup 函数，在 onUnmounted 中调用
let cleanupPageTool: () => void

onMounted(async () => {
  cleanupPageTool = registerPageTool({
    handlers: {
      // query-entity-list 工具Handler
      'query-entity-list': async (params: any) => {
        const { page = 1, pageSize = 10, link, status, owner, city, sortBy, sortOrder = 'asc' } = params
        
        // 设置分页参数
        if (sm.value) {
          pagerConfigSm.value.attrs.currentPage = page
          pagerConfigSm.value.attrs.pageSize = pageSize
        } else {
          pagerConfigLg.value.attrs.currentPage = page
          pagerConfigLg.value.attrs.pageSize = pageSize
        }
        
        // 设置筛选条件
        if (link) {
          const linkCondition = filterConditions.value.find(c => c.field === 'link')
          if (linkCondition) {
            linkCondition.value = link
          }
        }
        if (status) {
          filterConditions.value.push({
            id: Date.now().toString(),
            field: 'status',
            operator: 'equals',
            value: status
          })
        }
        if (owner) {
          filterConditions.value.push({
            id: (Date.now() + 1).toString(),
            field: 'owner',
            operator: 'equals',
            value: owner
          })
        }
        if (city) {
          filterConditions.value.push({
            id: (Date.now() + 2).toString(),
            field: 'city',
            operator: 'equals',
            value: city
          })
        }
        
        // 刷新数据
        await nextTick()
        grid.value?.handleFetch()
        
        return {
          content: [{
            type: 'text' as const,
            text: `查询entity列表成功，页码: ${page}，每页数量: ${pageSize}`
          }]
        }
      },
      
      // edit-entity 工具Handler
      'edit-entity': async (params: any) => {
        const { id, ...updateFields } = params
        
        // 查找目标行
        const tableData = grid.value.getTableData().fullData
        const targetRow = tableData.find((row: any) => row.id === id)
        
        if (!targetRow) {
          return {
            content: [{
              type: 'text' as const,
              text: `未找到ID为 ${id} 的entity`
            }]
          }
        }
        
        // 打开编辑对话框
        currentEntity.value = { ...targetRow, ...updateFields }
        readonly.value = false
        editModal.value = true
        
        await nextTick()
        await sleep(500)
        
        // 提交编辑
        onEditConfirm()
        
        return {
          content: [{
            type: 'text' as const,
            text: `编辑entity成功，ID: ${id}`
          }]
        }
      },
      
      // delete-entity 工具Handler
      'delete-entity': async (params: any) => {
        const { id, ids, force = false } = params
        
        if (ids && Array.isArray(ids)) {
          // 批量删除
          const deleteParams: any = { ids: JSON.stringify(ids) }
          if (force) {
            deleteParams.force = 1
          }
          
          setLoading(true)
          try {
            await useAxiosRepo(entity).api().batchDeleteEntity(deleteParams)
            grid.value.handleFetch()
            return {
              content: [{
                type: 'text' as const,
                text: `批量删除entity成功，共删除 ${ids.length} 条记录`
              }]
            }
          } catch (error: any) {
            return {
              content: [{
                type: 'text' as const,
                text: `批量删除失败: ${error.response?.data?.message || '未知错误'}`
              }]
            }
          } finally {
            setLoading(false)
          }
        } else if (id) {
          // 单个删除
          const deleteParams: any = { id }
          if (force) {
            deleteParams.force = 1
          }
          
          setLoading(true)
          try {
            await useAxiosRepo(entity).api().deleteEntity(deleteParams)
            grid.value.handleFetch()
            return {
              content: [{
                type: 'text' as const,
                text: `删除entity成功，ID: ${id}`
              }]
            }
          } catch (error: any) {
            return {
              content: [{
                type: 'text' as const,
                text: `删除失败: ${error.response?.data?.message || '未知错误'}`
              }]
            }
          } finally {
            setLoading(false)
          }
        }
        
        return {
          content: [{
            type: 'text' as const,
            text: '未提供有效的删除参数'
          }]
        }
      },
      
      // restore-entity 工具Handler
      'restore-entity': async (params: any) => {
        const { id } = params
        
        // 切换到回收站视图
        isRecycleBin.value = true
        await nextTick()
        await sleep(500)
        
        // 刷新数据
        grid.value?.handleFetch()
        await sleep(500)
        
        // 恢复实体
        setLoading(true)
        try {
          await useAxiosRepo(entity).api().editEntity({ id, deleted_at: '0' })
          grid.value.handleFetch()
          
          return {
            content: [{
              type: 'text' as const,
              text: `恢复entity成功，ID: ${id}`
            }]
          }
        } catch (error: any) {
          return {
            content: [{
              type: 'text' as const,
              text: `恢复失败: ${error.response?.data?.message || '未知错误'}`
            }]
          }
        } finally {
          setLoading(false)
        }
      },
    },
  })
})

// 页面卸载时取消注册，避免内存泄漏和消息串扰
onUnmounted(() => cleanupPageTool?.())

defineExpose({
  reload: () => {
    grid.value.handleFetch()
  },
  batchRemoveEntity,
  exportEntity,
  batchRestoreEntity,
  emptyRecycleBin,
})
</script>

<template>
  <div class="search-filter-container">
      <div class="filter-header">
        <TinyButton type="text" :icon="IconPlus" @click="addFilterCondition">
          添加筛选条件
        </TinyButton>
        <div style="display: flex; gap: 12px;">
          <TinyButton type="default" @click="resetFilters">重置</TinyButton>
          <TinyButton type="primary" @click="applyFilters">搜索</TinyButton>
        </div>
      </div>
      <div class="filter-conditions">
        <div class="filter-row" v-for="condition in filterConditions" :key="condition.id">
          <TinySelect
            v-model="condition.field"
            style="width: 120px; margin-right: 10px"
          >
            <TinyOption
              v-for="field in availableFields"
              :key="field.value"
              :value="field.value"
            >
              {{ field.label }}
            </TinyOption>
          </TinySelect>
          
          <TinySelect
            v-model="condition.operator"
            style="width: 120px; margin-right: 10px"
          >
            <TinyOption
              v-for="op in operators"
              :key="op.value"
              :value="op.value"
            >
              {{ op.label }}
            </TinyOption>
          </TinySelect>
          
          <TinyInput 
            v-model="condition.value"
            style="width: 150px; margin-right: 10px"
            :disabled="condition.operator === 'is_null' || condition.operator === 'not_null'"
          />
          
          <TinyButton 
            type="text" 
            :icon="IconMinus" 
            @click="removeFilterCondition(condition.id)"
            v-if="filterConditions.length > 1"
          />
        </div>
      </div>
    </div>

  <TinyGrid
    :key="sm ? 'sm' : 'lg'"
    ref="grid"
    :pager="sm ? pagerConfigSm : pagerConfigLg"
    :fetch-data="fetchData"
    :edit-config="
      rolePermission.includes('uctoo:entity:edit') && !isRecycleBin
        ? { trigger: 'click', mode: 'cell', showStatus: true }
        : undefined
    "
    :loading="loading"
    :auto-resize="true"
    remote-filter
    refresh
    :size="gridSize"
    align="center"
    @edit-closed="onEditClosed"
  >
    <TinyGridColumn type="selection" width="30px" />
    <TinyGridColumn field="id" title="ID" />
    <TinyGridColumn
      field="link"
      title="link"
      :editor="{ component: 'input', autoselect: true }"
    />
    <TinyGridColumn
      field="privacy_level"
      title="privacy_level"
      :editor="{ component: 'input', type: 'number', min: 0 }"
    />
    <TinyGridColumn
      field="stars"
      title="stars"
      :editor="{ component: 'input', type: 'number', min: 0 }"
    />
    <TinyGridColumn
      field="description"
      title="description"
      :editor="{ component: 'input', type: 'textarea' }"
    />
    <TinyGridColumn
      field="group_id"
      title="group_id"
      :editor="{ component: 'input' }"
    />
    <TinyGridColumn
      field="price"
      title="price"
      :editor="{ component: 'input', type: 'number', min: 0, step: '0.01' }"
    />
    <TinyGridColumn
      field="owner"
      title="owner"
      :editor="{ component: 'input' }"
    />
    <TinyGridColumn
      field="status"
      title="status"
      :editor="{ component: 'input' }"
    />
    <TinyGridColumn
      field="city"
      title="city"
      :editor="{ component: 'input' }"
    />
    <TinyGridColumn
      field="creator"
      title="creator"
      :editor="{ component: 'input' }"
    />
    <TinyGridColumn
      field="created_at"
      title="created_at"
      :editor="{ component: 'input' }"
    />
    <TinyGridColumn
      field="updated_at"
      title="updated_at"
      :editor="{ component: 'input' }"
    />
    <TinyGridColumn
      field="picture"
      title="picture"
      :editor="{ component: 'input' }"
    />
    <TinyGridColumn
      field="images"
      title="images"
      :editor="{ component: 'input' }"
    />
    <TinyGridColumn
      field="content"
      title="content"
      :editor="{ component: 'input', type: 'textarea' }"
    />
    <TinyGridColumn
      field="json"
      title="json"
      :editor="{ component: 'input', type: 'textarea' }"
    />
    <TinyGridColumn
      field="birthday"
      title="birthday"
      :editor="{ component: 'input' }"
    />
    <TinyGridColumn
      field="deleted_at"
      title="deleted_at"
      :editor="{ component: 'input' }"
    />
    <TinyGridColumn
      field="end_time"
      title="end_time"
      :editor="{ component: 'input' }"
    />
    <TinyGridColumn
      field="start_time"
      title="start_time"
      :editor="{ component: 'input' }"
    />
    <TinyGridColumn :title="$t('searchTable.columns.operations')" width="14%" fixed="right">
      <template #default="data">
        <template v-if="isRecycleBin">
          <!-- 回收站模式：显示恢复和彻底删除 -->
          <TinyButton
            v-permission="'uctoo:entity:edit'"
            type="text"
            @click="restoreEntity(data.row)"
          >
            <IconRestore class="operation-icon" />
            恢复
          </TinyButton>
          <TinyPopconfirm
            title="确定要彻底删除此实体吗？删除后无法恢复！"
            type="info"
            trigger="click"
            @confirm="removeEntity(data.row)"
          >
            <template #reference>
              <TinyButton
                v-permission="'uctoo:entity:del'"
                type="text"
              >
                <IconDel class="operation-icon" />
                彻底删除
              </TinyButton>
            </template>
          </TinyPopconfirm>
        </template>
        <template v-else>
          <!-- 正常模式：显示编辑、查看和删除 -->
          <TinyButton
            v-permission="'uctoo:entity:edit'"
            type="text"
            @click="onEdit(data.row)"
          >
            编辑
          </TinyButton>
          <TinyButton
            v-permission="'uctoo:entity:all'"
            type="text"
            @click="onView(data.row)"
          >
            查看
          </TinyButton>
          <TinyPopconfirm
            title="确定要删除此实体吗？"
            type="info"
            trigger="click"
            @confirm="removeEntity(data.row)"
          >
            <template #reference>
              <TinyButton
                v-permission="'uctoo:entity:del'"
                type="text"
              >
                <IconDel class="operation-icon" />
                {{ $t('page.Delete') }}
              </TinyButton>
            </template>
          </TinyPopconfirm>
        </template>
      </template>
    </TinyGridColumn>
  </TinyGrid>

  <!-- 编辑对话框 -->
  <TinyModalComponent
    v-model="editModal"
    show-footer
    :mask-closable="true"
    width="800px"
    height="auto"
    resize
    :title="readonly ? '查看实体' : '编辑实体'"
    @close="onEditCancel"
  >
    <EditForm
      v-if="editModal"
      ref="editFormRef"
      :entity-data="currentEntity"
      :readonly="readonly"
    />
    <template #footer>
      <TinyButton
        v-if="!readonly"
        type="primary"
        :loading="loading"
        @click="onEditConfirm"
      >
        确认
      </TinyButton>
      <TinyButton @click="onEditCancel">
        取消
      </TinyButton>
    </template>
  </TinyModalComponent>
</template>

<style scoped lang="less">
.operation-icon {
  margin-right: 3px;
  fill: currentColor;
}

.search-filter-container {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.filter-conditions {
  border-top: 1px solid #e4e7ed;
  padding-top: 15px;
}

.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}
</style>