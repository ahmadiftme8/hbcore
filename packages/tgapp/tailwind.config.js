/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			colors: {},
			fontFamily: {
				sans: ["var(--font-family-sans)"],
				mono: ["var(--font-family-mono)"],
			},
			fontSize: {
				xs: ["var(--font-size-xs)", { lineHeight: "var(--line-height-normal)" }],
				sm: ["var(--font-size-sm)", { lineHeight: "var(--line-height-normal)" }],
				base: ["var(--font-size-base)", { lineHeight: "var(--line-height-relaxed)" }],
				lg: ["var(--font-size-lg)", { lineHeight: "var(--line-height-relaxed)" }],
				xl: ["var(--font-size-xl)", { lineHeight: "var(--line-height-normal)" }],
				"2xl": ["var(--font-size-2xl)", { lineHeight: "var(--line-height-snug)" }],
				"3xl": ["var(--font-size-3xl)", { lineHeight: "var(--line-height-snug)" }],
				"4xl": ["var(--font-size-4xl)", { lineHeight: "var(--line-height-tight)" }],
				"5xl": ["var(--font-size-5xl)", { lineHeight: "var(--line-height-tight)" }],
			},
			fontWeight: {
				light: "var(--font-weight-light)",
				normal: "var(--font-weight-normal)",
				medium: "var(--font-weight-medium)",
				semibold: "var(--font-weight-semibold)",
				bold: "var(--font-weight-bold)",
			},
			lineHeight: {
				none: "var(--line-height-none)",
				tight: "var(--line-height-tight)",
				snug: "var(--line-height-snug)",
				normal: "var(--line-height-normal)",
				relaxed: "var(--line-height-relaxed)",
				loose: "var(--line-height-loose)",
			},
			letterSpacing: {
				tighter: "var(--letter-spacing-tighter)",
				tight: "var(--letter-spacing-tight)",
				normal: "var(--letter-spacing-normal)",
				wide: "var(--letter-spacing-wide)",
				wider: "var(--letter-spacing-wider)",
				widest: "var(--letter-spacing-widest)",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};

