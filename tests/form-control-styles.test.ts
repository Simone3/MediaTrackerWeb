import { readFileSync } from 'fs';
import path from 'path';

describe('shared form control styles', () => {
	test('keep selects aligned with text inputs in typography and height', () => {
		const stylesPath = path.join(process.cwd(), 'app/web/styles.css');
		const styles = readFileSync(stylesPath, 'utf8');

		expect(styles).toMatch(/\.text-input,\s*\.select-input,\s*\.textarea-input\s*\{[\s\S]*font:\s*inherit;/);
		expect(styles).toMatch(/\.text-input,\s*\.select-input\s*\{[\s\S]*height:\s*48px;/);
		expect(styles).toMatch(/\.text-input\.text-input-date\s*\{[\s\S]*min-width:\s*0;/);
		expect(styles).toMatch(/\.text-input\.text-input-date\s*\{[\s\S]*-webkit-min-logical-width:\s*0;/);
		expect(styles).toMatch(/\.text-input\.text-input-date\.text-input-date-ios\s*\{[\s\S]*-webkit-appearance:\s*listbox;/);
		expect(styles).toMatch(/\.text-input\.text-input-date\.text-input-date-ios::-webkit-date-and-time-value\s*\{[\s\S]*min-height:\s*1\.5em;/);
		expect(styles).toMatch(/\.text-input\.text-input-date\.text-input-date-ios::-webkit-date-and-time-value\s*\{[\s\S]*padding-left:\s*18px;/);
		expect(styles).toMatch(/\.text-input\.text-input-date\.text-input-date-ios::-webkit-datetime-edit\s*\{[\s\S]*padding:\s*13px 14px;/);
		expect(styles).toMatch(/\.clearable-input\s*\{[\s\S]*display:\s*flex;/);
		expect(styles).toMatch(/\.clearable-input-clear-button\s*\{[\s\S]*min-width:\s*92px;/);
		expect(styles).toMatch(/\.media-item-details-completion-row\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*auto;/);
		expect(styles).not.toMatch(/\.media-item-details-search-row,\s*\.clearable-input,\s*\.media-item-details-completion-row\s*\{/);
		expect(styles).not.toMatch(/\.media-item-details-search-button,\s*\.clearable-input-clear-button,\s*\.media-item-details-inline-button\s*\{/);
		expect(styles).toMatch(/\.select-input\s*\{[\s\S]*appearance:\s*none;/);
		expect(styles).toMatch(/\.select-input\s*\{[\s\S]*padding-right:\s*44px;/);
		expect(styles).toMatch(/\.select-input\s*\{[\s\S]*calc\(100% - 22px\) 50%/);
	});
});
