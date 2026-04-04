import { Component, ReactNode } from 'react';
import { CategoryInternal, MediaTypeInternal } from 'app/data/models/internal/category';
import { AppError } from 'app/data/models/internal/error';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';

/**
 * Presentational component to display the correct component based on a media type
 */
export class MediaTypeSwitcherComponent extends Component<MediaTypeSwitcherComponentProps> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		const mediaType = this.parseDiscriminator();

		switch(mediaType) {
			case 'BOOK':
				return this.props.book;

			case 'MOVIE':
				return this.props.movie;

			case 'TV_SHOW':
				return this.props.tvShow;

			case 'VIDEOGAME':
				return this.props.videogame;

			default:
				throw AppError.GENERIC.withDetails(`Media switcher does not support ${String(mediaType)} media type`);
		}
	}

	/**
	 * Helper to get the actual media type enum from the discriminator
	 * @returns the media type
	 */
	private parseDiscriminator(): MediaTypeInternal {
		const {
			discriminator
		} = this.props;

		if(typeof discriminator === 'string') {
			return discriminator;
		}

		return discriminator.mediaType;
	}
}

/**
 * MediaTypeSwitcherComponent's input props
 */
export type MediaTypeSwitcherComponentInput = {
	/**
	 * The media type source
	 */
	discriminator: CategoryInternal | MediaTypeInternal | MediaItemInternal;

	/**
	 * The component to display for books
	 */
	book: ReactNode;

	/**
	 * The component to display for movies
	 */
	movie: ReactNode;

	/**
	 * The component to display for TV shows
	 */
	tvShow: ReactNode;

	/**
	 * The component to display for videogames
	 */
	videogame: ReactNode;
};

/**
 * MediaTypeSwitcherComponent's props
 */
export type MediaTypeSwitcherComponentProps = MediaTypeSwitcherComponentInput;
