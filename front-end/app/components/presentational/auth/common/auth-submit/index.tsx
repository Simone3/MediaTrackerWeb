import React, { Component, MouseEvent, ReactNode } from 'react';

/**
 * Presentational component to display a submit button for the auth screens
 */
export class AuthSubmitComponent extends Component<AuthSubmitComponentProps> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			text,
			onPress,
			className,
			type = 'button',
			...otherProps
		} = this.props;

		const resolvedClassName = className ? `auth-submit ${className}` : 'auth-submit';

		return (
			<button
				{...otherProps}
				type={type}
				className={resolvedClassName}
				onClick={(event: MouseEvent<HTMLButtonElement>) => {
					if(otherProps.onClick) {
						otherProps.onClick(event);
					}
					if(onPress) {
						onPress(event);
					}
				}}>
				{text}
			</button>
		);
	}
}

/**
 * AuthSubmitComponent's props
 */
export type AuthSubmitComponentProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
	text: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	onPress?: React.MouseEventHandler<HTMLButtonElement>;
};
