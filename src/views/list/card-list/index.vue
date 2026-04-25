<script lang="ts" setup>
import {
  TinyButton,
  TinyButtonGroup,
  TinyCard,
  TinyLoading,
  TinyPager,
  TinySearch,
  TinyTag,
} from '@opentiny/vue'
import { iconRefresh } from '@opentiny/vue-icon'
import { t } from '@opentiny/vue-locale'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useAxiosRepo } from '@pinia-orm/axios'
import { application } from '@/store/models/uctoo/application'
import Image from './components/image.vue'

const IconRefresh = iconRefresh()
const serviceOptions = reactive([
  { text: t(`cardList.options.all`), value: 'all' },
  { text: t(`cardList.options.services`), value: 'dev' },
  { text: t(`cardList.options.design`), value: 'design' },
])
const filterDataModel = reactive({
  keywords: '',
  classify: 'all',
})

const pager = ref({
  currentPage: 1,
  pageSize: 10,
  total: 2,
  pageSizes: [10, 20, 50],
  layout: 'total, sizes, pre, pager, next, jumper',
})

const pagerRef = ref(null)
let observer = null

onMounted(() => {
  handleResizePager()
  fetchData()
})

onUnmounted(() => {
  observer?.disconnect()
})

function handleResizePager() {
  let resizeTimer = null
  const handleResize = (entries: ResizeObserverEntry[]) => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      entries.forEach((entry) => {
        const { width } = entry?.contentRect
        pager.value.layout
          = width < 600
            ? 'total, pre, pager, next'
            : 'total, sizes, pre, pager, next, jumper'
      })
    }, 150)
  }
  observer = new ResizeObserver(handleResize)
  observer.observe(pagerRef.value.$el)
}

function search() {
  pager.value.currentPage = 1
  fetchData()
}

function handleRefresh() {
  fetchData()
}

function classifyChange(val: string) {
  filterDataModel.classify = val
  pager.value.currentPage = 1
  fetchData()
}

function currentChange(current: number) {
  pager.value.currentPage = current
  fetchData()
}

function sizeChange(size: number) {
  pager.value.pageSize = size
  fetchData()
}

const cards = ref([])

const cardLoadingState = ref(null)

// 解析 tag 字段，支持字符串和数组格式
function parseTags(tag: any) {
  if (!tag) return []
  
  // 如果已经是数组，直接返回
  if (Array.isArray(tag)) return tag
  
  // 如果是字符串，尝试解析 JSON
  if (typeof tag === 'string') {
    try {
      const parsed = JSON.parse(tag)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      // 如果不是 JSON，返回空数组
      return []
    }
  }
  
  return []
}

async function fetchData() {
  try {
    cardLoadingState.value = TinyLoading.service({
      target: document.getElementById('card-list'),
    })
    
    // 构建查询参数，遵循 UCToo V4 API 规范
    // 使用 filter 参数传递过滤条件
    const queryParams: Record<string, any> = {}
    
    // 构建 filter 对象
    const filterConditions: Record<string, any> = {}
    
    // 处理 classify 过滤
    if (filterDataModel.classify && filterDataModel.classify !== 'all') {
      filterConditions.classify = { equals: filterDataModel.classify }
    }
    
    // 处理 keywords 搜索
    if (filterDataModel.keywords) {
      filterConditions.name = { contains: filterDataModel.keywords }
    }
    
    // 如果有过滤条件，添加到查询参数
    if (Object.keys(filterConditions).length > 0) {
      queryParams.filter = JSON.stringify(filterConditions)
    }
    
    console.log('Query params:', queryParams)
    
    // 使用 application model 的 getApplicationList 方法
    const appRepo = useAxiosRepo(application)
    const res = await appRepo.api().getApplicationList(
      pager.value.currentPage,
      pager.value.pageSize,
      queryParams
    )
    
    // res 是 pinia-orm/axios 的 Response 对象
    // res.response 是 AxiosResponse
    // res.entities 是已保存到 store 的数据
    const responseData = res.response.data
    
    console.log('API Response:', responseData)
    console.log('Response data structure:', {
      hasData: !!responseData.data,
      hasApplications: !!responseData.applications,
      errno: responseData.errno
    })
    
    // 处理响应数据
    // API 返回格式: { errno: 0, data: { applications: [...], currentPage: 1, totalCount: 11, totalPage: 2 } }
    // 或者直接: { applications: [...], currentPage: 1, totalCount: 11, totalPage: 2 }
    
    let applications = []
    let totalCount = 0
    
    // 情况1: { errno: 0, data: { applications: [...], totalCount: 11 } }
    if (responseData.errno !== undefined && responseData.data) {
      applications = responseData.data.applications || []
      totalCount = responseData.data.totalCount || 0
    }
    // 情况2: { applications: [...], totalCount: 11 }
    else if (responseData.applications) {
      applications = responseData.applications
      totalCount = responseData.totalCount || 0
    }
    
    cards.value = applications
    pager.value.total = totalCount
    console.log('Cards loaded:', cards.value.length, 'Total:', pager.value.total)
    console.log('First card:', cards.value[0])
  }
  catch (error) {
    console.error('Failed to fetch card list:', error)
  }
  finally {
    cardLoadingState.value?.close()
  }
}
</script>

<template>
  <div class="container-list">
    <Breadcrumb :items="['menu.list', 'menu.list.cardList']" />
    <div class="content">
      <div class="header mb-4">
        {{ $t('cardList.title') }}
      </div>
      <div class="mb-4 flex flex-wrap justify-between gap-2">
        <TinyButtonGroup
          v-model="filterDataModel.classify"
          class="card-list-button-group"
          :data="serviceOptions"
          @change="classifyChange"
        />
        <div class="search-box-container flex gap-2">
          <TinySearch
            v-model="filterDataModel.keywords"
            class="flex-1"
            :placeholder="$t('cardList.search.placeholder')"
            @change="search"
          />
          <TinyButton :icon="IconRefresh" @click="handleRefresh" />
        </div>
      </div>

      <div id="card-list" class="card-container">
        <TinyCard v-for="card in cards" :key="card.id" custom-class="card-item">
          <Image :src="card.icon" />
          <div class="header mb-2 mt-2">
            {{ card.name }}
          </div>
          <div class="line-clamp-2">
            {{ card.description }}
          </div>
          <div class="mt2" v-if="card.tag && parseTags(card.tag).length > 0">
            <TinyTag
              v-for="(item, index) in parseTags(card.tag)"
              :key="index"
              class="mr-1"
              :type="item.type"
              :value="item.value"
              effect="light"
            />
          </div>
        </TinyCard>
      </div>
      <TinyPager
        ref="pagerRef"
        :current-page="pager.currentPage"
        :total="pager.total"
        :page-size="pager.pageSize"
        :page-sizes="pager.pageSizes"
        :layout="pager.layout"
        :auto-resize="true"
        @current-change="currentChange"
        @size-change="sizeChange"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.container-list {
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: space-between;
  overflow-x: hidden;
  overflow-y: auto;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: calc(100% - 53px); // 53px is the height of breadcrumb
  overflow: auto;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
}

.header {
  color: var(--tv-color-text);
  font-weight: bold;
  font-size: 16px;
}

.search-box-container {
  flex: 1;
  max-width: 330px;
  min-width: 130px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
  row-gap: 12px;
}

.card-item {
  width: auto;
}

@media (max-width: @screen-mm) {
  :deep(.card-list-button-group.tiny-button-group .tiny-group-item li button) {
    padding: 0 20px;
  }
}
</style>
