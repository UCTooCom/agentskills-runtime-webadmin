import { useAxiosRepo } from '@pinia-orm/axios'
import { permissions } from '@/store/models/uctoo/permissions'

export interface ITreeNodeData {
  // node-key='id' 设置节点的唯一标识
  id: number | string
  // 节点显示文本
  label: string
  // 子节点
  children?: ITreeNodeData[]
  // 链接
  url: string
  // 组件
  component: string
  // 图标
  customIcon: string
  // 类型
  menuType: string
  // 父节点
  parentId: number
  // 排序
  order: number
  // 国际化
  locale: string
}

export interface CreateMenuDto {
  order: number
  menuType: string
  name: string
  path: string
  component: string
  icon: string
  locale: string
  parentId: number | null
}

export function getAllMenu() {
  return useAxiosRepo(permissions).api().getAllMenuTree()
}

export function getRoleMenu(email: string) {
  // 假设email是角色ID，实际项目中可能需要根据email获取角色ID
  return useAxiosRepo(permissions).api().getRoleMenuTree(email)
}

export function updateMenu(data: any) {
  // 转换数据格式以匹配新API
  const menuData = {
    id: data.id,
    permission_name: data.name,
    path: data.path,
    component: data.component,
    icon: data.icon,
    locale: data.locale,
    parent_id: data.parentId,
    weight: data.order,
    menu_type: data.menuType
  }
  return useAxiosRepo(permissions).api().editPermission(menuData)
}

export function deleteMenu(id: number, parentId: number) {
  return useAxiosRepo(permissions).api().deletePermission({ id })
}

export function createMenu(data: any) {
  // 转换数据格式以匹配新API
  const menuData = {
    permission_name: data.name,
    path: data.path,
    component: data.component,
    icon: data.icon,
    locale: data.locale,
    parent_id: data.parentId,
    weight: data.order,
    menu_type: data.menuType,
    type: 1, // 1 菜单 2 按钮
    hidden: 1, // 1 显示 0 隐藏
    keepalive: 1 // 1 缓存 2 不缓存
  }
  return useAxiosRepo(permissions).api().addPermission(menuData)
}
