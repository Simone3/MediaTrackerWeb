import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { BrowserBackNavigationGuardComponent } from 'app/components/presentational/generic/browser-back-navigation-guard';
import { MediaItemDetailsScreenComponent } from 'app/components/presentational/media-item/details/screen';
import { setMediaItemFormDraft } from 'app/redux/actions/media-item/generators';
import { State } from 'app/redux/state/state';
import { i18n } from 'app/utilities/i18n';

type MediaItemDetailsScreenContainerStateProps = {
	blockBrowserBack: boolean;
};

type MediaItemDetailsScreenContainerDispatchProps = {
	discardFormDraft: () => void;
};

type MediaItemDetailsScreenContainerProps = MediaItemDetailsScreenContainerStateProps & MediaItemDetailsScreenContainerDispatchProps;

const mapStateToProps = (state: State): MediaItemDetailsScreenContainerStateProps => {
	const details = state.mediaItemDetails;

	return {
		blockBrowserBack: details.dirty &&
			details.saveStatus !== 'SAVING' &&
			details.saveStatus !== 'SAVED'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): MediaItemDetailsScreenContainerDispatchProps => {
	return {
		discardFormDraft: () => {
			dispatch(setMediaItemFormDraft(undefined));
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
		React.createElement(MediaItemDetailsScreenComponent, screenProps)
	);
};

/**
 * Container component that handles Redux state for MediaItemDetailsScreenComponent
 */
export const MediaItemDetailsScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MediaItemDetailsScreenGuardedComponent);
