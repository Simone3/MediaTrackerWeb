import React, { ReactElement } from 'react';
import { getBookMediaItemRowData } from 'app/components/presentational/media-item/list/row/data/book';
import { MediaItemRowComponentProps, MediaItemRowViewComponent } from 'app/components/presentational/media-item/list/row/view/media-item';

export const BookMediaItemRowComponent = (props: MediaItemRowComponentProps): ReactElement => {
	return (
		<MediaItemRowViewComponent
			{...props}
			rowData={getBookMediaItemRowData(props.mediaItem)}
		/>
	);
};
