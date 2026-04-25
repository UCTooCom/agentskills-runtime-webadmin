import { defineStore } from 'pinia'
import { useAxiosRepo } from '@pinia-orm/axios'
import { permissions } from '@/store/models/uctoo/permissions'
import useUserStore from './user'

export const useMenuStore = defineStore('menu', {
  state() {
    return {
      menuList: [] as any[],
      flatMenuList: [] as any[],
    }
  },
  actions: {
    async getMenuList() {
      const userStore = useUserStore()
      console.log('getMenuList called, userStore.id:', userStore.id)
      
      if (!userStore.id) {
        console.log('No user id, returning empty menu')
        return []
      }
      
      try {
        // 使用 pinia-orm/axios 的 .api() 语法获取用户菜单，对接 agentskills-runtime
        const permissionsRepo = useAxiosRepo(permissions)
        console.log('Calling permissionsRepo.api().getUserMenuTree with userId:', userStore.id)

        const res = await permissionsRepo.api().getUserMenuTree(userStore.id)
        console.log('getUserMenuTree response:', res)
        console.log('getUserMenuTree response.response:', res.response)

        // res 是 pinia-orm/axios 的 Response 对象
        // res.response 是 AxiosResponse
        // res.entities 是已保存到 store 的数据
        const responseData = res.response?.data || res.data
        console.log('responseData:', responseData)
        
        // agentskills-runtime 返回格式: { errno, errmsg, data: MenuTree[] }
        if (responseData && (responseData.errno === '0' || responseData.errno === 0)) {
          this.menuList = responseData.data || []
          console.log('Menu list from errno=0:', this.menuList)
        } else if (Array.isArray(responseData)) {
          // 兼容直接返回数组的情况
          this.menuList = responseData
          console.log('Menu list from array:', this.menuList)
        } else {
          console.log('No valid menu data, setting empty array')
          this.menuList = []
        }
        
        this.menuListFlat()
        return this.menuList
      } catch (error) {
        console.error('Failed to get menu list:', error)
        this.menuList = []
        return []
      }
    },
    menuListFlat() {
      this.flatMenuList = []
      const dfs = (item: any) => {
        this.flatMenuList.push(item)
        for (let i = 0; i < item.children.length; i += 1) {
          dfs(item.children[i])
        }
      }
      for (let i = 0; i < this.menuList.length; i += 1) {
        dfs(this.menuList[i])
      }
    },
  },
})
