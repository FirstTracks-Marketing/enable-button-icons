/**
 * External dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		'index': path.resolve(process.cwd(), 'src/index.js'),
		'editor': path.resolve(process.cwd(), 'src/editor.scss'),
		'style': path.resolve(process.cwd(), 'src/index.scss')
	},
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.svg$/,
				use: ['@svgr/webpack']
			}
		]
	},
	plugins: [
		...defaultConfig.plugins,
		new RemoveEmptyScriptsPlugin()
	]
};