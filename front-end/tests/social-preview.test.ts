import { readFileSync } from 'fs';
import path from 'path';

const template = readFileSync(path.join(process.cwd(), 'public/index.html'), 'utf8');

/**
 * Reads the content of a meta tag from the HTML template.
 * @param property the og property name, or the name attribute for the non-og tags
 * @returns the content attribute
 */
const metaContent = (property: string): string => {
	const match = template.match(new RegExp(`<meta (?:property|name)="${property}" content="([^"]+)"`));
	if(!match) {
		throw new Error(`Cannot find the ${property} meta tag`);
	}

	return match[1];
};

describe('social preview', () => {
	it('points the preview image at an absolute url under the deployed origin', () => {
		const image = metaContent('og:image');

		expect(image).toBe('https://media-tracker-front-end.onrender.com/og_banner.png');
		expect(image.startsWith(metaContent('og:url'))).toBe(true);
	});

	it('declares the size the preview image actually has', () => {
		const banner = readFileSync(path.join(process.cwd(), 'public/og_banner.png'));

		// the IHDR chunk of a png starts at byte 16 and opens with the two dimensions, big endian
		expect(banner.readUInt32BE(16)).toBe(Number(metaContent('og:image:width')));
		expect(banner.readUInt32BE(20)).toBe(Number(metaContent('og:image:height')));
	});

	it('keeps the preview image wide enough for a card that crops the sides', () => {
		const banner = readFileSync(path.join(process.cwd(), 'public/og_banner.png'));
		const ratio = banner.readUInt32BE(16) / banner.readUInt32BE(20);

		expect(ratio).toBeGreaterThanOrEqual(1.8);
		expect(ratio).toBeLessThanOrEqual(2);
	});
});
