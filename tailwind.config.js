/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ecg: {
          grid: '#e0ded8',
          subgrid: '#f1f0eb',
          trace: '#0284c7',
          abnormal: '#dc2626',
          bg: '#fafaf9',
          darkgrid: '#1e293b',
          darksubgrid: '#0f172a',
          darktrace: '#38bdf8',
          darkabnormal: '#f87171',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
