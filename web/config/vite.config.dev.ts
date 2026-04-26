import { resolve } from 'node:path'
import process from 'node:process'
import { configDotenv } from 'dotenv'
import { loadEnv, mergeConfig } from 'vite'
import baseConfig from './vite.config.base'

// 加载 dev.env 文件
configDotenv({
  path: resolve(__dirname, '../dev.env'),
})

// 加载环境变量（development 模式会读取 .env.development 和 .env）
const env = loadEnv('development', process.cwd())

const proxyConfig = {
  // 代理后端 API 请求到 agentskills-runtime 服务器
  '/api/v1': {
    target: env.VITE_BACKEND_URL || 'https://javatoarktsapi.uctoo.com',
    changeOrigin: true,
    secure: false, // 允许自签名证书
    logLevel: 'debug',
  },
  // 代理 /api/user/* 请求到后端服务器
  '/api/user': {
    target: env.VITE_MOCK_SERVER_HOST || 'https://javatoarktsapi.uctoo.com',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
  },
  // /api/setup/* 路径需要代理到 NestJS 服务器进行真实的系统检测
  [env.VITE_BASE_API]: {
    target: env.VITE_SERVER_HOST,
    changeOrigin: true,
    logLevel: 'debug',
  },
}
export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      host: '0.0.0.0', // 允许所有网络接口访问,避免网络切换问题
      strictPort: true, // 严格使用指定端口
      fs: {
        strict: true,
      },
      proxy: {
        ...proxyConfig,
      },
      // 监听本地依赖变化,自动重新构建
      watch: {
        ignored: ['!**/node_modules/@opentiny/next-sdk/**', '!**/node_modules/@opentiny/next-remoter/**'],
      },
      // HMR 配置,增强连接稳定性
      hmr: {
        overlay: true, // 在浏览器中显示错误覆盖层
        clientPort: 3031, // 明确指定 HMR 客户端端口
      },
    },
    define: {
      // 确保 VITE_LOWCODE_DESIGNER_ENABLED 被注入到客户端代码
      'import.meta.env.VITE_LOWCODE_DESIGNER_ENABLED': JSON.stringify(
        process.env.VITE_LOWCODE_DESIGNER_ENABLED || 'false',
      ),
      // 确保 VITE_LOWCODE_DESIGNER_URL 被注入到客户端代码
      'import.meta.env.VITE_LOWCODE_DESIGNER_URL': JSON.stringify(
        process.env.VITE_LOWCODE_DESIGNER_URL || 'http://localhost:8090',
      ),
    },
    plugins: [],
  },
  baseConfig,
)
