/**
 * Chat MCP Server - 对接 agentskills-runtime 的聊天服务
 *
 * 功能:
 * 1. 提供 chat 工具 - 与大模型对话
 * 2. 提供 list_skills 工具 - 列出可用技能
 * 3. 提供 execute_skill 工具 - 执行技能
 * 4. WebSocket 连接管理
 */

import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js'
import type { WebMcpServer } from '../WebMcpServer'
import { z } from 'zod'

export interface ChatMcpServerOptions {
  /** WebSocket 服务地址 */
  wsUrl?: string
  /** 会话 ID */
  sessionId?: string
  /** 连接超时时间(ms) */
  connectionTimeout?: number
  /** 心跳间隔(ms) */
  heartbeatInterval?: number
  /** 心跳超时时间(ms) */
  heartbeatTimeout?: number
  /** 重连尝试次数 */
  reconnectAttempts?: number
  /** 重连延迟(ms) */
  reconnectDelay?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  status?: 'loading' | 'success' | 'error'
}

export interface SkillInfo {
  id: string
  name: string
  description: string
  version: string
}

/**
 * Chat MCP Server 类 - 对接 agentskills-runtime 的聊天服务
 */
export class ChatMcpServer {
  private ws: WebSocket | null = null
  private connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected'
  private currentSessionId: string = ''
  private heartbeatTimer: number | null = null
  private lastHeartbeatTime: number = 0
  private messageCallbacks = new Map<string, {
    resolve: (value: any) => void
    reject: (error: Error) => void
    timeout: NodeJS.Timeout
  }>()
  private wsUrl: string
  private connectionTimeout: number
  private heartbeatInterval: number
  private heartbeatTimeout: number
  private reconnectAttempts: number
  private reconnectDelay: number
  private reconnectCount: number = 0

  constructor(options: ChatMcpServerOptions = {}) {
    this.wsUrl = options.wsUrl || import.meta.env?.VITE_WS_URL || 'wss://javatoarktsapi.uctoo.com/ws/chat'
    this.connectionTimeout = options.connectionTimeout || 10000
    this.heartbeatInterval = options.heartbeatInterval || 10000
    this.heartbeatTimeout = options.heartbeatTimeout || 20000
    this.reconnectAttempts = options.reconnectAttempts || 3
    this.reconnectDelay = options.reconnectDelay || 2000
    this.currentSessionId = options.sessionId || ''
  }

  /**
   * 连接 WebSocket
   */
  private async connectWebSocket(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve(this.currentSessionId)
        return
      }

      this.connectionStatus = 'connecting'

      try {
        this.ws = new WebSocket(this.wsUrl)

        const timeout = setTimeout(() => {
          reject(new Error('WebSocket 连接超时'))
          this.ws?.close()
          this.reconnect()
        }, this.connectionTimeout)

        // 保存 welcome 回调
        this.messageCallbacks.set('welcome', {
          resolve,
          reject,
          timeout: setTimeout(() => {
            this.messageCallbacks.delete('welcome')
            reject(new Error('WebSocket 连接超时 - 未收到 welcome 消息'))
            this.reconnect()
          }, this.connectionTimeout)
        })

        this.ws.onopen = () => {
          clearTimeout(timeout)
          this.lastHeartbeatTime = Date.now()
          this.reconnectCount = 0
        }

        this.ws.onmessage = (event) => {
          this.handleWebSocketMessage(event)
        }

        this.ws.onerror = (error) => {
          clearTimeout(timeout)
          this.connectionStatus = 'error'
          const welcomeCallback = this.messageCallbacks.get('welcome')
          if (welcomeCallback) {
            clearTimeout(welcomeCallback.timeout)
            welcomeCallback.reject(new Error('WebSocket 连接错误'))
            this.messageCallbacks.delete('welcome')
          }
          this.reconnect()
        }

        this.ws.onclose = () => {
          clearTimeout(timeout)
          this.stopHeartbeat()
          this.connectionStatus = 'disconnected'
          const welcomeCallback = this.messageCallbacks.get('welcome')
          if (welcomeCallback) {
            clearTimeout(welcomeCallback.timeout)
            welcomeCallback.reject(new Error('WebSocket 连接关闭'))
            this.messageCallbacks.delete('welcome')
          }
          this.reconnect()
        }

      } catch (error) {
        this.connectionStatus = 'error'
        const welcomeCallback = this.messageCallbacks.get('welcome')
        if (welcomeCallback) {
          clearTimeout(welcomeCallback.timeout)
          welcomeCallback.reject(error instanceof Error ? error : new Error(String(error)))
          this.messageCallbacks.delete('welcome')
        }
        this.reconnect()
      }
    })
  }

  /**
   * 处理 WebSocket 消息
   */
  private handleWebSocketMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case 'welcome':
          this.currentSessionId = data.payload.session_id
          this.connectionStatus = 'connected'
          this.startHeartbeat()
          // 解析等待 welcome 的 Promise
          const welcomeCallback = this.messageCallbacks.get('welcome')
          if (welcomeCallback) {
            clearTimeout(welcomeCallback.timeout)
            welcomeCallback.resolve(this.currentSessionId)
            this.messageCallbacks.delete('welcome')
          }
          break

        case 'chat_response':
          // 查找所有非 welcome 的 callback（因为 chat 消息没有 message_id）
          for (const [id, callback] of this.messageCallbacks.entries()) {
            if (id !== 'welcome') {
              clearTimeout(callback.timeout)
              callback.resolve(data.payload.content)
              this.messageCallbacks.delete(id)
            }
          }
          break

        case 'skill_result':
          const skillCallback = this.messageCallbacks.get(data.payload.skill_id)
          if (skillCallback) {
            clearTimeout(skillCallback.timeout)
            skillCallback.resolve({
              success: data.payload.success === 'true',
              output: data.payload.output
            })
            this.messageCallbacks.delete(data.payload.skill_id)
          } else {
            // 查找所有非 welcome 的 callback
            for (const [id, callback] of this.messageCallbacks.entries()) {
              if (id !== 'welcome') {
                clearTimeout(callback.timeout)
                callback.resolve({
                  success: data.payload.success === 'true',
                  output: data.payload.output
                })
                this.messageCallbacks.delete(id)
              }
            }
          }
          break

        case 'skills_list':
          const listCallback = this.messageCallbacks.get('list_skills')
          if (listCallback) {
            clearTimeout(listCallback.timeout)
            listCallback.resolve(data.payload.skills || [])
            this.messageCallbacks.delete('list_skills')
          } else {
            // 查找所有非 welcome 的 callback
            for (const [id, callback] of this.messageCallbacks.entries()) {
              if (id !== 'welcome') {
                clearTimeout(callback.timeout)
                callback.resolve(data.payload.skills || [])
                this.messageCallbacks.delete(id)
              }
            }
          }
          break

        case 'error':
          // 查找对应的 callback 并 reject
          for (const [id, callback] of this.messageCallbacks.entries()) {
            clearTimeout(callback.timeout)
            callback.reject(new Error(data.payload.error))
            this.messageCallbacks.delete(id)
          }
          break

        case 'pong':
          this.lastHeartbeatTime = Date.now()
          break

        case 'status':
          // 处理状态消息（如 thinking）
          console.log('WebSocket status:', data.payload)
          break
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
    }
  }

  /**
   * 发送 WebSocket 消息
   */
  private sendMessage(type: string, payload: any, messageId?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket 未连接'))
        return
      }

      const id = messageId || `${type}-${Date.now()}`

      // 设置超时
      const timeout = setTimeout(() => {
        this.messageCallbacks.delete(id)
        reject(new Error('消息响应超时'))
      }, 60000) // 60秒超时

      // 保存 callback
      this.messageCallbacks.set(id, { resolve, reject, timeout })

      // 发送消息
      this.ws.send(JSON.stringify({
        type,
        ...payload,
        message_id: id
      }))
    })
  }

  /**
   * 启动心跳
   */
  private startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
        this.lastHeartbeatTime = Date.now()

        // 检查心跳超时
        if (Date.now() - this.lastHeartbeatTime > this.heartbeatTimeout) {
          console.warn('WebSocket heartbeat timeout')
          this.ws.close()
          this.reconnect()
        }
      }
    }, this.heartbeatInterval)
  }

  /**
   * 停止心跳
   */
  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * 重连
   */
  private reconnect() {
    if (this.reconnectCount < this.reconnectAttempts) {
      this.reconnectCount++
      console.log(`WebSocket 重连尝试 ${this.reconnectCount}/${this.reconnectAttempts}`)
      setTimeout(() => {
        this.connectWebSocket().catch(() => {
          // 忽略重连失败的错误
        })
      }, this.reconnectDelay)
    } else {
      console.error('WebSocket 重连失败，已达到最大尝试次数')
    }
  }

  /**
   * 发送聊天消息
   */
  async sendChatMessage(message: string): Promise<string> {
    // 确保已连接
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connectWebSocket()
    }

    // 发送消息并等待响应
    return await this.sendMessage('chat', { content: message })
  }

  /**
   * 列出可用技能
   */
  async listSkills(): Promise<SkillInfo[]> {
    // 确保已连接
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connectWebSocket()
    }

    // 获取技能列表
    return await this.sendMessage('list_skills', {})
  }

  /**
   * 执行技能
   */
  async executeSkill(skillId: string, parameters: Record<string, any> = {}, timeout: string = '60s'): Promise<{ success: boolean; output: string }> {
    // 确保已连接
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connectWebSocket()
    }

    // 执行技能
    return await this.sendMessage('execute_skill', {
      skill_id: skillId,
      parameters,
      timeout
    })
  }

  /**
   * 断开连接
   */
  disconnect() {
    this.stopHeartbeat()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.messageCallbacks.clear()
    this.connectionStatus = 'disconnected'
  }

  /**
   * 获取会话 ID
   */
  getSessionId(): string {
    return this.currentSessionId
  }

  /**
   * 获取连接状态
   */
  getConnectionStatus(): 'disconnected' | 'connecting' | 'connected' | 'error' {
    return this.connectionStatus
  }
}

/**
 * 创建 Chat MCP Server 并注册工具
 */
export function createChatMcpServer(
  server: WebMcpServer,
  options: ChatMcpServerOptions = {}
) {
  const chatMcpServer = new ChatMcpServer(options)

  /**
   * 注册 chat 工具
   */
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
      // 发送消息并等待响应
      const response = await chatMcpServer.sendChatMessage(message)

      return {
        content: [{
          type: 'text' as const,
          text: response
        }]
      }
    }
  )

  /**
   * 注册 list_skills 工具
   */
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
      // 获取技能列表
      const skills = await chatMcpServer.listSkills()

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(skills, null, 2)
        }]
      }
    }
  )

  /**
   * 注册 execute_skill 工具
   */
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
      // 执行技能
      const result = await chatMcpServer.executeSkill(skill_id, parameters, timeout)

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

  /**
   * 返回清理函数
   */
  return {
    disconnect: () => chatMcpServer.disconnect(),
    getSessionId: () => chatMcpServer.getSessionId(),
    getConnectionStatus: () => chatMcpServer.getConnectionStatus()
  }
}
