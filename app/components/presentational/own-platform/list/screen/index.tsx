import { Component, CSSProperties, ReactNode } from 'react';
import { CATEGORIES_MOBILE_BREAKPOINT } from 'app/components/presentational/category/list/constants';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { FABComponent } from 'app/components/presentational/generic/floating-action-button';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { OwnPlatformIconInternal, OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import ownPlatformIcon from 'app/resources/images/ic_input_own_platform.svg';
import platformAndroidIcon from 'app/resources/images/ic_platform_android.svg';
import platformAppleIcon from 'app/resources/images/ic_platform_apple.svg';
import platformBookIcon from 'app/resources/images/ic_platform_book.svg';
import platformDiscIcon from 'app/resources/images/ic_platform_disc.svg';
import platformDisneyIcon from 'app/resources/images/ic_platform_disney.svg';
import platformDownloadIcon from 'app/resources/images/ic_platform_download.svg';
import platformEpicIcon from 'app/resources/images/ic_platform_epic.svg';
import platformGogIcon from 'app/resources/images/ic_platform_gog.svg';
import platformHuluIcon from 'app/resources/images/ic_platform_hulu.svg';
import platformKindleIcon from 'app/resources/images/ic_platform_kindle.svg';
import platformNetflixIcon from 'app/resources/images/ic_platform_netflix.svg';
import platformOriginIcon from 'app/resources/images/ic_platform_origin.svg';
import platformPlaystationIcon from 'app/resources/images/ic_platform_playstation.svg';
import platformSteamIcon from 'app/resources/images/ic_platform_steam.svg';
import platformSwitchIcon from 'app/resources/images/ic_platform_switch.svg';
import platformUplayIcon from 'app/resources/images/ic_platform_uplay.svg';
import { i18n } from 'app/utilities/i18n';

const OWN_PLATFORMS_SCREEN_ACCENT = '#7db4ff';
const ownPlatformIcons: Record<OwnPlatformIconInternal, string> = {
	default: ownPlatformIcon,
	android: platformAndroidIcon,
	apple: platformAppleIcon,
	book: platformBookIcon,
	disc: platformDiscIcon,
	disney: platformDisneyIcon,
	download: platformDownloadIcon,
	epic: platformEpicIcon,
	gog: platformGogIcon,
	hulu: platformHuluIcon,
	kindle: platformKindleIcon,
	netflix: platformNetflixIcon,
	origin: platformOriginIcon,
	playstation: platformPlaystationIcon,
	steam: platformSteamIcon,
	switch: platformSwitchIcon,
	uplay: platformUplayIcon
};

/**
 * Presentational component that contains the whole "own platforms list" screen, that lists all user own platforms
 */
export class OwnPlatformsListScreenComponent extends Component<OwnPlatformsListScreenComponentInput & OwnPlatformsListScreenComponentOutput, OwnPlatformsListScreenComponentState> {
	public state: OwnPlatformsListScreenComponentState = {
		pendingDeleteOwnPlatform: undefined,
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
			ownPlatforms,
			selectedOwnPlatformId,
			isLoading,
			loadNewOwnPlatformDetails
		} = this.props;
		const {
			pendingDeleteOwnPlatform,
			isMobileLayout
		} = this.state;
		const countLabel = ownPlatforms.length === 1 ?
			i18n.t('ownPlatform.list.count.single') :
			i18n.t('ownPlatform.list.count.multiple', { count: ownPlatforms.length });

		return (
			<section
				className='entity-management-screen own-platforms-screen'
				style={{ '--entity-management-accent': OWN_PLATFORMS_SCREEN_ACCENT } as CSSProperties}>
				<div className='entity-management-screen-content'>
					<header className='entity-management-screen-header'>
						<div className='entity-management-screen-heading'>
							<div className='entity-management-screen-title-row'>
								<span className='entity-management-screen-icon-shell' aria-hidden={true}>
									<img src={ownPlatformIcon} alt='' className='entity-management-screen-icon' />
								</span>
								<div className='entity-management-screen-title-copy'>
									<h1 className='entity-management-screen-title'>{i18n.t('ownPlatform.list.title')}</h1>
									<p className='entity-management-screen-count'>{countLabel}</p>
								</div>
							</div>
						</div>
						{!isMobileLayout &&
							<button
								type='button'
								className='entity-management-screen-button entity-management-screen-button-secondary'
								onClick={loadNewOwnPlatformDetails}>
								+ {i18n.t('ownPlatform.details.title.new')}
							</button>}
					</header>
					<div className='entity-management-list' aria-busy={this.props.showSkeletons}>
						<ul className='entity-management-list-items'>
							<li
								className={`entity-management-list-row entity-management-list-row-standalone${selectedOwnPlatformId ? '' : ' entity-management-list-row-selected'}`}
								style={{ '--entity-management-row-accent': OWN_PLATFORMS_SCREEN_ACCENT } as CSSProperties}>
								<button
									type='button'
									className='entity-management-list-main entity-management-list-main-standalone'
									aria-pressed={!selectedOwnPlatformId}
									onClick={() => {
										this.props.selectOwnPlatform(undefined);
									}}>
									<span className='entity-management-list-badge-shell entity-management-list-badge-shell-muted entity-management-list-badge-shell-accent' aria-hidden={true}>
										<span className='entity-management-list-badge'>-</span>
									</span>
									<span className='entity-management-list-main-copy'>
										<span className='entity-management-list-name'>{i18n.t('ownPlatform.list.none')}</span>
									</span>
									{!selectedOwnPlatformId && <span className='entity-management-list-selection'>{i18n.t('common.state.selected')}</span>}
								</button>
							</li>
							{this.props.showSkeletons ?
								this.renderSkeletonRows() :
								ownPlatforms.map((ownPlatform: OwnPlatformInternal) => {
									const selected = ownPlatform.id === selectedOwnPlatformId;

									return (
										<li
											key={ownPlatform.id}
											className={`entity-management-list-row${selected ? ' entity-management-list-row-selected' : ''}`}
											style={{ '--entity-management-row-accent': ownPlatform.color } as CSSProperties}>
											<button
												type='button'
												className='entity-management-list-main'
												aria-pressed={selected}
												onClick={() => {
													this.props.selectOwnPlatform(ownPlatform);
												}}>
												<span className='entity-management-list-badge-shell entity-management-list-badge-shell-accent' aria-hidden={true}>
													<span
														className='entity-management-list-badge-icon'
														style={this.getOwnPlatformIconStyle(ownPlatform)}
													/>
												</span>
												<span className='entity-management-list-main-copy'>
													<span className='entity-management-list-name'>{ownPlatform.name}</span>
												</span>
												{selected && <span className='entity-management-list-selection'>{i18n.t('common.state.selected')}</span>}
											</button>
											<div className='entity-management-list-actions'>
												<button
													type='button'
													className='entity-management-list-action'
													onClick={() => {
														this.props.editOwnPlatform(ownPlatform);
													}}
													aria-label={`Edit ${ownPlatform.name}`}>
													{i18n.t('ownPlatform.list.edit')}
												</button>
												<button
													type='button'
													className='entity-management-list-action entity-management-list-action-danger'
													onClick={() => {
														this.requestDeleteOwnPlatform(ownPlatform);
													}}
													aria-label={`Delete ${ownPlatform.name}`}>
													{i18n.t('ownPlatform.list.delete')}
												</button>
											</div>
										</li>
									);
								})}
						</ul>
						{this.props.showEmptyState &&
							<div className='entity-management-list-empty'>
								<p className='entity-management-list-empty-title'>{i18n.t('ownPlatform.list.empty')}</p>
								<p className='entity-management-list-empty-copy'>{i18n.t('ownPlatform.list.emptyHint')}</p>
							</div>}
					</div>
				</div>
				{isMobileLayout &&
					<FABComponent
						text='+'
						onPress={() => {
							loadNewOwnPlatformDetails();
						}}
					/>}
				<LoadingIndicatorComponent
					visible={isLoading}
					fullScreen={false}
				/>
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
		this.setState({
			pendingDeleteOwnPlatform: ownPlatform
		});
	}

	/**
	 * Renders placeholder rows while the own platforms list is loading for the first time
	 * @returns the loading rows
	 */
	private renderSkeletonRows(): ReactNode {
		const loadingRows = Array.from({ length: 3 }, (_, index) => {
			return index;
		});

		return loadingRows.map((loadingRow) => {
			return (
				<li
					key={`own-platform-loading-${loadingRow}`}
					className='entity-management-list-row entity-management-list-skeleton-row'
					style={{ '--entity-management-row-accent': OWN_PLATFORMS_SCREEN_ACCENT } as CSSProperties}
					aria-hidden={true}>
					<div className='entity-management-list-main'>
						<span className='entity-management-list-badge-shell entity-management-list-badge-shell-accent list-skeleton-block entity-management-list-skeleton-badge-shell'>
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
	 * Builds the masked icon styles for the provided own platform
	 * @param ownPlatform the own platform
	 * @returns the CSS properties
	 */
	private getOwnPlatformIconStyle(ownPlatform: OwnPlatformInternal): CSSProperties {
		return {
			'--entity-management-badge-icon-url': `url(${ownPlatformIcons[ownPlatform.icon]})`,
			'--entity-management-badge-icon-color': ownPlatform.color
		} as CSSProperties;
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
	isMobileLayout: boolean;
}
