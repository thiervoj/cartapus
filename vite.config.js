/* eslint-disable */
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/cartapus.js'),
      name: 'Cartapus'
    }
  }
})
