import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server:{
    proxy: {
      // See https://vitejs.dev/config/#server-proxy
      '/api': {
        target: 'https://localhost:5001',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    }
  }
})
