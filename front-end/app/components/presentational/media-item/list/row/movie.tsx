import React, { ReactElement } from 'react';
import { getMovieMediaItemRowData } from 'app/components/presentational/media-item/list/row/data/movie';
import { MediaItemRowComponentProps, MediaItemRowViewComponent } from 'app/components/presentational/media-item/list/row/view/media-item';

export const MovieMediaItemRowComponent = (props: MediaItemRowComponentProps): ReactElement => {
	return (
		<MediaItemRowViewComponent
			{...props}
			rowData={getMovieMediaItemRowData(props.mediaItem)}
		/>
	);
};
