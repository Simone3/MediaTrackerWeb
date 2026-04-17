import { readFileSync } from 'fs';
import path from 'path';

describe('shared form control styles', () => {
	test('keep selects aligned with text inputs in typography and height', () => {
		const stylesPath = path.join(process.cwd(), 'app/web/styles.css');
		const styles = readFileSync(stylesPath, 'utf8');

		expect(styles).toMatch(/\.text-input,\s*\.select-input,\s*\.textarea-input\s*\{[\s\S]*font:\s*inherit;/);
		expect(styles).toMatch(/\.text-input,\s*\.select-input\s*\{[\s\S]*height:\s*48px;/);
		expect(styles).toMatch(/\.select-input\s*\{[\s\S]*appearance:\s*none;/);
		expect(styles).toMatch(/\.select-input\s*\{[\s\S]*padding-right:\s*44px;/);
		expect(styles).toMatch(/\.select-input\s*\{[\s\S]*calc\(100% - 22px\) 50%/);
	});
});
