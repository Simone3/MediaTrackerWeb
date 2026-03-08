import { HeaderComponentInput } from 'app/components/presentational/generic/header';
import { MediaItemsListHeaderComponent, MediaItemsListHeaderComponentInput, MediaItemsListHeaderComponentOutput } from 'app/components/presentational/media-item/list/header';
import { config } from 'app/config/config';
import { AppError } from 'app/data/models/internal/error';
import { searchMediaItems, stopMediaItemsSearchMode, stopMediaItemsViewGroupMode } from 'app/redux/actions/media-item/generators';
import { State } from 'app/redux/state/state';
import { i18n } from 'app/utilities/i18n';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State, ownProps: MediaItemsListHeaderContainerProps): MediaItemsListHeaderComponentInput => {

	const category = state.categoryGlobal.selectedCategory;
	if(!category) {

		throw AppError.GENERIC.withDetails('List state has no linked category, cannot display header');
	}

	const mediaType = category.mediaType;
	const mode = state.mediaItemsList.mode;
	const viewGroup = state.mediaItemsList.viewGroup;

	return {
		viewGroupMode: mode === 'VIEW_GROUP',
		searchMode: mode === 'SEARCH',
		normalHeaderInput: {
			...ownProps,
			title: category.name
		},
		searchHeaderInput: {
			autoFocus: true,
			placeholder: i18n.t(`mediaItem.list.search.${mediaType}`),
			placeholderTextColor: config.ui.colors.colorContrastText,
			showLoading: false
		},
		viewGroupHeaderInput: {
			title: viewGroup ? viewGroup.name : ''
		}
	};
};

const mapDispatchToProps = (dispatch: Dispatch): MediaItemsListHeaderComponentOutput => {

	return {
		onRequestSearchModeExit: () => {
			dispatch(stopMediaItemsSearchMode());
		},
		onRequestViewGroupModeExit: () => {
			dispatch(stopMediaItemsViewGroupMode());
		},
		searchHeaderOutput: {
			onSearch: (term) => {
				dispatch(searchMediaItems(term));
			}
		}
	};
};

/**
 * Container component that handles Redux state for MediaItemsListHeaderComponent
 */
export const MediaItemsListHeaderContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MediaItemsListHeaderComponent);

/**
 * MediaItemsListHeaderContainer's props
 */
export type MediaItemsListHeaderContainerProps = Omit<HeaderComponentInput, 'title'>;
