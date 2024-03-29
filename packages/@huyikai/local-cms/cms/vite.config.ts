/// <reference types="vitest" />
import { URL, fileURLToPath } from 'node:url';

import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
// import { defineConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: './',
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
    plugins: [
      vue(),
      AutoImport({
        /* options */
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        imports: [
          // presets
          'vue',
          'vue-router',
          'pinia',
          // custom
          {
            '@vueuse/core': [
              // named imports
              'useDebounceFn' // import { useDebounceFn } from '@vueuse/core',
            ],
            axios: [
              // default imports
              ['default', 'axios'] // import { default as axios } from 'axios',
            ],
            uuid: ['v4'],
            'ant-design-vue': ['message', 'Modal']
          },
          // example type import
          {
            from: 'vue-router',
            imports: ['RouteLocationRaw'],
            type: true
          }
        ],
        // 生成自动导入的TS声明文件
        dts: 'src/types/auto-imports.d.ts',
        // 兼容eslint
        eslintrc: {
          enabled: true // Default `false`
        }
      }),
      Components({
        /* options */
        dts: 'src/types/components.d.ts',
        dirs: ['src/components', 'src/views'],
        types: [
          {
            from: 'vue-router',
            names: ['RouterLink', 'RouterView']
          }
        ],
        resolvers: [
          AntDesignVueResolver({ importStyle: false, resolveIcons: true }),
          (componentName) => {
            // where `componentName` is always CapitalCase
            if (componentName.startsWith('MDEditor'))
              return { name: 'Editor', from: '@bytemd/vue-next' };
          }
        ]
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      outDir: './../dist',
      rollupOptions: {
        output: {
          // 手动指定 chunk 分割策略
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // 将所有 node_modules 目录下的代码分割到一个单独的 chunk
              return 'vendor';
            }
          }
        }
      }
    },
    test: {
      coverage: {
        reporter: ['text', 'json', 'html']
      }
    }
  };
});
