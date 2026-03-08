
import { MediaItemImageButtonsRowComponent, MediaItemImageButtonsRowComponentInput, MediaItemImageButtonsRowComponentOutput } from 'app/components/presentational/media-item/details/image-buttons-row';
import { getMediaItemCatalogDetails } from 'app/redux/actions/media-item/generators';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapDispatchToProps = (dispatch: Dispatch): MediaItemImageButtonsRowComponentOutput => {

	return {
		onReloadCatalog: (catalogId) => {
			dispatch(getMediaItemCatalogDetails(catalogId));
		}
	};
};

/**
 * Container component that handles Redux state for MediaItemImageButtonsRowComponent
 */
export const MediaItemImageButtonsRowContainer = connect(
	null,
	mapDispatchToProps
)(MediaItemImageButtonsRowComponent);

/**
 * MediaItemImageButtonsRowContainer's props
 */
export type MediaItemImageButtonsRowContainerProps = MediaItemImageButtonsRowComponentInput;
