import React, { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { BookFormViewComponent } from 'app/components/presentational/media-item/details/form/view/book';
import { BookInternal, DEFAULT_CATALOG_BOOK } from 'app/data/models/internal/media-items/book';
import { CommonMediaItemFormComponent, CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/media-item';
import { bookFormValidationSchema } from 'app/components/presentational/media-item/details/form/data/book';

/**
 * Presentational component that handles the Formik wrapper component for the book form
 */
export class BookFormComponent extends Component<BookFormComponentProps> {

	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			saveRequested,
			notifyFormStatus
		} = this.props;

		return (
			<CommonMediaItemFormComponent
				{...this.props}
				defaultCatalogItem={DEFAULT_CATALOG_BOOK}
				validationSchema={bookFormValidationSchema}>
				{(formikProps: FormikProps<BookInternal>) => {

					return (
						<BookFormViewComponent
							{...formikProps}
							saveRequested={saveRequested}
							notifyFormStatus={notifyFormStatus}
						/>
					);
				}}
			</CommonMediaItemFormComponent>
		);
	}
}

/**
 * BookFormComponent's input props
 */
export type BookFormComponentInput = CommonMediaItemFormComponentInputMain;

/**
 * BookFormComponent's output props
 */
export type BookFormComponentOutput = CommonMediaItemFormComponentOutput;

/**
 * BookFormComponent's props
 */
export type BookFormComponentProps = BookFormComponentInput & BookFormComponentOutput;
