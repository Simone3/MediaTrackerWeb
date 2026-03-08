
import { commonMediaItemFormMapDispatchToProps, commonMediaItemFormMapStateToProps } from 'app/components/containers/media-item/details/form/media-item';
import { MovieFormComponent, MovieFormComponentInput, MovieFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/movie';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): MovieFormComponentInput => {
	
	return {
		...commonMediaItemFormMapStateToProps(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch): MovieFormComponentOutput => {

	return {
		...commonMediaItemFormMapDispatchToProps(dispatch)
	};
};

/**
 * Container component that handles Redux state for MovieFormComponent
 */
export const MovieFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MovieFormComponent);
