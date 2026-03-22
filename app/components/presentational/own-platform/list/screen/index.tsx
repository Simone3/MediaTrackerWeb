import { Component, ReactNode } from 'react';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { EntityManagementListComponent } from 'app/components/presentational/generic/entity-management-list';
import { EntityManagementScreenComponent } from 'app/components/presentational/generic/entity-management-screen';
import { buildOwnPlatformMaskStyle } from 'app/components/presentational/own-platform/common/icon-registry';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import ownPlatformIcon from 'app/resources/images/ic_input_own_platform.svg';
import { i18n } from 'app/utilities/i18n';

const OWN_PLATFORMS_SCREEN_ACCENT = '#7db4ff';

/**
 * Presentational component that contains the whole "own platforms list" screen, that lists all user own platforms
 */
export class OwnPlatformsListScreenComponent extends Component<OwnPlatformsListScreenComponentInput & OwnPlatformsListScreenComponentOutput, OwnPlatformsListScreenComponentState> {
	public state: OwnPlatformsListScreenComponentState = {
		pendingDeleteOwnPlatform: undefined
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
			ownPlatforms,
			selectedOwnPlatformId,
			isLoading,
			loadNewOwnPlatformDetails,
			showEmptyState,
			showSkeletons
		} = this.props;
		const {
			pendingDeleteOwnPlatform
		} = this.state;
		const countLabel = ownPlatforms.length === 1 ?
			i18n.t('ownPlatform.list.count.single') :
			i18n.t('ownPlatform.list.count.multiple', { count: ownPlatforms.length });

		return (
			<>
				<EntityManagementScreenComponent
					screenClassName='own-platforms-screen'
					bodyClassName='app-dark-screen-active'
					accentColor={OWN_PLATFORMS_SCREEN_ACCENT}
					icon={<img src={ownPlatformIcon} alt='' className='entity-management-screen-icon' />}
					title={i18n.t('ownPlatform.list.title')}
					countLabel={countLabel}
					addButtonLabel={i18n.t('ownPlatform.details.title.new')}
					loadingVisible={isLoading}
					onAdd={loadNewOwnPlatformDetails}>
					<EntityManagementListComponent
						items={ownPlatforms}
						selectedItemId={selectedOwnPlatformId}
						selectedLabel={i18n.t('common.state.selected')}
						editLabel={i18n.t('ownPlatform.list.edit')}
						deleteLabel={i18n.t('ownPlatform.list.delete')}
						emptyTitle={i18n.t('ownPlatform.list.empty')}
						emptyCopy={i18n.t('ownPlatform.list.emptyHint')}
						showEmptyState={showEmptyState}
						showSkeletons={showSkeletons}
						getItemKey={(ownPlatform) => {
							return ownPlatform.id;
						}}
						getItemName={(ownPlatform) => {
							return ownPlatform.name;
						}}
						getItemAccentColor={(ownPlatform) => {
							return ownPlatform.color;
						}}
						getBadgeShellClassName={() => {
							return ' entity-management-list-badge-shell-accent';
						}}
						renderItemBadge={(ownPlatform) => {
							return (
								<span
									className='entity-management-list-badge-icon'
									style={buildOwnPlatformMaskStyle(
										ownPlatform.icon,
										ownPlatform.color,
										'--entity-management-badge-icon-url',
										'--entity-management-badge-icon-color'
									)}
								/>
							);
						}}
						onSelect={(ownPlatform) => {
							this.props.selectOwnPlatform(ownPlatform);
						}}
						onEdit={(ownPlatform) => {
							this.props.editOwnPlatform(ownPlatform);
						}}
						onDelete={(ownPlatform) => {
							this.requestDeleteOwnPlatform(ownPlatform);
						}}
						noneOption={{
							label: i18n.t('ownPlatform.list.none'),
							badge: <span className='entity-management-list-badge'>-</span>,
							accentColor: OWN_PLATFORMS_SCREEN_ACCENT,
							selected: !selectedOwnPlatformId,
							onSelect: () => {
								this.props.selectOwnPlatform(undefined);
							},
							badgeShellClassName: ' entity-management-list-badge-shell-muted entity-management-list-badge-shell-accent'
						}}
						skeletonAccentColor={OWN_PLATFORMS_SCREEN_ACCENT}
						skeletonBadgeShellClassName=' entity-management-list-badge-shell-accent'
						skeletonKeyPrefix='own-platform-loading'
					/>
				</EntityManagementScreenComponent>
				<ConfirmDialogComponent
					visible={Boolean(pendingDeleteOwnPlatform)}
					title={i18n.t('ownPlatform.common.alert.delete.title')}
					message={pendingDeleteOwnPlatform ? i18n.t('ownPlatform.common.alert.delete.message', { name: pendingDeleteOwnPlatform.name }) : ''}
					confirmLabel={i18n.t('common.alert.default.okButton')}
					cancelLabel={i18n.t('common.alert.default.cancelButton')}
					onConfirm={() => {
						if(pendingDeleteOwnPlatform) {
							this.props.deleteOwnPlatform(pendingDeleteOwnPlatform);
						}
						this.setState({
							pendingDeleteOwnPlatform: undefined
						});
					}}
					onCancel={() => {
						this.setState({
							pendingDeleteOwnPlatform: undefined
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
			this.props.fetchOwnPlatforms();
		}
	}

	/**
	 * Handles delete flow for an own platform
	 * @param ownPlatform the own platform
	 */
	private requestDeleteOwnPlatform(ownPlatform: OwnPlatformInternal): void {
		this.setState({
			pendingDeleteOwnPlatform: ownPlatform
		});
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
 * OwnPlatformsListScreenComponent's output props
 */
export type OwnPlatformsListScreenComponentOutput = {
	/**
	 * Callback to request the own platforms list (re)load
	 */
	fetchOwnPlatforms: () => void;

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

type OwnPlatformsListScreenComponentState = {
	pendingDeleteOwnPlatform?: OwnPlatformInternal;
}
