import React, { ReactElement } from 'react';
import { getVideogameMediaItemRowData } from 'app/components/presentational/media-item/list/row/data/videogame';
import { MediaItemRowComponentProps, MediaItemRowViewComponent } from 'app/components/presentational/media-item/list/row/view/media-item';

export const VideogameMediaItemRowComponent = (props: MediaItemRowComponentProps): ReactElement => {
	return (
		<MediaItemRowViewComponent
			{...props}
			rowData={getVideogameMediaItemRowData(props.mediaItem)}
		/>
	);
};
