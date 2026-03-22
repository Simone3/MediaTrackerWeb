import React, { Component, CSSProperties, ReactNode } from 'react';
import { CATEGORIES_MOBILE_BREAKPOINT } from 'app/components/presentational/category/list/constants';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { FABComponent } from 'app/components/presentational/generic/floating-action-button';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { GroupInternal } from 'app/data/models/internal/group';
import groupIcon from 'app/resources/images/ic_input_group.svg';
import { i18n } from 'app/utilities/i18n';

const GROUPS_SCREEN_ACCENT = '#7db4ff';

/**
 * Presentational component that contains the whole "groups list" screen, that lists all user groups
 */
export class GroupsListScreenComponent extends Component<GroupsListScreenComponentInput & GroupsListScreenComponentOutput, GroupsListScreenComponentState> {
	public state: GroupsListScreenComponentState = {
		pendingDeleteGroup: undefined,
		isMobileLayout: this.isMobileLayout()
	};

	/**
	 * @override
	 */
	public componentDidMount(): void {
		document.body.classList.add('app-dark-screen-active');
		window.addEventListener('resize', this.handleResize);
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
	public componentWillUnmount(): void {
		document.body.classList.remove('app-dark-screen-active');
		window.removeEventListener('resize', this.handleResize);
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			groups,
			selectedGroupId,
			isLoading,
			loadNewGroupDetails
		} = this.props;
		const {
			pendingDeleteGroup,
			isMobileLayout
		} = this.state;
		const countLabel = groups.length === 1 ?
			i18n.t('group.list.count.single') :
			i18n.t('group.list.count.multiple', { count: groups.length });

		return (
			<section
				className='entity-management-screen groups-screen'
				style={{ '--entity-management-accent': GROUPS_SCREEN_ACCENT } as CSSProperties}>
				<div className='entity-management-screen-content'>
					<header className='entity-management-screen-header'>
						<div className='entity-management-screen-heading'>
							<div className='entity-management-screen-title-row'>
								<span className='entity-management-screen-icon-shell' aria-hidden={true}>
									<img src={groupIcon} alt='' className='entity-management-screen-icon' />
								</span>
								<div className='entity-management-screen-title-copy'>
									<h1 className='entity-management-screen-title'>{i18n.t('group.list.title')}</h1>
									<p className='entity-management-screen-count'>{countLabel}</p>
								</div>
							</div>
						</div>
						{!isMobileLayout &&
							<button
								type='button'
								className='entity-management-screen-button entity-management-screen-button-secondary'
								onClick={loadNewGroupDetails}>
								+ {i18n.t('group.details.title.new')}
							</button>}
					</header>
					<div className='entity-management-list' aria-busy={this.props.showSkeletons}>
						<ul className='entity-management-list-items'>
							<li
								className={`entity-management-list-row entity-management-list-row-standalone${selectedGroupId ? '' : ' entity-management-list-row-selected'}`}
								style={{ '--entity-management-row-accent': GROUPS_SCREEN_ACCENT } as CSSProperties}>
								<button
									type='button'
									className='entity-management-list-main entity-management-list-main-standalone'
									aria-pressed={!selectedGroupId}
									onClick={() => {
										this.props.selectGroup(undefined);
									}}>
									<span className='entity-management-list-badge-shell entity-management-list-badge-shell-muted' aria-hidden={true}>
										<span className='entity-management-list-badge'>-</span>
									</span>
									<span className='entity-management-list-main-copy'>
										<span className='entity-management-list-name'>{i18n.t('group.list.none')}</span>
									</span>
									{!selectedGroupId && <span className='entity-management-list-selection'>{i18n.t('common.state.selected')}</span>}
								</button>
							</li>
							{this.props.showSkeletons ?
								this.renderSkeletonRows() :
								groups.map((group: GroupInternal) => {
									const selected = group.id === selectedGroupId;

									return (
										<li
											key={group.id}
											className={`entity-management-list-row${selected ? ' entity-management-list-row-selected' : ''}`}
											style={{ '--entity-management-row-accent': GROUPS_SCREEN_ACCENT } as CSSProperties}>
											<button
												type='button'
												className='entity-management-list-main'
												aria-pressed={selected}
												onClick={() => {
													this.props.selectGroup(group);
												}}>
												<span className='entity-management-list-badge-shell' aria-hidden={true}>
													<span className='entity-management-list-badge'>{this.getBadgeLabel(group.name, '#')}</span>
												</span>
												<span className='entity-management-list-main-copy'>
													<span className='entity-management-list-name'>{group.name}</span>
												</span>
												{selected && <span className='entity-management-list-selection'>{i18n.t('common.state.selected')}</span>}
											</button>
											<div className='entity-management-list-actions'>
												<button
													type='button'
													className='entity-management-list-action'
													onClick={() => {
														this.props.editGroup(group);
													}}
													aria-label={`Edit ${group.name}`}>
													{i18n.t('group.list.edit')}
												</button>
												<button
													type='button'
													className='entity-management-list-action entity-management-list-action-danger'
													onClick={() => {
														this.requestDeleteGroup(group);
													}}
													aria-label={`Delete ${group.name}`}>
													{i18n.t('group.list.delete')}
												</button>
											</div>
										</li>
									);
								})}
						</ul>
						{this.props.showEmptyState &&
							<div className='entity-management-list-empty'>
								<p className='entity-management-list-empty-title'>{i18n.t('group.list.empty')}</p>
								<p className='entity-management-list-empty-copy'>{i18n.t('group.list.emptyHint')}</p>
							</div>}
					</div>
				</div>
				{isMobileLayout &&
					<FABComponent
						text='+'
						onPress={() => {
							loadNewGroupDetails();
						}}
					/>}
				<LoadingIndicatorComponent
					visible={isLoading}
					fullScreen={false}
				/>
				<ConfirmDialogComponent
					visible={Boolean(pendingDeleteGroup)}
					title={i18n.t('group.common.alert.delete.title')}
					message={pendingDeleteGroup ? i18n.t('group.common.alert.delete.message', { name: pendingDeleteGroup.name }) : ''}
					confirmLabel={i18n.t('common.alert.default.okButton')}
					cancelLabel={i18n.t('common.alert.default.cancelButton')}
					onConfirm={() => {
						if(pendingDeleteGroup) {
							this.props.deleteGroup(pendingDeleteGroup);
						}
						this.setState({
							pendingDeleteGroup: undefined
						});
					}}
					onCancel={() => {
						this.setState({
							pendingDeleteGroup: undefined
						});
					}}
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
		this.setState({
			pendingDeleteGroup: group
		});
	}

	/**
	 * Renders placeholder rows while the groups list is loading for the first time
	 * @returns the loading rows
	 */
	private renderSkeletonRows(): ReactNode {
		const loadingRows = Array.from({ length: 3 }, (_, index) => {
			return index;
		});

		return loadingRows.map((loadingRow) => {
			return (
				<li
					key={`group-loading-${loadingRow}`}
					className='entity-management-list-row entity-management-list-skeleton-row'
					style={{ '--entity-management-row-accent': GROUPS_SCREEN_ACCENT } as CSSProperties}
					aria-hidden={true}>
					<div className='entity-management-list-main'>
						<span className='entity-management-list-badge-shell list-skeleton-block entity-management-list-skeleton-badge-shell'>
							<span className='list-skeleton-block entity-management-list-skeleton-badge' />
						</span>
						<span className='entity-management-list-main-copy'>
							<span className='list-skeleton-block entity-management-list-skeleton-title' />
						</span>
						<span className='entity-management-list-selection list-skeleton-block entity-management-list-skeleton-pill' />
					</div>
					<div className='entity-management-list-actions'>
						<span className='entity-management-list-action list-skeleton-block entity-management-list-skeleton-action' />
						<span className='entity-management-list-action list-skeleton-block entity-management-list-skeleton-action' />
					</div>
				</li>
			);
		});
	}

	/**
	 * Updates the responsive layout flag when the viewport changes
	 */
	private handleResize = (): void => {
		const isMobileLayout = this.isMobileLayout();

		if(isMobileLayout !== this.state.isMobileLayout) {
			this.setState({
				isMobileLayout
			});
		}
	};

	/**
	 * Extracts a small badge label from the provided text
	 * @param text the source text
	 * @param fallback the fallback label
	 * @returns the display label
	 */
	private getBadgeLabel(text: string, fallback: string): string {
		const compactLabel = text
			.trim()
			.split(/\s+/u)
			.filter(Boolean)
			.slice(0, 2)
			.map((chunk) => {
				return chunk[0];
			})
			.join('')
			.toUpperCase();

		return compactLabel || fallback;
	}

	/**
	 * Checks whether the current viewport matches the mobile layout
	 * @returns true if mobile layout should be used
	 */
	private isMobileLayout(): boolean {
		return window.innerWidth <= CATEGORIES_MOBILE_BREAKPOINT;
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

	/**
	 * Whether the list should render the empty-state card
	 */
	showEmptyState: boolean;

	/**
	 * Whether the list should render loading skeleton rows
	 */
	showSkeletons: boolean;
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

type GroupsListScreenComponentState = {
	pendingDeleteGroup?: GroupInternal;
	isMobileLayout: boolean;
}
