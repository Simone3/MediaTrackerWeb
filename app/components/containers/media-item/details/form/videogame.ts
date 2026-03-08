
import { commonMediaItemFormMapDispatchToProps, commonMediaItemFormMapStateToProps } from 'app/components/containers/media-item/details/form/media-item';
import { VideogameFormComponent, VideogameFormComponentInput, VideogameFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/videogame';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): VideogameFormComponentInput => {
	
	return {
		...commonMediaItemFormMapStateToProps(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch): VideogameFormComponentOutput => {

	return {
		...commonMediaItemFormMapDispatchToProps(dispatch)
	};
};

/**
 * Container component that handles Redux state for VideogameFormComponent
 */
export const VideogameFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(VideogameFormComponent);
