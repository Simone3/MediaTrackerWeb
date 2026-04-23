'use strict';

const fs = require('fs');
const path = require('path');
const Mocha = require('mocha');

process.env.TS_NODE_PROJECT = path.resolve(__dirname, 'tsconfig.json');

require('ts-node').register({
	project: process.env.TS_NODE_PROJECT,
	transpileOnly: true
});
require('tsconfig-paths/register');

const mocha = new Mocha({
	timeout: 10000
});

const testsRoot = path.resolve(__dirname);
const globalInitTest = path.join(testsRoot, 'global', 'global-init-tests.ts');

const listTestFiles = (directoryPath) => {
	const files = [];

	for(const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
		const entryPath = path.join(directoryPath, entry.name);

		if(entry.isDirectory()) {
			files.push(...listTestFiles(entryPath));
		}
		else if(entry.isFile() && entry.name.endsWith('.ts')) {
			files.push(entryPath);
		}
	}

	return files;
};

mocha.addFile(globalInitTest);

for(const testFile of listTestFiles(testsRoot)) {
	if(testFile !== globalInitTest) {
		mocha.addFile(testFile);
	}
}

try {
	mocha.loadFiles(() => {
		mocha.run((failures) => {
			process.exitCode = failures ? 1 : 0;
		});
	});
}
catch(error) {
	console.error(error);
	process.exitCode = 1;
}
