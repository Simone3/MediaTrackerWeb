import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { BrowserBackNavigationGuardComponent } from 'app/components/presentational/generic/browser-back-navigation-guard';
import { CategoryDetailsScreenComponent, CategoryDetailsScreenComponentInput, CategoryDetailsScreenComponentOutput } from 'app/components/presentational/category/details/screen';
import { DEFAULT_CATEGORY } from 'app/data/models/internal/category';
import { saveCategory, setCategoryFormStatus } from 'app/redux/actions/category/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';
import { i18n } from 'app/utilities/i18n';

type CategoryDetailsScreenContainerInput = CategoryDetailsScreenComponentInput & {
	blockBrowserBack: boolean;
};

const selectInput = (state: State): CategoryDetailsScreenContainerInput => {
	return {
		isLoading: state.categoryDetails.saveStatus === 'SAVING',
		category: state.categoryDetails.category || DEFAULT_CATEGORY,
		sameNameConfirmationRequested: state.categoryDetails.saveStatus === 'REQUIRES_CONFIRMATION',
		blockBrowserBack: state.categoryDetails.dirty &&
			state.categoryDetails.saveStatus !== 'SAVING' &&
			state.categoryDetails.saveStatus !== 'SAVED'
	};
};

const buildOutput = (dispatch: Dispatch): CategoryDetailsScreenComponentOutput => {
	return {
		saveCategory: (category, confirmSameName) => {
			dispatch(saveCategory(category, confirmSameName));
		},
		notifyFormStatus: (valid, dirty) => {
			dispatch(setCategoryFormStatus(valid, dirty));
		}
	};
};

/**
 * Container component that handles Redux state for CategoryDetailsScreenComponent
 * @returns the connected category details screen, guarded against losing an unsaved form
 */
export const CategoryDetailsScreenContainer = (): ReactElement => {
	const {
		blockBrowserBack,
		...screenProps
	} = useContainerInput(selectInput);
	const output = useContainerOutput(buildOutput);

	return (
		<BrowserBackNavigationGuardComponent
			when={blockBrowserBack}
			title={i18n.t('common.alert.form.exit.title')}
			message={i18n.t('common.alert.form.exit.message')}
			confirmLabel={i18n.t('common.alert.default.okButton')}
			cancelLabel={i18n.t('common.alert.default.cancelButton')}
		>
			<CategoryDetailsScreenComponent {...screenProps} {...output} />
		</BrowserBackNavigationGuardComponent>
	);
};
