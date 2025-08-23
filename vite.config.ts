import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const headers: Record<string, string> = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
  };

  // Only add CSP header in production to avoid undefined value error
  if (mode === 'production') {
    headers['Content-Security-Policy'] = 
      "default-src 'self'; " +
      "script-src 'self' https://cdn.jsdelivr.net https://js.stripe.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data: https: blob:; " +
      "connect-src 'self' https://*.supabase.co https://*.supabase.com wss://*.supabase.co https://api.stripe.com; " +
      "font-src 'self' data: https://fonts.gstatic.com; " +
      "frame-ancestors 'none'; " +
      "form-action 'self'; " +
      "base-uri 'self'; " +
      "object-src 'none'; " +
      "upgrade-insecure-requests";
  }

  return {
    server: {
      host: "::",
      port: 8080,
      headers
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Ensure consistent hashing for better caching
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
    },
  };
});
