import { config } from 'app/config/config';
import { MediaItemCatalogController } from 'app/controllers/catalogs/media-items/media-item';
import { restJsonInvoker } from 'app/controllers/external-services/rest-json-invoker';
import { twitchAuthTokenProvider } from 'app/controllers/external-services/twitch-auth-token-provider';
import { fromIgdbCatalogId, videogameExternalDetailsServiceMapper, videogameExternalSearchServiceMapper } from 'app/data/mappers/external-services/videogame';
import { AppError } from 'app/data/models/error/error';
import { IgdbGame } from 'app/data/models/external-services/media-items/videogame';
import { CatalogVideogameInternal, SearchVideogameCatalogResultInternal } from 'app/data/models/internal/media-items/videogame';
import { logger } from 'app/loggers/logger';
import { InvocationParams } from 'app/utilities/helper-types';
import { miscUtils } from 'app/utilities/misc-utils';
import { parserValidator } from 'app/utilities/parser-validator';

/**
 * Controller for videogame catalog
 */
class VideogameCatalogController extends MediaItemCatalogController<SearchVideogameCatalogResultInternal, CatalogVideogameInternal> {
	/**
	 * @override
	 */
	public searchMediaItemCatalogByTerm(searchTerm: string): Promise<SearchVideogameCatalogResultInternal[]> {
		return new Promise((resolve, reject): void => {
			twitchAuthTokenProvider.getAccessToken()
				.then((accessToken) => {
					const invocationParams: InvocationParams<string, IgdbGame[]> = {
						method: 'POST',
						url: this.getUrl(config.externalApis.igdb.search.relativePath),
						requestBody: this.getSearchRequestBody(searchTerm),
						requestContentType: 'text/plain',
						headers: this.getHeaders(accessToken),
						timeoutMilliseconds: config.externalApis.timeoutMilliseconds,
						assumeWellFormedResponse: true
					};

					return restJsonInvoker.invoke(invocationParams);
				})
				.then((response) => {
					return this.parseIgdbGamesResponse(response);
				})
				.then((games) => {
					resolve(videogameExternalSearchServiceMapper.toInternalList(games));
				})
				.catch((error) => {
					logger.error('Videogame catalog invocation error: %s', error);
					reject(AppError.GENERIC.withDetails(error));
				});
		});
	}
	
	/**
	 * @override
	 */
	public getMediaItemFromCatalog(catalogItemId: string): Promise<CatalogVideogameInternal> {
		return new Promise((resolve, reject): void => {
			const igdbId = this.getIgdbId(catalogItemId);

			twitchAuthTokenProvider.getAccessToken()
				.then((accessToken) => {
					const invocationParams: InvocationParams<string, IgdbGame[]> = {
						method: 'POST',
						url: this.getUrl(config.externalApis.igdb.details.relativePath),
						requestBody: this.getDetailsRequestBody(igdbId),
						requestContentType: 'text/plain',
						headers: this.getHeaders(accessToken),
						timeoutMilliseconds: config.externalApis.timeoutMilliseconds,
						assumeWellFormedResponse: true
					};

					return restJsonInvoker.invoke(invocationParams);
				})
				.then((response) => {
					return this.parseIgdbGamesResponse(response);
				})
				.then((games) => {
					const game = games[0];
					if(game) {
						resolve(videogameExternalDetailsServiceMapper.toInternal(game));
					}
					else {
						reject(AppError.NOT_FOUND.withDetails(`Videogame catalog item ${catalogItemId} not found`));
					}
				})
				.catch((error) => {
					logger.error('Videogame catalog invocation error: %s', error);
					reject(AppError.GENERIC.withDetails(error));
				});
		});
	}

	/**
	 * Helper to build the IGDB endpoint URL
	 * @param relativePath endpoint relative path
	 * @returns the full endpoint URL
	 */
	private getUrl(relativePath: string): string {
		return miscUtils.buildUrl([
			config.externalApis.igdb.basePath,
			relativePath
		]);
	}

	/**
	 * Helper to build IGDB request headers
	 * @param accessToken the Twitch app access token
	 * @returns the request headers
	 */
	private getHeaders(accessToken: string): { [key: string]: string } {
		return {
			'Client-ID': config.externalApis.igdb.auth.clientId,
			Authorization: `Bearer ${accessToken}`
		};
	}

	/**
	 * Helper to build the IGDB search request body
	 * @param searchTerm the search term
	 * @returns the APICALYPSE request body
	 */
	private getSearchRequestBody(searchTerm: string): string {
		const escapedSearchTerm = this.escapeApicalypseString(searchTerm);
		return [
			'fields id,name,first_release_date;',
			`search "${escapedSearchTerm}";`,
			`limit ${config.externalApis.igdb.search.limit};`
		].join('\n');
	}

	/**
	 * Helper to build the IGDB details request body
	 * @param igdbId the raw IGDB ID
	 * @returns the APICALYPSE request body
	 */
	private getDetailsRequestBody(igdbId: string): string {
		return [
			'fields id,name,first_release_date,summary,storyline,genres.name,cover.image_id,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,platforms.name;',
			`where id = ${igdbId};`,
			'limit 1;'
		].join('\n');
	}

	/**
	 * Helper to escape a string in an APICALYPSE query
	 * @param value the source value
	 * @returns the escaped value
	 */
	private escapeApicalypseString(value: string): string {
		return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
	}

	/**
	 * Helper to parse and validate IGDB game array responses, discarding the games (and the parts of a game)
	 * that failed validation
	 * @param response the raw response
	 * @returns the parsed response
	 */
	private parseIgdbGamesResponse(response: unknown): Promise<IgdbGame[]> {
		if(response instanceof Array) {
			return parserValidator.parseAndValidateListDiscardingInvalid(IgdbGame, response as object[])
				.then((parseResult) => {
					if(parseResult.discardedItems > 0) {
						logger.warn('Videogame catalog - Discarded %s invalid response list item(s)', parseResult.discardedItems);
					}

					return parseResult.value;
				});
		}
		else {
			return Promise.reject(AppError.EXTERNAL_API_PARSE.withDetails('IGDB response is not an array'));
		}
	}

	/**
	 * Helper to get a raw IGDB ID from an API catalog ID
	 * @param catalogItemId the API catalog ID
	 * @returns the raw IGDB ID
	 */
	private getIgdbId(catalogItemId: string): string {
		const igdbId = fromIgdbCatalogId(catalogItemId);
		if(/^\d+$/.test(igdbId)) {
			return igdbId;
		}
		else {
			throw AppError.INVALID_REQUEST.withDetails(`Invalid IGDB catalog ID ${catalogItemId}`);
		}
	}
}

/**
 * Singleton implementation of the videogame catalog controller
 */
export const videogameCatalogController = new VideogameCatalogController();
