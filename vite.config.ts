import react from '@vitejs/plugin-react'
import {resolve} from 'path'
import {defineConfig} from 'vite'
import envCompatible from 'vite-plugin-env-compatible'
import svgr from 'vite-plugin-svgr'

/** @type {import('vite').UserConfig} */
// @see https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 3000,
  },
  envPrefix: 'REACT_APP_',
  resolve: {
    alias: {
      '#context': resolve(__dirname, './src/app/context'),
      '#store': resolve(__dirname, './src/app/redux/'),
      '#tws': resolve(__dirname, './src/app/modules/tws/'),
      '#common': resolve(__dirname, './src/app/common/'),
      '#helpers': resolve(__dirname, './src/app/helpers/'),
      '#hooks': resolve(__dirname, './src/app/hooks/'),
      '#layouts': resolve(__dirname, './src/app/layouts/'),
      '#pages': resolve(__dirname, './src/app/pages/'),
      '#routing': resolve(__dirname, './src/app/routing/'),
    },
  },
  plugins: [svgr(), react(), envCompatible(/* options */)],
})
