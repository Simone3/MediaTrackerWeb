import React, { ReactElement } from 'react';
import { MediaItemUnsavedChangesGuardContainer } from 'app/components/containers/media-item/details/unsaved-changes-guard';
import { MediaItemDetailsScreenComponent } from 'app/components/presentational/media-item/details/screen';

/**
 * Container component that guards the media item form against losing unsaved changes
 * @returns the guarded media item details screen
 */
export const MediaItemDetailsScreenContainer = (): ReactElement => {
	return React.createElement(
		MediaItemUnsavedChangesGuardContainer,
		{},
		React.createElement(MediaItemDetailsScreenComponent)
	);
};
