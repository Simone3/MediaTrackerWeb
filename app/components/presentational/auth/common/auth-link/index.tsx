import { styles } from 'app/components/presentational/auth/common/auth-link/styles';
import React, { ReactNode, Component } from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

/**
 * Presentational component to display a redirect link for the auth screens
 */
export class AuthLinkComponent extends Component<AuthLinkComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<TouchableOpacity {...this.props}>
				<Text style={styles.link}>
					{this.props.text}
				</Text>
			</TouchableOpacity>
		);
	}
}

/**
 * AuthLinkComponent's props
 */
export type AuthLinkComponentProps = TouchableOpacityProps & {

	/**
	 * The button text
	 */
	text: string;
};
