import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'src/setupTests.js',
        'vitest.config.js',
        'vite.config.js',
        'src/main.jsx',
        'src/App.jsx',
        'src/context/**',
        'src/services/**',
        'src/pages/OrganizerDashboard.jsx',
        'src/pages/VolunteerDashboard.jsx',
        'src/pages/StaffDashboard.jsx'
      ]
    }
  }
});
