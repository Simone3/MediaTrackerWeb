import { ReactElement, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import appLogo from 'app/resources/images/ic_app_logo.png';
import settingsIcon from 'app/resources/images/ic_settings.svg';
import { i18n } from 'app/utilities/i18n';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens, AppSections } from 'app/utilities/screens';

const homePath = screenToPath(AppSections.Media);
const settingsPath = screenToPath(AppScreens.Settings);

/**
 * Shared top header for authenticated screens.
 * @param props the input props
 * @returns the component
 */
export const AuthenticatedPageHeaderComponent = (props: AuthenticatedPageHeaderComponentProps): ReactElement => {
	const homeLabel = i18n.t('common.drawer.home');
	const settingsLabel = i18n.t('common.drawer.settings');

	return (
		<header className='authenticated-page-header'>
			<div className='authenticated-page-header-main'>
				<div className='authenticated-page-header-leading'>
					<NavLink
						to={homePath}
						title={homeLabel}
						aria-label={homeLabel}
						className='authenticated-page-header-link authenticated-page-header-home-link'>
						<img src={appLogo} alt='' aria-hidden='true' className='authenticated-page-header-home-logo' />
					</NavLink>
					<div className='authenticated-page-header-copy'>
						<h1 className='authenticated-page-header-title'>{props.title}</h1>
						<p
							className={props.subtitle ?
								'authenticated-page-header-subtitle' :
								'authenticated-page-header-subtitle authenticated-page-header-subtitle-empty'}
							aria-hidden={props.subtitle ? undefined : true}>
							{props.subtitle ? props.subtitle : '\u00A0'}
						</p>
					</div>
				</div>
				<div className='authenticated-page-header-actions'>
					{props.actions}
					{props.showSettingsShortcut &&
						<NavLink
							to={settingsPath}
							title={settingsLabel}
							aria-label={settingsLabel}
							className='authenticated-page-header-link authenticated-page-header-settings-link'>
							<img src={settingsIcon} alt='' aria-hidden='true' className='authenticated-page-header-link-icon' />
						</NavLink>}
				</div>
			</div>
		</header>
	);
};

export type AuthenticatedPageHeaderComponentProps = {
	title: string;
	actions?: ReactNode;
	showSettingsShortcut?: boolean;
	subtitle?: string;
};
