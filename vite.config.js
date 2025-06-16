import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // /api로 시작하는 모든 요청
        target: "http://52.78.100.102:3000",
        changeOrigin: true,
      },
      "/post": {
        target: "http://52.78.100.102:3000",
        changeOrigin: true,
      },
      "/user": {
        target: "http://52.78.100.102:3000",
        changeOrigin: true,
      },
      "/upload": {
        // 업로드 관련 요청
        target: "http://52.78.100.102:3000",
        changeOrigin: true,
      },
    },
  },
});
