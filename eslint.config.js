// eslint.config.js
// 如果你的项目没有"type":"module"在其package.json文件中指定,那么eslint.config.js必须采用 CommonJS 格式

import antfu from '@antfu/eslint-config'

export default antfu(
  {
    // unocss: false,
    vue: true,
    typescript: true,
    formatters: true,
    ignores: ['**/**/stats.html'],
  },
  {
    rules: {
      'no-console': 'off',
      'unused-imports/no-unused-vars': 'off',
      'n/prefer-global/buffer': 'off',
      'n/prefer-global/process': 'off',
    },
  },
)
