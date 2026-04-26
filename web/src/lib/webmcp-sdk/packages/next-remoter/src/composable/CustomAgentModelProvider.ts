import type { ChatCompletionResponse } from '@opentiny/tiny-robot-kit'
import type { ChatCompletionRequest } from '@opentiny/tiny-robot-kit'
import type { StreamHandler } from '@opentiny/tiny-robot-kit'
import { BaseModelProvider } from '@opentiny/tiny-robot-kit'
import type { AIModelConfig } from '@opentiny/tiny-robot-kit'
import { nextTick, watch, type Ref } from 'vue'
import { AgentModelProvider, IAgentModelProviderOption } from '@opentiny/next-sdk'
import type { ICustomAgentModelProviderLlmConfig } from '../types/type'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createOpenAI } from '@ai-sdk/openai'
import type { ProviderV2 } from '@ai-sdk/provider'
import type { OpenAIProvider } from '@ai-sdk/openai'
import { GENUI_CONFIG } from '../config/genui-config'
import { StreamVisitor } from './streamVisitor'
import { extractTextAndJson } from './handleSchema'
import { DelayedPromise } from '@ai-sdk/provider-utils'
import { PromptManager } from './promptManager'
import { ChatMcpServer } from '@opentiny/next-sdk/chat'

const DEFAULT_SHARED_CONFIG = {
  model: 'deepseek-ai/DeepSeek-V3',
  maxSteps: 15,
  extraTools: {}
}

const DEFAULT_FACTORY_CONFIG = {
  apiKey: 'sk-trial',
  baseURL: 'https://agent.opentiny.design/api/v1/ai/',
  genuiUrl: 'https://agent.opentiny.design/api/v1/ai/prompt',
  providerType: 'deepseek' as const
}

/**
 * 合并用户 providerOptions 与默认 GENUI_CONFIG
 * 按 provider 维度浅合并，用户配置中的同名字段会覆盖默认值
 * @param user 用户传递的自定义配置（如 { deepseek: { user: 'userId' } }）
 * @param defaults 默认 GENUI 配置
 */
function mergeProviderOptions(
  user?: Record<string, any>,
  defaults?: Record<string, any>
): Record<string, any> | undefined {
  if (!defaults && !user) return undefined
  if (!user) return defaults
  if (!defaults) return user
  const result = { ...defaults }
  for (const [provider, options] of Object.entries(user)) {
    if (options && typeof options === 'object' && !Array.isArray(options)) {
      result[provider] = { ...(result[provider] || {}), ...options }
    } else {
      result[provider] = options
    }
  }
  return result
}

/** Tiny-robot 所需要的自定义大语言的Provider */
export class CustomAgentModelProvider extends BaseModelProvider {
  transport: any
  /** 一个 ai-sdk agent 封装 */
  agent: AgentModelProvider
  promptManager: PromptManager
  llmConfig: ICustomAgentModelProviderLlmConfig = { ...DEFAULT_SHARED_CONFIG, ...DEFAULT_FACTORY_CONFIG }
  /** 生成式UI启用状态 */
  isGenuiEnabled?: Ref<boolean>
  debugStream: boolean = false
  /** WebSocket 聊天服务器 */
  chatMcpServer: ChatMcpServer | null = null

  constructor(config: AIModelConfig, systemPrompt: string, llmConfig?: ICustomAgentModelProviderLlmConfig) {
    super(config)

    let mergedConfig: ICustomAgentModelProviderLlmConfig
    if (llmConfig && 'llm' in llmConfig) {
      mergedConfig = {
        ...DEFAULT_SHARED_CONFIG,
        ...llmConfig
      }
    } else {
      mergedConfig = {
        ...DEFAULT_SHARED_CONFIG,
        ...DEFAULT_FACTORY_CONFIG,
        ...(llmConfig || {})
      }
    }

    this.llmConfig = mergedConfig

    // 提供一个空的llm实例，避免AgentModelProvider创建使用错误baseURL的llm实例
    const llmConfigOption = { llm: {
      model: () => ({
        streamText: () => ({
          fullStream: new ReadableStream({ start: (controller) => controller.close() }),
          response: Promise.resolve({ messages: [] })
        }),
        generateText: () => Promise.resolve({ text: '', response: { messages: [] } })
      })
    } as any }

    const options: IAgentModelProviderOption = {
      llmConfig: llmConfigOption
    }

    this.agent = new AgentModelProvider(options)
    this.promptManager = new PromptManager()
    this.promptManager.setStatic(systemPrompt)
    
    // 初始化 ChatMcpServer
    this.initChatMcpServer()
  }
  
  /**
   * 初始化 ChatMcpServer
   */
  private initChatMcpServer() {
    const wsUrl = import.meta.env.VITE_WS_URL || 'wss://javatoarktsapi.uctoo.com/ws/chat'
    this.chatMcpServer = new ChatMcpServer({
      wsUrl,
      sessionId: '',
      reconnectAttempts: 3,
      reconnectDelay: 2000
    })
  }

  /**
   * 更新大语言模型配置
   * Update LLM configuration
   * @param modelId 模型ID
   * @param apiUrl API地址
   * @param apiKey API密钥
   * @param providerType 提供商类型
   * @param useReActMode 是否使用 ReAct 模式
   */
  updateLLMConfig({
    model,
    baseURL,
    genuiUrl,
    apiKey,
    providerType,
    useReActMode,
    llm,
    providerOptions,
    headers
  }: {
    model: string
    baseURL?: string
    genuiUrl?: string
    apiKey?: string
    providerType?: 'deepseek' | 'openai' | ((options: any) => ProviderV2)
    useReActMode?: boolean
    llm?: ProviderV2
    /** 自定义请求体字段，会合并到 AI SDK streamText 的 providerOptions 中 */
    providerOptions?: Record<string, any>
    /** 自定义请求 Header，透传给 ai-sdk Provider 实例 */
    headers?: Record<string, string>
  }) {
    if (llm) {
      this.agent.llm = llm
      this.llmConfig.model = model
      this.llmConfig.useReActMode = useReActMode || false
      this.agent.useReActMode = useReActMode || false
    } else if (providerType && baseURL && apiKey) {
      // 如果启用了生成式UI, 切换大模型地址
      const finallyBaseURL = this.isGenuiEnabled?.value ? genuiUrl || baseURL : baseURL // 优先用它，未配置则用base
      // 更新本地配置
      this.llmConfig.model = model
      this.llmConfig.apiKey = apiKey
      this.llmConfig.baseURL = baseURL
      this.llmConfig.providerType = providerType
      this.llmConfig.useReActMode = useReActMode || false
      this.agent.useReActMode = useReActMode || false

      // 根据 providerType 创建新的 llm 实例
      let providerFn: (options: {
        apiKey: string
        baseURL: string
        headers?: Record<string, string>
      }) => ProviderV2 | OpenAIProvider

      if (providerType === 'deepseek') {
        providerFn = createDeepSeek
      } else if (providerType === 'openai') {
        providerFn = createOpenAI
      } else if (typeof providerType === 'function') {
        providerFn = providerType
      } else {
        throw new Error(`Unsupported providerType: ${providerType}`)
      }

      // 将 headers 透传给 provider 工厂函数（undefined 时不传，避免覆盖 sdk 默认值）
      this.agent.llm = providerFn({ apiKey, baseURL: finallyBaseURL, ...(headers ? { headers } : {}) })
    }
    // 每次切换模型时同步 providerOptions 和 headers，undefined 时清空避免残留
    this.llmConfig.providerOptions = providerOptions
    this.llmConfig.headers = headers
  }
  /**
   * 清理消息数组中的 get-skill-content 工具调用结果
   */
  cleanGetSkillContentToolResult(messages: any[]) {
    const lastMsg = messages[messages.length - 1]
    if (lastMsg.role === 'tool' && lastMsg.content.length > 0) {
      const lastContent = lastMsg.content[lastMsg.content.length - 1]
      if (lastContent.type === 'tool-result' && lastContent.toolName === 'get_skill_content') {
        lastContent.output.value.content = '查询到技能内容已添加到系统提示词中。'
      }
    }
  }
  /**
   * 清理消息数组中的旧快照消息，只保留最新的快照
   * @param messages 消息数组
   * @returns 清理后的消息数组
   */
  private cleanupOldSnapshotsInMessages(messages: any[]): any[] {
    if (!messages || messages.length === 0) return messages

    // 检查是否启用 ReAct 模式（统一使用 agent.useReActMode 来判断）
    // Check if ReAct mode is enabled (use agent.useReActMode for unified judgment)
    const isReActMode = this.agent.useReActMode === true

    // 在 ReAct 模式下，工具结果作为 user 消息添加；否则作为 tool 消息添加
    const expectedRole = isReActMode ? 'user' : 'tool'

    // 检查最后一项是否是预期角色且包含快照信息
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== expectedRole) {
      return messages
    }

    // 判断最后一项是否包含快照信息
    if (!this.isSnapshotContent(lastMessage.content)) {
      return messages
    }

    // 创建消息数组的副本，避免直接修改原数组
    const cleanedMessages = [...messages]

    // 从倒数第二项开始往前查找，找到最后一次快照消息（除了最后一项）
    // 因为最后一项是当前步骤的新快照，需要保留
    for (let i = cleanedMessages.length - 2; i >= 0; i--) {
      const msg = cleanedMessages[i] as any
      // 在 ReAct 模式下检查 user 角色，否则检查 tool 角色
      if (msg.role === expectedRole && this.isSnapshotContent(msg.content)) {
        // 找到旧的快照消息，仅保留其文本并移除图片
        this.replaceSnapshotWithPlaceholder(msg)
      }
    }

    return cleanedMessages
  }

  /**
   * 从文本中移除快照数据，保留操作信息
   * @param text 原始文本
   * @returns 清理后的文本
   */
  private removeSnapshotData(text: string): string {
    if (!text) return text

    // 快照开始的标记词
    const snapshotMarkers = [
      '无障碍树快照:',
      '无障碍树快照：',
      '快照内容:',
      '快照内容：',
      '页面无障碍树快照:',
      '页面无障碍树快照：',
      '操作后的页面快照:',
      '操作后的页面快照：'
    ]

    // 查找快照标记的位置
    let snapshotStartIndex = -1
    for (const marker of snapshotMarkers) {
      const index = text.indexOf(marker)
      if (index !== -1) {
        snapshotStartIndex = index
        break
      }
    }

    // 如果找到快照标记，删除从标记开始到结尾的内容
    if (snapshotStartIndex !== -1) {
      // 保留标记之前的内容，并添加占位符
      const beforeSnapshot = text.substring(0, snapshotStartIndex).trim()
      return beforeSnapshot ? `${beforeSnapshot} 📸 [历史快照已清理]` : '📸 历史快照已清理'
    }

    // 如果没有明确的标记，但包含快照关键词，可能整个文本都是快照
    // 检查是否是纯快照内容（以快照关键词开头）
    const pureSnapshotStarts = ['已成功获取页面无障碍树快照', 'takeSnapshot', 'snapshotId_counter']

    for (const start of pureSnapshotStarts) {
      if (text.startsWith(start)) {
        return '📸 历史快照已清理'
      }
    }

    // 没有找到快照标记，返回原文本
    return text
  }

  /**
   * 清理消息中的快照信息，旨在保留文本但移除图片以节省 token
   * @param msg 消息对象
   */
  private replaceSnapshotWithPlaceholder(msg: any): void {
    if (Array.isArray(msg.content)) {
      // 检查是否是 MCP 工具返回格式 (Tiny Robot Kit 包装后的格式)
      const firstItem = msg.content[0]
      if (firstItem?.output?.value?.content) {
        const innerContent = firstItem.output.value.content
        if (Array.isArray(innerContent)) {
          // 处理内容：移除图片，检查文本是否包含快照并替换
          firstItem.output.value.content = innerContent
            .map((item: any) => {
              // 移除图片类型
              if (item.type === 'image' || item.type === 'image_url') {
                return null
              }
              // 检查文本类型是否包含快照信息
              if (item.type === 'text' && item.text && this.isSnapshotContent(item.text)) {
                // 移除快照数据，保留操作信息
                const cleanedText = this.removeSnapshotData(item.text)
                return { type: 'text', text: cleanedText }
              }
              // 保留其他内容
              return item
            })
            .filter((item: any) => item !== null) // 移除被标记为 null 的项
        }
        // 如果 MCP 返回结果中包含单独的 screenshot 字段，也予以移除
        if (firstItem.output.value.screenshot) {
          delete firstItem.output.value.screenshot
        }
      } else {
        // 普通多模态数组格式 (AI SDK 风格)
        // 过滤掉所有图片部分，只保留文本部分
        msg.content = msg.content.filter((item: any) => item.type !== 'image' && item.type !== 'image_url')
      }
    } else if (typeof msg.content === 'string') {
      // 字符串格式：检查是否包含无障碍树快照
      // 如果包含快照信息，移除快照数据但保留操作信息
      if (this.isSnapshotContent(msg.content)) {
        msg.content = this.removeSnapshotData(msg.content)
      }
      // 如果是纯文本（不含快照），保持不变
    }
  }

  /**
   * 判断内容是否包含快照信息
   * @param content 消息内容（可能是字符串或数组）
   * @returns 是否包含快照信息
   */
  private isSnapshotContent(content: any): boolean {
    if (!content) return false

    // 快照相关的关键词
    const snapshotKeywords = [
      '无障碍树快照',
      'takeSnapshot',
      'snapshotId_counter',
      'UID 格式',
      '快照 ID',
      '操作后的页面快照',
      '已成功获取页面无障碍树快照',
      '快照内容：'
    ]

    // 如果是字符串格式
    if (typeof content === 'string') {
      return snapshotKeywords.some((keyword) => content.includes(keyword))
    }

    // 如果是数组格式（MCP 工具返回格式 或 多模态消息）
    if (Array.isArray(content)) {
      for (const item of content) {
        // 1. 检查 MCP 工具返回格式
        const textMcp = item?.output?.value?.content?.[0]?.text
        if (textMcp && snapshotKeywords.some((keyword) => textMcp.includes(keyword))) {
          return true
        }

        // 2. 检查多模态文本消息
        if (item.type === 'text' && item.text) {
          if (snapshotKeywords.some((keyword) => item.text.includes(keyword))) {
            return true
          }
        }

        // 3. 检查是否有图片内容
        if (item.type === 'image' || item.type === 'image_url') {
          return true
        }
      }
    }

    return false
  }

  async chatStream(request: ChatCompletionRequest, handler: StreamHandler): Promise<void> {
    // 读取用户最新的请求
    let lastUserMsg = request.messages[request.messages.length - 1]
    if (!lastUserMsg) return

    // 确保 ChatMcpServer 已初始化
    if (!this.chatMcpServer) {
      this.initChatMcpServer()
    }

    // 构建用户消息内容
    let messageContent: string
    if (typeof lastUserMsg.content === 'string') {
      messageContent = lastUserMsg.content
    } else if (Array.isArray(lastUserMsg.content)) {
      // 处理多模态消息，只提取文本部分
      const textParts = lastUserMsg.content.filter((item: any) => item.type === 'text')
      messageContent = textParts.map((item: any) => item.text).join(' ')
    } else {
      messageContent = ''
    }

    // 待返回的promise对象，用户阻塞住函数立即返回。
    const dp = new DelayedPromise<void>()

    try {
      // 使用 ChatMcpServer 发送消息
      const response = await this.chatMcpServer!.sendChatMessage(messageContent)

      // 构建响应消息 - 简化格式，直接使用 content
      const defaultMessage = {
        role: 'assistant',
        content: response
      }

      // 发送响应数据
      handler.onData(defaultMessage)

      // 完成
      nextTick(() => {
        dp.resolve()
        handler.onDone()
      })
    } catch (error) {
      // 处理错误
      const errorMsg = {
        role: 'assistant',
        content: `错误：${(error as Error).message || '未知错误'}`
      }
      handler.onData(errorMsg)
      nextTick(() => {
        dp.resolve()
        handler.onDone()
      })
    }

    return dp.promise
  }

  /** 同步请求不需要实现 */
  chat(_request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    throw new Error('Method not implemented.')
  }
}
