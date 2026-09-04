import { GoogleBooksSearchResponse } from 'app/data/models/external-services/media-items/book';
import { TmdbMovieDetailsResponse } from 'app/data/models/external-services/media-items/movie';
import { IgdbGame } from 'app/data/models/external-services/media-items/videogame';
import { parserValidator } from 'app/utilities/parser-validator';
import chai from 'chai';
import { extract } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Helper to assert that a lenient parse rejected
 * @param promise the parse promise
 * @returns true if the promise rejected
 */
const rejected = async(promise: Promise<unknown>): Promise<boolean> => {
	try {
		await promise;
		return false;
	}
	catch(error) {
		return Boolean(error);
	}
};

/**
 * Helper to get the titles of a parsed book search response
 * @param response the parsed response
 * @returns the volume titles
 */
const extractTitles = (response: GoogleBooksSearchResponse): string[] => {
	if(response.items) {
		return response.items.map((item) => {
			return item.volumeInfo.title;
		});
	}

	return [];
};

/**
 * Tests for the parser/validator
 */
describe('ParserValidator Tests', () => {
	describe('ParserValidator Tests', () => {
		it('Should parse a valid object without discarding anything', async() => {
			const result = await parserValidator.parseAndValidateDiscardingInvalidItems(GoogleBooksSearchResponse, {
				items: [
					{ id: '1', volumeInfo: { title: 'First' } },
					{ id: '2', volumeInfo: { title: 'Second' } }
				]
			});

			expect(result.discardedItems, 'Parser discarded items of a valid response').to.equal(0);
			expect(result.value.items, 'Parser did not return all the valid items').to.have.lengthOf(2);
		});

		it('Should discard the invalid list items instead of the whole list', async() => {
			const result = await parserValidator.parseAndValidateDiscardingInvalidItems(GoogleBooksSearchResponse, {
				items: [
					{ id: '1', volumeInfo: { title: 'First' } },
					{ id: '2', volumeInfo: {} },
					{ id: '3', volumeInfo: { title: 'Third' } }
				]
			});

			expect(result.discardedItems, 'Parser did not discard the invalid item').to.equal(1);
			expect(extractTitles(result.value), 'Parser did not keep the valid items').to.be.eql([ 'First', 'Third' ]);
		});

		it('Should discard the null and non-object list items', async() => {
			const result = await parserValidator.parseAndValidateDiscardingInvalidItems(GoogleBooksSearchResponse, {
				items: [
					{ id: '1', volumeInfo: { title: 'First' } },
					null,
					17,
					{ id: '2', volumeInfo: { title: 'Second' } }
				]
			});

			expect(result.discardedItems, 'Parser did not discard the invalid items').to.equal(2);
			expect(extractTitles(result.value), 'Parser did not keep the valid items').to.be.eql([ 'First', 'Second' ]);
		});

		it('Should discard the invalid items nested inside a list item', async() => {
			const result = await parserValidator.parseAndValidateDiscardingInvalidItems(TmdbMovieDetailsResponse, {
				id: 1,
				title: 'Mock Movie',
				genres: [{ name: 'Genre1' }, {}, { name: 'Genre2' }],
				credits: {
					crew: [{ name: 'Some Director', job: 'Director' }, { job: 'Director' }]
				}
			});

			expect(result.discardedItems, 'Parser did not discard the invalid nested items').to.equal(2);
			expect(result.value.genres, 'Parser did not keep the valid genres').to.be.eql([{ name: 'Genre1' }, { name: 'Genre2' }]);
			expect(result.value.credits?.crew, 'Parser did not keep the valid crew members').to.have.lengthOf(1);
		});

		it('Should discard a list of primitives that cannot be fixed item by item', async() => {
			const result = await parserValidator.parseAndValidateDiscardingInvalidItems(GoogleBooksSearchResponse, {
				items: [
					{ id: '1', volumeInfo: { title: 'First', authors: [ 'Some Author', 33 ] } }
				]
			});

			expect(extractTitles(result.value), 'Parser discarded the whole item instead of the invalid list').to.be.eql([ 'First' ]);
			expect(result.value.items?.[0].volumeInfo.authors, 'Parser did not discard the invalid list').to.be.equal(undefined);
		});

		it('Should return an empty list if all its items are invalid', async() => {
			const result = await parserValidator.parseAndValidateDiscardingInvalidItems(GoogleBooksSearchResponse, {
				items: [{ id: '1', volumeInfo: {} }, { id: '2', volumeInfo: {} }]
			});

			expect(result.discardedItems, 'Parser did not discard all the items').to.equal(2);
			expect(result.value.items, 'Parser did not return an empty list').to.be.eql([]);
		});

		it('Should reject if the failure is not a list item', async() => {
			const parsed = parserValidator.parseAndValidateDiscardingInvalidItems(TmdbMovieDetailsResponse, {
				id: 1,
				genres: [{ name: 'Genre1' }]
			});

			expect(await rejected(parsed), 'Parser did not reject a response without its required fields').to.equal(true);
		});

		it('Should discard the invalid elements of a list response', async() => {
			const result = await parserValidator.parseAndValidateListDiscardingInvalid(IgdbGame, [
				{ id: 1, name: 'First', genres: [{ id: 9, name: 'RPG' }, { id: 10 }] },
				{ id: 2 },
				{ id: 3, name: 'Third' }
			]);

			expect(result.discardedItems, 'Parser did not discard the invalid game and the invalid genre').to.equal(2);
			expect(extract(result.value, 'name'), 'Parser did not keep the valid games').to.be.eql([ 'First', 'Third' ]);
			expect(result.value[0].genres, 'Parser did not keep the valid genre').to.have.lengthOf(1);
		});
	});
});
