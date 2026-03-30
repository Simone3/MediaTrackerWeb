import { BrowserBackNavigationGuardComponent } from 'app/components/presentational/generic/browser-back-navigation-guard';
import { MediaItemDetailsScreenComponent, MediaItemDetailsScreenComponentInput, MediaItemDetailsScreenComponentOutput } from 'app/components/presentational/media-item/details/screen';
import { requestGroupSelection } from 'app/redux/actions/group/generators';
import { getMediaItemCatalogDetails, resetMediaItemsCatalogSearch, saveMediaItem, searchMediaItemsCatalog, setMediaItemFormDraft, setMediaItemFormStatus } from 'app/redux/actions/media-item/generators';
import { requestOwnPlatformSelection } from 'app/redux/actions/own-platform/generators';
import { State } from 'app/redux/state/state';
import { i18n } from 'app/utilities/i18n';
import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

type MediaItemDetailsScreenContainerStateProps = MediaItemDetailsScreenComponentInput & {
	blockBrowserBack: boolean;
};

type MediaItemDetailsScreenContainerProps = MediaItemDetailsScreenContainerStateProps & MediaItemDetailsScreenComponentOutput;

const mapStateToProps = (state: State): MediaItemDetailsScreenContainerStateProps => {
	const details = state.mediaItemDetails;
	const mediaItemLoading = details.saveStatus === 'SAVING';
	const catalogLoading = state.mediaItemDetails.catalogStatus === 'FETCHING';
	const groupsLoading = state.groupsList.status === 'DELETING' || state.groupsList.status === 'FETCHING';
	const platformsLoading = state.ownPlatformsList.status === 'DELETING' || state.ownPlatformsList.status === 'FETCHING';

	return {
		isLoading: mediaItemLoading || catalogLoading || groupsLoading || platformsLoading,
		mediaItem: details.mediaItem,
		sameNameConfirmationRequested: details.saveStatus === 'REQUIRES_CONFIRMATION',
		draftMediaItem: details.formDraft,
		catalogSearchResults: details.catalogSearchResults,
		catalogDetails: details.catalogDetails,
		selectedGroup: state.groupGlobal.selectedGroup,
		selectedOwnPlatform: state.ownPlatformGlobal.selectedOwnPlatform,
		blockBrowserBack: details.dirty &&
			details.saveStatus !== 'SAVING' &&
			details.saveStatus !== 'SAVED'
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
		persistFormDraft: (mediaItem) => {
			dispatch(setMediaItemFormDraft(mediaItem));
		},
		discardFormDraft: () => {
			dispatch(setMediaItemFormDraft(undefined));
		},
		requestGroupSelection: () => {
			dispatch(requestGroupSelection());
		},
		requestOwnPlatformSelection: () => {
			dispatch(requestOwnPlatformSelection());
		},
		searchMediaItemsCatalog: (term) => {
			dispatch(searchMediaItemsCatalog(term));
		},
		loadMediaItemCatalogDetails: (catalogId) => {
			dispatch(getMediaItemCatalogDetails(catalogId));
		},
		resetMediaItemsCatalogSearch: () => {
			dispatch(resetMediaItemsCatalogSearch());
		}
	};
};

const MediaItemDetailsScreenGuardedComponent = (props: MediaItemDetailsScreenContainerProps): ReactElement => {
	const {
		blockBrowserBack,
		discardFormDraft,
		...screenProps
	} = props;

	return React.createElement(
		BrowserBackNavigationGuardComponent,
		{
			when: blockBrowserBack,
			title: i18n.t('common.alert.form.exit.title'),
			message: i18n.t('common.alert.form.exit.message'),
			confirmLabel: i18n.t('common.alert.default.okButton'),
			cancelLabel: i18n.t('common.alert.default.cancelButton'),
			onConfirmLeave: discardFormDraft
		},
		React.createElement(MediaItemDetailsScreenComponent, {
			...screenProps,
			discardFormDraft
		})
	);
};

/**
 * Container component that handles Redux state for MediaItemDetailsScreenComponent
 */
export const MediaItemDetailsScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MediaItemDetailsScreenGuardedComponent);
