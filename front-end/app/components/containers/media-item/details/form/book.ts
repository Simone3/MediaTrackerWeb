import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { commonMediaItemFormMapDispatchToProps, commonMediaItemFormMapStateToProps } from 'app/components/containers/media-item/details/form/media-item';
import { BookFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/book';
import { CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/media-item';
import { BookInternal } from 'app/data/models/internal/media-items/book';
import { State } from 'app/redux/state/state';

const mapStateToProps = (state: State): CommonMediaItemFormComponentInputMain<BookInternal> => {
	const commonProps = commonMediaItemFormMapStateToProps(state);

	return {
		...commonProps,
		initialValues: commonProps.initialValues as BookInternal,
		restoredDraft: commonProps.restoredDraft as BookInternal | undefined
	};
};

const mapDispatchToProps = (dispatch: Dispatch): CommonMediaItemFormComponentOutput => {
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
