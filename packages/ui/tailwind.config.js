module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          deep: '#020408',
          mid: '#070c14',
          card: '#0d1522',
          hover: '#141f32',
        },
        accent: {
          DEFAULT: '#00f0ff', // electric teal
          2: '#ffaa00',       // molten gold
          3: '#4d00ff',       // deep indigo
        },
        text: {
          hi: '#f0f6ff',
          mid: '#8fa8c8',
          lo: '#3d5a80',
        },
      },
      fontFamily: {
        display: ['var(--font-clash)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '20px',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'hue-rotate': 'hueRotate 10s linear infinite',
      },
      keyframes: {
        hueRotate: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
