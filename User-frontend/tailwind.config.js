/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class"],
  theme: {
  	extend: {
		keyframes: {
			"caret-blink": {
			  "0%,70%,100%": { opacity: "1" },
			  "20%,50%": { opacity: "0" },
			},
			"shimmer": {
              "100%": {
                "transform": "translateX(100%)",
              },
            },
		},
		animation: {
			"caret-blink": "caret-blink 1.25s ease-out infinite",
			"shimmer": "shimmer 2s infinite",
		},
  		screens: {
  			sm: '0px'
  		},
  		colors: {
  			// New modern color palette
            primary: {
                DEFAULT: '#6366F1', // Indigo
                50: '#EEF2FF',
                100: '#E0E7FF',
                200: '#C7D2FE',
                300: '#A5B4FC',
                400: '#818CF8',
                500: '#6366F1',
                600: '#4F46E5',
                700: '#4338CA',
                800: '#3730A3',
                900: '#312E81',
                950: '#1E1B4B',
            },
            secondary: {
                DEFAULT: '#14B8A6', // Teal
                50: '#F0FDFA',
                100: '#CCFBF1',
                200: '#99F6E4',
                300: '#5EEAD4',
                400: '#2DD4BF',
                500: '#14B8A6',
                600: '#0D9488',
                700: '#0F766E',
                800: '#115E59',
                900: '#134E4A',
                950: '#042F2E',
            },
            accent: {
                DEFAULT: '#F43F5E', // Rose
                50: '#FFF1F2',
                100: '#FFE4E6',
                200: '#FECDD3',
                300: '#FDA4AF',
                400: '#FB7185',
                500: '#F43F5E',
                600: '#E11D48',
                700: '#BE123C',
                800: '#9F1239',
                900: '#881337',
                950: '#4C0519',
            },
            gray: {
                50: '#F9FAFB',
                100: '#F3F4F6',
                200: '#E5E7EB',
                300: '#D1D5DB',
                400: '#9CA3AF',
                500: '#6B7280',
                600: '#4B5563',
                700: '#374151',
                800: '#1F2937',
                900: '#111827',
                950: '#030712',
            },
            success: '#10B981', // Emerald
            warning: '#F59E0B', // Amber
            error: '#EF4444',   // Red
            info: '#3B82F6',    // Blue
            background: {
                light: '#FFFFFF',
                dark: '#0F172A',
            },
            surface: {
                light: '#F8FAFC',
                dark: '#1E293B',
            },
            border: {
                light: '#E2E8F0',
                dark: '#334155',
            },
  		},
        borderRadius: {
            'none': '0',
            'sm': '0.25rem',
            DEFAULT: '0.375rem',
            'md': '0.5rem',
            'lg': '0.75rem',
            'xl': '1rem',
            '2xl': '1.5rem',
            '3xl': '2rem',
            'full': '9999px',
        },
        boxShadow: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
            inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            none: 'none',
        },
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['CustomBlack', 'sans-serif'],
        },
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      const newUtilities = {
        '.gradient-primary': {
          background: 'linear-gradient(to right, #6366F1, #8B5CF6)',
        },
        '.gradient-secondary': {
          background: 'linear-gradient(to right, #14B8A6, #0EA5E9)',
        },
        '.gradient-accent': {
          background: 'linear-gradient(to right, #F43F5E, #EC4899)',
        },
        '.text-gradient-primary': {
          background: 'linear-gradient(to right, #6366F1, #8B5CF6)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.card-hover': {
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        },
        '.glass': {
          background: 'rgba(255, 255, 255, 0.25)',
          'backdrop-filter': 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
        },
        '.glass-dark': {
          background: 'rgba(15, 23, 42, 0.75)',
          'backdrop-filter': 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
          'border': '1px solid rgba(255, 255, 255, 0.08)',
        },
      }
      addUtilities(newUtilities)
    }
  ]
}
