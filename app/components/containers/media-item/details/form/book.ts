
import { commonMediaItemFormMapDispatchToProps, commonMediaItemFormMapStateToProps } from 'app/components/containers/media-item/details/form/media-item';
import { BookFormComponent, BookFormComponentInput, BookFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/book';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): BookFormComponentInput => {
	
	return {
		...commonMediaItemFormMapStateToProps(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch): BookFormComponentOutput => {

	return {
		...commonMediaItemFormMapDispatchToProps(dispatch)
	};
};

/**
 * Container component that handles Redux state for BookFormComponent
 */
export const BookFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(BookFormComponent);
