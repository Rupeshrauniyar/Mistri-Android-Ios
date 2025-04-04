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
				indexColor: 'black',
				activeColor: '#cb2d4f',
				background: {
					light: 'hsl(var(--background))',
					dark: 'hsl(var(--background))',
				},
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
			
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: '#F43F5E',
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
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: {
					light: 'hsl(var(--border))',
					dark: 'hsl(var(--border))',
				},
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
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
				success: '#10B981',
				warning: '#F59E0B',
				error: '#EF4444',
				info: '#3B82F6',
				surface: {
					light: 'hsl(var(--surface))',
					dark: 'hsl(var(--surface))',
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
