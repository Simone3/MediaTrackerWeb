import { textSearchUtils } from 'app/utilities/text-search';

describe('textSearchUtils', () => {
	const items = [
		{ name: 'Star Wars' },
		{ name: 'The Lord of the Rings' },
		{ name: 'Pokémon' }
	];
	const getItemName = (item: { name: string }): string => {
		return item.name;
	};

	test('returns the whole list when the search term is empty or blank', () => {
		expect(textSearchUtils.filter(items, '', getItemName)).toBe(items);
		expect(textSearchUtils.filter(items, '   ', getItemName)).toBe(items);
		expect(textSearchUtils.filter(items, undefined, getItemName)).toBe(items);
	});

	test('matches a substring ignoring case and surrounding spaces', () => {
		expect(textSearchUtils.filter(items, '  WARS ', getItemName)).toEqual([ items[0] ]);
		expect(textSearchUtils.filter(items, 'of the', getItemName)).toEqual([ items[1] ]);
	});

	test('matches ignoring accents in both the text and the search term', () => {
		expect(textSearchUtils.filter(items, 'pokemon', getItemName)).toEqual([ items[2] ]);
		expect(textSearchUtils.filter([ { name: 'Pokemon' } ], 'pokémon', getItemName)).toEqual([ { name: 'Pokemon' } ]);
	});

	test('returns an empty list when nothing matches', () => {
		expect(textSearchUtils.filter(items, 'zelda', getItemName)).toEqual([]);
	});

	test('treats an empty search term as a match and handles missing text', () => {
		expect(textSearchUtils.matches('None', '')).toBe(true);
		expect(textSearchUtils.matches(undefined, 'none')).toBe(false);
		expect(textSearchUtils.matches('None', 'non')).toBe(true);
		expect(textSearchUtils.matches('None', 'nine')).toBe(false);
	});
});
