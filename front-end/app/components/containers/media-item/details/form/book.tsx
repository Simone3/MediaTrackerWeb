import { ReactElement } from 'react';
import { buildCommonMediaItemFormOutput, useCommonMediaItemFormInput } from 'app/components/containers/media-item/details/form/media-item';
import { BookFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/book';
import { CommonMediaItemFormComponentInputMain } from 'app/components/presentational/media-item/details/form/wrapper/media-item';
import { BookInternal } from 'app/data/models/internal/media-items/book';
import { useContainerOutput } from 'app/redux/hooks';

/**
 * Container component that handles Redux state for BookFormComponent
 * @returns the connected book form
 */
export const BookFormContainer = (): ReactElement => {
	const commonInput = useCommonMediaItemFormInput();
	const output = useContainerOutput(buildCommonMediaItemFormOutput);
	const input: CommonMediaItemFormComponentInputMain<BookInternal> = {
		...commonInput,
		initialValues: commonInput.initialValues as BookInternal,
		restoredDraft: commonInput.restoredDraft as BookInternal | undefined
	};

	return <BookFormComponent {...input} {...output} />;
};
