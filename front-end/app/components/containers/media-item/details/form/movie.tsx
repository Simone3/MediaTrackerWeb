import { ReactElement } from 'react';
import { buildCommonMediaItemFormOutput, useCommonMediaItemFormInput } from 'app/components/containers/media-item/details/form/media-item';
import { MovieFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/movie';
import { useContainerOutput } from 'app/redux/hooks';

/**
 * Container component that handles Redux state for MovieFormComponent
 * @returns the connected movie form
 */
export const MovieFormContainer = (): ReactElement => {
	const input = useCommonMediaItemFormInput();
	const output = useContainerOutput(buildCommonMediaItemFormOutput);

	return <MovieFormComponent {...input} {...output} />;
};
