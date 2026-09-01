import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { MediaItemsListScreenComponent, MediaItemsListScreenComponentInput, MediaItemsListScreenComponentOutput } from 'app/components/presentational/media-item/list/screen';
import { AppError } from 'app/data/models/internal/error';
import { fetchMediaItems, loadNewMediaItemDetails } from 'app/redux/actions/media-item/generators';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';
import { AppScreens } from 'app/utilities/screens';

const mapStateToProps = (state: State): MediaItemsListScreenComponentInput => {
	const listState = state.mediaItemsList;
	const category = state.categoryGlobal.selectedCategory;
	if(!category) {
		throw AppError.GENERIC.withDetails('App navigated to the media items details screen without category data');
	}

	return {
		isLoading: listState.status === 'FETCHING' || listState.status === 'DELETING' || listState.status === 'INLINE_UPDATING',
		requiresFetch: listState.status === 'REQUIRES_FETCH',
		category: category,
		mediaItemsCount: listState.totalCount
	};
};

const mapDispatchToProps = (dispatch: Dispatch): MediaItemsListScreenComponentOutput => {
	return {
		fetchMediaItems: () => {
			dispatch(fetchMediaItems());
		},
		loadNewMediaItemDetails: (category) => {
			dispatch(loadNewMediaItemDetails(category));
		},

		// Opening the stats is a plain navigation and not a saga: the screen loads its own data and the category is already global
		openStats: () => {
			navigationService.navigate(AppScreens.MediaItemsStats);
		}
	};
};

/**
 * Container component that handles Redux state for MediaItemsListScreenComponent
 */
export const MediaItemsListScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MediaItemsListScreenComponent);
