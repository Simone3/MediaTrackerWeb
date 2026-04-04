import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { commonMediaItemFormMapDispatchToProps, commonMediaItemFormMapStateToProps } from 'app/components/containers/media-item/details/form/media-item';
import { MovieFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/movie';
import { CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/media-item';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import { State } from 'app/redux/state/state';

const mapStateToProps = (state: State): CommonMediaItemFormComponentInputMain<MovieInternal> => {
	const commonProps = commonMediaItemFormMapStateToProps(state);

	return {
		...commonProps,
		initialValues: commonProps.initialValues as MovieInternal,
		restoredDraft: commonProps.restoredDraft as MovieInternal | undefined
	};
};

const mapDispatchToProps = (dispatch: Dispatch): CommonMediaItemFormComponentOutput => {
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
