const nextPlugin = require("@next/eslint-plugin-next");

module.exports = [
	{
		ignores: [".next/**"],
	},
	{
		files: ["**/*.{js,jsx}"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
	},
	nextPlugin.configs["core-web-vitals"],
	{
		rules: {
			"@next/next/no-html-link-for-pages": "warn",
		},
	},
];
