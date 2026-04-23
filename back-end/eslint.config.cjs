const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');
const legacyConfig = require('./.eslintrc.js');

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

module.exports = compat.config(legacyConfig);
