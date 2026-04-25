# Chat 功能集成文档

## 概述

基于现有的 TinyRemoter 悬浮窗和智能体助手页面,对接 agentskills-runtime 后端,实现完整的聊天和技能执行功能。

## 架构

```
web-admin/web/
├── src/
│   ├── App.vue                          # 主应用(已集成 TinyRemoter)
│   ├── mcp-servers/
│   │   ├── index.ts                     # MCP Server 注册入口
│   │   └── chat/
│   │       └── tools.ts                 # Chat 工具实现
│   └── skills/
│       ├── data-analysis.md             # 数据分析技能
│       ├── code-generation.md           # 代码生成技能
│       └── document-writing.md          # 文档撰写技能
└── .env                                 # 环境变量配置
```

## 核心实现

### 1. Chat MCP Tools (`src/mcp-servers/chat/tools.ts`)

提供以下 MCP 工具:

#### chat 工具
与大模型进行对话

**参数:**
- `message` (string): 要发送的消息内容

**示例:**
```typescript
// AI 自动调用
用户: "你好,请介绍一下你自己"
AI: [调用 chat 工具] -> 返回大模型回复
```

#### list_skills 工具
列出 agentskills-runtime 中可用的技能

**参数:** 无

**示例:**
```typescript
用户: "有哪些可用的技能?"
AI: [调用 list_skills 工具] -> 返回技能列表
```

#### execute_skill 工具
执行指定的技能

**参数:**
- `skill_id` (string): 技能 ID
- `parameters` (object, 可选): 技能参数
- `timeout` (string, 可选): 超时时间

**示例:**
```typescript
用户: "帮我分析这份数据"
AI: [调用 execute_skill 工具] -> 执行数据分析技能
```

#### get_connection_status 工具
获取 WebSocket 连接状态

**参数:** 无

**返回:**
```json
{
  "status": "connected",
  "sessionId": "xxx-xxx-xxx",
  "wsUrl": "wss://javatoarktsapi.uctoo.com/ws/chat"
}
```

### 2. WebSocket 连接管理

**连接流程:**
1. 用户点击悬浮窗打开对话框
2. TinyRemoter 自动初始化
3. MCP 工具首次调用时建立 WebSocket 连接
4. 连接成功后收到 `welcome` 消息,包含 `sessionId`
5. 启动心跳保活机制

**消息协议:**

```typescript
// 连接成功
{
  "type": "welcome",
  "payload": {
    "session_id": "xxx-xxx-xxx"
  }
}

// 聊天消息
{
  "type": "chat",
  "content": "你好",
  "message_id": "chat-123"
}

// 聊天响应
{
  "type": "chat_response",
  "payload": {
    "content": "你好!我是 AI 助手...",
    "message_id": "chat-123"
  }
}

// 技能列表
{
  "type": "list_skills",
  "message_id": "list_skills"
}

// 技能列表响应
{
  "type": "skills_list",
  "payload": {
    "skills": [...]
  }
}

// 执行技能
{
  "type": "execute_skill",
  "skill_id": "skill-1",
  "parameters": {},
  "timeout": "60s"
}

// 技能执行结果
{
  "type": "skill_result",
  "payload": {
    "skill_id": "skill-1",
    "success": "true",
    "output": "执行结果..."
  }
}

// 心跳
{
  "type": "ping"
}

// 心跳响应
{
  "type": "pong"
}
```

### 3. Skills 配置

Skills 以 Markdown 文件形式存储在 `src/skills/` 目录:

```markdown
# 技能名称

## 描述
技能的详细描述

## 功能
- 功能1
- 功能2

## 使用场景
描述何时使用此技能

## 示例
用户: "示例问题"
AI: [使用技能处理]
```

**自动加载:**
```typescript
// src/skills/index.ts
export const skills = import.meta.glob('./**/*', {
  query: '?raw',
  import: 'default',
  eager: true
})
```

## 使用方式

### 1. 启动应用

```bash
npm start
```

### 2. 登录后访问

登录成功后,页面右下角会出现悬浮窗图标。

### 3. 打开助手

点击悬浮窗图标,选择"打开对话框",即可打开 AI 助手。

### 4. 开始对话

在输入框中输入问题,AI 会自动理解意图并调用相应的工具:

```
用户: "你好"
AI: [调用 chat 工具] -> 返回回复

用户: "有哪些技能?"
AI: [调用 list_skills 工具] -> 返回技能列表

用户: "帮我分析数据"
AI: [调用 execute_skill 工具] -> 执行数据分析技能
```

### 5. 使用 Skills

在输入框中输入 `@` 可以唤起技能列表,选择技能后 AI 会自动调用。

## 配置说明

### 环境变量

```bash
# WebSocket 地址
VITE_WS_URL=wss://javatoarktsapi.uctoo.com/ws/chat

# Agent 服务地址
VITE_AGENT_ROOT=https://javatoarktsapi.uctoo.com
```

### App.vue 配置

```vue
<template>
  <div>
    <router-view />
  </div>
  <TinyRemoter
    :skills="skills"
    :agent-root="AGENT_URL"
    :session-id="sessionID"
  />
</template>

<script setup>
import { TinyRemoter } from '@opentiny/next-remoter'
import { skills } from './skills'

const AGENT_URL = 'https://agent.opentiny.design/api/v1/webmcp-trial/'
const sessionID = ref('')

// 连接 MCP Server
onMounted(async () => {
  await createMcpServer()
  const client = new WebMcpClient()
  await client.connect(clientTransport)
  const { sessionId } = await client.connect({
    agent: true,
    url: `${AGENT_URL}mcp`
  })
  sessionID.value = sessionId
})
</script>
```

## 与原实现的对比

| 功能 | 原实现 (uctoo-app-client-pc) | 新实现 (web-admin) |
|------|---------------------------|-------------------|
| UI 组件 | Ant Design Vue | TinyRemoter |
| 悬浮窗 | 无 | ✅ createRemoter |
| 工具调用 | WebSocket 消息 | MCP 工具注册 |
| 技能管理 | 手动管理 | 自动加载 Markdown |
| 状态管理 | ref 状态 | 响应式 + MCP |
| 扩展性 | 较弱 | 强 (基于 webmcp-sdk) |

## 优势

1. **无需额外页面**: 直接使用现有的 TinyRemoter 悬浮窗
2. **遵循现有架构**: 完全基于 webmcp-sdk 的 MCP 工具机制
3. **自动工具发现**: AI 自动识别和调用工具
4. **Skills 自动加载**: Markdown 文件自动转换为技能
5. **统一管理**: 所有工具集中在 mcp-servers 管理

## 扩展开发

### 添加新的 MCP 工具

在 `src/mcp-servers/chat/tools.ts` 中添加:

```typescript
server.registerTool(
  'new_tool',
  {
    title: '新工具',
    description: '工具描述',
    inputSchema: {
      param: z.string().describe('参数说明')
    }
  },
  async ({ param }) => {
    // 实现逻辑
    return {
      content: [{
        type: 'text',
        text: '结果'
      }]
    }
  }
)
```

### 添加新的 Skill

在 `src/skills/` 目录创建 Markdown 文件:

```markdown
# 新技能

## 描述
技能描述

## 功能
- 功能列表

## 使用场景
使用场景说明
```

## 故障排除

### 1. WebSocket 连接失败

**检查:**
- agentskills-runtime 服务是否启动
- `.env` 中的 `VITE_WS_URL` 是否正确
- 网络是否可达

### 2. 工具调用失败

**检查:**
- MCP Server 是否正确注册
- 工具参数是否符合 schema
- WebSocket 连接状态

### 3. Skills 不显示

**检查:**
- `src/skills/` 目录是否有 Markdown 文件
- 文件格式是否正确
- `skills/index.ts` 是否正确导出

## 后续优化

1. **持久化会话**: 将聊天记录保存到数据库
2. **多模型支持**: 支持切换不同的 LLM
3. **流式响应**: 实现打字机效果
4. **技能市场**: 可视化技能管理界面
5. **对话历史**: 查看和恢复历史对话

## 相关文档

- [TinyRemoter README](../lib/webmcp-sdk/packages/next-remoter/README.md)
- [webmcp-sdk 文档](https://docs.opentiny.design/next-sdk/guide/)
- [agentskills-runtime 文档](../../agentskills-runtime/README.md)
