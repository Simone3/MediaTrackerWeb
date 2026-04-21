import React, { Component, ReactNode } from 'react';
import { i18n } from 'app/utilities/i18n';
import appLogo from 'app/resources/images/ic_app_logo.png';

/**
 * Presentational component to display the app title with the app logo
 */
export class AppTitleComponent extends Component<AppTitleComponentProps> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			className,
			style
		} = this.props;

		const resolvedClassName = className ? `auth-title ${className}` : 'auth-title';

		return (
			<div className={resolvedClassName} style={style}>
				<span className='auth-title-logo-shell'>
					<img src={appLogo} alt={i18n.t('common.app.name')} className='auth-title-logo' />
				</span>
				<h1 className='auth-title-text'>{i18n.t('common.app.name')}</h1>
			</div>
		);
	}
}

/**
 * AppTitleComponent's props
 */
export type AppTitleComponentProps = {
	className?: string;
	style?: React.CSSProperties;
};
