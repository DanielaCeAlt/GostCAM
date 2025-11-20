import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
    './src/contexts/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // ===== COLORES GOSTCAM =====
        'gostcam': {
          'primary': 'var(--gostcam-primary)',
          'primary-hover': 'var(--gostcam-primary-hover)',
          'primary-active': 'var(--gostcam-primary-active)',
          'secondary': 'var(--gostcam-secondary)',
          'secondary-hover': 'var(--gostcam-secondary-hover)',
          'secondary-active': 'var(--gostcam-secondary-active)',
          'success': 'var(--gostcam-success)',
          'success-light': 'var(--gostcam-success-light)',
          'success-dark': 'var(--gostcam-success-dark)',
          'warning': 'var(--gostcam-warning)',
          'warning-light': 'var(--gostcam-warning-light)',
          'warning-dark': 'var(--gostcam-warning-dark)',
          'danger': 'var(--gostcam-danger)',
          'danger-light': 'var(--gostcam-danger-light)',
          'danger-dark': 'var(--gostcam-danger-dark)',
          'info': 'var(--gostcam-info)',
          'info-light': 'var(--gostcam-info-light)',
          'info-dark': 'var(--gostcam-info-dark)',
          'text-primary': 'var(--gostcam-text-primary)',
          'text-secondary': 'var(--gostcam-text-secondary)',
          'text-muted': 'var(--gostcam-text-muted)',
          'border-light': 'var(--gostcam-border-light)',
          'border-medium': 'var(--gostcam-border-medium)',
          'border-strong': 'var(--gostcam-border-strong)',
          'gray': {
            50: 'var(--gostcam-gray-50)',
            100: 'var(--gostcam-gray-100)',
            200: 'var(--gostcam-gray-200)',
            300: 'var(--gostcam-gray-300)',
            400: 'var(--gostcam-gray-400)',
            500: 'var(--gostcam-gray-500)',
            600: 'var(--gostcam-gray-600)',
            700: 'var(--gostcam-gray-700)',
            800: 'var(--gostcam-gray-800)',
            900: 'var(--gostcam-gray-900)',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(59, 130, 246, 0.5)',
        'glow-green': '0 0 15px rgba(34, 197, 94, 0.5)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;