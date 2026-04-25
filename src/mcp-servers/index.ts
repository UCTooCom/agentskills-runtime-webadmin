import { createMessageChannelPairTransport, WebMcpServer, withPageTools } from '@opentiny/next-sdk'
import registerChatTools from './chat/tools'
import registerLocaleManagementTools from './locale/tools'
import registerMenuManagementTools from './menu/tools'
import registerPermissionManagementTools from './permission/tools'
import registerRoleManagementTools from './role/tools'
import registerUserManagementTools from './user/tools'
import registerEntityTools from './entity/tools'

const rawServer = new WebMcpServer()
const [serverTransport, clientTransport] = createMessageChannelPairTransport()

// withPageTools 包装后，registerTool 第三个参数支持路由配置对象
export const server = withPageTools(rawServer)

// clientTransport 导出给 TinyRemoter 使用
export { clientTransport }

export async function createMcpServer() {
  // 注册 Chat 工具(对接 agentskills-runtime)
  registerChatTools(server)
  
  // 注册业务管理工具
  registerLocaleManagementTools(server)
  registerUserManagementTools(server)
  registerRoleManagementTools(server)
  registerPermissionManagementTools(server)
  registerMenuManagementTools(server)
  registerEntityTools(server)
  
  // 最后建立连接，确保所有工具已注册完毕
  await rawServer.connect(serverTransport)
}
