import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { commonMediaItemFormMapDispatchToProps, commonMediaItemFormMapStateToProps } from 'app/components/containers/media-item/details/form/media-item';
import { VideogameFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/videogame';
import { CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/media-item';
import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import { State } from 'app/redux/state/state';

const mapStateToProps = (state: State): CommonMediaItemFormComponentInputMain<VideogameInternal> => {
	const commonProps = commonMediaItemFormMapStateToProps(state);

	return {
		...commonProps,
		initialValues: commonProps.initialValues as VideogameInternal,
		restoredDraft: commonProps.restoredDraft as VideogameInternal | undefined
	};
};

const mapDispatchToProps = (dispatch: Dispatch): CommonMediaItemFormComponentOutput => {
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
