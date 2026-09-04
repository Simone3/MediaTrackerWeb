import { ReactElement, ReactNode } from 'react';
import { Dispatch } from 'redux';
import { BrowserBackNavigationGuardComponent } from 'app/components/presentational/generic/browser-back-navigation-guard';
import { setMediaItemFormDraft } from 'app/redux/actions/media-item/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { hasUnsavedMediaItemFormChanges } from 'app/redux/state/media-item';
import { State } from 'app/redux/state/state';
import { i18n } from 'app/utilities/i18n';

type MediaItemUnsavedChangesGuardProps = {

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

type MediaItemUnsavedChangesGuardInput = {
	hasUnsavedChanges: boolean;
};

type MediaItemUnsavedChangesGuardOutput = {
	discardFormDraft: () => void;
};

const selectInput = (state: State): MediaItemUnsavedChangesGuardInput => {
	return {
		hasUnsavedChanges: hasUnsavedMediaItemFormChanges(state.mediaItemDetails)
	};
};

const buildOutput = (dispatch: Dispatch): MediaItemUnsavedChangesGuardOutput => {
	return {
		discardFormDraft: () => {
			dispatch(setMediaItemFormDraft(undefined));
		}
	};
};

/**
 * Container component that guards every screen of the media item form flow against losing the unsaved form draft
 * @param props the container props
 * @returns the guarded children
 */
export const MediaItemUnsavedChangesGuardContainer = (props: MediaItemUnsavedChangesGuardProps): ReactElement => {
	const {
		interceptBrowserBack,
		children
	} = props;
	const {
		hasUnsavedChanges
	} = useContainerInput(selectInput);
	const {
		discardFormDraft
	} = useContainerOutput(buildOutput);

	return (
		<BrowserBackNavigationGuardComponent
			when={hasUnsavedChanges}
			interceptBrowserBack={interceptBrowserBack}
			title={i18n.t('common.alert.form.exit.title')}
			message={i18n.t('common.alert.form.exit.message')}
			confirmLabel={i18n.t('common.alert.default.okButton')}
			cancelLabel={i18n.t('common.alert.default.cancelButton')}
			onConfirmLeave={discardFormDraft}
		>
			{children}
		</BrowserBackNavigationGuardComponent>
	);
};
