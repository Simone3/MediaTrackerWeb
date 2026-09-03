import { ReactElement } from 'react';
import { buildCommonMediaItemFormOutput, useCommonMediaItemFormInput } from 'app/components/containers/media-item/details/form/media-item';
import { BookFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/book';
import { useContainerOutput } from 'app/redux/hooks';

/**
 * Container component that handles Redux state for BookFormComponent
 * @returns the connected book form
 */
export const BookFormContainer = (): ReactElement => {
	const input = useCommonMediaItemFormInput();
	const output = useContainerOutput(buildCommonMediaItemFormOutput);

	return <BookFormComponent {...input} {...output} />;
};
