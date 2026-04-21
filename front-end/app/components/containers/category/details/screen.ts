import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { BrowserBackNavigationGuardComponent } from 'app/components/presentational/generic/browser-back-navigation-guard';
import { CategoryDetailsScreenComponent, CategoryDetailsScreenComponentInput, CategoryDetailsScreenComponentOutput } from 'app/components/presentational/category/details/screen';
import { DEFAULT_CATEGORY } from 'app/data/models/internal/category';
import { saveCategory, setCategoryFormStatus } from 'app/redux/actions/category/generators';
import { State } from 'app/redux/state/state';
import { i18n } from 'app/utilities/i18n';

type CategoryDetailsScreenContainerStateProps = CategoryDetailsScreenComponentInput & {
	blockBrowserBack: boolean;
};

type CategoryDetailsScreenContainerProps = CategoryDetailsScreenContainerStateProps & CategoryDetailsScreenComponentOutput;

const mapStateToProps = (state: State): CategoryDetailsScreenContainerStateProps => {
	return {
		isLoading: state.categoryDetails.saveStatus === 'SAVING',
		category: state.categoryDetails.category || DEFAULT_CATEGORY,
		sameNameConfirmationRequested: state.categoryDetails.saveStatus === 'REQUIRES_CONFIRMATION',
		blockBrowserBack: state.categoryDetails.dirty &&
			state.categoryDetails.saveStatus !== 'SAVING' &&
			state.categoryDetails.saveStatus !== 'SAVED'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): CategoryDetailsScreenComponentOutput => {
	return {
		saveCategory: (category, confirmSameName) => {
			dispatch(saveCategory(category, confirmSameName));
		},
		notifyFormStatus: (valid, dirty) => {
			dispatch(setCategoryFormStatus(valid, dirty));
		}
	};
};

const CategoryDetailsScreenGuardedComponent = (props: CategoryDetailsScreenContainerProps): ReactElement => {
	const {
		blockBrowserBack,
		...screenProps
	} = props;

	return React.createElement(
		BrowserBackNavigationGuardComponent,
		{
			when: blockBrowserBack,
			title: i18n.t('common.alert.form.exit.title'),
			message: i18n.t('common.alert.form.exit.message'),
			confirmLabel: i18n.t('common.alert.default.okButton'),
			cancelLabel: i18n.t('common.alert.default.cancelButton')
		},
		React.createElement(CategoryDetailsScreenComponent, screenProps)
	);
};

/**
 * Container component that handles Redux state for CategoryDetailsScreenComponent
 */
export const CategoryDetailsScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CategoryDetailsScreenGuardedComponent);
