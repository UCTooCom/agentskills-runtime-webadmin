import { isLogin } from '../utils/auth'
import {
  failResponseWrap,
  initData,
  successResponseWrap,
} from '../utils/setup-mock'

const positive = JSON.parse(JSON.stringify(initData.tableData))
const negative = JSON.parse(JSON.stringify(initData.tableData.reverse()))
const initlist = JSON.parse(JSON.stringify(initData.chartData[0].list))
const userInfo = JSON.parse(JSON.stringify(initData.userInfo))
export default [
  // 注册
  {
    url: '/api/user/register',
    method: 'post',
    response: (params: { body: any }) => {
      localStorage.setItem('registerUser', JSON.stringify(params.body))
      return successResponseWrap({ ...userInfo, role: 'admin' })
    },
  },

  // 用户信息
  {
    url: '/api/user/userInfo',
    method: 'get',
    response: () => {
      if (isLogin()) {
        const role = window.localStorage.getItem('userRole') || 'admin'
        return successResponseWrap({
          ...userInfo,
          role,
        })
      }
      return successResponseWrap(null)
    },
  },

  // 修改用户信息
  {
    url: '/api/user/userInfo',
    method: 'put',
    response: () => {
      if (isLogin()) {
        const role = window.localStorage.getItem('userRole') || 'admin'
        return successResponseWrap({
          ...userInfo,
          role,
        })
      }
      return successResponseWrap(null)
    },
  },

  // 登录
  {
    url: '/api/user/login',
    method: 'post',
    response: (params: { body: any }) => {
      const registerUser = JSON.parse(
        localStorage.getItem('registerUser') || '{}',
      )
      const { username, password } = JSON.parse(JSON.stringify(params.body))
      if (!username) {
        return failResponseWrap(null, '邮箱名不能为空', 'InvalidParameter')
      }
      if (!password) {
        return failResponseWrap(null, '密码不能为空', 'InvalidParameter')
      }
      if (
        (username === 'admin@example.com' && password === 'admin')
        || (username === registerUser.username
          && password === registerUser.password)
      ) {
        window.localStorage.setItem('userRole', 'admin')
        return successResponseWrap({
          token: '12345',
          userInfo: {
            ...userInfo,
          },
        })
      }
      return failResponseWrap(null, '账号或者密码错误', 'InvalidParameter')
    },
  },

  // 登出
  {
    url: '/api/user/logout',
    method: 'post',
    response: () => {
      return successResponseWrap(null)
    },
  },
] as any
