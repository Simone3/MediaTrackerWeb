
import { SearchTextInputComponentSuggestion } from 'app/components/presentational/form/components/text-input-search';
import { SearchTextInputFieldComponent, SearchTextInputFieldComponentInput, SearchTextInputFieldComponentOutput } from 'app/components/presentational/form/fields/text-input-search';
import { getMediaItemCatalogDetails, resetMediaItemsCatalogSearch, searchMediaItemsCatalog } from 'app/redux/actions/media-item/generators';
import { State } from 'app/redux/state/state';
import { i18n } from 'app/utilities/i18n';
import { ImageRequireSource } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State, ownProps: MediaItemFormNameFieldContainerProps): SearchTextInputFieldComponentInput => {
	
	const catalogSearchResults = state.mediaItemDetails.catalogSearchResults;
	let suggestions: SearchTextInputComponentSuggestion[] | undefined;
	if(catalogSearchResults) {

		suggestions = catalogSearchResults.map((result) => {

			return {
				key: result.catalogId,
				value: result.releaseDate ? i18n.t('mediaItem.details.catalog.result.fullLabel', { name: result.name, releaseDate: result.releaseDate.getFullYear() }) : result.name
			};
		});
	}

	return {
		...ownProps,
		suggestions: suggestions
	};
};

const mapDispatchToProps = (dispatch: Dispatch): SearchTextInputFieldComponentOutput => {

	return {
		onSearch: (term) => {
			dispatch(searchMediaItemsCatalog(term));
		},
		onSelectSuggestion: (catalogId) => {
			dispatch(getMediaItemCatalogDetails(catalogId));
		},
		onClearSuggestions: () => {
			dispatch(resetMediaItemsCatalogSearch());
		}
	};
};

/**
 * Container component that handles Redux state for SearchTextInputFieldComponent
 */
export const MediaItemFormNameFieldContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchTextInputFieldComponent);

/**
 * MediaItemFormNameFieldContainer's props
 */
export type MediaItemFormNameFieldContainerProps = {

	/**
	 * The input name (unique in the form)
	 */
	name: string;

	/**
	 * The text placeholder
	 */
	placeholder: string;

	/**
	 * The input icon
	 */
	icon: ImageRequireSource;
};
