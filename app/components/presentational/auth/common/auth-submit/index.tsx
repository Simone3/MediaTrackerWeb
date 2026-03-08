import { styles } from 'app/components/presentational/auth/common/auth-submit/styles';
import React, { ReactNode, Component } from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

/**
 * Presentational component to display a submit button for the auth screens
 */
export class AuthSubmitComponent extends Component<AuthSubmitComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<TouchableOpacity {...this.props}>
				<Text style={this.props.disabled ? [ styles.submit, styles.submitDisabled ] : styles.submit}>
					{this.props.text}
				</Text>
			</TouchableOpacity>
		);
	}
}

/**
 * AuthSubmitComponent's props
 */
export type AuthSubmitComponentProps = TouchableOpacityProps & {

	/**
	 * The button text
	 */
	text: string;
};
