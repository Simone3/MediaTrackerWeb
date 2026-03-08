import React, { ReactNode, Component } from 'react';
import { FieldComponent } from 'app/components/presentational/form/fields/generic';
import { SearchTextInputComponent, SearchTextInputComponentInput, SearchTextInputComponentSearchOutput } from 'app/components/presentational/form/components/text-input-search';

/**
 * Formik wrapper of SearchTextInputComponent
 */
export class SearchTextInputFieldComponent extends Component<SearchTextInputFieldComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			name
		} = this.props;

		return (
			<FieldComponent name={name}>
				{(field, status) => {
					return (
						<SearchTextInputComponent
							{...this.props}
							status={status}
							currentText={field.value}
							onTextChange={field.setValue}
							onFocus={field.onFocus}
							onBlur={field.onBlur}
						/>
					);
				}}
			</FieldComponent>
		);
	}
}

/**
 * SearchTextInputFieldComponent's input props
 */
export type SearchTextInputFieldComponentInput = Omit<SearchTextInputComponentInput, 'currentText' | 'status' > & {

	/**
	 * The input name (unique in the form)
	 */
	name: string;
}

/**
 * SearchTextInputFieldComponent's output props
 */
export type SearchTextInputFieldComponentOutput = SearchTextInputComponentSearchOutput;

/**
 * SearchTextInputFieldComponent's props
 */
export type SearchTextInputFieldComponentProps = SearchTextInputFieldComponentInput & SearchTextInputFieldComponentOutput;
