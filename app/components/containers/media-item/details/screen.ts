import { MediaItemDetailsScreenComponent, MediaItemDetailsScreenComponentInput, MediaItemDetailsScreenComponentOutput } from 'app/components/presentational/media-item/details/screen';
import { DEFAULT_BOOK } from 'app/data/models/internal/media-items/book';
import { saveMediaItem, setMediaItemFormStatus } from 'app/redux/actions/media-item/generators';
import { startTvShowSeasonsHandling } from 'app/redux/actions/tv-show-season/generators';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): MediaItemDetailsScreenComponentInput => {
	const details = state.mediaItemDetails;
	const mediaItemLoading = details.saveStatus === 'SAVING';
	const catalogLoading = state.mediaItemDetails.catalogStatus === 'FETCHING';
	const groupsLoading = state.groupsList.status === 'DELETING' || state.groupsList.status === 'FETCHING';
	const platformsLoading = state.ownPlatformsList.status === 'DELETING' || state.ownPlatformsList.status === 'FETCHING';

	return {
		isLoading: mediaItemLoading || catalogLoading || groupsLoading || platformsLoading,
		mediaItem: details.mediaItem || DEFAULT_BOOK,
		sameNameConfirmationRequested: details.saveStatus === 'REQUIRES_CONFIRMATION',
		tvShowSeasons: state.tvShowSeasonsList.tvShowSeasons,
		tvShowSeasonsLoadTimestamp: state.tvShowSeasonsList.completeHandlingTimestamp
	};
};

const mapDispatchToProps = (dispatch: Dispatch): MediaItemDetailsScreenComponentOutput => {
	return {
		saveMediaItem: (mediaItem, confirmSameName) => {
			dispatch(saveMediaItem(mediaItem, confirmSameName));
		},
		notifyFormStatus: (valid, dirty) => {
			dispatch(setMediaItemFormStatus(valid, dirty));
		},
		handleTvShowSeasons: (currentSeasons) => {
			dispatch(startTvShowSeasonsHandling(currentSeasons || []));
		},
		goBack: () => {
			navigationService.back();
		}
	};
};

/**
 * Container component that handles Redux state for MediaItemDetailsScreenComponent
 */
export const MediaItemDetailsScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MediaItemDetailsScreenComponent);
