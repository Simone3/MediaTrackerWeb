import { ReactElement } from 'react';
import { buildCommonMediaItemFormOutput, useCommonMediaItemFormInput } from 'app/components/containers/media-item/details/form/media-item';
import { VideogameFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/videogame';
import { useContainerOutput } from 'app/redux/hooks';

/**
 * Container component that handles Redux state for VideogameFormComponent
 * @returns the connected videogame form
 */
export const VideogameFormContainer = (): ReactElement => {
	const input = useCommonMediaItemFormInput();
	const output = useContainerOutput(buildCommonMediaItemFormOutput);

	return <VideogameFormComponent {...input} {...output} />;
};
