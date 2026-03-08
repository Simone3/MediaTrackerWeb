import { styles } from 'app/components/presentational/form/helpers/multiple-input/styles';
import { GenericMultipleInputComponent } from 'app/components/presentational/form/helpers/multiple-input';
import { DatePickerComponent } from 'app/components/presentational/form/components/date-picker';
import React, { ReactNode, Component } from 'react';
import { i18n } from 'app/utilities/i18n';
import { FormInputComponentInput, FormInputComponentOutput } from 'app/components/presentational/form/components/generic';
import { View } from 'react-native';
import { config } from 'app/config/config';
import { format } from 'date-fns';

/**
 * Presentational component to display a multiple date input (result is array of user-defined dates)
 */
export class MultiDateInputComponent extends Component<MultiDateInputComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<GenericMultipleInputComponent<Date | undefined>
				{...this.props}
				defaultInputValue={undefined}
				onValidityCheck={this.onValidityCheck}
				onBuildDisplayString={this.onBuildDisplayString}
				onBuildInput={this.onBuildInput.bind(this)}
				onValuesChange={this.onValuesChange.bind(this)}
			/>
		);
	}

	private onValidityCheck(values: (Date | undefined)[]): boolean {

		return values.length === 1 || !values.some((value) => {
			return !value;
		});
	}

	private onBuildDisplayString(values: (Date | undefined)[]): string {

		return values.map((date) => {
			return date ? format(date, config.ui.dateFormat) : '';
		}).join(', ');
	}

	private onBuildInput(value: (Date | undefined), onValueChange: (newValue: (Date | undefined)) => void): ReactNode {
		
		return (
			<View style={styles.modalInput}>
				<DatePickerComponent
					placeholder={i18n.t('common.form.input.multiDate.placeholder')}
					currentDate={value}
					onSelectDate={onValueChange}
					status='DEFAULT'
					onFocus={() => {
						// Do nothing for now
					}}
					onBlur={() => {
						// Do nothing for now
					}}
					hideIconAndStatus={true}
				/>
			</View>
		);
	}

	private onValuesChange(values: (Date | undefined)[]): void {

		// Can only be Date[] because of onValidityCheck()
		this.props.onValuesChange(values as Date[]);
	}
}

/**
 * MultiDateInputComponent's input props
 */
export type MultiDateInputComponentInput = FormInputComponentInput & {

	/**
	 * The current value
	 */
	currentValues: Date[] | undefined;

	/**
	 * The text placeholder
	 */
	placeholder: string;
}

/**
 * MultiDateInputComponent's output props
 */
export type MultiDateInputComponentOutput = FormInputComponentOutput;

/**
 * MultiDateInputComponent's props
 */
export type MultiDateInputComponentProps = MultiDateInputComponentInput & MultiDateInputComponentOutput & {

	/**
	 * Notifies input value change
	 */
	onValuesChange: (values: Date[]) => void;
}

