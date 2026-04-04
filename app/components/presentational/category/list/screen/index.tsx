import { Component, ReactNode } from 'react';
import { CategoriesListContainer } from 'app/components/containers/category/list/list';
import { FABComponent } from 'app/components/presentational/generic/floating-action-button';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { MOBILE_LAYOUT_BREAKPOINT } from 'app/utilities/layout';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole "categories list" screen, that lists all user categories
 */
export class CategoriesListScreenComponent extends Component<CategoriesListScreenComponentInput & CategoriesListScreenComponentOutput, CategoriesListScreenComponentState> {
	public state: CategoriesListScreenComponentState = {
		isMobileLayout: this.isMobileLayout()
	};

	/**
	 * @override
	 */
	public componentDidMount(): void {
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
		window.removeEventListener('resize', this.handleResize);
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			categoriesCount,
			loadNewCategoryDetails
		} = this.props;
		
		const countLabel = categoriesCount === 1 ?
			i18n.t('category.list.count.single') :
			i18n.t('category.list.count.multiple', { count: categoriesCount });

		return (
			<section className='categories-screen'>
				<div className='categories-screen-content'>
					<header className='categories-screen-header'>
						<div className='categories-screen-heading'>
							<h1 className='categories-screen-title'>{i18n.t('category.list.title')}</h1>
							<p className='categories-screen-count'>{countLabel}</p>
						</div>
						{!this.state.isMobileLayout &&
							<PillButtonComponent tone='secondary' onClick={loadNewCategoryDetails}>
								+ {i18n.t('category.list.add')}
							</PillButtonComponent>}
					</header>
					<CategoriesListContainer />
					{this.state.isMobileLayout &&
						<FABComponent
							text='+'
							onPress={loadNewCategoryDetails}
						/>}
				</div>
				<LoadingIndicatorComponent
					visible={this.props.isLoading}
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
			this.props.fetchCategories();
		}
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
	 * Checks whether the current viewport matches the mobile layout
	 * @returns true if mobile layout should be used
	 */
	private isMobileLayout(): boolean {
		return window.innerWidth <= MOBILE_LAYOUT_BREAKPOINT;
	}
}

/**
 * CategoriesListScreenComponent's input props
 */
export type CategoriesListScreenComponentInput = {
	/**
	 * Number of categories currently loaded
	 */
	categoriesCount: number;

	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Flag to tell if the categories list requires a fetch. If so, on startup or on update the component will invoke the fetch callback.
	 */
	requiresFetch: boolean;
}

/**
 * CategoriesListScreenComponent's output props
 */
export type CategoriesListScreenComponentOutput = {
	/**
	 * Callback to request the categories list (re)load
	 */
	fetchCategories: () => void;

	/**
	 * Callback to load the details of a new category
	 */
	loadNewCategoryDetails: () => void;
}

type CategoriesListScreenComponentState = {
	isMobileLayout: boolean;
}
