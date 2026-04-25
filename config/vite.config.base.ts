import { resolve } from 'node:path'
import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { defineConfig, loadEnv } from 'vite'
import svgLoader from 'vite-svg-loader'
import { viteMockServe } from 'vite-plugin-mock'
import localDepsPlugin from '../scripts/vite-plugin-local-deps.js'

const config = {
  plugins: [
    localDepsPlugin(), // 自动构建本地依赖
    vue(),
    vueJsx(),
    svgLoader({ svgoConfig: {} }),
    UnoCSS(),
    viteMockServe({
      mockPath: 'src/mock',
      localEnabled: false, // 禁用本地 mock，让请求发送到真实服务器
      prodEnabled: false,
      watchFiles: true,
      logger: true,
      // 忽略 /api/setup/* 路径，让这些请求通过代理转发到 NestJS 服务器
      ignore: /^\/api\/setup\/.*/,
    }),
  ],
  build: {
    outDir: resolve(__dirname, loadEnv('', process.cwd()).VITE_OUT_DIR || '../dist'),
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: 'assets',
        replacement: resolve(__dirname, '../src/assets'),
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.esm-bundler.js', // Resolve the i18n warning issue
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js', // compile template
      },
      {
        find: '@opentiny/vue-icon',
        replacement: resolve(__dirname, '../node_modules/@opentiny/vue-icon'), // compile template
      },
      {
        find: '@opentiny/vue-theme',
        replacement: resolve(__dirname, '../node_modules/@opentiny/vue-theme'),
      },
      {
        find: '@opentiny/next-sdk',
        replacement: resolve(__dirname, '../src/lib/webmcp-sdk/packages/next-sdk'),
      },
      {
        find: '@opentiny/next-remoter',
        replacement: resolve(__dirname, '../src/lib/webmcp-sdk/packages/next-remoter'),
      },
    ],
    extensions: ['.ts', '.js', '.css'],
    preserveSymlinks: false,
  },
  define: {
    BUILD_TOOLS: '\'VITE\'',
  },
  optimizeDeps: {
    // 强制排除本地依赖,避免 Vite 预构建缓存问题
    exclude: [
      '@opentiny/next-sdk',
      '@opentiny/next-remoter',
    ],
    // 强制包含这些依赖进行优化
    include: [
      'vue',
      'vue-router',
      'pinia',
      '@opentiny/vue',
    ],
    esbuildOptions: {
      resolveExtensions: ['.ts', '.js', '.css'],
      // 启用装饰器支持
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          useDefineForClassFields: false,
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            'src/assets/style/breakpoint.less',
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
  // 配置 esbuild 支持装饰器
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        useDefineForClassFields: false,
      },
    },
  },
}
export default defineConfig(config)
