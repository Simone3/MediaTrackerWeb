import { Component, ReactNode } from 'react';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { EntityManagementListComponent } from 'app/components/presentational/generic/entity-management-list';
import { EntityManagementScreenComponent } from 'app/components/presentational/generic/entity-management-screen';
import { GroupInternal } from 'app/data/models/internal/group';
import groupIcon from 'app/resources/images/ic_input_group.svg';
import { i18n } from 'app/utilities/i18n';

const GROUPS_SCREEN_ACCENT = '#7db4ff';

/**
 * Presentational component that contains the whole "groups list" screen, that lists all user groups
 */
export class GroupsListScreenComponent extends Component<GroupsListScreenComponentInput & GroupsListScreenComponentOutput, GroupsListScreenComponentState> {
	public state: GroupsListScreenComponentState = {
		pendingDeleteGroup: undefined
	};

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
			isLoading,
			loadNewGroupDetails,
			showEmptyState,
			showSkeletons
		} = this.props;
		const {
			pendingDeleteGroup
		} = this.state;
		const countLabel = groups.length === 1 ?
			i18n.t('group.list.count.single') :
			i18n.t('group.list.count.multiple', { count: groups.length });

		return (
			<>
				<EntityManagementScreenComponent
					screenClassName='groups-screen'
					accentColor={GROUPS_SCREEN_ACCENT}
					icon={<img src={groupIcon} alt='' className='entity-management-screen-icon' />}
					title={i18n.t('group.list.title')}
					countLabel={countLabel}
					addButtonLabel={i18n.t('group.details.title.new')}
					loadingVisible={isLoading}
					onAdd={loadNewGroupDetails}>
					<EntityManagementListComponent
						items={groups}
						selectedItemId={selectedGroupId}
						selectedLabel={i18n.t('common.state.selected')}
						editLabel={i18n.t('group.list.edit')}
						deleteLabel={i18n.t('group.list.delete')}
						emptyTitle={i18n.t('group.list.empty')}
						emptyCopy={i18n.t('group.list.emptyHint')}
						showEmptyState={showEmptyState}
						showSkeletons={showSkeletons}
						getItemKey={(group) => {
							return group.id;
						}}
						getItemName={(group) => {
							return group.name;
						}}
						getItemAccentColor={() => {
							return GROUPS_SCREEN_ACCENT;
						}}
						renderItemBadge={(group) => {
							return <span className='entity-management-list-badge'>{this.getBadgeLabel(group.name, '#')}</span>;
						}}
						onSelect={(group) => {
							this.props.selectGroup(group);
						}}
						onEdit={(group) => {
							this.props.editGroup(group);
						}}
						onDelete={(group) => {
							this.requestDeleteGroup(group);
						}}
						noneOption={{
							label: i18n.t('group.list.none'),
							badge: <span className='entity-management-list-badge'>-</span>,
							accentColor: GROUPS_SCREEN_ACCENT,
							selected: !selectedGroupId,
							onSelect: () => {
								this.props.selectGroup(undefined);
							},
							badgeShellClassName: ' entity-management-list-badge-shell-muted'
						}}
						skeletonAccentColor={GROUPS_SCREEN_ACCENT}
						skeletonKeyPrefix='group-loading'
					/>
				</EntityManagementScreenComponent>
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
			</>
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
}
