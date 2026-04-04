import { Component, ReactNode } from 'react';
import { MediaItemFormSwitcherContainer } from 'app/components/containers/media-item/details/form/switcher';

/**
 * Presentational component that contains the whole "media item details" screen, that works as the "add new media item", "update media item" and
 * "view media item data" sections
 */
export class MediaItemDetailsScreenComponent extends Component {
	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<MediaItemFormSwitcherContainer/>
		);
	}
}

/**
 * MediaItemDetailsScreenComponent's input props
 */
export type MediaItemDetailsScreenComponentInput = Record<string, never>;

/**
 * MediaItemDetailsScreenComponent's output props
 */
export type MediaItemDetailsScreenComponentOutput = Record<string, never>;
