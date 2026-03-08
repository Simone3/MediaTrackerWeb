import React, { ReactNode, Component } from 'react';
import { FieldComponent } from 'app/components/presentational/form/fields/generic';
import { TvShowSeasonHandlerComponent, TvShowSeasonHandlerComponentInput, TvShowSeasonHandlerComponentOutput } from 'app/components/presentational/form/components/tv-show-season-handler';

/**
 * Formik wrapper of TvShowSeasonHandlerComponent
 */
export class TvShowSeasonHandlerFieldComponent extends Component<TvShowSeasonHandlerFieldComponentProps> {
	
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
						<TvShowSeasonHandlerComponent
							{...this.props}
							status={status}
							seasons={field.value}
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
 * TvShowSeasonHandlerFieldComponent's input props
 */
export type TvShowSeasonHandlerFieldComponentInput = Omit<TvShowSeasonHandlerComponentInput, 'seasons' | 'status'> & {

	/**
	 * The input name (unique in the form)
	 */
	name: string;
}

/**
 * TvShowSeasonHandlerFieldComponent's output props
 */
export type TvShowSeasonHandlerFieldComponentOutput = Omit<TvShowSeasonHandlerComponentOutput, 'onFocus' | 'onBlur'>;

/**
 * TvShowSeasonHandlerFieldComponent's props
 */
export type TvShowSeasonHandlerFieldComponentProps = TvShowSeasonHandlerFieldComponentInput & TvShowSeasonHandlerFieldComponentOutput;

