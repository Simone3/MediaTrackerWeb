import { CSSProperties, SubmitEventHandler, ReactElement, ReactNode } from 'react';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';

/**
 * Shared shell for the entity-details forms.
 * @param props the input props
 * @returns the component
 */
export const EntityDetailsFrameComponent = (props: EntityDetailsFrameComponentProps): ReactElement => {
	return (
		<section
			className={`entity-details-screen ${props.screenClassName}`}
			style={{ '--entity-details-accent': props.accentColor } as CSSProperties}>
			<div className='entity-details-screen-content'>
				<header className='entity-details-hero'>
					<div className='entity-details-heading'>
						<div className='entity-details-title-row'>
							<span className='entity-details-icon-shell' aria-hidden={true}>
								{props.icon}
							</span>
							<div className='entity-details-title-copy'>
								<h1 className='entity-details-title'>{props.title}</h1>
								{props.subtitle && <p className='entity-details-subtitle'>{props.subtitle}</p>}
							</div>
						</div>
					</div>
					<div className='entity-details-actions'>
						<PillButtonComponent
							tone='primary'
							disabled={props.saveDisabled}
							onClick={props.onSave}>
							{props.saveLabel}
						</PillButtonComponent>
					</div>
				</header>
				<form
					className='entity-details-form'
					onSubmit={props.onSubmit}>
					<div className='entity-details-main'>
						{props.children}
					</div>
				</form>
			</div>
			{props.dialogs}
			{props.loadingVisible !== undefined &&
				<LoadingIndicatorComponent
					visible={props.loadingVisible}
					fullScreen={false}
				/>}
		</section>
	);
};

export type EntityDetailsFrameComponentProps = {
	screenClassName: string;
	accentColor: string;
	icon: ReactNode;
	title: string;
	saveLabel: string;
	saveDisabled: boolean;
	children: ReactNode;
	onSave: () => void;
	onSubmit: SubmitEventHandler<HTMLFormElement>;
	dialogs?: ReactNode;
	loadingVisible?: boolean;
	subtitle?: string;
};
