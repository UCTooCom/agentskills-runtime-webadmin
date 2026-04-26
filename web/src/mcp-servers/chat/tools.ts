/**
 * Chat Tools - 对接 agentskills-runtime 的聊天和技能工具
 */

import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js'
import type { PageAwareServer } from '@opentiny/next-sdk'
import { z } from 'zod'

// WebSocket 连接管理
let ws: WebSocket | null = null
let connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected'
let currentSessionId: string = ''
let heartbeatTimer: number | null = null
let lastHeartbeatTime: number = 0

// 消息回调队列
const messageCallbacks = new Map<string, {
  resolve: (value: any) => void
  reject: (error: Error) => void
  timeout: number
}>()

// WebSocket 配置
const WS_URL = import.meta.env.VITE_WS_URL || 'wss://javatoarktsapi.uctoo.com/ws/chat'
const CONNECTION_TIMEOUT = 10000
const HEARTBEAT_INTERVAL = 10000
const HEARTBEAT_TIMEOUT = 20000

/**
 * 连接 WebSocket
 */
async function connectWebSocket(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      resolve(currentSessionId)
      return
    }

    connectionStatus = 'connecting'

    try {
      ws = new WebSocket(WS_URL)

      const timeout = setTimeout(() => {
        reject(new Error('WebSocket 连接超时'))
        ws?.close()
      }, CONNECTION_TIMEOUT)

      ws.onopen = () => {
        clearTimeout(timeout)
        connectionStatus = 'connected'
        lastHeartbeatTime = Date.now()
        startHeartbeat()
      }

      ws.onmessage = (event) => {
        handleWebSocketMessage(event)
      }

      ws.onerror = (error) => {
        clearTimeout(timeout)
        connectionStatus = 'error'
        reject(new Error('WebSocket 连接错误'))
      }

      ws.onclose = () => {
        clearTimeout(timeout)
        stopHeartbeat()
        connectionStatus = 'disconnected'
      }

    } catch (error) {
      connectionStatus = 'error'
      reject(error)
    }
  })
}

/**
 * 处理 WebSocket 消息
 */
function handleWebSocketMessage(event: MessageEvent) {
  try {
    const data = JSON.parse(event.data)

    switch (data.type) {
      case 'welcome':
        currentSessionId = data.payload.session_id
        connectionStatus = 'connected'
        const welcomeCallback = messageCallbacks.get('welcome')
        if (welcomeCallback) {
          clearTimeout(welcomeCallback.timeout)
          welcomeCallback.resolve(currentSessionId)
          messageCallbacks.delete('welcome')
        }
        break

      case 'chat_response':
        const chatCallback = messageCallbacks.get(data.payload.message_id)
        if (chatCallback) {
          clearTimeout(chatCallback.timeout)
          chatCallback.resolve(data.payload.content)
          messageCallbacks.delete(data.payload.message_id)
        }
        break

      case 'skill_result':
        const skillCallback = messageCallbacks.get(data.payload.skill_id)
        if (skillCallback) {
          clearTimeout(skillCallback.timeout)
          skillCallback.resolve({
            success: data.payload.success === 'true',
            output: data.payload.output
          })
          messageCallbacks.delete(data.payload.skill_id)
        }
        break

      case 'skills_list':
        const listCallback = messageCallbacks.get('list_skills')
        if (listCallback) {
          clearTimeout(listCallback.timeout)
          listCallback.resolve(data.payload.skills || [])
          messageCallbacks.delete('list_skills')
        }
        break

      case 'error':
        for (const [id, callback] of messageCallbacks.entries()) {
          clearTimeout(callback.timeout)
          callback.reject(new Error(data.payload.error))
          messageCallbacks.delete(id)
        }
        break

      case 'pong':
        lastHeartbeatTime = Date.now()
        break
    }
  } catch (error) {
    console.error('Failed to parse WebSocket message:', error)
  }
}

/**
 * 发送 WebSocket 消息
 */
function sendMessage(type: string, payload: any, messageId?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      reject(new Error('WebSocket 未连接'))
      return
    }

    const id = messageId || `${type}-${Date.now()}`

    const timeout = setTimeout(() => {
      messageCallbacks.delete(id)
      reject(new Error('消息响应超时'))
    }, 60000)

    messageCallbacks.set(id, { resolve, reject, timeout })

    ws.send(JSON.stringify({
      type,
      ...payload,
      message_id: id
    }))
  })
}

/**
 * 启动心跳
 */
function startHeartbeat() {
  stopHeartbeat()
  heartbeatTimer = window.setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }))
      lastHeartbeatTime = Date.now()

      if (Date.now() - lastHeartbeatTime > HEARTBEAT_TIMEOUT) {
        console.warn('WebSocket heartbeat timeout')
        ws.close()
        connectWebSocket()
      }
    }
  }, HEARTBEAT_INTERVAL)
}

/**
 * 停止心跳
 */
function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }
}

/**
 * 注册 Chat 工具
 */
export default function registerChatTools(server: PageAwareServer) {
  // chat 工具 - 与大模型对话
  server.registerTool(
    'chat',
    {
      title: '与大模型对话',
      description: '向大模型发送消息并获取回复',
      inputSchema: {
        message: z.string().describe('要发送的消息内容')
      },
      annotations: {
        title: 'AI 对话',
        readOnlyHint: false
      } as ToolAnnotations
    },
    async ({ message }: { message: string }) => {
      // 确保已连接
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        await connectWebSocket()
      }

      // 发送消息并等待响应
      const response = await sendMessage('chat', { content: message })

      return {
        content: [{
          type: 'text' as const,
          text: response
        }]
      }
    }
  )

  // list_skills 工具 - 列出可用技能
  server.registerTool(
    'list_skills',
    {
      title: '列出可用技能',
      description: '获取当前可用的技能列表',
      inputSchema: {},
      annotations: {
        title: '技能列表',
        readOnlyHint: true
      } as ToolAnnotations
    },
    async () => {
      // 确保已连接
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        await connectWebSocket()
      }

      // 获取技能列表
      const skills = await sendMessage('list_skills', {})

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(skills, null, 2)
        }]
      }
    }
  )

  // execute_skill 工具 - 执行技能
  server.registerTool(
    'execute_skill',
    {
      title: '执行技能',
      description: '执行指定的技能并返回结果',
      inputSchema: {
        skill_id: z.string().describe('技能 ID'),
        parameters: z.record(z.any()).optional().describe('技能参数'),
        timeout: z.string().optional().describe('超时时间(如 60s)')
      },
      annotations: {
        title: '技能执行',
        readOnlyHint: false
      } as ToolAnnotations
    },
    async ({ skill_id, parameters = {}, timeout = '60s' }: {
      skill_id: string
      parameters?: Record<string, any>
      timeout?: string
    }) => {
      // 确保已连接
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        await connectWebSocket()
      }

      // 执行技能
      const result = await sendMessage('execute_skill', {
        skill_id,
        parameters,
        timeout
      })

      return {
        content: [{
          type: 'text' as const,
          text: result.success
            ? `技能执行成功:\n${result.output}`
            : `技能执行失败:\n${result.output}`
        }]
      }
    }
  )

  // get_connection_status 工具 - 获取连接状态
  server.registerTool(
    'get_connection_status',
    {
      title: '获取连接状态',
      description: '获取 WebSocket 连接状态和会话信息',
      inputSchema: {},
      annotations: {
        title: '连接状态',
        readOnlyHint: true
      } as ToolAnnotations
    },
    async () => {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            status: connectionStatus,
            sessionId: currentSessionId,
            wsUrl: WS_URL
          }, null, 2)
        }]
      }
    }
  )
}

// 导出清理函数
export function cleanup() {
  stopHeartbeat()
  if (ws) {
    ws.close()
    ws = null
  }
  messageCallbacks.clear()
}
