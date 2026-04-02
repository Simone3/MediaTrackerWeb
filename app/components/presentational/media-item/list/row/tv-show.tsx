import { getTvShowMediaItemRowData } from 'app/components/presentational/media-item/list/row/data/tv-show';
import { MediaItemRowComponentProps, MediaItemRowViewComponent } from 'app/components/presentational/media-item/list/row/view/media-item';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import React, { ReactElement } from 'react';

export const TvShowMediaItemRowComponent = (props: MediaItemRowComponentProps): ReactElement => {
	return (
		<MediaItemRowViewComponent
			{...props}
			rowData={getTvShowMediaItemRowData(props.mediaItem as TvShowInternal)}
		/>
	);
};
