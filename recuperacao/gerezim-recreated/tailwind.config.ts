import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0b2132',
          800: '#0e2238',
          700: '#1a3b5c'
        },
        gold: {
          500: '#b7902e',
          300: '#c6a15a',
          100: '#fbf5e6'
        }
      },
      fontFamily: {
        title: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: [],
}

export default config
