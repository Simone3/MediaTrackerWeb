import { Component, ReactNode } from 'react';
import { CategoriesListContainer } from 'app/components/containers/category/list/list';
import { AuthenticatedPageHeaderComponent } from 'app/components/presentational/generic/authenticated-page-header';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { ResponsiveHeaderAddButtonComponent } from 'app/components/presentational/generic/responsive-header-add-button';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole "categories list" screen, that lists all user categories
 */
export class CategoriesListScreenComponent extends Component<CategoriesListScreenComponentInput & CategoriesListScreenComponentOutput> {
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
			categoriesCount,
			loadNewCategoryDetails
		} = this.props;
		
		const countLabel = categoriesCount === 1 ?
			i18n.t('category.list.count.single') :
			i18n.t('category.list.count.multiple', { count: categoriesCount });

		return (
			<section className='categories-screen'>
				<div className='categories-screen-content'>
					<AuthenticatedPageHeaderComponent
						title={i18n.t('category.list.title')}
						subtitle={countLabel}
						showSettingsShortcut={true}
						actions={
							<ResponsiveHeaderAddButtonComponent
								label={i18n.t('category.list.add')}
								mobileLabel={i18n.t('common.buttons.add')}
								onClick={loadNewCategoryDetails}
							/>
						}
					/>
					<CategoriesListContainer />
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
};

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
};
