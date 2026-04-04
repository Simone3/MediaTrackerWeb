import React, { Component, MouseEvent, ReactNode } from 'react';

/**
 * Presentational component to display a redirect link for the auth screens
 */
export class AuthLinkComponent extends Component<AuthLinkComponentProps> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			text,
			onPress,
			className,
			...otherProps
		} = this.props;

		const resolvedClassName = className ? `auth-link ${className}` : 'auth-link';

		return (
			<button
				{...otherProps}
				type='button'
				className={resolvedClassName}
				onClick={(event: MouseEvent<HTMLButtonElement>) => {
					if (otherProps.onClick) {
						otherProps.onClick(event);
					}
					if (onPress) {
						onPress(event);
					}
				}}>
				{text}
			</button>
		);
	}
}

/**
 * AuthLinkComponent's props
 */
export type AuthLinkComponentProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
	text: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	onPress?: React.MouseEventHandler<HTMLButtonElement>;
};
