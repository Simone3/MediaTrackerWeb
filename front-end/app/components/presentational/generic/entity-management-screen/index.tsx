import { CSSProperties, ReactElement, ReactNode } from 'react';
import { AuthenticatedPageHeaderComponent } from 'app/components/presentational/generic/authenticated-page-header';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { ResponsiveHeaderAddButtonComponent } from 'app/components/presentational/generic/responsive-header-add-button';
import { i18n } from 'app/utilities/i18n';

/**
 * Shared screen shell for the dark entity-management pages.
 * @param props the input props
 * @returns the component
 */
export const EntityManagementScreenComponent = (props: EntityManagementScreenComponentProps): ReactElement => {
	const defaultAddAction = props.onAdd && props.addButtonLabel ?
		(
			<ResponsiveHeaderAddButtonComponent
				label={props.addButtonLabel}
				mobileLabel={i18n.t('common.buttons.add')}
				onClick={props.onAdd}
			/>
		) :
		null;
	const headerActions = props.renderHeaderActions ?
		props.renderHeaderActions({
			defaultAddAction
		}) :
		defaultAddAction;

	return (
		<section
			className={`entity-management-screen ${props.screenClassName}`}
			style={{ '--entity-management-accent': props.accentColor } as CSSProperties}>
			<div className='entity-management-screen-content'>
				<AuthenticatedPageHeaderComponent
					title={props.title}
					subtitle={props.countLabel}
					actions={headerActions}
				/>
				{props.children}
			</div>
			{props.loadingVisible !== undefined &&
				<LoadingIndicatorComponent
					visible={props.loadingVisible}
					fullScreen={false}
				/>}
		</section>
	);
};

export type EntityManagementScreenComponentProps = {
	screenClassName: string;
	accentColor: string;
	title: string;
	countLabel: string;
	children: ReactNode;
	addButtonLabel?: string;
	loadingVisible?: boolean;
	onAdd?: () => void;
	renderHeaderActions?: (context: EntityManagementHeaderActionsContext) => ReactNode;
};

type EntityManagementHeaderActionsContext = {
	defaultAddAction: ReactNode;
};
