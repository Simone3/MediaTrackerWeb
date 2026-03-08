import { HeaderComponent, HeaderComponentInput } from 'app/components/presentational/generic/header';
import { State } from 'app/redux/state/state';
import { i18n } from 'app/utilities/i18n';
import { connect } from 'react-redux';

const mapStateToProps = (state: State, ownProps: CategoryDetailsHeaderContainerProps): HeaderComponentInput => {
	
	const category = state.categoryDetails.category;

	return {
		...ownProps,
		title: category && category.id ? category.name : i18n.t('category.details.title.new')
	};
};

/**
 * Container component that handles Redux state for HeaderComponent
 */
export const CategoryDetailsHeaderContainer = connect(
	mapStateToProps
)(HeaderComponent);

/**
 * CategoryDetailsHeaderContainer's props
 */
export type CategoryDetailsHeaderContainerProps = Omit<HeaderComponentInput, 'title'>;
