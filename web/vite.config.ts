/*
 * @Author: qiuzx
 * @Date: 2024-12-19 14:36:34
 * @LastEditors: qiuzx
 * @Description: description
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 8081,
        host: '0.0.0.0',
        proxy: {
            "/mid_service": {
                target: "http://127.0.0.1:11055/",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/mid_service/, ""),
            },
        },
    },
    resolve: {
      alias: {
          '@': path.join(__dirname, 'src'),
      },
      extensions: ['.js', '.ts', '.tsx', '.jsx'],
    },
});
