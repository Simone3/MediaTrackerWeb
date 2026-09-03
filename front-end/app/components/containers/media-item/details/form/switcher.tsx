import { ReactElement } from 'react';
import { MediaItemFormSwitcherComponent, MediaItemFormSwitcherComponentProps } from 'app/components/presentational/media-item/details/form/switcher';
import { AppError } from 'app/data/models/internal/error';
import { useContainerInput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';

const selectInput = (state: State): MediaItemFormSwitcherComponentProps => {
	if(!state.mediaItemDetails.mediaItem) {
		throw AppError.GENERIC.withDetails('App navigated to the media item details screen with undefined details');
	}

	return {
		mediaItem: state.mediaItemDetails.mediaItem
	};
};

/**
 * Container component that selects the correct media-item form container
 * @returns the form matching the media item being edited
 */
export const MediaItemFormSwitcherContainer = (): ReactElement => {
	const input = useContainerInput(selectInput);

	return <MediaItemFormSwitcherComponent {...input} />;
};
