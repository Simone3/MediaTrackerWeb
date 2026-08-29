import React, { ReactElement, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { BrowserBackNavigationGuardComponent } from 'app/components/presentational/generic/browser-back-navigation-guard';
import { setMediaItemFormDraft } from 'app/redux/actions/media-item/generators';
import { hasUnsavedMediaItemFormChanges } from 'app/redux/state/media-item';
import { State } from 'app/redux/state/state';
import { i18n } from 'app/utilities/i18n';

type MediaItemUnsavedChangesGuardOwnProps = {

	/**
	 * If true (the default), the first browser back attempt is intercepted too. The screens opened from the media item form (group,
	 * own platform and TV show season selection) set it to false, since going back from them returns to the form with the draft intact
	 */
	interceptBrowserBack?: boolean;

	/**
	 * The guarded screen
	 */
	children?: ReactNode;
};

type MediaItemUnsavedChangesGuardStateProps = {
	hasUnsavedChanges: boolean;
};

type MediaItemUnsavedChangesGuardDispatchProps = {
	discardFormDraft: () => void;
};

type MediaItemUnsavedChangesGuardProps = MediaItemUnsavedChangesGuardOwnProps & MediaItemUnsavedChangesGuardStateProps & MediaItemUnsavedChangesGuardDispatchProps;

const mapStateToProps = (state: State): MediaItemUnsavedChangesGuardStateProps => {
	return {
		hasUnsavedChanges: hasUnsavedMediaItemFormChanges(state.mediaItemDetails)
	};
};

const mapDispatchToProps = (dispatch: Dispatch): MediaItemUnsavedChangesGuardDispatchProps => {
	return {
		discardFormDraft: () => {
			dispatch(setMediaItemFormDraft(undefined));
		}
	};
};

const MediaItemUnsavedChangesGuardWrapperComponent = (props: MediaItemUnsavedChangesGuardProps): ReactElement => {
	const {
		hasUnsavedChanges,
		interceptBrowserBack,
		discardFormDraft,
		children
	} = props;

	return React.createElement(
		BrowserBackNavigationGuardComponent,
		{
			when: hasUnsavedChanges,
			interceptBrowserBack: interceptBrowserBack,
			title: i18n.t('common.alert.form.exit.title'),
			message: i18n.t('common.alert.form.exit.message'),
			confirmLabel: i18n.t('common.alert.default.okButton'),
			cancelLabel: i18n.t('common.alert.default.cancelButton'),
			onConfirmLeave: discardFormDraft
		},
		children
	);
};

/**
 * Container component that guards every screen of the media item form flow against losing the unsaved form draft
 */
export const MediaItemUnsavedChangesGuardContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MediaItemUnsavedChangesGuardWrapperComponent);
