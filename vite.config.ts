import { fileURLToPath, URL } from 'node:url'
import path from 'path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import Components from 'unplugin-vue-components/vite'
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 当前执行 node 命令时文件夹的地址（工作目录）
  const root = process.cwd()
  // 加载环境变量
  const env = loadEnv(mode, root)

  return {
    base: env.VITE_BASE_PATH || '/',
    root: root,
    plugins: [
      vue(),
      // svg图标雪碧图插件
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svgs/icons')], // 指定需要缓存的图标文件夹
        symbolId: 'icon-[name]', // 指定 symbolId 格式
      }),
      // 通过 Antdv Next 官方的插件按需引用使用：https://www.antdv-next.cn/docs/vue/getting-started-cn
      Components({
        resolvers: [AntdvNextResolver()],
      }),
    ],
    server: {
      port: Number(env.VITE_PORT) || 5173,
      host: '0.0.0.0',
      open: env.VITE_OPEN === 'true',
      // proxy: {
      //   '/api': {
      //     target: env.VITE_API_BASE_URL || 'http://localhost:8123',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ''),
      //   },
      // },
    },
    build: {
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: (env.VITE_SOURCEMAP === 'true' ? 'inline' : false) as any,
      minify: 'esbuild', // 代码压缩配置
      // chunkSizeWarningLimit: 800,
      esbuild: {
        drop: env.VITE_DROP_CONSOLE === 'true' ? ['console'] : [],
      },
      rollupOptions: {
        output: {
          // 分包策略
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (['vue', 'vue-router', 'pinia'].some((pkg) => id.includes(pkg))) {
                return 'vue-vendor'
              }
              if (id.includes('antdv-next') || id.includes('@antdv-next/icons')) {
                return 'antdv-vendor'
              }
              if (
                id.includes('echarts') ||
                id.includes('echarts-wordcloud') ||
                id.includes('vue-echarts')
              ) {
                return 'echarts-vendor'
              }
            }
          },
          // 输出文件命名
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
        },
      },
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
