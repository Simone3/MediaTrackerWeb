import React, { ChangeEvent, Component, ReactNode } from 'react';

/**
 * Presentational component to display a text input for the auth screens
 */
export class AuthTextInputComponent extends Component<AuthTextInputComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			onChangeText,
			secureTextEntry,
			className,
			type,
			...otherProps
		} = this.props;

		const resolvedType = secureTextEntry ? 'password' : type || 'text';
		const resolvedClassName = className ? `auth-input ${className}` : 'auth-input';

		return (
			<input
				{...otherProps}
				type={resolvedType}
				className={resolvedClassName}
				onChange={(event: ChangeEvent<HTMLInputElement>) => {
					if(otherProps.onChange) {
						otherProps.onChange(event);
					}
					if(onChangeText) {
						onChangeText(event.target.value);
					}
				}}
			/>
		);
	}
}

/**
 * AuthTextInputComponent's props
 */
export type AuthTextInputComponentProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onChangeText?: (value: string) => void;
	secureTextEntry?: boolean;
};
