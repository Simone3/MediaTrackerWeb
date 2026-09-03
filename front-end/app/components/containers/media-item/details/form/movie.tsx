import { ReactElement } from 'react';
import { buildCommonMediaItemFormOutput, useCommonMediaItemFormInput } from 'app/components/containers/media-item/details/form/media-item';
import { MovieFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/movie';
import { CommonMediaItemFormComponentInputMain } from 'app/components/presentational/media-item/details/form/wrapper/media-item';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import { useContainerOutput } from 'app/redux/hooks';

/**
 * Container component that handles Redux state for MovieFormComponent
 * @returns the connected movie form
 */
export const MovieFormContainer = (): ReactElement => {
	const commonInput = useCommonMediaItemFormInput();
	const output = useContainerOutput(buildCommonMediaItemFormOutput);
	const input: CommonMediaItemFormComponentInputMain<MovieInternal> = {
		...commonInput,
		initialValues: commonInput.initialValues as MovieInternal,
		restoredDraft: commonInput.restoredDraft as MovieInternal | undefined
	};

	return <MovieFormComponent {...input} {...output} />;
};
