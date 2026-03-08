import { MediaItemFilterModalComponent, MediaItemFilterModalComponentInput, MediaItemFilterModalComponentOutput } from 'app/components/presentational/media-item/list/filter-modal';
import { AppError } from 'app/data/models/internal/error';
import { stopMediaItemsSetFiltersMode, submitMediaItemsFilters } from 'app/redux/actions/media-item/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): MediaItemFilterModalComponentInput => {
	
	const category = state.categoryGlobal.selectedCategory;
	const currentFilter = state.mediaItemsList.filter;
	const currentSortBy = state.mediaItemsList.sortBy;
	if(!category || !currentFilter || !currentSortBy) {

		throw AppError.GENERIC.withDetails('List state has no linked category/filter/sort, cannot display filter modal');
	}

	return {
		category: category,
		visible: state.mediaItemsList.mode === 'SET_FILTERS',
		initialFilter: currentFilter,
		initialSortBy: currentSortBy
	};
};

const mapDispatchToProps = (dispatch: Dispatch): MediaItemFilterModalComponentOutput => {

	return {
		submitFilter: (filter, sortBy) => {
			dispatch(stopMediaItemsSetFiltersMode());
			dispatch(submitMediaItemsFilters(filter, sortBy));
		},
		close: () => {
			dispatch(stopMediaItemsSetFiltersMode());
		}
	};
};

/**
 * Container component that handles Redux state for MediaItemFilterModalComponent
 */
export const MediaItemFilterModalContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MediaItemFilterModalComponent);
