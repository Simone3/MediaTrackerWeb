import { readFileSync } from 'fs';
import path from 'path';

const template = readFileSync(path.join(process.cwd(), 'public/index.html'), 'utf8');
const styles = readFileSync(path.join(process.cwd(), 'app/web/styles.css'), 'utf8');

/**
 * Reads the value of a custom property from the global stylesheet.
 * @param name the custom property name
 * @returns the declared value
 */
const tokenValue = (name: string): string => {
	const match = styles.match(new RegExp(`${name}:\\s*([^;]+);`));
	if(!match) {
		throw new Error(`Cannot find ${name} in the stylesheet`);
	}

	return match[1];
};

/**
 * Reads the body of a rule from a stylesheet or from the inline styles of the HTML template.
 * @param source the stylesheet or template contents
 * @param selector the rule selector
 * @returns the declarations inside the rule
 */
const ruleBody = (source: string, selector: string): string => {
	const match = source.match(new RegExp(`\\${selector}\\s*\\{([^}]+)\\}`));
	if(!match) {
		throw new Error(`Cannot find rule ${selector}`);
	}

	return match[1];
};

/**
 * Reads a declaration from a rule body, resolving any custom property reference into its literal value.
 * @param body the rule body
 * @param property the declaration name
 * @returns the declared value, with tokens resolved
 */
const declaration = (body: string, property: string): string => {
	const match = body.match(new RegExp(`(?:^|[\\s;])${property}:\\s*([^;]+);`));
	if(!match) {
		throw new Error(`Cannot find declaration ${property}`);
	}

	return match[1].replace(/var\((--[\w-]+)\)/g, (_full: string, name: string) => {
		return tokenValue(name);
	});
};

describe('boot placeholder', () => {
	it('paints the app shell before the bundle runs', () => {
		expect(template).toMatch(/<div id="root">\s*<div class="app-boot">\s*<div class="app-boot-spinner"><\/div>/);
		expect(declaration(ruleBody(template, '.app-boot'), 'background')).toBe(tokenValue('--color-scrim-strong'));
		expect(template).toContain(tokenValue('--color-background-app'));
	});

	it('keeps the placeholder spinner identical to the one the first screen renders', () => {
		const bootSpinner = ruleBody(template, '.app-boot-spinner');
		const screenSpinner = ruleBody(styles, '.loading-indicator-spinner');

		for(const property of [ 'width', 'height', 'border-radius', 'border', 'border-top-color' ]) {
			expect(declaration(bootSpinner, property)).toBe(declaration(screenSpinner, property));
		}

		const spinDuration = /\s(\d*\.?\d+s)\s/;
		expect(declaration(bootSpinner, 'animation').match(spinDuration)?.[1]).toBe(declaration(screenSpinner, 'animation').match(spinDuration)?.[1]);
	});
});
