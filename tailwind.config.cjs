const typography = require('@tailwindcss/typography');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			 // add a new custom color named "japanRed" with hex #EF3340
			 colors: {
				 'japanRed': '#EF3340',
			 },
		}
	},

	plugins: [typography]
};

module.exports = config;
