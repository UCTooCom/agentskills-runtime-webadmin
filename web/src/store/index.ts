import { createPinia } from 'pinia'
import { createORM } from 'pinia-orm'
import { createPiniaOrmAxios } from '@pinia-orm/axios'
import axios from 'axios'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import useAppStore from './modules/app'
import useTabBarStore from './modules/tab-bar'
import { useTabStore } from './modules/tabs'
import useUserStore from './modules/user'

// 导入所有 uctoo models
import * as uctooModels from './models/uctoo'

// 导入 seed models
import { BoardOption } from './models/BoardOption'
import { Employee } from './models/Employee'
import { ProfileVersion, ProfileProject } from './models/ProfileData'
import { UserData } from './models/UserData'

// 配置 pinia-orm
// 使用相对路径，通过代理服务器发送请求，避免跨域问题
const apiURL = ''

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 注册所有 models
const allModels = [
  ...Object.values(uctooModels).filter((item) => {
    return item && typeof item === 'function' && item.entity
  }),
  BoardOption,
  Employee,
  ProfileVersion,
  ProfileProject,
  UserData,
]

const pinia = createPinia()

// 使用 pinia-plugin-persistedstate 插件
pinia.use(piniaPluginPersistedstate)

// 使用 pinia-orm，models 在 createORM 中注册
const orm = createORM({
  model: allModels as any,
  plugins: [
    createPiniaOrmAxios({
      axios: axiosInstance,
      baseURL: apiURL,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }),
  ],
})

pinia.use(orm)

export { useAppStore, useTabBarStore, useTabStore, useUserStore }
export default pinia
