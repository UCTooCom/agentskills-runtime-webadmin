<template>
  <div class="chat-remoter-container">
    <TinyRemoter
      ref="remoterRef"
      v-model:show="show"
      :sessionId="sessionId"
      :title="title"
      :llmConfig="llmConfig"
      :customMarketMcpServers="mcpServers"
      :systemPrompt="systemPrompt"
      @mounted="handleRemoterMounted"
    >
      <!-- 自定义欢迎界面 -->
      <template #welcome>
        <div class="chat-welcome">
          <div class="welcome-icon">🤖</div>
          <h2>{{ title }}</h2>
          <p>我可以帮您完成各种任务</p>
          <div class="quick-actions">
            <button
              v-for="action in quickActions"
              :key="action.id"
              class="action-btn"
              @click="handleQuickAction(action)"
            >
              {{ action.label }}
            </button>
          </div>
        </div>
      </template>

      <!-- 自定义提示建议 -->
      <template #suggestions>
        <div class="suggestions">
          <span
            v-for="suggestion in suggestions"
            :key="suggestion"
            class="suggestion-pill"
            @click="handleSuggestion(suggestion)"
          >
            {{ suggestion }}
          </span>
        </div>
      </template>
    </TinyRemoter>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { TinyRemoter } from '@opentiny/next-remoter'
import type { PluginInfo } from '@opentiny/next-remoter'

interface Props {
  show?: boolean
  title?: string
  wsUrl?: string
  agentRoot?: string
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: 'AI 助手',
  wsUrl: import.meta.env.VITE_WS_URL || 'wss://javatoarktsapi.uctoo.com/ws/chat',
  agentRoot: import.meta.env.VITE_AGENT_ROOT || 'https://javatoarktsapi.uctoo.com'
})

const emit = defineEmits<{
  'update:show': [value: boolean]
  'session-created': [sessionId: string]
  'error': [error: Error]
}>()

const remoterRef = ref()
const sessionId = ref('')
const show = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

// LLM 配置
const llmConfig = ref({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1',
  providerType: 'openai' as const,
  model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o',
  maxSteps: 10
})

// 系统提示词
const systemPrompt = ref(`你是一个智能助手,可以帮助用户完成各种任务。

你可以使用以下工具:
- chat: 与大模型对话
- list_skills: 列出可用的技能
- execute_skill: 执行指定的技能

当用户需要执行特定任务时,请先使用 list_skills 查看可用技能,然后使用 execute_skill 执行相应的技能。`)

// MCP 服务器配置
const mcpServers = ref<PluginInfo[]>([
  {
    id: 'chat-mcp',
    name: '聊天服务',
    description: '对接 agentskills-runtime 的聊天和技能服务',
    url: `${import.meta.env.VITE_AGENT_ROOT || 'https://javatoarktsapi.uctoo.com'}/mcp/stream`,
    type: 'sse',
    enabled: true,
    addState: 'added',
    tools: []
  }
])

// 快速操作
const quickActions = ref([
  { id: 1, label: '💬 开始对话', prompt: '你好,请介绍一下你自己' },
  { id: 2, label: '📋 查看技能', prompt: '请列出所有可用的技能' },
  { id: 3, label: '❓ 帮助', prompt: '请告诉我你可以做什么' }
])

// 提示建议
const suggestions = ref([
  '查询天气',
  '数据分析',
  '生成代码',
  '撰写文档'
])

// WebSocket 连接
let ws: WebSocket | null = null
let connectionStatus = ref<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')

/**
 * 连接 WebSocket
 */
async function connectWebSocket() {
  return new Promise<string>((resolve, reject) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      resolve(sessionId.value)
      return
    }

    connectionStatus.value = 'connecting'

    try {
      ws = new WebSocket(props.wsUrl)

      ws.onopen = () => {
        connectionStatus.value = 'connected'
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'welcome') {
          sessionId.value = data.payload.session_id
          emit('session-created', sessionId.value)
          resolve(sessionId.value)
        }
      }

      ws.onerror = (error) => {
        connectionStatus.value = 'error'
        emit('error', new Error('WebSocket 连接错误'))
        reject(error)
      }

      ws.onclose = () => {
        connectionStatus.value = 'disconnected'
      }

    } catch (error) {
      connectionStatus.value = 'error'
      emit('error', error as Error)
      reject(error)
    }
  })
}

/**
 * 处理 Remoter 挂载
 */
function handleRemoterMounted() {
  // 自动连接 WebSocket
  connectWebSocket().catch(console.error)
}

/**
 * 处理快速操作
 */
function handleQuickAction(action: { prompt: string }) {
  remoterRef.value?.sendMessage(action.prompt)
}

/**
 * 处理提示建议
 */
function handleSuggestion(suggestion: string) {
  remoterRef.value?.sendMessage(suggestion)
}

/**
 * 发送消息
 */
function sendMessage(message: string) {
  remoterRef.value?.sendMessage(message)
}

/**
 * 获取会话 ID
 */
function getSessionId() {
  return sessionId.value
}

/**
 * 获取连接状态
 */
function getConnectionStatus() {
  return connectionStatus.value
}

// 暴露方法
defineExpose({
  sendMessage,
  getSessionId,
  getConnectionStatus,
  connectWebSocket
})

// 生命周期
onMounted(() => {
  // 可以在这里初始化
})

onUnmounted(() => {
  // 清理 WebSocket 连接
  if (ws) {
    ws.close()
    ws = null
  }
})
</script>

<style scoped>
.chat-remoter-container {
  width: 100%;
  height: 100%;
}

.chat-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.chat-welcome h2 {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.chat-welcome p {
  margin: 0 0 24px;
  font-size: 16px;
  color: #8c8c8c;
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  color: #1890ff;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  color: #fff;
  background: #1890ff;
  border-color: #1890ff;
}

.suggestions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px;
}

.suggestion-pill {
  padding: 8px 16px;
  font-size: 13px;
  color: #595959;
  background: #f5f5f5;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-pill:hover {
  color: #1890ff;
  background: #e6f7ff;
}
</style>
