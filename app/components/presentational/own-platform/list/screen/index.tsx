import React, { Component, ReactNode } from 'react';
import { FABComponent } from 'app/components/presentational/generic/floating-action-button';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole "own platforms list" screen, that lists all user own platforms
 */
export class OwnPlatformsListScreenComponent extends Component<OwnPlatformsListScreenComponentInput & OwnPlatformsListScreenComponentOutput> {
	/**
	 * @override
	 */
	public componentDidMount(): void {
		this.requestFetchIfRequired();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(): void {
		this.requestFetchIfRequired();
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			ownPlatforms,
			selectedOwnPlatformId,
			isLoading
		} = this.props;

		return (
			<section className='own-platforms-screen'>
				<div className='own-platforms-list'>
					<div className='own-platforms-list-header'>
						<h1 className='own-platforms-list-title'>{i18n.t('ownPlatform.list.title')}</h1>
						<div className='own-platforms-list-header-actions'>
							<button type='button' className='own-platforms-list-secondary' onClick={this.props.goBack}>
								Back
							</button>
							<button type='button' className='own-platforms-list-refresh' onClick={this.props.refreshOwnPlatforms}>
								Refresh
							</button>
						</div>
					</div>
					<ul className='own-platforms-list-items'>
						<li className='own-platforms-list-item own-platforms-list-item-none'>
							<button
								type='button'
								className={selectedOwnPlatformId ? 'own-platforms-list-row' : 'own-platforms-list-row own-platforms-list-row-selected'}
								onClick={() => {
									this.props.selectOwnPlatform(undefined);
								}}>
								{i18n.t('ownPlatform.list.none')}
							</button>
						</li>
						{ownPlatforms.map((ownPlatform: OwnPlatformInternal) => {
							const selected = ownPlatform.id === selectedOwnPlatformId;
							const rowClass = selected ? 'own-platforms-list-row own-platforms-list-row-selected' : 'own-platforms-list-row';
							return (
								<li key={ownPlatform.id} className='own-platforms-list-item'>
									<button
										type='button'
										className={rowClass}
										onClick={() => {
											this.props.selectOwnPlatform(ownPlatform);
										}}>
										<span className='own-platforms-list-row-color' style={{ backgroundColor: ownPlatform.color }} />
										<span>{ownPlatform.name}</span>
									</button>
									<button
										type='button'
										className='own-platforms-list-options'
										onClick={() => {
											this.props.editOwnPlatform(ownPlatform);
										}}
										aria-label={`Edit ${ownPlatform.name}`}>
										{i18n.t('ownPlatform.list.edit')}
									</button>
									<button
										type='button'
										className='own-platforms-list-options own-platforms-list-options-danger'
										onClick={() => {
											this.requestDeleteOwnPlatform(ownPlatform);
										}}
										aria-label={`Delete ${ownPlatform.name}`}>
										{i18n.t('ownPlatform.list.delete')}
									</button>
								</li>
							);
						})}
					</ul>
					{ownPlatforms.length === 0 && <p className='own-platforms-list-empty'>{i18n.t('ownPlatform.list.empty')}</p>}
				</div>
				<FABComponent
					text='+'
					onPress={() => {
						this.props.loadNewOwnPlatformDetails();
					}}
				/>
				<LoadingIndicatorComponent
					visible={isLoading}
					fullScreen={false}
				/>
			</section>
		);
	}

	/**
	 * Helper to invoke the fetch callback if the input fetch flag is true
	 */
	private requestFetchIfRequired(): void {
		if(this.props.requiresFetch) {
			this.props.fetchOwnPlatforms();
		}
	}

	/**
	 * Handles delete flow for an own platform
	 * @param ownPlatform the own platform
	 */
	private requestDeleteOwnPlatform(ownPlatform: OwnPlatformInternal): void {
		const title = i18n.t('ownPlatform.common.alert.delete.title');
		const message = i18n.t('ownPlatform.common.alert.delete.message', { name: ownPlatform.name });

		// Keep native confirm for phase 2 to preserve existing blocking UX with minimal migration risk.
		// eslint-disable-next-line no-alert
		const confirmed = window.confirm(`${title}\n\n${message}`);
		if(confirmed) {
			this.props.deleteOwnPlatform(ownPlatform);
		}
	}
}

/**
 * OwnPlatformsListScreenComponent's input props
 */
export type OwnPlatformsListScreenComponentInput = {
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Flag to tell if the own platforms list requires a fetch. If so, on startup or on update the component will invoke the fetch callback.
	 */
	requiresFetch: boolean;

	/**
	 * Own platforms list to display
	 */
	ownPlatforms: OwnPlatformInternal[];

	/**
	 * The currently selected own platform ID if any
	 */
	selectedOwnPlatformId?: string;
}

/**
 * OwnPlatformsListScreenComponent's output props
 */
export type OwnPlatformsListScreenComponentOutput = {
	/**
	 * Callback to request the own platforms list (re)load
	 */
	fetchOwnPlatforms: () => void;

	/**
	 * Callback to refresh own platforms list
	 */
	refreshOwnPlatforms: () => void;

	/**
	 * Callback to select an own platform (or none)
	 */
	selectOwnPlatform: (ownPlatform: OwnPlatformInternal | undefined) => void;

	/**
	 * Callback to edit an existing own platform
	 */
	editOwnPlatform: (ownPlatform: OwnPlatformInternal) => void;

	/**
	 * Callback to delete an existing own platform
	 */
	deleteOwnPlatform: (ownPlatform: OwnPlatformInternal) => void;

	/**
	 * Callback to load the details of a new own platform
	 */
	loadNewOwnPlatformDetails: () => void;

	/**
	 * Callback to navigate back
	 */
	goBack: () => void;
}
