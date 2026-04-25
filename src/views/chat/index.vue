<template>
  <div class="chat-page">
    <div class="chat-header">
      <h1>AI 助手</h1>
      <div class="header-actions">
        <TinyButton type="primary" @click="showChat = true">
          打开聊天
        </TinyButton>
      </div>
    </div>

    <div class="chat-content">
      <div class="chat-info">
        <h2>功能介绍</h2>
        <ul>
          <li>🤖 <strong>智能对话</strong>: 与大语言模型进行自然语言交互</li>
          <li>🔧 <strong>技能执行</strong>: 调用各种技能完成特定任务</li>
          <li>📊 <strong>数据分析</strong>: 处理和分析数据</li>
          <li>💻 <strong>代码生成</strong>: 生成和优化代码</li>
          <li>📝 <strong>文档撰写</strong>: 协助撰写各类文档</li>
        </ul>

        <h2>使用说明</h2>
        <ol>
          <li>点击"打开聊天"按钮启动 AI 助手</li>
          <li>在输入框中输入您的问题或需求</li>
          <li>AI 助手会自动理解您的意图并执行相应操作</li>
          <li>您也可以直接使用 @ 符号唤起技能列表</li>
        </ol>

        <h2>连接状态</h2>
        <div class="connection-status">
          <span
            class="status-dot"
            :style="{ backgroundColor: statusColor }"
          ></span>
          <span>{{ statusText }}</span>
          <span v-if="sessionId" class="session-info">
            会话: {{ sessionId.substring(0, 12) }}...
          </span>
        </div>
      </div>
    </div>

    <!-- Chat Remoter 组件 -->
    <ChatRemoter
      v-model:show="showChat"
      :title="chatTitle"
      :wsUrl="wsUrl"
      :agentRoot="agentRoot"
      @session-created="handleSessionCreated"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button as TinyButton, Modal } from '@opentiny/vue'
import ChatRemoter from '@/lib/webmcp-sdk/packages/next-remoter/src/components/ChatRemoter.vue'

// 状态
const showChat = ref(false)
const sessionId = ref('')
const connectionStatus = ref<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')

// 配置
const chatTitle = ref('UCTOO AI 助手')
const wsUrl = ref(import.meta.env.VITE_WS_URL || 'wss://javatoarktsapi.uctoo.com/ws/chat')
const agentRoot = ref(import.meta.env.VITE_AGENT_ROOT || 'https://javatoarktsapi.uctoo.com')

// 连接状态文本
const statusText = computed(() => {
  switch (connectionStatus.value) {
    case 'connected': return '已连接'
    case 'connecting': return '连接中...'
    case 'disconnected': return '未连接'
    case 'error': return '连接错误'
    default: return '未知状态'
  }
})

// 连接状态颜色
const statusColor = computed(() => {
  switch (connectionStatus.value) {
    case 'connected': return '#52c41a'
    case 'connecting': return '#1890ff'
    case 'disconnected': return '#8c8c8c'
    case 'error': return '#ff4d4f'
    default: return '#8c8c8c'
  }
})

/**
 * 处理会话创建
 */
function handleSessionCreated(id: string) {
  sessionId.value = id
  connectionStatus.value = 'connected'
  Modal.message({ message: 'AI 助手已连接', status: 'success' })
}

/**
 * 处理错误
 */
function handleError(error: Error) {
  connectionStatus.value = 'error'
  Modal.message({ message: `连接错误: ${error.message}`, status: 'error' })
}
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  background: #f5f5f5;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chat-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.chat-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 24px;
}

.chat-info {
  max-width: 800px;
  width: 100%;
  padding: 32px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chat-info h2 {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.chat-info h2:not(:first-child) {
  margin-top: 32px;
}

.chat-info ul,
.chat-info ol {
  margin: 0 0 24px;
  padding-left: 24px;
}

.chat-info li {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #595959;
}

.chat-info li strong {
  color: #262626;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.session-info {
  margin-left: auto;
  font-size: 12px;
  color: #8c8c8c;
}
</style>
