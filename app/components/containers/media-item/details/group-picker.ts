import { EntityPickerFieldComponent, EntityPickerFieldComponentInput, EntityPickerFieldComponentOutput } from 'app/components/presentational/form/fields/entity-picker';
import { requestGroupSelection } from 'app/redux/actions/group/generators';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapDispatchToProps = (dispatch: Dispatch, ownProps: GroupPickerFieldContainerProps): EntityPickerFieldComponentOutput => {

	return {
		...ownProps,
		requestEntitySelection: () => {
			dispatch(requestGroupSelection());
		}
	};
};

/**
 * Container component that handles Redux state for EntityPickerFieldComponent
 */
export const GroupPickerFieldContainer = connect(
	null,
	mapDispatchToProps
)(EntityPickerFieldComponent);

/**
 * GroupPickerFieldContainer's input props
 */
export type GroupPickerFieldContainerInput = EntityPickerFieldComponentInput;

/**
 * GroupPickerFieldContainer's props
 */
export type GroupPickerFieldContainerProps = GroupPickerFieldContainerInput;
