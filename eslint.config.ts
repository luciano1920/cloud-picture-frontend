import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores([
    '**/dist/**',
    '**/dist-prod/**',
    '**/dist-dev/**',
    '**/dist-test/**',
    '**/dist-ssr/**',
    '**/coverage/**',
  ]),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  {
    rules: {
      // TypeScript 相关
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',

      // Vue 相关
      'vue/eqeqeq': ['error', 'always'],
      'vue/html-end-tags': 'error',
      'vue/no-template-shadow': 'error',
      'vue/multi-word-component-names': 'warn',

      'max-lines': [
        'error',
        {
          max: 800, // 单文件最大 800 行
          skipBlankLines: true, // 忽略空行
          skipComments: true, // 忽略注释行
        },
      ],
    },
  },

  skipFormatting,
)
