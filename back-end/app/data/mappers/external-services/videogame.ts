import { config } from 'app/config/config';
import { ModelMapper } from 'app/data/mappers/common';
import { AppError } from 'app/data/models/error/error';
import { IgdbGame, IgdbInvolvedCompany, IgdbNamedReference } from 'app/data/models/external-services/media-items/videogame';
import { CatalogVideogameInternal, SearchVideogameCatalogResultInternal } from 'app/data/models/internal/media-items/videogame';
import { miscUtils } from 'app/utilities/misc-utils';

const IGDB_CATALOG_ID_PREFIX = 'igdb:';

/**
 * Helper to build an IGDB catalog ID
 * @param sourceId the source IGDB ID
 * @returns the prefixed catalog ID
 */
export const toIgdbCatalogId = (sourceId: number): string => {
	return `${IGDB_CATALOG_ID_PREFIX}${sourceId}`;
};

/**
 * Helper to strip the IGDB catalog ID prefix
 * @param catalogId the possibly prefixed catalog ID
 * @returns the raw IGDB ID
 */
export const fromIgdbCatalogId = (catalogId: string): string => {
	if(catalogId.startsWith(IGDB_CATALOG_ID_PREFIX)) {
		return catalogId.substring(IGDB_CATALOG_ID_PREFIX.length);
	}
	else {
		return catalogId;
	}
};

/**
 * Helper to get the release date from the videogame data
 * @param gameData the game data
 * @returns the release date as a Date or undefined
 */
const getReleaseDate = (gameData: IgdbGame): Date | undefined => {
	if(gameData.first_release_date) {
		return new Date(gameData.first_release_date * 1000);
	}
	else {
		return undefined;
	}
};

/**
 * Mapper for the videogames search external service
 */
class VideogameExternalSearchServiceMapper extends ModelMapper<SearchVideogameCatalogResultInternal, IgdbGame, never> {
	/**
	 * @override
	 */
	protected convertToExternal(): IgdbGame {
		throw AppError.GENERIC.withDetails('convertToExternal unimplemented');
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: IgdbGame): SearchVideogameCatalogResultInternal {
		return {
			catalogId: toIgdbCatalogId(source.id),
			name: source.name,
			releaseDate: getReleaseDate(source)
		};
	}
}

/**
 * Mapper for the videogames details external service
 */
class VideogameExternalDetailsServiceMapper extends ModelMapper<CatalogVideogameInternal, IgdbGame, never> {
	/**
	 * @override
	 */
	protected convertToExternal(): IgdbGame {
		throw AppError.GENERIC.withDetails('convertToExternal unimplemented');
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: IgdbGame): CatalogVideogameInternal {
		return {
			catalogId: toIgdbCatalogId(source.id),
			name: source.name,
			genres: this.getNames(source.genres),
			description: source.summary ? source.summary : source.storyline,
			releaseDate: getReleaseDate(source),
			imageUrl: this.getImageUrl(source.cover?.image_id),
			developers: this.getCompanies(source.involved_companies, 'developer'),
			publishers: this.getCompanies(source.involved_companies, 'publisher'),
			platforms: this.getNames(source.platforms)
		};
	}

	/**
	 * Helper to get names from IGDB references
	 * @param references the IGDB references
	 * @returns the sorted names
	 */
	private getNames(references: IgdbNamedReference[] | undefined): string[] | undefined {
		return miscUtils.extractFilterAndSortFieldValues(references, 'name');
	}

	/**
	 * Helper to build the image URL
	 * @param imageId the IGDB image ID
	 * @returns the possibly undefined image URL
	 */
	private getImageUrl(imageId: string | undefined): string | undefined {
		if(imageId) {
			return miscUtils.buildUrl([
				config.externalApis.igdb.imageBasePath,
				`t_${config.externalApis.igdb.imageSize}`,
				`${imageId}.${config.externalApis.igdb.imageExtension}`
			]);
		}

		return undefined;
	}

	/**
	 * Helper to get company names by involvement type
	 * @param involvedCompanies the involved company records
	 * @param involvementType the involvement type
	 * @returns the sorted company names
	 */
	private getCompanies(involvedCompanies: IgdbInvolvedCompany[] | undefined, involvementType: 'developer' | 'publisher'): string[] | undefined {
		if(involvedCompanies) {
			return miscUtils.filterAndSortValues(involvedCompanies
				.filter((involvedCompany) => {
					return involvedCompany[involvementType] && involvedCompany.company?.name;
				})
				.map((involvedCompany) => {
					return involvedCompany.company?.name as string;
				}));
		}

		return undefined;
	}
}

/**
 * Singleton instance of videogame search external service mapper
 */
export const videogameExternalSearchServiceMapper = new VideogameExternalSearchServiceMapper();

/**
 * Singleton instance of videogame details external service mapper
 */
export const videogameExternalDetailsServiceMapper = new VideogameExternalDetailsServiceMapper();
