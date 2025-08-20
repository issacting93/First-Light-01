/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "./App.tsx",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'terminal-bg': 'var(--terminal-bg)',
          'terminal-bg-secondary': 'var(--terminal-bg-secondary)',
          'terminal-bg-tertiary': 'var(--terminal-bg-tertiary)',
          'terminal-bg-panel': 'var(--terminal-bg-panel)',
          'terminal-text-primary': 'var(--terminal-text-primary)',
          'terminal-text-secondary': 'var(--terminal-text-secondary)',
          'terminal-text-muted': 'var(--terminal-text-muted)',
          'terminal-accent-primary': 'var(--terminal-accent-primary)',
          'terminal-accent-secondary': 'var(--terminal-accent-secondary)',
          'terminal-accent-tertiary': 'var(--terminal-accent-tertiary)',
          'terminal-warning': 'var(--terminal-warning)',
          'terminal-error': 'var(--terminal-error)',
          'terminal-error-dark': 'var(--terminal-error-dark)',
          'terminal-success': 'var(--terminal-success)',
          'terminal-border': 'var(--terminal-border)',
          'terminal-border-accent': 'var(--terminal-border-accent)',
          'terminal-border-error': 'var(--terminal-border-error)',
          'terminal-border-muted': 'var(--terminal-border-muted)',
        },
        fontFamily: {
          'terminal': 'var(--terminal-font-family)',
        },
        fontSize: {
          'terminal-xs': 'var(--terminal-font-size-xs)',
          'terminal-sm': 'var(--terminal-font-size-sm)',
          'terminal-base': 'var(--terminal-font-size-base)',
          'terminal-lg': 'var(--terminal-font-size-lg)',
          'terminal-xl': 'var(--terminal-font-size-xl)',
          'terminal-2xl': 'var(--terminal-font-size-2xl)',
          'terminal-3xl': 'var(--terminal-font-size-3xl)',
        },
        letterSpacing: {
          'terminal-tight': 'var(--terminal-letter-spacing-tight)',
          'terminal-normal': 'var(--terminal-letter-spacing-normal)',
          'terminal-wide': 'var(--terminal-letter-spacing-wide)',
          'terminal-wider': 'var(--terminal-letter-spacing-wider)',
          'terminal-widest': 'var(--terminal-letter-spacing-widest)',
        },
        animation: {
          'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
          'shine': 'shine 2s ease-in-out infinite',
          'progress-shine': 'progress-shine 2s ease-in-out infinite',
        },
        keyframes: {
          'pulse-glow': {
            '0%': { boxShadow: '0 0 5px rgba(204, 29, 44, 0.5)' },
            '100%': { boxShadow: '0 0 20px rgba(204, 29, 44, 0.8)' },
          },
          'shine': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' },
          },
          'progress-shine': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' },
          },
        },
      },
    },
    darkMode: 'class',
    plugins: [],
  }