import { CategoryDetailsScreenComponent, CategoryDetailsScreenComponentInput } from 'app/components/presentational/category/details/screen';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';

const mapStateToProps = (state: State): CategoryDetailsScreenComponentInput => {
	
	return {
		isLoading: state.categoryDetails.saveStatus === 'SAVING'
	};
};

/**
 * Container component that handles Redux state for CategoryDetailsScreenComponent
 */
export const CategoryDetailsScreenContainer = connect(
	mapStateToProps,
	null
)(CategoryDetailsScreenComponent);
