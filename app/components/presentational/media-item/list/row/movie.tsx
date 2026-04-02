import { getMovieMediaItemRowData } from 'app/components/presentational/media-item/list/row/data/movie';
import { MediaItemRowComponentProps, MediaItemRowViewComponent } from 'app/components/presentational/media-item/list/row/view/media-item';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import React, { ReactElement } from 'react';

export const MovieMediaItemRowComponent = (props: MediaItemRowComponentProps): ReactElement => {
	return (
		<MediaItemRowViewComponent
			{...props}
			rowData={getMovieMediaItemRowData(props.mediaItem as MovieInternal)}
		/>
	);
};
