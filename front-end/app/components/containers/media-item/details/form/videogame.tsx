import { ReactElement } from 'react';
import { buildCommonMediaItemFormOutput, useCommonMediaItemFormInput } from 'app/components/containers/media-item/details/form/media-item';
import { VideogameFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/videogame';
import { CommonMediaItemFormComponentInputMain } from 'app/components/presentational/media-item/details/form/wrapper/media-item';
import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import { useContainerOutput } from 'app/redux/hooks';

/**
 * Container component that handles Redux state for VideogameFormComponent
 * @returns the connected videogame form
 */
export const VideogameFormContainer = (): ReactElement => {
	const commonInput = useCommonMediaItemFormInput();
	const output = useContainerOutput(buildCommonMediaItemFormOutput);
	const input: CommonMediaItemFormComponentInputMain<VideogameInternal> = {
		...commonInput,
		initialValues: commonInput.initialValues as VideogameInternal,
		restoredDraft: commonInput.restoredDraft as VideogameInternal | undefined
	};

	return <VideogameFormComponent {...input} {...output} />;
};
