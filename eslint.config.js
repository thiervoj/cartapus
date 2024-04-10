import js from '@eslint/js'
import globals from 'globals'
import standard from 'eslint-config-standard'

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    plugins: { standard },
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'space-before-function-paren': 'off'
    }
  }
]
