/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			scrollbar: ['rounded'],
			fontFamily: {
				overpass: ['Overpass', 'sans-serif'],
				encodeSans: ['Encode Sans', 'sans-serif'],
				notoSansDisplay: ['Noto Sans Display', 'sans-serif'],
				tenorSans: ['Tenor Sans', 'sans-serif'],
			},
		},
	},
	corePlugins: {
		preflight: false,
	},
	plugins: [require('tailwind-scrollbar')],
}
