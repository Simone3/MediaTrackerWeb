import { HeaderComponent, HeaderComponentInput } from 'app/components/presentational/generic/header';
import { State } from 'app/redux/state/state';
import { i18n } from 'app/utilities/i18n';
import { connect } from 'react-redux';

const mapStateToProps = (state: State, ownProps: MediaItemDetailsHeaderContainerProps): HeaderComponentInput => {
	
	const mediaItem = state.mediaItemDetails.mediaItem;
	if(!mediaItem) {

		return {
			...ownProps,
			title: ''
		};
	}

	return {
		...ownProps,
		title: mediaItem.id ? mediaItem.name : i18n.t(`mediaItem.details.title.new.${mediaItem.mediaType}`)
	};
};

/**
 * Container component that handles Redux state for HeaderComponent
 */
export const MediaItemDetailsHeaderContainer = connect(
	mapStateToProps
)(HeaderComponent);

/**
 * MediaItemDetailsHeaderContainer's props
 */
export type MediaItemDetailsHeaderContainerProps = Omit<HeaderComponentInput, 'title'>;
