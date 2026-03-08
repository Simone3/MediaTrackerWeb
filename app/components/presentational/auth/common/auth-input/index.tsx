import { styles } from 'app/components/presentational/auth/common/auth-input/styles';
import React, { ReactNode, Component } from 'react';
import { TextInput, TextInputProps, StyleSheet, TextStyle } from 'react-native';

/**
 * Presentational component to display a text input for the auth screens
 */
export class AuthTextInputComponent extends Component<AuthTextInputComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<TextInput
				{...this.props}
				style={StyleSheet.compose<TextStyle, TextStyle, TextStyle>(styles.input, this.props.style)}
			/>
		);
	}
}

/**
 * AuthTextInputComponent's props
 */
export type AuthTextInputComponentProps = TextInputProps;
