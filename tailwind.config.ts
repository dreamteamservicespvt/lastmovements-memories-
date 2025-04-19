
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				party: {
					purple: {
						DEFAULT: "#5f3dc4",
						light: "#7048e8",
						dark: "#4c3399"
					},
					pink: {
						DEFAULT: "#f72585",
						light: "#ff4d9f",
						dark: "#b5179e"
					},
					gold: {
						DEFAULT: "#ffd700",
						light: "#ffdf33",
						dark: "#ffc107"
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" }
				},
				"fade-out": {
					"0%": { opacity: "1", transform: "translateY(0)" },
					"100%": { opacity: "0", transform: "translateY(10px)" }
				},
				"pulse-glow": {
					"0%, 100%": { boxShadow: "0 0 15px rgba(247, 37, 133, 0.5)" },
					"50%": { boxShadow: "0 0 30px rgba(247, 37, 133, 0.8)" }
				},
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" }
				},
				"float-slow": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-5px)" }
				},
				"float-horizontal": {
					"0%, 100%": { transform: "translateX(0)" },
					"50%": { transform: "translateX(10px)" }
				},
				"background-pan": {
					"0%": { backgroundPosition: "0% 50%" },
					"100%": { backgroundPosition: "100% 50%" }
				},
				shimmer: {
					"0%": { backgroundPosition: "100% 0%" },
					"100%": { backgroundPosition: "0% 0%" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.5s ease-out",
				"fade-out": "fade-out 0.5s ease-out",
				"pulse-glow": "pulse-glow 2s infinite",
				"float": "float 6s ease-in-out infinite",
				"float-slow": "float-slow 8s ease-in-out infinite",
				"float-horizontal": "float-horizontal 8s ease-in-out infinite",
				"background-pan": "background-pan 3s ease infinite alternate",
				"shimmer": "shimmer 2s linear infinite",
			},
			backgroundImage: {
				"gradient-party": "linear-gradient(135deg, #5f3dc4 0%, #f72585 50%, #ffd700 100%)",
				"gradient-twilight": "linear-gradient(135deg, #0f172a 0%, #4c3399 50%, #7048e8 100%)",
				"gradient-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
				"gradient-shimmer": "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0))",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
