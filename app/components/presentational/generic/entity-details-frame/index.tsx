import { CSSProperties, SubmitEventHandler, ReactElement, ReactNode } from 'react';
import { AuthenticatedPageHeaderComponent } from 'app/components/presentational/generic/authenticated-page-header';
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
				<AuthenticatedPageHeaderComponent
					title={props.title}
					subtitle={props.subtitle}
					actions={
						<PillButtonComponent
							tone='primary'
							size='compact'
							loadingVisible={props.saveLoadingVisible}
							disabled={props.saveDisabled}
							onClick={props.onSave}>
							{props.saveLabel}
						</PillButtonComponent>
					}
				/>
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
	title: string;
	saveLabel: string;
	saveDisabled: boolean;
	children: ReactNode;
	onSave: () => void;
	onSubmit: SubmitEventHandler<HTMLFormElement>;
	dialogs?: ReactNode;
	loadingVisible?: boolean;
	saveLoadingVisible?: boolean;
	subtitle?: string;
};
