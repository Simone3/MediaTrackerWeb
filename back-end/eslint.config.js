const { defineConfig } = require('eslint/config');
const js = require('@eslint/js');
const stylisticPlugin = require('@stylistic/eslint-plugin');
const globals = require('globals');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const jsdocPlugin = require('eslint-plugin-jsdoc');

const sharedFiles = [ 'app/**/*.ts', 'test/**/*.ts', 'index.ts' ];
const testFiles = [ 'test/**/*.ts' ];
const configFiles = [ 'app/config/config.ts' ];

const warnifyRuleConfig = (ruleConfig) => {
	if(ruleConfig === 2 || ruleConfig === 'error') {
		return 'warn';
	}

	if(Array.isArray(ruleConfig) && ruleConfig.length > 0) {
		const [ severity, ...rest ] = ruleConfig;

		if(severity === 2 || severity === 'error') {
			return [ 'warn', ...rest ];
		}
	}

	return ruleConfig;
};

const warnifyRules = (rules) => {
	if(!rules) {
		return rules;
	}

	return Object.fromEntries(
		Object.entries(rules).map(([ ruleName, ruleConfig ]) => {
			return [ ruleName, warnifyRuleConfig(ruleConfig) ];
		})
	);
};

const warnifyConfig = (config) => {
	if(!config || !config.rules) {
		return config;
	}

	return {
		...config,
		rules: warnifyRules(config.rules)
	};
};

const warnifyConfigs = (configs) => {
	if(Array.isArray(configs)) {
		return configs.map((config) => {
			return warnifyConfig(config);
		});
	}

	return warnifyConfig(configs);
};

const stylisticRules = {
	'@stylistic/indent': [ 'warn', 'tab', { SwitchCase: 1 }],
	'@stylistic/array-bracket-spacing': [ 'warn', 'always', {
		singleValue: true,
		objectsInArrays: false,
		arraysInArrays: false
	}],
	'@stylistic/arrow-parens': [ 'warn', 'always' ],
	'@stylistic/arrow-spacing': [ 'warn', { before: true, after: true }],
	'@stylistic/block-spacing': [ 'warn', 'always' ],
	'@stylistic/brace-style': [ 'warn', 'stroustrup', { allowSingleLine: false }],
	'@stylistic/comma-dangle': [ 'warn', 'never' ],
	'@stylistic/comma-spacing': [ 'warn', { before: false, after: true }],
	'@stylistic/comma-style': [ 'warn', 'last' ],
	'@stylistic/computed-property-spacing': [ 'warn', 'never' ],
	'@stylistic/eol-last': 'warn',
	'@stylistic/function-call-spacing': [ 'warn', 'never' ],
	'@stylistic/function-paren-newline': [ 'warn', 'consistent' ],
	'@stylistic/generator-star-spacing': [ 'warn', { before: true, after: true }],
	'@stylistic/key-spacing': [ 'warn', { beforeColon: false, afterColon: true, mode: 'strict' }],
	'@stylistic/keyword-spacing': [ 'warn', {
		before: true,
		after: true,
		overrides: {
			if: { after: false },
			for: { after: false },
			switch: { after: false },
			while: { after: false }
		}
	}],
	'@stylistic/line-comment-position': [ 'warn', { position: 'above' }],
	'@stylistic/lines-around-comment': [ 'warn', {
		beforeBlockComment: false,
		afterBlockComment: false,
		beforeLineComment: true,
		afterLineComment: false,
		allowBlockStart: true,
		allowBlockEnd: true,
		allowObjectStart: true,
		allowObjectEnd: true,
		allowArrayStart: true,
		allowArrayEnd: true
	}],
	'@stylistic/lines-between-class-members': [ 'warn', 'always', { exceptAfterSingleLine: true }],
	'@stylistic/max-statements-per-line': [ 'warn', { max: 1 }],
	'@stylistic/multiline-comment-style': [ 'warn', 'separate-lines' ],
	'@stylistic/multiline-ternary': [ 'warn', 'always-multiline' ],
	'@stylistic/new-parens': 'warn',
	'@stylistic/newline-per-chained-call': [ 'warn', { ignoreChainWithDepth: 4 }],
	'@stylistic/no-confusing-arrow': 'warn',
	'@stylistic/no-extra-parens': [ 'warn', 'all', {
		conditionalAssign: false,
		ignoreJSX: 'all',
		nestedBinaryExpressions: false,
		returnAssign: false
	}],
	'@stylistic/no-extra-semi': 'warn',
	'@stylistic/no-floating-decimal': 'warn',
	'@stylistic/no-mixed-spaces-and-tabs': [ 'warn' ],
	'@stylistic/no-multi-spaces': 'warn',
	'@stylistic/no-multiple-empty-lines': [ 'warn', { max: 1 }],
	'@stylistic/no-trailing-spaces': [ 'warn', {
		ignoreComments: false,
		skipBlankLines: true
	}],
	'@stylistic/no-whitespace-before-property': 'warn',
	'@stylistic/object-curly-newline': [ 'warn', {
		ObjectExpression: { consistent: true },
		ObjectPattern: { consistent: true }
	}],
	'@stylistic/object-curly-spacing': [ 'warn', 'always' ],
	'@stylistic/object-property-newline': [ 'warn', { allowAllPropertiesOnSameLine: true }],
	'@stylistic/one-var-declaration-per-line': [ 'warn', 'always' ],
	'@stylistic/operator-linebreak': [ 'warn', 'after' ],
	'@stylistic/padded-blocks': [ 'warn', { blocks: 'never', switches: 'never', classes: 'never' }],
	'@stylistic/quote-props': [ 'warn', 'as-needed' ],
	'@stylistic/quotes': [ 'warn', 'single', { avoidEscape: false, allowTemplateLiterals: 'always' }],
	'@stylistic/semi': [ 'warn', 'always' ],
	'@stylistic/semi-spacing': [ 'warn', { before: false, after: true }],
	'@stylistic/semi-style': [ 'warn', 'last' ],
	'@stylistic/space-before-blocks': [ 'warn', 'always' ],
	'@stylistic/space-before-function-paren': [ 'warn', 'never' ],
	'@stylistic/space-in-parens': [ 'warn', 'never' ],
	'@stylistic/space-infix-ops': [ 'warn', { int32Hint: false }],
	'@stylistic/space-unary-ops': [ 'warn', { words: true, nonwords: false }],
	'@stylistic/spaced-comment': [ 'warn', 'always' ],
	'@stylistic/switch-colon-spacing': [ 'warn', { after: true, before: false }],
	'@stylistic/template-curly-spacing': [ 'warn', 'never' ],
	'@stylistic/wrap-iife': [ 'warn', 'inside' ],
	'@stylistic/yield-star-spacing': [ 'warn', { before: true, after: true }]
};

module.exports = defineConfig([
	{
		ignores: [ 'build/**', 'coverage/**', 'node_modules/**', 'test/build-test/**', 'eslint.config.js', 'test/run-tests.cjs' ]
	},
	warnifyConfigs(js.configs.recommended),
	...warnifyConfigs(tsPlugin.configs['flat/recommended']),
	{
		files: sharedFiles,
		plugins: {
			'@stylistic': stylisticPlugin,
			'@typescript-eslint': tsPlugin,
			jsdoc: jsdocPlugin
		},
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.es2021,
				...globals.node,
				BigInt: 'readonly'
			},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname
			}
		},
		settings: {
			jsdoc: {
				allowOverrideWithoutParam: true,
				allowImplementsWithoutParam: true,
				allowAugmentsExtendsWithoutParam: true,
				mode: 'typescript'
			}
		},
		rules: {

			/* ************* @typescript-eslint ************* */

			'@typescript-eslint/explicit-function-return-type': [ 'warn', { allowExpressions: true }],
			'@typescript-eslint/no-shadow': [ 'warn' ],
			'@typescript-eslint/no-unused-vars': [ 'warn', { vars: 'all', args: 'after-used' }],
			'@typescript-eslint/no-use-before-define': [ 'warn', { typedefs: false }],

			/* ************* @stylistic ************* */

			...stylisticRules,

			/* ************* eslint ************* */

			'accessor-pairs': [ 'warn', { getWithoutSet: false, setWithoutGet: true }],
			'array-callback-return': [ 'warn', { allowImplicit: true }],
			'arrow-body-style': [ 'warn', 'always' ],
			'block-scoped-var': 'warn',
			complexity: 'off',
			'consistent-return': 'off',
			'consistent-this': [ 'warn', 'that' ],
			'constructor-super': 'warn',
			curly: [ 'warn', 'all' ],
			'default-case': 'warn',
			'dot-notation': [ 'warn', { allowKeywords: true }],
			eqeqeq: 'warn',
			'for-direction': 'warn',
			'func-name-matching': 'off',
			'func-names': 'off',
			'func-style': [ 'warn', 'expression' ],
			'getter-return': [ 'warn', { allowImplicit: true }],
			'global-require': 'warn',
			'handle-callback-err': [ 'warn', 'err' ],
			'id-blacklist': 'off',
			'id-length': [ 'warn', {
				min: 2,
				max: Number.infinity,
				properties: 'always',
				exceptions: [ '_', 'i', 'j', 'x', 'y', 'z', 'q' ]
			}],
			'id-match': 'off',
			'init-declarations': 'off',
			'max-depth': 'off',
			'max-len': 'off',
			'max-nested-callbacks': 'off',
			'max-params': 'off',
			'max-statements': 'off',
			'no-alert': 'warn',
			'no-array-constructor': 'warn',
			'no-await-in-loop': 'off',
			'no-bitwise': 'warn',
			'no-buffer-constructor': 'warn',
			'no-caller': 'warn',
			'no-case-declarations': 'warn',
			'no-catch-shadow': 'warn',
			'no-class-assign': 'warn',
			'no-compare-neg-zero': 'warn',
			'no-cond-assign': [ 'warn', 'always' ],
			'no-console': 'warn',
			'no-const-assign': 'warn',
			'no-constant-condition': 'warn',
			'no-continue': 'off',
			'no-control-regex': 'warn',
			'no-debugger': 'warn',
			'no-delete-var': 'warn',
			'no-div-regex': 'warn',
			'no-dupe-args': 'warn',
			'no-dupe-class-members': 'warn',
			'no-dupe-keys': 'warn',
			'no-duplicate-case': 'warn',
			'no-duplicate-imports': 'warn',
			'no-empty': 'warn',
			'no-empty-character-class': 'warn',
			'no-empty-function': [ 'warn', { allow: [ 'methods' ] }],
			'no-eq-null': 'warn',
			'no-eval': 'warn',
			'no-ex-assign': 'warn',
			'no-extend-native': 'warn',
			'no-extra-bind': 'warn',
			'no-extra-boolean-cast': 'warn',
			'no-extra-label': 'warn',
			'no-fallthrough': 'warn',
			'no-func-assign': 'warn',
			'no-global-assign': 'warn',
			'no-implicit-coercion': 'warn',
			'no-implicit-globals': 'warn',
			'no-implied-eval': 'warn',
			'no-inline-comments': 'warn',
			'no-inner-declarations': [ 'warn', 'both' ],
			'no-invalid-regexp': 'warn',
			'no-invalid-this': 'off',
			'no-irregular-whitespace': 'warn',
			'no-iterator': 'warn',
			'no-label-var': 'warn',
			'no-labels': 'warn',
			'no-lone-blocks': 'warn',
			'no-loop-func': 'warn',
			'no-magic-numbers': 'off',
			'no-mixed-requires': [ 'warn', true ],
			'no-multi-str': 'warn',
			'no-negated-condition': 'off',
			'no-nested-ternary': 'warn',
			'no-new': 'warn',
			'no-new-native-nonconstructor': 'warn',
			'no-new-object': 'warn',
			'no-new-func': 'warn',
			'no-new-require': 'warn',
			'no-new-symbol': 'warn',
			'no-new-wrappers': 'warn',
			'no-obj-calls': 'warn',
			'no-octal': 'warn',
			'no-octal-escape': 'warn',
			'no-param-reassign': 'off',
			'no-path-concat': 'warn',
			'no-plusplus': [ 'warn', { allowForLoopAfterthoughts: true }],
			'no-process-env': 'warn',
			'no-process-exit': 'warn',
			'no-proto': 'warn',
			'no-redeclare': 'warn',
			'no-restricted-globals': 'warn',
			'no-restricted-imports': 'off',
			'no-restricted-modules': 'off',
			'no-restricted-syntax': 'off',
			'no-return-assign': [ 'warn', 'always' ],
			'no-script-url': 'warn',
			'no-self-assign': 'warn',
			'no-self-compare': 'warn',
			'no-sequences': 'warn',
			'no-shadow': 'off',
			'no-shadow-restricted-names': 'warn',
			'no-sparse-arrays': 'warn',
			'no-sync': [ 'warn', { allowAtRootLevel: false }],
			'no-template-curly-in-string': 'warn',
			'no-ternary': 'off',
			'no-this-before-super': 'warn',
			'no-throw-literal': 'warn',
			'no-undef': 'warn',
			'no-undef-init': 'warn',
			'no-undefined': 'off',
			'no-unexpected-multiline': 'warn',
			'no-unmodified-loop-condition': 'warn',
			'no-unneeded-ternary': 'warn',
			'no-unreachable': 'warn',
			'no-unsafe-finally': 'warn',
			'no-unsafe-negation': 'warn',
			'no-unused-expressions': 'off',
			'no-unused-labels': 'warn',
			'no-unused-vars': 'off',
			'no-use-before-define': 'off',
			'no-useless-call': 'warn',
			'no-useless-computed-key': 'warn',
			'no-useless-concat': 'warn',
			'no-useless-escape': 'warn',
			'no-useless-return': 'warn',
			'no-var': 'warn',
			'no-void': 'warn',
			'no-warning-comments': 'warn',
			'no-with': 'warn',
			'object-shorthand': 'off',
			'one-var': 'off',
			'operator-assignment': [ 'warn', 'always' ],
			'prefer-arrow-callback': [ 'warn', { allowNamedFunctions: false, allowUnboundThis: true }],
			'prefer-const': [ 'warn', { destructuring: 'any', ignoreReadBeforeAssign: true }],
			'prefer-numeric-literals': 'warn',
			'prefer-reflect': [ 'warn', { exceptions: [] } ],
			'prefer-rest-params': 'warn',
			'prefer-spread': 'warn',
			'prefer-template': 'warn',
			radix: 'warn',
			'require-jsdoc': 'off',
			'require-yield': 'warn',
			'sort-keys': 'off',
			'sort-vars': [ 'warn', { ignoreCase: true }],
			strict: [ 'warn', 'global' ],
			'symbol-description': 'warn',
			'use-isnan': 'warn',
			'valid-typeof': 'warn',
			'vars-on-top': 'warn',
			'wrap-regex': 'off',
			yoda: [ 'warn', 'never' ],

			/* ************* eslint-plugin-jsdoc ************* */

			'jsdoc/check-alignment': 'warn',
			'jsdoc/check-examples': 'off',
			'jsdoc/check-param-names': 'warn',
			'jsdoc/check-syntax': 'warn',
			'jsdoc/check-tag-names': 'warn',
			'jsdoc/check-types': 'warn',
			'jsdoc/no-undefined-types': 'warn',
			'jsdoc/require-hyphen-before-param-description': [ 'warn', 'never' ],
			'jsdoc/require-param': 'warn',
			'jsdoc/require-param-description': 'warn',
			'jsdoc/require-param-name': 'warn',
			'jsdoc/require-returns': 'warn',
			'jsdoc/require-returns-check': 'warn',
			'jsdoc/require-returns-description': 'warn',
			'jsdoc/valid-types': 'warn'
		}
	},
	{
		files: configFiles,
		rules: {
			'@typescript-eslint/no-require-imports': 'off'
		}
	},
	{
		files: testFiles,
		languageOptions: {
			globals: {
				...globals.mocha
			}
		},
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'arrow-body-style': 'off',
			'no-console': 'off',
			'no-throw-literal': 'off',
			'prefer-arrow-callback': 'off'
		}
	}
]);
