import { HeaderIconComponent, HeaderIconComponentOutput } from 'app/components/presentational/generic/header-icon';
import { startMediaItemsSetFiltersMode } from 'app/redux/actions/media-item/generators';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapDispatchToProps = (dispatch: Dispatch): HeaderIconComponentOutput => {
	
	return {
		onClick: () => {
			dispatch(startMediaItemsSetFiltersMode());
		}
	};
};

/**
 * Container component that handles Redux state for HeaderIconComponent
 */
export const MediaItemsListHeaderFilterIconContainer = connect(
	null,
	mapDispatchToProps
)(HeaderIconComponent);
