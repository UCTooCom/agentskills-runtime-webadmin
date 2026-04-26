<script lang="ts" setup>
import { WebMcpClient } from '@opentiny/next-sdk'
import { TinyRemoter } from '@opentiny/next-remoter'
import { TinyConfigProvider } from '@opentiny/vue'
import TinyThemeTool from '@opentiny/vue-theme/theme-tool'
import { onMounted, ref } from 'vue'
import GlobalSetting from '@/components/global-setting/index.vue'
import { useTheme } from './hooks/useTheme'
import { clientTransport, createMcpServer } from './mcp-servers'
import { skills } from './skills'
// 导入样式
import '@opentiny/next-remoter/dist/style.css'

const theme = new TinyThemeTool()
useTheme(theme)

const design = {
  name: 'x-design', // 设计规范名称
  version: '1.0.0', // 设计规范版本号
  components: {
    Button: {
      props: {
        resetTime: 0,
        round: true,
      },
    },
  },
}

// 将本地 MCP Server 注册到 TinyRemoter
// key 为服务器名称（自定义），type: 'local' 表示浏览器本地运行
const mcpServers = {
  'my-mcp-server': {
    type: 'local',
    transport: clientTransport,
  },
}

// 使用 agentskills-runtime 后端
const AGENT_URL = import.meta.env.VITE_AGENT_ROOT
const sessionID = ref('')

// LLM 配置 - 使用 agentskills-runtime 的 AI 接口
const llmConfig = ref({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'sk-dummy-key',
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL || `${AGENT_URL}/api/v1/ai`,
  providerType: 'openai' as const,
  model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o',
  maxSteps: 10
})

console.log('LLM Config:', {
  apiKey: llmConfig.value.apiKey ? '***' : 'empty',
  baseURL: llmConfig.value.baseURL,
  model: llmConfig.value.model
})

// 启动 MCP Server（注册工具 + 建立通信通道）
onMounted(async () => {
  try {
    await createMcpServer()
  } catch (error) {
    // 本地开发环境远程服务不可用是正常的，静默处理
    console.warn('MCP remote service not available in local development environment')
  }
})
</script>

<template>
  <div>
    <TinyConfigProvider :design="design">
      <router-view />
    </TinyConfigProvider>

    <GlobalSetting />
  </div>
  <TinyRemoter
    :skills="skills"
    :agent-root="AGENT_URL"
    :session-id="sessionID"
    :llmConfig="llmConfig"
    :customMarketMcpServers="[]"
  />
</template>

<style lang="less" scoped>
  @import '@/assets/style/menu.less'; /* 引入公共样式 */
</style>
