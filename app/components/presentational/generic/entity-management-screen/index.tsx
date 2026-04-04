import { CSSProperties, ReactElement, ReactNode, useEffect, useState } from 'react';
import { FABComponent } from 'app/components/presentational/generic/floating-action-button';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { MOBILE_LAYOUT_BREAKPOINT } from 'app/utilities/layout';

/**
 * Shared screen shell for the dark entity-management pages.
 * @param props the input props
 * @returns the component
 */
export const EntityManagementScreenComponent = (props: EntityManagementScreenComponentProps): ReactElement => {
	const [ isMobileLayout, setIsMobileLayout ] = useState<boolean>(() => {
		return window.innerWidth <= MOBILE_LAYOUT_BREAKPOINT;
	});

	useEffect(() => {
		const handleResize = (): void => {
			const nextIsMobileLayout = window.innerWidth <= MOBILE_LAYOUT_BREAKPOINT;
			setIsMobileLayout((currentIsMobileLayout) => {
				return currentIsMobileLayout === nextIsMobileLayout ? currentIsMobileLayout : nextIsMobileLayout;
			});
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const defaultAddAction = !isMobileLayout && props.onAdd && props.addButtonLabel ?
		(
			<PillButtonComponent tone='secondary' onClick={props.onAdd}>
				+ {props.addButtonLabel}
			</PillButtonComponent>
		) :
		null;
	const headerActions = props.renderHeaderActions ?
		props.renderHeaderActions({
			defaultAddAction,
			isMobileLayout
		}) :
		defaultAddAction;

	return (
		<section
			className={`entity-management-screen ${props.screenClassName}`}
			style={{ '--entity-management-accent': props.accentColor } as CSSProperties}>
			<div className='entity-management-screen-content'>
				<header className='entity-management-screen-header'>
					<div className='entity-management-screen-heading'>
						<div className='entity-management-screen-title-row'>
							<span className='entity-management-screen-icon-shell' aria-hidden={true}>
								{props.icon}
							</span>
							<div className='entity-management-screen-title-copy'>
								<h1 className='entity-management-screen-title'>{props.title}</h1>
								<p className='entity-management-screen-count'>{props.countLabel}</p>
							</div>
						</div>
					</div>
					{headerActions}
				</header>
				{props.children}
			</div>
			{isMobileLayout && props.onAdd &&
				<FABComponent
					text='+'
					onPress={props.onAdd}
				/>}
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
	icon: ReactNode;
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
	isMobileLayout: boolean;
};
