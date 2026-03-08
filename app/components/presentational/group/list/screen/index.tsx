import React, { Component, ReactNode } from 'react';
import { FABComponent } from 'app/components/presentational/generic/floating-action-button';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { GroupInternal } from 'app/data/models/internal/group';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole "groups list" screen, that lists all user groups
 */
export class GroupsListScreenComponent extends Component<GroupsListScreenComponentInput & GroupsListScreenComponentOutput> {
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
			groups,
			selectedGroupId,
			isLoading
		} = this.props;

		return (
			<section className='groups-screen'>
				<div className='groups-list'>
					<div className='groups-list-header'>
						<h1 className='groups-list-title'>{i18n.t('group.list.title')}</h1>
						<div className='groups-list-header-actions'>
							<button type='button' className='groups-list-secondary' onClick={this.props.goBack}>
								Back
							</button>
							<button type='button' className='groups-list-refresh' onClick={this.props.refreshGroups}>
								Refresh
							</button>
						</div>
					</div>
					<ul className='groups-list-items'>
						<li className='groups-list-item groups-list-item-none'>
							<button
								type='button'
								className={selectedGroupId ? 'groups-list-row' : 'groups-list-row groups-list-row-selected'}
								onClick={() => {
									this.props.selectGroup(undefined);
								}}>
								{i18n.t('group.list.none')}
							</button>
						</li>
						{groups.map((group: GroupInternal) => {
							const selected = group.id === selectedGroupId;
							const rowClass = selected ? 'groups-list-row groups-list-row-selected' : 'groups-list-row';

							return (
								<li key={group.id} className='groups-list-item'>
									<button
										type='button'
										className={rowClass}
										onClick={() => {
											this.props.selectGroup(group);
										}}>
										{group.name}
									</button>
									<button
										type='button'
										className='groups-list-options'
										onClick={() => {
											this.props.editGroup(group);
										}}
										aria-label={`Edit ${group.name}`}>
										{i18n.t('group.list.edit')}
									</button>
									<button
										type='button'
										className='groups-list-options groups-list-options-danger'
										onClick={() => {
											this.requestDeleteGroup(group);
										}}
										aria-label={`Delete ${group.name}`}>
										{i18n.t('group.list.delete')}
									</button>
								</li>
							);
						})}
					</ul>
					{groups.length === 0 && <p className='groups-list-empty'>{i18n.t('group.list.empty')}</p>}
				</div>
				<FABComponent
					text='+'
					onPress={() => {
						this.props.loadNewGroupDetails();
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
			this.props.fetchGroups();
		}
	}

	/**
	 * Handles delete flow for a group
	 * @param group the group
	 */
	private requestDeleteGroup(group: GroupInternal): void {
		const title = i18n.t('group.common.alert.delete.title');
		const message = i18n.t('group.common.alert.delete.message', { name: group.name });

		// Keep native confirm for phase 2 to preserve existing blocking UX with minimal migration risk.
		// eslint-disable-next-line no-alert
		const confirmed = window.confirm(`${title}\n\n${message}`);
		if(confirmed) {
			this.props.deleteGroup(group);
		}
	}
}

/**
 * GroupsListScreenComponent's input props
 */
export type GroupsListScreenComponentInput = {
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Flag to tell if the groups list requires a fetch. If so, on startup or on update the component will invoke the fetch callback.
	 */
	requiresFetch: boolean;

	/**
	 * The groups list to display
	 */
	groups: GroupInternal[];

	/**
	 * The currently selected group ID if any
	 */
	selectedGroupId?: string;
}

/**
 * GroupsListScreenComponent's output props
 */
export type GroupsListScreenComponentOutput = {
	/**
	 * Callback to request the groups list (re)load
	 */
	fetchGroups: () => void;

	/**
	 * Callback to refresh groups list
	 */
	refreshGroups: () => void;

	/**
	 * Callback to select a group (or none)
	 */
	selectGroup: (group: GroupInternal | undefined) => void;

	/**
	 * Callback to edit an existing group
	 */
	editGroup: (group: GroupInternal) => void;

	/**
	 * Callback to delete an existing group
	 */
	deleteGroup: (group: GroupInternal) => void;

	/**
	 * Callback to load the details of a new group
	 */
	loadNewGroupDetails: () => void;

	/**
	 * Callback to navigate back
	 */
	goBack: () => void;
}
