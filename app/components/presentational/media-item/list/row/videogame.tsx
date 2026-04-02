import { getVideogameMediaItemRowData } from 'app/components/presentational/media-item/list/row/data/videogame';
import { MediaItemRowComponentProps, MediaItemRowViewComponent } from 'app/components/presentational/media-item/list/row/view/media-item';
import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import React, { ReactElement } from 'react';

export const VideogameMediaItemRowComponent = (props: MediaItemRowComponentProps): ReactElement => {
	return (
		<MediaItemRowViewComponent
			{...props}
			rowData={getVideogameMediaItemRowData(props.mediaItem as VideogameInternal)}
		/>
	);
};
