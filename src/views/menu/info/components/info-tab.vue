<script lang="ts" setup>
import type {
  ComponentInstance,
} from 'vue'
import type { Node } from './menu-tree.vue'
import type { ITreeNodeData } from '@/router/guard/menu'
import { registerPageTool } from '@opentiny/next-sdk'
import {
  Loading,
  Button as TinyButton,
  Modal as TinyModal,
} from '@opentiny/vue'
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { getAllLocalItems } from '@/api/local'
import { useAxiosRepo } from '@pinia-orm/axios'
import { permissions } from '@/store/models/uctoo/permissions'
import useLoading from '@/hooks/loading'
import { useResponsiveSize } from '@/hooks/responsive'
import { useDeepClone } from '@/hooks/useDeepClone'
import { useI18nMenu } from '@/hooks/useI18nMenu'
import { flushRouter } from '@/router/guard/menu'
import { useTabStore } from '@/store'
import { useMenuStore } from '@/store/modules/router'
import { sleep } from '@/utils/base-utils'
import { getIdByLabel } from '@/utils/tree'
import AddMenu from './add-menu.vue'
import menuTree from './menu-tree.vue'
import UpdateForm from './update-form.vue'

const { modalSize } = useResponsiveSize()

const { t } = useI18n()
const vLoading = Loading.directive
const rawMenuData = ref<ITreeNodeData[]>([])
const localeData = ref<{ value: string, label: string }[]>([])
const i18nMenuData = computed(() => useI18nMenu(rawMenuData.value, t))

const readonly = ref(false)
const updateModal = ref(false)
const DEFAULT_NODE = {
  id: '',
  permission_name: '',
  path: '',
  component: '',
  icon: '',
  menu_type: 'normal',
  parent_id: '',
  weight: 0,
  locale: '',
  title: '',
  type: 1,
  hidden: 1,
  keepalive: 1,
}
const activeNode = ref<ITreeNodeData>()
const form = ref<ComponentInstance<typeof UpdateForm>>()
const addMenu = ref<ComponentInstance<typeof AddMenu>>()
const { loading, setLoading } = useLoading(false)
const { loading: treeLoading, setLoading: setTreeLoading } = useLoading(true)
const { loading: addLoading, setLoading: setAddLoading } = useLoading()
const addModal = ref(false)
const router = useRouter()
const tabStore = useTabStore()

function handleAddMenu() {
  addModal.value = true
}
function onAddMenuClose() {
  addModal.value = false
}
function onClickAdd() {
  addMenu.value
    .valid()
    .then(() => {
      const menuInfo = addMenu.value.getMenuInfo()
      setAddLoading(true)
      // 直接使用数据库字段名
      const menuData = {
        permission_name: menuInfo.name,
        path: menuInfo.path,
        component: menuInfo.component,
        icon: menuInfo.icon,
        locale: menuInfo.locale,
        parent_id: menuInfo.parentId || '',
        weight: menuInfo.order,
        menu_type: menuInfo.menuType || 'normal',
        type: 1, // 1 菜单 2 按钮
        hidden: 1, // 1 显示 0 隐藏
        keepalive: 1 // 1 缓存 2 不缓存
      }
      useAxiosRepo(permissions).api().addPermission(menuData)
        .then(() => {
          TinyModal.message({
            message: t('menuInfo.modal.add.success'),
            status: 'success',
          })
          addModal.value = false
          return updateUserMenu()
        })
        .then(() => fetchMenu())
        .catch((error) => {
          if (error.response && error.response.data) {
            const errorMessage = error.response.data.message || '未知错误'
            TinyModal.message({
              message: errorMessage,
              status: 'error',
            })
          }
        })
        .finally(() => {
          setAddLoading(false)
        })
    })
    .catch(() => {})
}
function onClose() {
  activeNode.value = DEFAULT_NODE
}
function onUpdate(data: Node) {
  updateModal.value = true
  activeNode.value = data
  readonly.value = false
}
function onCheck(data: Node) {
  activeNode.value = data
  updateModal.value = true
  readonly.value = true
}
function onCancel() {
  activeNode.value = DEFAULT_NODE
  updateModal.value = false
}
function flushTabs() {
  const routePaths = router.getRoutes().map(routeItem => routeItem.path)
  const removeTabs = tabStore.data.filter(
    ({ link }) => !routePaths.includes(link),
  )
  removeTabs.forEach(({ link }) => tabStore.delByLink(link))
  if (!tabStore.data.includes(tabStore.current)) {
    tabStore.$patch({
      current: tabStore.data[0],
    })
  }
}
function onDelete(data: Node) {
  setTreeLoading(true)
  const node = useDeepClone(data)
  
  useAxiosRepo(permissions).api().deletePermission({ id: node.id })
    .then(() => {
      TinyModal.message({
        message: '删除成功',
        status: 'success',
      })
      return fetchMenu()
    })
    .then(() => {
      return updateUserMenu()
    })
    .then(() => {
      flushTabs()
    })
    .catch((reason) => {
      const error = reason
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || '未知错误'
        TinyModal.message({
          message: errorMessage,
          status: 'error',
        })
      }
    })
    .finally(() => {
      setTreeLoading(false)
    })
}
function onConfirm() {
  setLoading(true)
  form.value
    .valid()
    .then(() => {
      const menuInfo = form.value.getMenuInfo()
      activeNode.value = {
        ...DEFAULT_NODE,
      }
      if (menuInfo.id === menuInfo.parent_id) {
        TinyModal.message({
          message: t('menuInfo.modal.message.error'),
          status: 'error',
        })
        return
      }
      // 直接使用数据库字段名
      const menuData = {
        id: menuInfo.id,
        permission_name: menuInfo.permission_name,
        path: menuInfo.path,
        component: menuInfo.component,
        icon: menuInfo.icon,
        locale: menuInfo.locale,
        parent_id: menuInfo.parent_id || '',
        weight: menuInfo.weight,
        menu_type: menuInfo.menu_type || 'normal'
      }
      useAxiosRepo(permissions).api().editPermission(menuData)
        .then(() => {
          TinyModal.message({
            message: t('menuInfo.modal.edit.success'),
            status: 'success',
          })
          setTimeout(() => {
            router.go(0)
          }, 200)
          setTreeLoading(true)
          return fetchMenu()
        })
        .then(() => updateUserMenu())
        .catch((error) => {
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
          setTreeLoading(false)
        })
      updateModal.value = false
    })
    .catch(() => {})
    .finally(() => {
      setLoading(false)
    })
}
async function fetchMenu() {
  const response = await useAxiosRepo(permissions).api().getAllMenuTree()

  console.log('=== fetchMenu response ===', response)
  console.log('=== fetchMenu response.data ===', response.data)

  // 处理新API的响应格式
  // pinia-orm/axios 返回的 response 结构：{ data: AxiosResponse, entities: ..., response: AxiosResponse }
  // AxiosResponse 结构：{ data: { errno, errmsg, data: [...] }, status: 200, ... }
  const axiosResponse = response.response || response
  const responseData = axiosResponse.data || response.data

  console.log('=== fetchMenu axiosResponse ===', axiosResponse)
  console.log('=== fetchMenu responseData ===', responseData)

  // 检查响应数据结构 - 新API返回 { errno, errmsg, data }
  const menuData = responseData.data || responseData

  console.log('=== fetchMenu menuData ===', menuData)

  // 直接使用数据库字段名，不需要转换
  rawMenuData.value = Array.isArray(menuData) ? menuData : []
  console.log('=== fetchMenu rawMenuData.value ===', rawMenuData.value)
}
const menuStore = useMenuStore()
const { reloadMenu } = inject<{ reloadMenu: () => void }>('RELOAD')
async function updateUserMenu() {
  await flushRouter(router)
  reloadMenu()
  return menuStore.getMenuList()
}
function fetchLocalItems() {
  getAllLocalItems(1, 0, 1).then(({ data }) => {
    localeData.value = data.items.map((item) => {
      return {
        value: item.key,
        label: t(item.key),
      }
    })
  })
}

const { locale } = useI18n()
watch(locale, () => {
  fetchLocalItems()
})

let cleanupPageTool: () => void

onMounted(async () => {
  Promise.all([fetchMenu(), fetchLocalItems()]).finally(() => {
    treeLoading.value = false
  })

  cleanupPageTool = registerPageTool({
    handlers: {
      // key 必须与 mcp-servers 中注册的工具名一致
      'add-menu': async ({ name, order, parentMenu, icon, component, path, locale: menuLocale }) => {
        handleAddMenu()
        await sleep(1000)
        const parentId = getIdByLabel(i18nMenuData.value, parentMenu)
        addMenu.value.setMenuInfo({
          name,
          order,
          parentId,
          icon,
          component,
          menuType: '/',
          path,
          locale: menuLocale,
        })
        await sleep(1000)
        onClickAdd()
        return { content: [{ type: 'text', text: `收到: ${name}` }] }
      },
    },
  })
})

onUnmounted(() => cleanupPageTool?.())
</script>

<template>
  <div class="tiny-fullscreen-scroll">
    <div class="tiny-fullscreen-wrapper">
      <div class="menu-add-btn">
        <TinyButton
          v-permission="'uctoo:menu:add'"
          type="primary"
          @click="handleAddMenu"
        >
          {{ $t('menuInfo.modal.title.add') }}
        </TinyButton>
      </div>
      <menu-tree
        v-loading="treeLoading"
        :data="i18nMenuData"
        :locale-data="localeData"
        @update="onUpdate"
        @check="onCheck"
        @delete="onDelete"
      />
      <TinyModal
        v-model="addModal"
        show-footer
        resize
        :width="modalSize"
        height="auto"
        :title="$t('menuInfo.modal.title.add')"
        @close="onAddMenuClose"
      >
        <AddMenu
          v-if="addModal"
          ref="addMenu"
          :menus="i18nMenuData"
          :locales="localeData"
        />
        <template #footer>
          <TinyButton round @click="onAddMenuClose">
            {{
              $t('menu.btn.cancel')
            }}
          </TinyButton>
          <TinyButton
            type="primary"
            round
            :loading="addLoading"
            @click="onClickAdd"
          >
            {{ $t('menu.btn.confirm') }}
          </TinyButton>
        </template>
      </TinyModal>
      <TinyModal
        v-if="!readonly"
        v-model="updateModal"
        show-footer
        :mask-closable="true"
        :width="modalSize"
        height="auto"
        resize
        :title="$t('menuInfo.modal.title.update')"
        @close="onClose"
      >
        <UpdateForm
          v-if="updateModal"
          ref="form"
          :node="activeNode"
          :menus="i18nMenuData"
          :locale-data="localeData"
          :readonly="readonly"
        />

        <template #footer>
          <TinyButton
            v-if="!readonly"
            type="primary"
            :loading="loading"
            @click="onConfirm"
          >
            {{ $t('menu.btn.confirm') }}
          </TinyButton>
          <TinyButton v-if="!readonly" @click="onCancel">
            {{
              $t('menu.btn.cancel')
            }}
          </TinyButton>
        </template>
      </TinyModal>
      <TinyModal
        v-if="readonly"
        v-model="updateModal"
        show-footer
        :mask-closable="true"
        resize
        :title="$t('menuInfo.modal.title.info')"
        @close="onClose"
      >
        <UpdateForm
          v-if="updateModal"
          ref="form"
          :node="activeNode"
          :menus="i18nMenuData"
          :locale-data="localeData"
          :readonly="readonly"
        />
      </TinyModal>
    </div>
  </div>
</template>

<style scoped lang="less">
  #contain {
  height: 100%;
  padding: 15px;
  overflow: hidden;
}

.menu-add-btn {
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
