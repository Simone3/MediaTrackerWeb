import { HeaderIconComponent, HeaderIconComponentOutput } from 'app/components/presentational/generic/header-icon';
import { startMediaItemsSearchMode } from 'app/redux/actions/media-item/generators';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapDispatchToProps = (dispatch: Dispatch): HeaderIconComponentOutput => {
	
	return {
		onClick: () => {
			dispatch(startMediaItemsSearchMode());
		}
	};
};

/**
 * Container component that handles Redux state for HeaderIconComponent
 */
export const MediaItemsListHeaderSearchIconContainer = connect(
	null,
	mapDispatchToProps
)(HeaderIconComponent);
